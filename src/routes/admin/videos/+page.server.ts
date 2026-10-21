import { db } from '$lib/server/db';
import { adminTable, videosTable } from '$lib/server/schema';
import { desc, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = locals.session!;
    const videos = await db.select({
        id: videosTable.id,
        video_id: videosTable.video_id,
        title: videosTable.title,
        description: videosTable.description,
        video_url: videosTable.video_url,
        thumbnail_url: videosTable.thumbnail_url,
        category: videosTable.category,
        author: sql<string>`coalesce(${adminTable.name}, ${videosTable.author})`,
        author_id: videosTable.author_id,
        views: videosTable.views,
        duration: videosTable.duration,
        is_featured: videosTable.is_featured,
        created_at: videosTable.created_at,
    }).from(videosTable).leftJoin(adminTable, eq(videosTable.author_id, adminTable.admin_id)).orderBy(desc(videosTable.created_at)).limit(50);
    return { videos, role: session.role, currentAdminId: session.admin_id };
};
