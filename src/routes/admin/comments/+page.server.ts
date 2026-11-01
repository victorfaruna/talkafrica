import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { commentsTable, postTable, usersTable, movieReviewsTable } from '$lib/server/schema';
import { eq, desc, like, or, and, sql, count } from 'drizzle-orm';
import { pageNumber } from '$lib/server/pagination';

export const load: PageServerLoad = async ({ url, locals }) => {
    const status = url.searchParams.get('status') || 'all';
    const search = url.searchParams.get('search') || '';
    const session = locals.session!;
    const isSuperAdmin = session.role === 'super_admin';
    const page = pageNumber(url);
    const pageSize = 25;

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
                movieTitle: movieReviewsTable.title,
                userName: usersTable.name,
                userEmail: usersTable.email
            })
            .from(commentsTable)
            .leftJoin(postTable, eq(commentsTable.post_id, postTable.post_id))
            .leftJoin(movieReviewsTable, eq(commentsTable.post_id, movieReviewsTable.review_id))
            .leftJoin(usersTable, eq(commentsTable.user_id, usersTable.user_id))
            .$dynamic();

        const filters = [];
        if (!isSuperAdmin) filters.push(eq(postTable.author_id, session.admin_id));

        if (status !== 'all') {
            filters.push(eq(commentsTable.status, status));
        }

        // Apply search filter
        if (search) {
            filters.push(
                or(
                    like(commentsTable.content, `%${search}%`),
                    like(usersTable.email, `%${search}%`),
                    like(postTable.title, `%${search}%`),
                    like(movieReviewsTable.title, `%${search}%`)
                )
            );
        }

        if (filters.length) query = query.where(and(...filters));

        const rows = await query.orderBy(desc(commentsTable.created_at), desc(commentsTable.comment_id)).limit(pageSize + 1).offset((page - 1) * pageSize);
        const comments = rows.slice(0, pageSize);

        // Get counts for each status
        const countStatus = async (commentStatus: string) => db
            .select({ count: count() })
            .from(commentsTable)
            .leftJoin(postTable, eq(commentsTable.post_id, postTable.post_id))
            .where(isSuperAdmin ? eq(commentsTable.status, commentStatus) : and(eq(commentsTable.status, commentStatus), eq(postTable.author_id, session.admin_id)));
        const [[pendingCount], [approvedCount], [rejectedCount]] = await Promise.all([
            countStatus('pending'), countStatus('approved'), countStatus('rejected')
        ]);

        return {
            comments,
            pagination: { currentPage: page, hasPrevPage: page > 1, hasNextPage: rows.length > pageSize },
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
            pagination: { currentPage: page, hasPrevPage: page > 1, hasNextPage: false },
            stats: { pending: 0, approved: 0, rejected: 0 },
            currentStatus: status,
            currentSearch: search
        };
    }
};
