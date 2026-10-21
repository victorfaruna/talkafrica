import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { commentsTable, postTable } from '$lib/server/schema';
import { requireAdmin } from '$lib/server/admin-auth';

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = requireAdmin(locals);
    const { ids, action } = await request.json();
    if (!Array.isArray(ids) || !['approve', 'reject', 'delete'].includes(action)) return json({ success: false, message: 'Invalid request' }, { status: 400 });
    const permitted = await db.select({ id: commentsTable.comment_id }).from(commentsTable)
        .innerJoin(postTable, eq(commentsTable.post_id, postTable.post_id))
        .where(and(inArray(commentsTable.comment_id, ids), session.role === 'super_admin' ? undefined : eq(postTable.author_id, session.admin_id)));
    const permittedIds = permitted.map((row) => row.id);
    if (!permittedIds.length) return json({ success: true, count: 0 });
    if (action === 'delete') await db.delete(commentsTable).where(inArray(commentsTable.comment_id, permittedIds));
    else await db.update(commentsTable).set({ status: action === 'approve' ? 'approved' : 'rejected', updated_at: new Date() }).where(inArray(commentsTable.comment_id, permittedIds));
    return json({ success: true, count: permittedIds.length });
};
