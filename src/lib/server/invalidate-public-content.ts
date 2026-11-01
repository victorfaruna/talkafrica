import { env } from '$env/dynamic/private';
import { publicDataCache } from './public-data-cache';

export async function invalidatePublicContent() {
    publicDataCache.invalidate();
    // Optional, existing Vercel CDN functionality. No new service or dependency.
    // Other serverless instances still expire their in-memory data within 60s.
    if (!env.VERCEL_CACHE_PURGE_TOKEN || !env.VERCEL_PROJECT_ID) return;
    const url = new URL('https://api.vercel.com/v1/edge-cache/invalidate-by-tags');
    url.searchParams.set('projectIdOrName', env.VERCEL_PROJECT_ID);
    if (env.VERCEL_TEAM_ID) url.searchParams.set('teamId', env.VERCEL_TEAM_ID);
    try {
        const result = await fetch(url, {
            method: 'POST', signal: AbortSignal.timeout(3000),
            headers: { authorization: `Bearer ${env.VERCEL_CACHE_PURGE_TOKEN}`, 'content-type': 'application/json' },
            body: JSON.stringify({ tags: ['talkafrica-public'], target: env.VERCEL_ENV === 'preview' ? 'preview' : 'production' }),
        });
        if (!result.ok) console.error('Public CDN invalidation failed:', result.status);
    } catch { console.error('Public CDN invalidation unavailable; the 60-second CDN TTL remains active.'); }
}
