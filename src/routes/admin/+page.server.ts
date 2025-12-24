import { db } from '$lib/server/db';
import { adminTable, commentsTable, postTable, usersTable, sessionsTable } from '$lib/server/schema';
import { count, desc, sum, eq, gt } from 'drizzle-orm';

export const load = async () => {
    try {
        const [postsCount] = await db.select({ count: count() }).from(postTable).where(eq(postTable.deleted, false));
        const [usersCount] = await db.select({ count: count() }).from(usersTable);
        const [adminsCount] = await db.select({ count: count() }).from(adminTable);
        const [commentsCount] = await db.select({ count: count() }).from(commentsTable);
        const [viewsSum] = await db.select({ total: sum(postTable.views) }).from(postTable).where(eq(postTable.deleted, false));

        // Count online users (active in last 5 minutes)
        // Count online users (active in last 5 minutes)
        let onlineUsersCount = { count: 0 };
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const [result] = await db.select({ count: count() })
                .from(sessionsTable)
                .where(gt(sessionsTable.last_seen, fiveMinutesAgo));
            if (result) onlineUsersCount = result;
        } catch (err) {
            console.warn("Failed to fetch online users count (table might be missing):", err);
        }

        console.log("Debug Admin Stats - Views Sum View:", viewsSum);
        console.log("Debug Admin Stats - Online Users:", onlineUsersCount);

        const recentPosts = await db.select().from(postTable).where(eq(postTable.deleted, false)).orderBy(desc(postTable.created_at)).limit(5);
        const allPosts = await db.select().from(postTable).where(eq(postTable.deleted, false)).orderBy(desc(postTable.created_at));

        return {
            stats: {
                totalPosts: postsCount?.count ?? 0,
                totalUsers: (usersCount?.count ?? 0) + (adminsCount?.count ?? 0),
                totalComments: commentsCount?.count ?? 0,
                totalViews: Number(viewsSum?.total) ?? 0,
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
