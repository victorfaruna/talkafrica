// Run with: node --import tsx --test scripts/origin-transfer.test.ts
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer, type ViteDevServer } from 'vite';
import { PgDialect } from 'drizzle-orm/pg-core';
import { cachePublicResponse } from '../src/lib/server/public-cache';

const origin = 'https://talkafricang.com';
const postId = '12345678-1234-4123-8123-123456789012';
const dialect = new PgDialect();
let server: ViteDevServer;
let db: any;
let schema: any;
let track: any;
let search: any;
let editorPosts: any;
let original: any;

before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
    ({ db } = await server.ssrLoadModule('/src/lib/server/db.ts'));
    schema = await server.ssrLoadModule('/src/lib/server/schema.ts');
    ({ POST: track } = await server.ssrLoadModule('/src/routes/api/track/+server.ts'));
    ({ GET: search } = await server.ssrLoadModule('/src/routes/api/search/+server.ts'));
    ({ GET: editorPosts } = await server.ssrLoadModule('/src/routes/api/posts/+server.ts'));
    original = { insert: db.insert, update: db.update, transaction: db.transaction, select: db.select };
});

after(async () => {
    if (original) Object.assign(db, original);
    await server?.close();
});

function event(body = '{}', initial: Record<string, string> = {}, requestOrigin = origin) {
    const values = new Map(Object.entries(initial));
    const writes = new Map<string, { value: string; options: any }>();
    return {
        request: new Request(`${origin}/api/track`, {
            method: 'POST', headers: { origin: requestOrigin, 'content-type': 'application/json' }, body
        }),
        url: new URL(`${origin}/api/track`),
        cookies: {
            get: (name: string) => values.get(name),
            set(name: string, value: string, options: any) {
                values.set(name, value);
                writes.set(name, { value, options });
            }
        },
        values,
        writes
    };
}

function mockWrites(publishedPostExists = true) {
    const calls: { table: unknown; kind: string; where?: any }[] = [];
    const insert = (table: unknown) => ({ values: () => ({
        onConflictDoUpdate: async () => { calls.push({ table, kind: 'insert' }); }
    }) });
    const update = (table: unknown) => ({ set: () => ({ where: (where: any) => {
        calls.push({ table, kind: 'update', where });
        return { returning: async () => publishedPostExists ? [{ post_id: postId }] : [] };
    } }) });
    db.insert = insert;
    db.update = update;
    db.transaction = async (callback: any) => callback({ insert, update });
    return calls;
}

test('public HTML and page data can be cached without caching them in the browser', () => {
    for (const route of ['/', '/posts/[post_id]', '/[category=category]', '/movies/[slug]', '/api/search']) {
        for (const method of ['GET', 'HEAD']) {
            const response = new Response('published', { headers: { 'cache-control': 'private, no-store' } });
            cachePublicResponse(route, new Request(`${origin}/__data.json`, { method }), response);
            assert.equal(response.headers.get('vercel-cdn-cache-control'), 'public, s-maxage=60, stale-while-revalidate=300');
            assert.equal(response.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
            assert.equal(response.headers.has('set-cookie'), false);
        }
    }
});

test('admin, editor APIs, tracking, failed responses and authenticated requests are excluded', () => {
    for (const route of ['/admin', '/admin/login', '/api/posts', '/api/track', null]) {
        const response = new Response(null);
        cachePublicResponse(route, new Request(origin), response);
        assert.equal(response.headers.has('vercel-cdn-cache-control'), false);
    }
    for (const [request, response] of [
        [new Request(origin, { method: 'POST' }), new Response(null)],
        [new Request(origin, { headers: { authorization: 'Bearer example' } }), new Response(null)],
        [new Request(origin), new Response(null, { status: 500 })],
        [new Request(origin), new Response(null, { headers: { 'set-cookie': 'visitor=example' } })]
    ]) {
        cachePublicResponse('/', request, response);
        assert.equal(response.headers.has('vercel-cdn-cache-control'), false);
    }
});

test('tracking rejects cross-origin and malformed requests before writing to the database', async () => {
    const calls = mockWrites();
    await assert.rejects(track(event('{}', {}, 'https://example.com')), (error: any) => error.status === 403);
    for (const body of ['null', '[]', 'invalid', '{"postId":"invalid"}', '{"movieSlug":12}']) {
        await assert.rejects(track(event(body)), (error: any) => error.status === 400);
    }
    await assert.rejects(track(event(' '.repeat(513))), (error: any) => error.status === 413);
    assert.equal(calls.length, 0);
});

test('new visits create a session with secure cookies and an empty uncached response', async () => {
    const calls = mockWrites();
    const first = event();
    const response = await track(first);
    assert.equal(response.status, 204);
    assert.equal(await response.text(), '');
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(calls.filter((call) => call.table === schema.sessionsTable).length, 1);
    assert.equal(first.writes.get('session_id')?.options.secure, true);
    assert.equal(first.writes.get('session_id')?.options.httpOnly, true);

    await track(event('{}', Object.fromEntries(first.values)));
    assert.equal(calls.filter((call) => call.table === schema.sessionsTable).length, 1, 'session updates remain throttled');
});

test('article views and both daily counters update once per browser cookie', async () => {
    const calls = mockWrites();
    const first = event(JSON.stringify({ postId }), { session_id: postId, last_session_update: String(Date.now()) });
    assert.equal((await track(first)).status, 204);
    assert.deepEqual(calls.map((call) => call.table), [schema.postTable, schema.dailyStatsTable, schema.postDailyStatsTable]);
    const where = dialect.sqlToQuery(calls[0].where);
    assert.ok(where.params.includes('published'));
    assert.ok(where.params.includes(false));
    assert.equal(first.values.get('viewed_posts'), postId);

    await track(event(JSON.stringify({ postId }), Object.fromEntries(first.values)));
    assert.equal(calls.length, 3, 'repeat visits do not increment any article counters');
});

test('missing or unpublished articles do not increment daily counters or set a viewed cookie', async () => {
    const calls = mockWrites(false);
    const visit = event(JSON.stringify({ postId }), { session_id: postId, last_session_update: String(Date.now()) });
    assert.equal((await track(visit)).status, 204);
    assert.equal(calls.length, 1);
    assert.equal(visit.writes.has('viewed_posts'), false);
});

test('movie views only update published movies and leave session tracking throttled', async () => {
    const calls = mockWrites();
    await track(event('{"movieSlug":"example-movie"}', { session_id: postId, last_session_update: String(Date.now()) }));
    assert.equal(calls.length, 1);
    assert.equal(calls[0].table, schema.movieReviewsTable);
    assert.ok(dialect.sqlToQuery(calls[0].where).params.includes('published'));
});

test('public search is bounded, excludes article bodies and filters drafts and deleted posts', async () => {
    let fields: any;
    let where: any;
    let limit: number | undefined;
    db.select = (selection: any) => {
        fields = selection;
        return { from: () => ({ where: (filter: any) => {
            where = filter;
            return { orderBy: () => ({ limit: async (count: number) => { limit = count; return []; } }) };
        } }) };
    };
    const response = await search({ url: new URL(`${origin}/api/search?search=africa`) });
    assert.deepEqual(await response.json(), { posts: [] });
    assert.equal(limit, 10);
    assert.equal('content' in fields, false);
    const query = dialect.sqlToQuery(where);
    assert.ok(query.params.includes('published'));
    assert.ok(query.params.includes(false));
});

test('anonymous callers cannot fetch the editor API full article bodies', async () => {
    db.select = () => { throw new Error('Anonymous requests must not reach the database'); };
    await assert.rejects(editorPosts({ url: new URL(`${origin}/api/posts`), locals: {} }), (error: any) => error.status === 401);
});
