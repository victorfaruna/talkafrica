import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { commentsTable, postTable } from '$lib/server/schema';
import { requireAdmin } from '$lib/server/admin-auth';

async function allowed(commentId: string, locals: App.Locals) {
    const session = requireAdmin(locals);
    const [row] = await db.select({ author_id: postTable.author_id })
        .from(commentsTable).innerJoin(postTable, eq(commentsTable.post_id, postTable.post_id))
        .where(eq(commentsTable.comment_id, commentId)).limit(1);
    return session.role === 'super_admin' || row?.author_id === session.admin_id;
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    if (!(await allowed(params.id, locals))) return json({ success: false, message: 'Forbidden' }, { status: 403 });
    const { status } = await request.json();
    if (!['approved', 'rejected', 'spam'].includes(status)) return json({ success: false, message: 'Invalid status' }, { status: 400 });
    await db.update(commentsTable).set({ status, updated_at: new Date() }).where(eq(commentsTable.comment_id, params.id));
    return json({ success: true });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    if (!(await allowed(params.id, locals))) return json({ success: false, message: 'Forbidden' }, { status: 403 });
    await db.delete(commentsTable).where(eq(commentsTable.comment_id, params.id));
    return json({ success: true });
};
