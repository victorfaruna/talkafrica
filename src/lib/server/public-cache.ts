import { isAuthenticatedRequest } from './public-data-cache';

// Only share responses whose published content is identical for every visitor.
// SvelteKit's __data.json requests resolve to the same route IDs as their pages.
const publicRoutes = new Set([
    '/',
    '/[category=category]',
    '/african-giant',
    '/posts/[post_id]',
    '/movies',
    '/movies/[slug]',
    '/videos',
    '/about',
    '/emergence',
    '/api/search',
    '/api/our-impact',
    '/sitemap.xml',
    '/api/videos'
]);

export function cachePublicResponse(routeId: string | null, request: Request, response: Response) {
    const authenticated = isAuthenticatedRequest(request);
    if (authenticated || routeId?.startsWith('/admin') ||
        (routeId?.startsWith('/api/') && !publicRoutes.has(routeId) && routeId !== '/api/article-media/[kind]/[id]/[hash]')) {
        response.headers.set('cache-control', 'private, no-store');
        response.headers.set('vercel-cdn-cache-control', 'private, no-store');
        response.headers.delete('vercel-cache-tag');
        return;
    }
    if (
        !routeId ||
        !publicRoutes.has(routeId) ||
        !['GET', 'HEAD'].includes(request.method) ||
        authenticated ||
        response.status !== 200 ||
        response.headers.has('set-cookie')
    ) {
        return;
    }

    // A warm data cache lasts 60s; CDN responses last another 60s at most.
    // No extra stale window: edits/unpublishing propagate within two minutes
    // even without the optional Vercel tag invalidation credentials.
    response.headers.set('cache-control', 'public, max-age=0, must-revalidate');
    response.headers.set('vercel-cdn-cache-control', 'public, s-maxage=60');
    response.headers.set('vercel-cache-tag', 'talkafrica-public');
}
