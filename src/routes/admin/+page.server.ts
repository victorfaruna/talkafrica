import { db } from '$lib/server/db';
import { adminTable, commentsTable, postTable, usersTable, sessionsTable, dailyStatsTable, postDailyStatsTable } from '$lib/server/schema';
import { and, count, desc, eq, gt, sql, sum } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const session = locals.session!;
    const isSuperAdmin = session.role === 'super_admin';
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
            db.select(postSelection).from(postTable).leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id)).where(eq(postTable.deleted, false)).orderBy(desc(postTable.created_at)),
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
            topWriters: [],
        };
    }
};
