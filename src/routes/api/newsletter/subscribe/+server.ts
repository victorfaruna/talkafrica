import { json } from '@sveltejs/kit';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        // Basic validation
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return json({ error: 'Invalid email address' }, { status: 400 });
        }

        if (!DATABASE_URL) {
            console.error('DATABASE_URL is missing');
            return json({ error: 'Server configuration error' }, { status: 500 });
        }

        const sql = postgres(DATABASE_URL);

        try {
            // Insert into Database
            await sql`
                INSERT INTO newsletter_subscribers (email)
                VALUES (${email})
            `;
        } catch (dbError: any) {
            // Handle duplicate email error (Postgres unique constraint violation)
            if (dbError.code === '23505') {
                return json({ success: true, message: 'Already subscribed' });
            }
            throw dbError;
        } finally {
            // Close the connection (or rely on pool, but for serverless/lambdas usually recommended to close or use pool correctly)
            // postgres.js manages pool automatically, but in a +server.ts context, we can just let it handle it.
            // However, creating a new connection every request might be heavy. 
            // Ideally we'd have a shared db client in $lib/server/db.ts.
            // For now, to match the scope of the fix, we'll keep it simple but safe.
            // await sql.end(); // Don't verify end immediately if we want to potentially reuse, but postgres() creates a pool.
            // Actually, best practice with postgres.js in SvelteKit is to export a singleton or create per request.
            // Let's create it per request for safety in this fix, and end it.
            await sql.end();
            // Re-evaluating: 'postgres' returns a Sql function which is a pool. 
            // We should just use it and let it be. But to avoid leaking connections in dev if HMR happens, maybe just closing is fine.
        }

        // Add to Google Sheets (fire and forget)
        try {
            const { appendToSheet } = await import('$lib/server/sheets');
            appendToSheet(email).catch(err => console.error('Sheet append error:', err));
        } catch (e) {
            console.error('Failed to import or run sheets logic:', e);
        }

        return json({ success: true });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return json({ error: 'Failed to subscribe' }, { status: 500 });
    }
};
