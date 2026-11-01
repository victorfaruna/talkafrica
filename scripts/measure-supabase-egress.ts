// Read-only diagnostic: never prints credentials, article bodies or personal data.
// node --import tsx scripts/measure-supabase-egress.ts
import { createServer } from 'vite';
import postgres from 'postgres';
import { config } from 'dotenv';
import { slugifyPostTitle } from '../src/lib/post-url';

config({ quiet: true });
const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
    if (process.argv.includes('--media-only')) {
        const { db } = await server.ssrLoadModule('/src/lib/server/db.ts');
        const { postTable } = await server.ssrLoadModule('/src/lib/server/schema.ts');
        const { publicArticleContent, INLINE_IMAGE_PATTERN } = await server.ssrLoadModule('/src/lib/server/article-media.ts');
        const { postSlug } = await server.ssrLoadModule('/src/lib/server/post-slug.ts');
        const { sql: query, desc, and, eq } = await import('drizzle-orm');
        const sample = await db.select({
            beforeBytes: query`octet_length(${postTable.content})`,
            afterBytes: query`octet_length(${publicArticleContent(postTable.content, postTable.post_id, 'posts')})`,
            post_id: postTable.post_id,
        }).from(postTable).where(and(eq(postTable.status, 'published'), eq(postTable.deleted, false)))
            .orderBy(desc(query`octet_length(${postTable.content})`)).limit(1);
        console.log('largest_published_body', JSON.stringify(sample));
        const fixtures = ['Café & Art', "Writer's story", 'Àfrica — Lagos', '😀', 'a'.repeat(190)];
        // Check the exact SQL slug expression against canonical JS URLs for all
        // published titles (titles only), plus Unicode and length edge cases.
        const titles = await db.select({ title: postTable.title, slug: postSlug }).from(postTable);
        const mismatches = titles.filter((row: any) => row.slug !== slugifyPostTitle(row.title)).length;
        console.log('slug_parity', JSON.stringify({ titles: titles.length, mismatches }));
        if (mismatches) throw Error('SQL and JavaScript article URLs differ');
        for (const title of fixtures) {
            // Use a synthetic posts CTE without inserting anything.
            const result = await db.execute(query`with posts(title) as (values (${title})) select ${postSlug} as slug from posts`);
            if (result[0].slug !== slugifyPostTitle(title)) throw Error('Slug parity failed for synthetic title');
        }
        const uri = 'data:image/png;base64,aGVsbG8=';
        const html = `<p>Preserve text &amp; formatting</p><img alt="one" src="${uri}"><img src="https://example.com/old.png"><img src="${uri}">`;
        const replacement = publicArticleContent(query`${html}`, query`${'00000000-0000-4000-8000-000000000000'}`, 'posts');
        const result = await db.execute(query`select ${replacement} as content`);
        const reconstructed = result[0].content.replace(/\/api\/article-media\/posts\/[0-9a-f-]+\/[0-9a-f]{32}/g, uri);
        if (reconstructed !== html) throw Error('Embedded image rewrite changed article HTML');
        console.log('media_html_roundtrip', JSON.stringify({ passed: true, imageReferences: 2, externalUrlsPreserved: true, pattern: INLINE_IMAGE_PATTERN }));
    } else {
    if (!process.argv.includes('--pages-only')) await sql.begin('read only', async (tx) => {
        console.log('database_summary', JSON.stringify(await tx`
            select count(*)::int as posts,
                sum(octet_length(content))::bigint as content_bytes,
                max(octet_length(content)) as largest_body_bytes,
                count(*) filter (where content ~* 'data:image/[^;]+;base64,')::int as bodies_with_inline_images,
                count(*) filter (where image ~* '^data:')::int as inline_cover_images,
                count(*) filter (where content like '%/storage/v1/%' or image like '%/storage/v1/%')::int as posts_referencing_storage,
                (select sum(octet_length(title) + 36) from posts where status = 'published' and deleted = false)::bigint as slug_candidate_text_bytes
            from posts`));
        console.log('media_hosts', JSON.stringify(await tx`
            select split_part(image, '/', 3) as host, count(*)::int as covers
            from posts where image like 'http%' group by 1 order by 2 desc`));
        // Storage metadata only: no object downloads, no signed URLs.
        try {
            console.log('storage_metadata', JSON.stringify(await tx`
                select bucket_id, count(*)::int as objects,
                    sum((metadata->>'size')::bigint)::bigint as bytes,
                    max((metadata->>'size')::bigint) as largest_object_bytes,
                    array_agg(distinct metadata->>'cacheControl') as cache_controls
                from storage.objects group by bucket_id`));
        } catch { console.log('storage_metadata', 'unavailable to this database role'); }
    });
    const [{ post_id, title }] = await sql`select post_id, title from posts where status = 'published' and deleted = false order by created_at desc limit 1`;
    const { db } = await server.ssrLoadModule('/src/lib/server/db.ts');
    const originalSelect = db.select;
    let calls = 0;
    let bytes = 0;
    let rows = 0;
    db.select = (...args: any[]) => {
        const wrap = (builder: any): any => new Proxy(builder, {
            get(target, key) {
                if (key === 'then' || key === 'catch' || key === 'finally') {
                    const run = Promise.resolve(target).then((result: any[]) => {
                        calls++; rows += result.length;
                        bytes += Buffer.byteLength(JSON.stringify(result));
                        return result;
                    });
                    return run[key as 'then'].bind(run);
                }
                const value = Reflect.get(target, key);
                return typeof value === 'function' ? (...params: any[]) => {
                    const next = value.apply(target, params);
                    return next && typeof next === 'object' && typeof next.then === 'function' ? wrap(next) : next;
                } : value;
            }
        });
        return wrap(originalSelect.apply(db, args));
    };
    for (const [name, path, event] of [
        ['home', '/src/routes/+page.server.ts', {}],
        ['article', '/src/routes/posts/[post_id]/+page.server.ts', { params: { post_id: slugifyPostTitle(title) } }],
        ['african-giant', '/src/routes/african-giant/+page.server.ts', { url: new URL('https://talkafricang.com/african-giant'), depends() {} }],
    ] as const) {
        const { load } = await server.ssrLoadModule(path);
        for (const run of ['cold', 'repeat']) {
            calls = bytes = rows = 0;
            const data = await load(event);
            console.log('page_sample', JSON.stringify({ name, run, queries: calls, rows, resultJsonBytes: bytes, pageDataJsonBytes: Buffer.byteLength(JSON.stringify(data)), articleId: name === 'article' ? post_id : undefined }));
        }
    }
    db.select = originalSelect;
    }
} finally {
    await server.close();
    await sql.end();
    // Vite's loaded app owns its own pool, which otherwise lives for 30 seconds.
}
