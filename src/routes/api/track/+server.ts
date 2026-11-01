import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { randomUUID } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { sessionsTable, postTable, dailyStatsTable, postDailyStatsTable, movieReviewsTable } from '$lib/server/schema';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const POST: RequestHandler = async ({ request, url, cookies }) => {
    if (request.headers.get('origin') !== url.origin) error(403, 'Invalid origin');

    const body = await request.text();
    if (body.length > 512) error(413, 'Tracking payload too large');
    let data: { postId?: string; movieSlug?: string };
    try {
        data = JSON.parse(body);
    } catch {
        error(400, 'Invalid tracking payload');
    }
    if (
        !data || typeof data !== 'object' || Array.isArray(data) ||
        (data.postId !== undefined && (typeof data.postId !== 'string' || !uuidPattern.test(data.postId))) ||
        (data.movieSlug !== undefined && (typeof data.movieSlug !== 'string' || !data.movieSlug || data.movieSlug.length > 255)) ||
        (data.postId !== undefined && data.movieSlug !== undefined)
    ) {
        error(400, 'Invalid tracking payload');
    }

    const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, secure: url.protocol === 'https:' };
    const now = Date.now();
    const existingSession = cookies.get('session_id');
    const validSession = existingSession && uuidPattern.test(existingSession);
    const sessionId = validSession ? existingSession : randomUUID();
    const lastUpdate = Number(cookies.get('last_session_update'));

    try {
        if (!validSession || !Number.isFinite(lastUpdate) || now - lastUpdate > 5 * 60 * 1000 || lastUpdate > now) {
            await db.insert(sessionsTable).values({ session_id: sessionId, last_seen: new Date(now) })
                .onConflictDoUpdate({ target: sessionsTable.session_id, set: { last_seen: new Date(now) } });
            cookies.set('session_id', sessionId, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
            cookies.set('last_session_update', String(now), { ...cookieOptions, maxAge: 60 * 60 });
        }

        const viewedPostIds = (cookies.get('viewed_posts') || '').split(',').filter((id) => uuidPattern.test(id));
        if (data.postId && !viewedPostIds.includes(data.postId)) {
            const postId = data.postId;
            const counted = await db.transaction(async (tx) => {
                const updated = await tx.update(postTable)
                    .set({ views: sql`${postTable.views} + 1` })
                    .where(and(eq(postTable.post_id, postId), eq(postTable.status, 'published'), eq(postTable.deleted, false)))
                    .returning({ post_id: postTable.post_id });
                if (!updated.length) return false;

                await tx.insert(dailyStatsTable)
                    .values({ date: sql`CURRENT_DATE`, views: 1 })
                    .onConflictDoUpdate({ target: dailyStatsTable.date, set: { views: sql`${dailyStatsTable.views} + 1` } });
                await tx.insert(postDailyStatsTable)
                    .values({ post_id: postId, date: sql`CURRENT_DATE`, views: 1 })
                    .onConflictDoUpdate({
                        target: [postDailyStatsTable.post_id, postDailyStatsTable.date],
                        set: { views: sql`${postDailyStatsTable.views} + 1` }
                    });
                return true;
            });
            if (counted) {
                cookies.set('viewed_posts', [...viewedPostIds, postId].slice(-50).join(','), { ...cookieOptions, maxAge: 60 * 60 * 24 });
            }
        }

        if (data.movieSlug) {
            await db.update(movieReviewsTable)
                .set({ views: sql`${movieReviewsTable.views} + 1` })
                .where(and(eq(movieReviewsTable.slug, data.movieSlug), eq(movieReviewsTable.status, 'published')));
        }
    } catch (cause) {
        console.error('Failed to track page visit:', cause);
        return new Response(null, { status: 503, headers: { 'cache-control': 'private, no-store' } });
    }

    return new Response(null, { status: 204, headers: { 'cache-control': 'private, no-store' } });
};
