import { db } from '$lib/server/db';
import { adminTable, commentsTable, postTable, usersTable, sessionsTable, dailyStatsTable } from '$lib/server/schema';
import { count, desc, sum, eq, gt, sql } from 'drizzle-orm';

export const load = async () => {
    try {
        // 1. Fetch all independent stats concurrently
        const [
            postsCountResult,
            usersCountResult,
            adminsCountResult,
            commentsCountResult,
            viewsSumResult,
            dailyStatsResult,
            onlineUsersResult,
            recentPosts,
            allPosts
        ] = await Promise.all([
            db.select({ count: count() }).from(postTable).where(eq(postTable.deleted, false)),
            db.select({ count: count() }).from(usersTable),
            db.select({ count: count() }).from(adminTable),
            db.select({ count: count() }).from(commentsTable),
            db.select({ total: sum(postTable.views) }).from(postTable).where(eq(postTable.deleted, false)),
            db.select({ views: dailyStatsTable.views }).from(dailyStatsTable).where(eq(dailyStatsTable.date, sql`CURRENT_DATE`)),
            db.select({ count: count() }).from(sessionsTable).where(gt(sessionsTable.last_seen, new Date(Date.now() - 5 * 60 * 1000))),

            // Recent posts (full details for maybe a widget?) - limiting to 5 is fine
            db.select().from(postTable).where(eq(postTable.deleted, false)).orderBy(desc(postTable.created_at)).limit(5),

            // All posts list - optimize to NOT fetch 'content'
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                // content: postTable.content, // OMIT large content
                category: postTable.category,
                image: postTable.image,
                status: postTable.status,
                featured: postTable.featured,
                views: postTable.views,
                author: postTable.author,
                created_at: postTable.created_at,
                updated_at: postTable.updated_at,
            }).from(postTable).where(eq(postTable.deleted, false)).orderBy(desc(postTable.created_at)).limit(50)
        ]);

        const postsCount = postsCountResult[0];
        const usersCount = usersCountResult[0];
        const adminsCount = adminsCountResult[0];
        const commentsCount = commentsCountResult[0];
        const viewsSum = viewsSumResult[0];

        const viewsToday = dailyStatsResult[0]?.views ?? 0;
        const onlineUsersCount = onlineUsersResult[0] ?? { count: 0 };

        console.log("Debug Admin Stats - Views Sum View:", viewsSum);
        console.log("Debug Admin Stats - Online Users:", onlineUsersCount);

        return {
            stats: {
                totalPosts: postsCount?.count ?? 0,
                totalAdmins: adminsCount?.count ?? 0,
                totalUsers: usersCount?.count ?? 0,
                totalComments: commentsCount?.count ?? 0,
                totalViews: Number(viewsSum?.total) ?? 0,
                viewsToday: viewsToday,
                onlineUsers: onlineUsersCount?.count ?? 0
            },
            recentPosts: recentPosts,
            posts: allPosts
        };
    } catch (error) {
        console.error('Error loading admin dashboard data:', error);
        try {
            const fs = await import('fs');
            fs.writeFileSync('admin_error.log', `Error at ${new Date().toISOString()}: ${error instanceof Error ? error.message : String(error)} \nStack: ${error instanceof Error ? error.stack : ''}\n\n`, { flag: 'a' });
        } catch (logErr) {
            console.error("Failed to write to log file:", logErr);
        }

        return {
            stats: {
                totalPosts: 0,
                totalUsers: 0,
                totalComments: 0,
                totalViews: 0,
                onlineUsers: 0
            },
            recentPosts: [],
            posts: []
        };
    }
};
