import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { newsletterSubscribersTable } from '$lib/server/schema';
import { count, desc } from 'drizzle-orm';
import { listRange } from '$lib/server/pagination';
import type { RequestHandler } from './$types';
import { requireSuperAdmin } from '$lib/server/admin-auth';

export const GET: RequestHandler = async ({ locals, url }) => {
    requireSuperAdmin(locals);
    try {
        const { limit, offset } = listRange(url, 25);
        const [subscribers, totals] = await Promise.all([db.select()
            .from(newsletterSubscribersTable)
            .orderBy(desc(newsletterSubscribersTable.created_at)).limit(limit + 1).offset(offset),
            db.select({ count: count() }).from(newsletterSubscribersTable),
        ]);

        return json({ success: true, subscribers: subscribers.slice(0, limit), hasMore: subscribers.length > limit, total: totals[0].count });
    } catch (error) {
        console.error('Failed to fetch subscribers:', error);
        return json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
};
