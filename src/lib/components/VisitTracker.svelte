<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import { page } from '$app/state';

    // Includes the initial hydrated visit, but never link preloads. Serialize
    // requests so rapid navigation shares the same session and view cookies.
    let pending = Promise.resolve();
    afterNavigate(({ from, to }) => {
        if (!to?.route.id || to.url.pathname.startsWith('/admin') || page.status !== 200) return;
        if (from && from.url.pathname === to.url.pathname && from.url.search === to.url.search) return;

        const body = JSON.stringify({
            postId: page.data.post?.post_id,
            movieSlug: page.data.review?.slug
        });
        pending = pending.then(async () => {
            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body,
                    keepalive: true
                });
            } catch { /* Analytics must never interrupt reading or navigation. */ }
        });
    });
</script>
