import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { commentsTable, postTable, usersTable } from '$lib/server/schema';
import { eq, desc, like, or, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
    const status = url.searchParams.get('status') || 'all';
    const search = url.searchParams.get('search') || '';

    try {
        let query = db
            .select({
                comment_id: commentsTable.comment_id,
                post_id: commentsTable.post_id,
                user_id: commentsTable.user_id,
                content: commentsTable.content,
                status: commentsTable.status,
                created_at: commentsTable.created_at,
                postTitle: postTable.title,
                userName: usersTable.name,
                userEmail: usersTable.email
            })
            .from(commentsTable)
            .leftJoin(postTable, eq(commentsTable.post_id, postTable.post_id))
            .leftJoin(usersTable, eq(commentsTable.user_id, usersTable.user_id))
            .$dynamic();

        // Apply status filter
        if (status !== 'all') {
            query = query.where(eq(commentsTable.status, status));
        }

        // Apply search filter
        if (search) {
            query = query.where(
                or(
                    like(commentsTable.content, `%${search}%`),
                    like(usersTable.email, `%${search}%`),
                    like(postTable.title, `%${search}%`)
                )
            );
        }

        const comments = await query.orderBy(desc(commentsTable.created_at));

        // Get counts for each status
        const [pendingCount] = await db
            .select({ count: db.$count(commentsTable) })
            .from(commentsTable)
            .where(eq(commentsTable.status, 'pending'));

        const [approvedCount] = await db
            .select({ count: db.$count(commentsTable) })
            .from(commentsTable)
            .where(eq(commentsTable.status, 'approved'));

        const [rejectedCount] = await db
            .select({ count: db.$count(commentsTable) })
            .from(commentsTable)
            .where(eq(commentsTable.status, 'rejected'));

        return {
            comments,
            stats: {
                pending: pendingCount?.count || 0,
                approved: approvedCount?.count || 0,
                rejected: rejectedCount?.count || 0
            },
            currentStatus: status,
            currentSearch: search
        };
    } catch (error) {
        console.error('Error loading comments:', error);
        return {
            comments: [],
            stats: { pending: 0, approved: 0, rejected: 0 },
            currentStatus: status,
            currentSearch: search
        };
    }
};
