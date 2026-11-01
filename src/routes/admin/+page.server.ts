import { db } from '$lib/server/db';
import { adminTable, commentsTable, postTable, usersTable, sessionsTable, dailyStatsTable, postDailyStatsTable } from '$lib/server/schema';
import { and, count, desc, eq, gt, ilike, or, sql, sum } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { pageNumber } from '$lib/server/pagination';

export const load: PageServerLoad = async ({ locals, url }) => {
    const session = locals.session!;
    const isSuperAdmin = session.role === 'super_admin';
    const page = pageNumber(url);
    const pageSize = 25;
    const showPosts = url.searchParams.get('tab') === 'posts';
    const view = isSuperAdmin || url.searchParams.get('view') === 'all' ? 'all' : 'mine';
    const status = url.searchParams.get('status') || 'all';
    const search = (url.searchParams.get('search') || '').trim().slice(0, 200);
    const author = url.searchParams.get('author');
    const listFilter = and(
        eq(postTable.deleted, false),
        view === 'mine' ? eq(postTable.author_id, session.admin_id) : undefined,
        author && /^[0-9a-f-]{36}$/i.test(author) ? eq(postTable.author_id, author) : undefined,
        ['draft', 'published'].includes(status) ? eq(postTable.status, status) : undefined,
        search ? or(ilike(postTable.title, `%${search.replace(/[\\%_]/g, '\\$&')}%`), ilike(postTable.excerpt, `%${search.replace(/[\\%_]/g, '\\$&')}%`)) : undefined,
    );
    const owned = isSuperAdmin
        ? eq(postTable.deleted, false)
        : and(eq(postTable.deleted, false), eq(postTable.author_id, session.admin_id));

    try {
        const postSelection = {
            post_id: postTable.post_id,
            title: postTable.title,
            excerpt: postTable.excerpt,
            category: postTable.category,
            image: postTable.image,
            status: postTable.status,
            featured: postTable.featured,
            views: postTable.views,
            author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
            author_id: postTable.author_id,
            created_at: postTable.created_at,
            updated_at: postTable.updated_at,
        };

        const [
            postsCountResult,
            draftsCountResult,
            usersCountResult,
            adminsCountResult,
            commentsCountResult,
            viewsSumResult,
            dailyStatsResult,
            onlineUsersResult,
            recentPosts,
            allPosts,
            listCount,
            leaderboardResult,
        ] = await Promise.all([
            db.select({ count: count() }).from(postTable).where(and(owned, eq(postTable.status, 'published'))),
            db.select({ count: count() }).from(postTable).where(and(owned, eq(postTable.status, 'draft'))),
            db.select({ count: count() }).from(usersTable),
            db.select({ count: count() }).from(adminTable),
            isSuperAdmin
                ? db.select({ count: count() }).from(commentsTable)
                : db.select({ count: count() }).from(commentsTable).innerJoin(postTable, eq(commentsTable.post_id, postTable.post_id)).where(eq(postTable.author_id, session.admin_id)),
            db.select({ total: sum(postTable.views) }).from(postTable).where(owned),
            isSuperAdmin
                ? db.select({ views: dailyStatsTable.views }).from(dailyStatsTable).where(eq(dailyStatsTable.date, sql`CURRENT_DATE`))
                : db.select({ views: sum(postDailyStatsTable.views) }).from(postDailyStatsTable).innerJoin(postTable, eq(postDailyStatsTable.post_id, postTable.post_id)).where(and(eq(postDailyStatsTable.date, sql`CURRENT_DATE`), eq(postTable.author_id, session.admin_id))),
            db.select({ count: count() }).from(sessionsTable).where(gt(sessionsTable.last_seen, new Date(Date.now() - 5 * 60 * 1000))),
            db.select(postSelection).from(postTable).leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id)).where(owned).orderBy(desc(postTable.created_at)).limit(5),
            showPosts ? db.select(postSelection).from(postTable).leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id)).where(listFilter).orderBy(desc(postTable.created_at), desc(postTable.post_id)).limit(pageSize).offset((page - 1) * pageSize) : [],
            showPosts ? db.select({ count: count() }).from(postTable).where(listFilter) : [{ count: 0 }],
            db.execute(sql`
                SELECT a.admin_id, a.name, stats.posts, stats.total_views
                FROM admin a
                CROSS JOIN LATERAL (
                    SELECT
                        (SELECT COUNT(*)::int FROM posts p WHERE p.author_id = a.admin_id AND p.deleted = false AND p.created_at >= date_trunc('month', CURRENT_DATE)) AS posts,
                        (SELECT COALESCE(SUM(p.views), 0)::int FROM posts p WHERE p.author_id = a.admin_id AND p.deleted = false AND p.created_at >= date_trunc('month', CURRENT_DATE))
                        +
                        (SELECT COALESCE(SUM(pds.views), 0)::int FROM post_daily_stats pds JOIN posts p ON p.post_id = pds.post_id WHERE p.author_id = a.admin_id AND p.deleted = false AND p.created_at < date_trunc('month', CURRENT_DATE) AND pds.date >= date_trunc('month', CURRENT_DATE)) AS total_views
                ) stats
                WHERE stats.posts > 0 OR stats.total_views > 0
                ORDER BY total_views DESC, posts DESC
                LIMIT 5
            `),
        ]);

        return {
            role: session.role,
            currentAdminId: session.admin_id,
            stats: {
                totalPosts: postsCountResult[0]?.count ?? 0,
                totalDrafts: draftsCountResult[0]?.count ?? 0,
                totalAdmins: adminsCountResult[0]?.count ?? 0,
                totalUsers: usersCountResult[0]?.count ?? 0,
                totalComments: commentsCountResult[0]?.count ?? 0,
                totalViews: Number(viewsSumResult[0]?.total ?? 0),
                viewsToday: Number(dailyStatsResult[0]?.views ?? 0),
                onlineUsers: onlineUsersResult[0]?.count ?? 0,
            },
            recentPosts,
            posts: allPosts,
            postFilters: { view, status, search },
            pagination: { currentPage: page, totalPosts: listCount[0]?.count ?? 0, hasPrevPage: page > 1, hasNextPage: page * pageSize < (listCount[0]?.count ?? 0) },
            topWriters: Array.from(leaderboardResult),
        };
    } catch (error) {
        console.error('Error loading admin dashboard data:', error);
        return {
            role: session.role,
            currentAdminId: session.admin_id,
            stats: { totalPosts: 0, totalDrafts: 0, totalAdmins: 0, totalUsers: 0, totalComments: 0, totalViews: 0, viewsToday: 0, onlineUsers: 0 },
            recentPosts: [],
            posts: [],
            postFilters: { view, status, search },
            pagination: { currentPage: page, totalPosts: 0, hasPrevPage: page > 1, hasNextPage: false },
            topWriters: [],
        };
    }
};
