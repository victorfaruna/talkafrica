import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { postTable, postCategoriesTable } from '$lib/server/schema';
import { requireAdmin } from '$lib/server/admin-auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
    const session = requireAdmin(locals);
    const id = url.searchParams.get('post_id');
    if (!id) return { post: null };
    if (!/^[0-9a-f-]{36}$/i.test(id)) error(404, 'Post not found');
    const [posts, categories] = await Promise.all([
        db.select().from(postTable).where(and(
            eq(postTable.post_id, id), eq(postTable.deleted, false),
            session.role !== 'super_admin' ? eq(postTable.author_id, session.admin_id) : undefined,
        )).limit(1),
        db.select({ slug: postCategoriesTable.category_slug }).from(postCategoriesTable)
            .where(eq(postCategoriesTable.post_id, id)),
    ]);
    if (!posts[0]) error(404, 'Post not found');
    return { post: { ...posts[0], categories: categories.map((category) => category.slug) } };
};
