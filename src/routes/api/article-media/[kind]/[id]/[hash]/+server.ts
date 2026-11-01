import { error } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { postTable, movieReviewsTable } from '$lib/server/schema';
import { INLINE_IMAGE_PATTERN } from '$lib/server/article-media';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    if (!/^[0-9a-f]{32}$/.test(params.hash) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)) error(404);
    const table = params.kind === 'posts' ? postTable : params.kind === 'movies' ? movieReviewsTable : null;
    if (!table) error(404);
    const id = 'post_id' in table ? table.post_id : table.review_id;
    // Only the requested image leaves Postgres, decoded to binary there. Never
    // fetch the full article body to the application just to extract an image.
    const result = await db.execute<{ mime: string; data: Buffer }>(sql`
        select split_part(split_part(image.uri[1], ';', 1), ':', 2) as mime,
            decode(split_part(image.uri[1], ',', 2), 'base64') as data
        from ${table}
        cross join lateral regexp_matches(${table.content}, ${`(${INLINE_IMAGE_PATTERN})`}, 'g') as image(uri)
        where ${and(eq(id, params.id), eq(table.status, 'published'),
            'deleted' in table ? eq(table.deleted, false) : undefined)}
            and md5(image.uri[1]) = ${params.hash}
        limit 1
    `);
    const image = result[0];
    if (!image) error(404);
    return new Response(new Uint8Array(image.data), { headers: {
        'content-type': image.mime,
        // Fingerprinted public image URL; editing image bytes creates a new URL.
        'cache-control': 'public, max-age=31536000, immutable',
        'vercel-cdn-cache-control': 'public, s-maxage=86400',
        'vercel-cache-tag': 'talkafrica-public',
        'x-content-type-options': 'nosniff',
        'content-security-policy': "default-src 'none'; sandbox",
    } });
};
