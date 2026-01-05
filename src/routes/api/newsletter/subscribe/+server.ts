import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { newsletterSubscribersTable } from '$lib/server/schema';
import type { RequestHandler } from './$types';
import { appendToSheet } from '$lib/server/sheets';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        // Basic validation
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return json({ error: 'Invalid email address' }, { status: 400 });
        }

        try {
            // Insert into Database
            await db.insert(newsletterSubscribersTable).values({ email });
        } catch (dbError: any) {
            // Handle duplicate email error (Postgres unique constraint violation)
            // Postgres error code for unique violation is '23505'
            if (dbError?.code === '23505') {
                return json({ success: true, message: 'Already subscribed' });
            }
            throw dbError;
        }

        // Add to Google Sheets (fire and forget)
        try {
            // We import this directly now, assuming it's safe or we handle error here
            // Previous code used dynamic import, which is fine, but static is cleaner if we fix the env var issues.
            // If the user hasn't fixed env vars, this might fail at runtime.
            // But let's stick to the previous pattern of catching errors.
            await appendToSheet(email).catch(err => console.error('Sheet append error:', err));
        } catch (e) {
            console.error('Failed to run sheets logic:', e);
        }

        return json({ success: true });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return json({ error: 'Failed to subscribe' }, { status: 500 });
    }
};
