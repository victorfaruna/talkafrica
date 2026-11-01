import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq, desc, and, or, exists, sql, count } from 'drizzle-orm';
import { postTable, postCategoriesTable, adminTable } from '$lib/server/schema';
import { publicPostCardFields } from '$lib/server/post-cards';
import { cachedPublicData } from '$lib/server/public-data-cache';
import { pageNumber } from '$lib/server/pagination';

const loadContent: PageServerLoad = async ({ url }) => {
    const page = pageNumber(url);
    const limit = 12;
    const matching = and(
        eq(postTable.status, 'published'), eq(postTable.deleted, false),
        or(eq(postTable.category, 'african-giant'), exists(
            db.select({ one: sql`1` }).from(postCategoriesTable).where(and(
                eq(postCategoriesTable.post_id, postTable.post_id),
                eq(postCategoriesTable.category_slug, 'african-giant'),
            )),
        )),
    );
    // EXISTS preserves both category systems without duplicate rows or a full ID download.
    const [total] = await db.select({ count: count() }).from(postTable).where(matching);
    const totalPosts = total.count;
    const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
    const currentPage = Math.min(page, totalPages);
    const posts = await db.select(publicPostCardFields).from(postTable)
        .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
        .where(matching).orderBy(desc(postTable.created_at), desc(postTable.post_id))
        .limit(limit).offset((currentPage - 1) * limit);
    return {
        posts, categoryName: 'African Giant of the Week',
        pagination: { currentPage, totalPages, hasNextPage: currentPage < totalPages, hasPrevPage: currentPage > 1, totalPosts },
    };
};

export const load: PageServerLoad = (event) => {
    event.depends('category:african-giant');
    event.depends('posts:african-giant:' + pageNumber(event.url));
    return cachedPublicData('african-giant:' + pageNumber(event.url), () => loadContent(event), event.request);
};
