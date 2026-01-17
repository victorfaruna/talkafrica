import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { newsletterSubscribersTable } from '$lib/server/schema';
import type { RequestHandler } from './$types';


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

        // Google Sheets integration removed per user request. 
        // Emails are stored in the database.

        return json({ success: true });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return json({ error: 'Failed to subscribe' }, { status: 500 });
    }
};
