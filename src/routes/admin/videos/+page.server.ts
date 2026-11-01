import { db } from '$lib/server/db';
import { adminTable, videosTable } from '$lib/server/schema';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { pageNumber } from '$lib/server/pagination';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    const session = locals.session!;
    const page = pageNumber(url);
    const search = (url.searchParams.get('search') ?? '').trim().slice(0, 200);
    const view = session.role === 'super_admin' || url.searchParams.get('view') === 'all' ? 'all' : 'mine';
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
    }).from(videosTable).leftJoin(adminTable, eq(videosTable.author_id, adminTable.admin_id))
        .where(and(
            view === 'mine' ? eq(videosTable.author_id, session.admin_id) : undefined,
            search ? ilike(videosTable.title, `%${search.replace(/[\\%_]/g, '\\$&')}%`) : undefined,
        ))
        .orderBy(desc(videosTable.created_at), desc(videosTable.video_id)).limit(26).offset((page - 1) * 25);
    return { videos: videos.slice(0, 25), role: session.role, currentAdminId: session.admin_id, search, view,
        pagination: { currentPage: page, hasPrevPage: page > 1, hasNextPage: videos.length > 25 } };
};
