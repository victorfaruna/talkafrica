import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { postTable } from '$lib/server/schema';
import { cachedPublicData } from '$lib/server/public-data-cache';

// Public search sends card fields only. /api/posts remains the editor's full API.
export const GET: RequestHandler = async ({ url, request }) => {
    const term = (url.searchParams.get('search') || '').trim().slice(0, 200).toLowerCase();
    if (term.length < 2) return json({ posts: [] });

    try {
        const pattern = `%${term.replace(/[\\%_]/g, '\\$&')}%`;
        const posts = await cachedPublicData(`search:${term}`, () => db.select({
            post_id: postTable.post_id,
            title: postTable.title,
            excerpt: postTable.excerpt,
            image: postTable.image,
            category: postTable.category,
            created_at: postTable.created_at
        })
            .from(postTable)
            .where(and(
                eq(postTable.status, 'published'),
                eq(postTable.deleted, false),
                or(ilike(postTable.title, pattern), ilike(postTable.content, pattern), ilike(postTable.excerpt, pattern))
            ))
            .orderBy(desc(postTable.created_at))
            .limit(10), request);
        return json({ posts });
    } catch (cause) {
        console.error('Failed to search posts:', cause);
        return json({ posts: [], error: 'Search unavailable' }, { status: 503 });
    }
};
