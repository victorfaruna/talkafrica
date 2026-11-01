// node --import tsx --test scripts/egress.test.ts
import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createServer, type ViteDevServer } from 'vite';
import { PgDialect } from 'drizzle-orm/pg-core';
import { PublicDataCache, isAuthenticatedRequest, changesPublicContent } from '../src/lib/server/public-data-cache';
import { cachePublicResponse } from '../src/lib/server/public-cache';
import { listRange } from '../src/lib/server/pagination';
import { createCommentResource } from '../src/lib/comments';
import { lazyArticleImages } from '../src/lib/utils/article-html';

test('public cache coalesces concurrent requests, expires, and never retains failures', async () => {
    let now = 1000;
    const cache = new PublicDataCache(() => now);
    let calls = 0;
    const read = async () => { calls++; return { title: 'Published' }; };
    await Promise.all([cache.get('article', read), cache.get('article', read)]);
    await cache.get('article', read);
    assert.equal(calls, 1);
    now += 60_001;
    await cache.get('article', read);
    assert.equal(calls, 2);
    cache.invalidate();
    await cache.get('article', read);
    assert.equal(calls, 3);
    for (let i = 0; i < 2; i++) await assert.rejects(cache.get('failed', () => { calls++; throw Error('offline'); }));
    assert.equal(calls, 5);
});

test('publishing during an in-flight read cannot repopulate stale content', async () => {
    const cache = new PublicDataCache();
    let finish!: (value: string) => void;
    const pending = cache.get('article', () => new Promise<string>((resolve) => { finish = resolve; }));
    await Promise.resolve();
    cache.invalidate();
    finish('old');
    await pending;
    assert.equal(await cache.get('article', () => 'new'), 'new');
});

test('cache entry and byte limits evict data rather than growing indefinitely', async () => {
    const cache = new PublicDataCache(Date.now, 2, 20);
    await cache.get('a', () => '12345');
    await cache.get('b', () => '12345');
    await cache.get('c', () => '12345');
    assert.equal(await cache.get('a', () => 'new'), 'new');
});

test('admin and Supabase auth cookies bypass public caching; visitor cookies do not', () => {
    for (const cookie of ['admin=abc', 'session_id=visit; admin=abc', 'sb-example-auth-token=abc']) {
        const request = new Request('https://example.com/', { headers: { cookie } });
        assert.equal(isAuthenticatedRequest(request), true);
        const response = new Response('private');
        cachePublicResponse('/', request, response);
        assert.equal(response.headers.get('cache-control'), 'private, no-store');
        assert.equal(response.headers.get('vercel-cdn-cache-control'), 'private, no-store');
    }
    assert.equal(isAuthenticatedRequest(new Request('https://example.com', { headers: { cookie: 'session_id=visit' } })), false);
});

test('publishing, editing, removal and employee form actions invalidate public data', () => {
    for (const [path, method] of [['/api/posts', 'POST'], ['/api/posts', 'PUT'], ['/api/posts', 'DELETE'], ['/api/movie-reviews/id', 'PATCH'], ['/api/our-impact/id', 'DELETE'], ['/admin/employee-of-the-month', 'POST']]) {
        assert.equal(changesPublicContent(path, method), true);
    }
    assert.equal(changesPublicContent('/api/track', 'POST'), false);
    assert.equal(changesPublicContent('/api/posts', 'GET'), false);
});

test('limits and offsets reject malformed numbers and cap oversized requests', () => {
    for (const value of ['-1', 'NaN', 'Infinity', '1.5']) assert.equal(listRange(new URL(`https://example.com?limit=${value}`)).limit, 20);
    assert.deepEqual(listRange(new URL('https://example.com?limit=999999&offset=999999999')), { limit: 50, offset: 1_000_000 });
    assert.equal(listRange(new URL('https://example.com?limit=0')).limit, 1);
});

test('two comment components share one request and both receive submission refreshes', async () => {
    let calls = 0;
    const resource = createCommentResource('post', (async () => {
        calls++;
        return Response.json({ success: true, comments: [{ comment_id: String(calls) }], hasMore: true });
    }) as typeof fetch);
    const a: any[] = [], b: any[] = [];
    const unsubA = resource.subscribe((state) => a.push(state));
    const unsubB = resource.subscribe((state) => b.push(state));
    await Promise.all([resource.load(), resource.load()]);
    assert.equal(calls, 1);
    await resource.load('refresh');
    assert.equal(calls, 2);
    assert.equal(a.at(-1).comments[0].comment_id, '2');
    assert.equal(b.at(-1).comments[0].comment_id, '2');
    unsubA(); unsubB();
});

test('article media loading preserves existing URLs and explicit image priorities', () => {
    assert.equal(lazyArticleImages('<p>Text</p><img src="/old.png">'), '<p>Text</p><img decoding="async" loading="lazy" src="/old.png">');
    assert.equal(lazyArticleImages('<img loading="eager" decoding="sync" src="https://example.com/a.png">'), '<img loading="eager" decoding="sync" src="https://example.com/a.png">');
});

let server: ViteDevServer;
let db: any, originalSelect: any, originalExecute: any, cache: any;
let editorPosts: any, dashboard: any, giant: any, comments: any, movies: any, media: any, save: any, cloudinary: any, upload: any;
let postsCreate: any, postsUpdate: any, handle: any, adminLayout: any;
let insert: any, update: any;
const dialect = new PgDialect();
const admin = { admin_id: '12345678-1234-4123-8123-123456789012', role: 'admin' };

before(async () => {
    server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
    ({ db } = await server.ssrLoadModule('/src/lib/server/db.ts'));
    originalSelect = db.select; originalExecute = db.execute;
    insert = db.insert; update = db.update;
    ({ publicDataCache: cache } = await server.ssrLoadModule('/src/lib/server/public-data-cache.ts'));
    ({ GET: editorPosts } = await server.ssrLoadModule('/src/routes/api/posts/+server.ts'));
    ({ POST: postsCreate, PUT: postsUpdate } = await server.ssrLoadModule('/src/routes/api/posts/+server.ts'));
    ({ handle } = await server.ssrLoadModule('/src/hooks.server.ts'));
    ({ load: adminLayout } = await server.ssrLoadModule('/src/routes/admin/+layout.server.ts'));
    ({ load: dashboard } = await server.ssrLoadModule('/src/routes/admin/+page.server.ts'));
    ({ load: giant } = await server.ssrLoadModule('/src/routes/african-giant/+page.server.ts'));
    ({ GET: comments } = await server.ssrLoadModule('/src/routes/api/posts/[postId]/comments/+server.ts'));
    ({ GET: movies } = await server.ssrLoadModule('/src/routes/api/movie-reviews/+server.ts'));
    ({ GET: media } = await server.ssrLoadModule('/src/routes/api/article-media/[kind]/[id]/[hash]/+server.ts'));
    ({ storeInlineImages: save } = await server.ssrLoadModule('/src/lib/server/store-inline-images.ts'));
    ({ cloudinary } = await server.ssrLoadModule('/src/lib/server/cloudinary.ts'));
    upload = cloudinary.uploader.upload;
});
beforeEach(() => { cache?.invalidate(); });
after(async () => {
    if (db) { db.select = originalSelect; db.execute = originalExecute; db.insert = insert; db.update = update; }
    if (cloudinary) cloudinary.uploader.upload = upload;
    await server?.close();
});

function database(respond?: (query: any) => any[]) {
    const queries: any[] = [];
    db.select = (fields: any) => {
        function wrap(builder: any): any {
            return new Proxy(builder, { get(target, key) {
                const run = async () => {
                    const query = { fields, ...target.toSQL() };
                    queries.push(query);
                    return respond?.(query) ?? (fields?.count ? [{ count: 100 }] : []);
                };
                if (key === 'then') return (resolve: any, reject: any) => run().then(resolve, reject);
                if (key === 'catch') return (reject: any) => run().catch(reject);
                const value = Reflect.get(target, key);
                return typeof value === 'function' ? (...args: any[]) => {
                    const next = value.apply(target, args);
                    return next && typeof next.then === 'function' ? wrap(next) : next;
                } : value;
            } });
        }
        return wrap(originalSelect.call(db, fields));
    };
    db.execute = async (query: any) => { queries.push(dialect.sqlToQuery(query)); return []; };
    return queries;
}

test('editor lists omit bodies, cap limits and only fetch a body for an owned detail', async () => {
    const queries = database();
    await editorPosts({ url: new URL('https://example.com/api/posts?limit=99999'), locals: { session: admin } });
    assert.ok(!('content' in queries[0].fields));
    assert.ok(queries[0].params.includes(50));
    queries.length = 0;
    await editorPosts({ url: new URL(`https://example.com/api/posts?post_id=${admin.admin_id}`), locals: { session: admin } });
    assert.ok('content' in queries[0].fields);
    assert.ok(queries[0].params.includes(1));
    assert.ok(queries[0].sql.includes('"posts"."author_id" ='));
});

test('dashboard omits the complete list; post management filters and pages in SQL', async () => {
    const queries = database();
    await dashboard({ locals: { session: admin }, url: new URL('https://example.com/admin') });
    assert.ok(queries.every((query) => !query.fields?.title || query.params.includes(5)));
    queries.length = 0;
    const data = await dashboard({ locals: { session: admin }, url: new URL('https://example.com/admin?tab=posts&status=draft&search=africa&page=2') });
    const list = queries.find((query) => query.fields?.title && query.params.includes(25));
    assert.ok(list.sql.includes('ilike'));
    assert.ok(list.sql.includes('offset'));
    assert.ok(list.params.includes('draft'));
    assert.ok(list.params.includes(admin.admin_id));
    assert.equal(data.pagination.currentPage, 2);
});

test('African Giant uses SQL count and EXISTS instead of downloading every ID', async () => {
    const queries = database();
    await giant({ url: new URL('https://example.com/african-giant?page=2'), depends() {} });
    assert.equal(queries.length, 2);
    assert.ok(queries[1].sql.includes('exists'));
    assert.ok(queries[1].params.includes(12));
});

test('public comments page in SQL and never return reader email addresses', async () => {
    const queries = database();
    await comments({ params: { postId: admin.admin_id }, url: new URL('https://example.com/comments?offset=20') });
    assert.ok(!queries[0].sql.includes('"email"'));
    assert.ok(queries[0].params.includes('approved'));
    assert.ok(queries[0].params.includes(21));
    assert.ok(queries[0].params.includes(20));
});

test('anonymous movie lists cannot include drafts or full bodies', async () => {
    const queries = database();
    await movies({ url: new URL('https://example.com/api/movie-reviews?status=draft&limit=99999'), locals: {} });
    assert.ok(queries[0].params.includes('published'));
    assert.ok(!queries[0].params.includes('draft'));
    assert.ok(!('content' in queries[0].fields));
    assert.ok(queries[0].params.includes(50));
});

test('embedded media rejects malformed URLs and only reads a published fingerprint match', async () => {
    const queries = database();
    await assert.rejects(media({ params: { id: 'bad', hash: 'bad', kind: 'posts' } }), (error: any) => error.status === 404);
    assert.equal(queries.length, 0);
    await assert.rejects(media({ params: { id: admin.admin_id, hash: 'a'.repeat(32), kind: 'posts' } }), (error: any) => error.status === 404);
    assert.ok(queries[0].sql.includes('decode('));
    assert.ok(queries[0].params.includes('published'));
    assert.ok(queries[0].params.includes(false));
    assert.ok(queries[0].params.includes('a'.repeat(32)));
});

test('saving uploads each distinct inline image once and preserves HTML and external URLs', async () => {
    let calls = 0;
    cloudinary.uploader.upload = async () => { calls++; return { secure_url: 'https://res.cloudinary.com/example/image.png' }; };
    const uri = 'data:image/png;base64,aGVsbG8=';
    const html = `<p>Keep this text</p><img alt="first" src="${uri}"><img src="https://example.com/old.png"><img src="${uri}">`;
    const saved = await save(html);
    assert.equal(calls, 1);
    assert.equal(saved, html.replaceAll(uri, 'https://res.cloudinary.com/example/image.png'));
});

test('media responses contain only image bytes with immutable caching and a matching MIME type', async () => {
    db.execute = async () => [{ mime: 'image/png', data: Buffer.from('example bytes') }];
    const response = await media({ params: { id: admin.admin_id, hash: 'a'.repeat(32), kind: 'posts' } });
    assert.equal(await response.text(), 'example bytes');
    assert.equal(response.headers.get('content-type'), 'image/png');
    assert.match(response.headers.get('cache-control')!, /immutable/);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});

test('create and edit save external image URLs and avoid returning article bodies', async () => {
    database((query) => query.fields?.author_id ? [{ author_id: admin.admin_id }] : []);
    const values: any[] = [];
    db.insert = () => ({ values: (value: any) => { values.push(value); return { returning: async (fields: any) => {
        assert.ok(!('content' in fields)); return [{ post_id: admin.admin_id }];
    } }; } });
    db.update = () => ({ set: (value: any) => { values.push(value); return { where: () => ({ returning: async (fields: any) => {
        assert.ok(!('content' in fields)); return [{ post_id: admin.admin_id }];
    } }) }; } });
    cloudinary.uploader.upload = async () => ({ secure_url: 'https://res.cloudinary.com/example/stored.png' });
    const body = { title: 'Test', content: '<img src="data:image/png;base64,aGVsbG8=">', status: 'published' };
    const event = (method: string, value: any) => ({ locals: { session: admin }, request: new Request('https://example.com/api/posts', { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(value) }) });
    assert.equal((await postsCreate(event('POST', body))).status, 200);
    assert.equal((await postsUpdate(event('PUT', { ...body, post_id: admin.admin_id }))).status, 200);
    assert.equal(values.length, 2);
    assert.ok(values.every((value) => value.content === '<img src="https://res.cloudinary.com/example/stored.png">'));
});

test('failed inline upload keeps the article unsaved', async () => {
    let writes = 0;
    db.insert = () => { writes++; throw Error('Must not write'); };
    cloudinary.uploader.upload = async () => { throw Error('Upload unavailable'); };
    const response = await postsCreate({ locals: { session: admin }, request: new Request('https://example.com/api/posts', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Test', content: '<img src="data:image/png;base64,aGVsbG8=">' }),
    }) });
    assert.equal(response.status, 500);
    assert.equal(writes, 0);
});

test('authorized writes invalidate public data while anonymous attempts cannot flush the cache', async () => {
    const fetch = globalThis.fetch;
    globalThis.fetch = async () => Response.json({});
    try {
    for (const authenticated of [true, false]) {
        cache.invalidate();
        await cache.get('published', () => 'old');
        const event = {
            url: new URL('https://example.com/api/posts'), route: { id: '/api/posts' },
            locals: authenticated ? { session: admin } : {}, cookies: { get: () => undefined },
            request: new Request('https://example.com/api/posts', { method: 'PUT' }),
        };
        await handle({ event, resolve: async () => new Response(null, { status: authenticated ? 200 : 401 }) });
        assert.equal(await cache.get('published', () => 'new'), authenticated ? 'new' : 'old');
    }
    } finally { globalThis.fetch = fetch; }
});

test('admin layout reuses hook authentication, redirects anonymous users, and preserves role restrictions', async () => {
    db.select = () => { throw Error('The layout must not repeat the hook query'); };
    await assert.rejects(adminLayout({ locals: {}, url: new URL('https://example.com/admin') }), (error: any) => error.status === 302);
    await assert.rejects(adminLayout({ locals: { session: admin }, url: new URL('https://example.com/admin/categories') }), (error: any) => error.status === 303);
    const data = await adminLayout({ locals: { session: admin }, url: new URL('https://example.com/admin') });
    assert.equal(data.isAuthenticated, true);
    assert.equal(data.admin.role, 'admin');
});
