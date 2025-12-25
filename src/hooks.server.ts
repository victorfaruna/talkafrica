import { db } from '$lib/server/db';
import { sessionsTable } from '$lib/server/schema';
import { eq, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const handle = async ({ event, resolve }) => {
    const path = event.url.pathname;

    // Skip session tracking for static assets, internal paths, and API calls to avoid DB congestion
    if (
        path.startsWith('/_app/') ||
        path.startsWith('/images/') ||
        path.startsWith('/favicon') ||
        path.includes('.')
    ) {
        return await resolve(event);
    }

    let session_id = event.cookies.get('session_id');

    if (!session_id) {
        session_id = randomUUID();
        event.cookies.set('session_id', session_id, {
            path: '/',
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });
    }

    try {
        await db.insert(sessionsTable).values({
            session_id,
            last_seen: new Date(),
        })
            .onConflictDoUpdate({
                target: sessionsTable.session_id,
                set: { last_seen: new Date() }
            });
    } catch (error) {
        console.error('Failed to track session:', error);
    }

    const response = await resolve(event);
    return response;
};
