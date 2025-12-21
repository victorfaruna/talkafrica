import { db } from '$lib/server/db';
import { adminTable, commentsTable, postTable, usersTable } from '$lib/server/schema';
import { count, desc, sum } from 'drizzle-orm';

export const load = async () => {
    try {
        const [postsCount] = await db.select({ count: count() }).from(postTable);
        const [usersCount] = await db.select({ count: count() }).from(usersTable);
        const [commentsCount] = await db.select({ count: count() }).from(commentsTable);
        const [viewsSum] = await db.select({ total: sum(postTable.views) }).from(postTable);

        const recentPosts = await db.select().from(postTable).orderBy(desc(postTable.created_at)).limit(5);
        const allPosts = await db.select().from(postTable).orderBy(desc(postTable.created_at));

        return {
            stats: {
                totalPosts: postsCount?.count ?? 0,
                totalUsers: usersCount?.count ?? 0,
                totalComments: commentsCount?.count ?? 0,
                totalViews: Number(viewsSum?.total) ?? 0
            },
            recentPosts: recentPosts,
            posts: allPosts
        };
    } catch (error) {
        console.error('Error loading admin dashboard data:', error);
        return {
            stats: {
                totalPosts: 0,
                totalUsers: 0,
                totalComments: 0,
                totalViews: 0
            },
            recentPosts: [],
            posts: []
        };
    }
};
