import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { newsletterSubscribersTable } from '$lib/server/schema';
import { desc } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const subscribers = await db.select()
            .from(newsletterSubscribersTable)
            .orderBy(desc(newsletterSubscribersTable.created_at));

        return json({ success: true, subscribers });
    } catch (error) {
        console.error('Failed to fetch subscribers:', error);
        return json({ error: 'Failed to fetch subscribers' }, { status: 500 });
    }
};
