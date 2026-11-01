// Run with: node --import tsx --test scripts/navigation.test.ts
import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer, type ViteDevServer } from 'vite';
import { PgDialect } from 'drizzle-orm/pg-core';

let server: ViteDevServer;
let db: any;
let select: any;
let articleLoad: any;
let categoryLoad: any;
const dialect = new PgDialect();
const current = { post_id: '12345678-1234-4123-8123-123456789012', title: 'Current article', category: 'technology', content: '<p>Full article</p>', created_at: new Date('2026-10-01') };
const earlier = { post_id: '22345678-1234-4123-8123-123456789012', title: 'Earlier article' };
const newer = { post_id: '32345678-1234-4123-8123-123456789012', title: 'Newer article' };
const oldest = { post_id: '42345678-1234-4123-8123-123456789012', title: 'Oldest article' };

before(async () => {
    server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
    ({ db } = await server.ssrLoadModule('/src/lib/server/db.ts'));
    select = db.select;
    ({ load: articleLoad } = await server.ssrLoadModule('/src/routes/posts/[post_id]/+page.server.ts'));
    ({ load: categoryLoad } = await server.ssrLoadModule('/src/routes/[category=category]/+page.server.ts'));
});
after(async () => {
    if (db) db.select = select;
    await server?.close();
});

function database(fixture: { related?: any[]; previous?: any[]; next?: any[]; oldest?: any[]; latest?: any[]; candidates?: any[]; total?: number } = {}) {
    const queries: any[] = [];
    let concurrent = 0;
    let maxConcurrent = 0;
    db.select = (fields: any) => {
        const query: any = { fields, order: [] };
        const builder: any = {
            from(table: any) { query.table = table; return builder; },
            leftJoin() { return builder; },
            where(where: any) { query.where = dialect.sqlToQuery(where); return builder; },
            orderBy(...order: any[]) { query.order = order.map((value) => dialect.sqlToQuery(value).sql); return builder; },
            limit(limit: number) { query.limit = limit; return builder; },
            offset(offset: number) { query.offset = offset; return builder; },
            then(resolve: any, reject: any) { return execute().then(resolve, reject); },
            catch(reject: any) { return execute().catch(reject); },
        };
        async function execute() {
            queries.push(query);
            concurrent++;
            maxConcurrent = Math.max(maxConcurrent, concurrent);
            await new Promise((resolve) => setTimeout(resolve, 5));
            concurrent--;
            if ('count' in fields) return [{ count: fixture.total ?? 13 }];
            if ('content' in fields) return [current];
            if ('category_slug' in fields) return [{ category_slug: 'technology' }];
            if (Object.keys(fields).length === 2) {
                if (!query.limit) return fixture.candidates ?? [current];
                if (query.where.sql.includes(' < ')) return fixture.previous ?? [earlier];
                if (query.where.sql.includes(' > ')) return fixture.next ?? [newer];
                return fixture.oldest ?? [oldest];
            }
            if (query.limit === 10) return fixture.latest ?? [newer, earlier, oldest];
            if (query.limit === 3) return fixture.related ?? [earlier];
            if (query.limit === 1) return [];
            return [];
        }
        return builder;
    };
    return { queries, maxConcurrent: () => maxConcurrent };
}

const articleEvent = (identifier = 'current-article') => ({ params: { post_id: identifier } });
const categoryEvent = (page = '2', category = 'politics') => ({
    params: { category }, url: new URL(`https://talkafricang.com/${category}?page=${page}`), depends() {},
});

test('article content, categories and navigation survive the parallel reads', async () => {
    const mock = database();
    const data = await articleLoad(articleEvent());
    assert.equal(data.post.content, current.content);
    assert.deepEqual(data.post.categories, ['technology']);
    assert.deepEqual(data.prevPost, earlier);
    assert.deepEqual(data.nextPost, newer);
    assert.deepEqual(data.relatedPosts, [earlier]);
    assert.ok(mock.maxConcurrent() >= 6, 'independent sidebar reads must overlap');
    const related = mock.queries.find((query) => query.limit === 3);
    assert.ok(related.where.params.includes('published'));
    assert.ok(related.where.params.includes(false));
    assert.ok(related.where.sql.includes('exists'));
});

test('missing related articles reuse latest posts and newest article wraps to oldest', async () => {
    database({ related: [], next: [] });
    const data = await articleLoad(articleEvent());
    assert.deepEqual(data.relatedPosts, [newer, earlier, oldest]);
    assert.deepEqual(data.nextPost, oldest);
    assert.deepEqual(data.prevPost, earlier);
});

test('wrapping navigation never repeats the same destination on both sides', async () => {
    database({ previous: [], next: [], oldest: [earlier], latest: [earlier] });
    const data = await articleLoad(articleEvent());
    assert.deepEqual(data.nextPost, earlier);
    assert.equal(data.prevPost, null);
});

test('legacy UUID URLs still redirect to the canonical article slug', async () => {
    database();
    await assert.rejects(articleLoad(articleEvent(current.post_id)), (error: any) => error.status === 301 && error.location === '/posts/current-article');
});

test('unknown article slugs remain 404 responses', async () => {
    const mock = database({ candidates: [] });
    await assert.rejects(articleLoad(articleEvent('missing')), (error: any) => error.status === 404);
    assert.equal(mock.queries.length, 1);
});

test('category pagination uses the SQL count and keeps reads bounded', async () => {
    const mock = database();
    const data = await categoryLoad(categoryEvent());
    assert.deepEqual(data.pagination, { currentPage: 2, totalPages: 2, hasNextPage: false, hasPrevPage: true, totalPosts: 13 });
    assert.equal(mock.queries.find((query) => query.limit === 12)?.offset, 12);
    for (const query of mock.queries) {
        assert.ok(query.limit || 'count' in query.fields, 'lists must be bounded');
        assert.ok(query.where.params.includes('published'));
        assert.ok(query.where.params.includes(false));
    }
    assert.ok(mock.maxConcurrent() >= 4, 'counts and category sections must overlap');
});

test('empty categories have one page and invalid page numbers use page one', async () => {
    database({ total: 0 });
    const data = await categoryLoad(categoryEvent('-1'));
    assert.equal(data.pagination.currentPage, 1);
    assert.equal(data.pagination.totalPages, 1);
    assert.equal(data.pagination.hasNextPage, false);
});
