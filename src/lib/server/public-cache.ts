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
    '/api/our-impact'
]);

export function cachePublicResponse(routeId: string | null, request: Request, response: Response) {
    if (
        !routeId ||
        !publicRoutes.has(routeId) ||
        !['GET', 'HEAD'].includes(request.method) ||
        request.headers.has('authorization') ||
        response.status !== 200 ||
        response.headers.has('set-cookie')
    ) {
        return;
    }

    // Browsers revalidate; Vercel shares content for one minute and may serve a
    // stale copy for up to five minutes while refreshing it in the background.
    response.headers.set('cache-control', 'public, max-age=0, must-revalidate');
    response.headers.set('vercel-cdn-cache-control', 'public, s-maxage=60, stale-while-revalidate=300');
}
