<script lang="ts">
    import MovieRecommendations from "$lib/components/MovieRecommendations.svelte";
    import CommentSection from "$lib/components/CommentSection.svelte";

    export let data;
    let review = data.review;
    let relatedReviews = data.relatedReviews || [];

    function formatDate(d: string) {
        return new Date(d).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function starRating(rating: number) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return { full, half, empty: 5 - full - (half ? 1 : 0) };
    }

    $: stars = starRating(review.rating);

    // Convert YouTube watch URL to embed URL
    function getEmbedUrl(url: string): string {
        if (!url) return "";
        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
        );
        if (match) return `https://www.youtube.com/embed/${match[1]}`;
        return url; // Use as-is if already an embed link or other format
    }

    $: embedUrl = review.trailer_url ? getEmbedUrl(review.trailer_url) : "";
</script>

<svelte:head>
    <title>{review.title} - Movie Review | Talk Africa</title>
    <meta
        name="description"
        content="Read Talk Africa's review of {review.title}. {review.genre
            ? `Genre: ${review.genre}.`
            : ''} Rated {review.rating}/5 stars."
    />
</svelte:head>

<!-- Backdrop hero -->
<div
    class="relative w-full overflow-hidden bg-gray-950"
    style="min-height: 420px;"
>
    {#if review.backdrop_url}
        <img
            src={review.backdrop_url}
            alt=""
            class="absolute inset-0 w-full h-full object-cover opacity-40"
        />
    {:else}
        <div
            class="absolute inset-0 bg-gradient-to-br from-yellow-900/40 via-gray-950 to-gray-950"
        ></div>
    {/if}
    <div
        class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"
    ></div>

    <div
        class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row gap-8 items-end"
    >
        <!-- Poster -->
        <div
            class="w-36 sm:w-48 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10"
        >
            <img
                src={review.poster_url}
                alt={review.title}
                class="w-full aspect-[2/3] object-cover"
            />
        </div>

        <!-- Meta -->
        <div class="flex-1 pb-2">
            {#if review.genre}
                <div
                    class="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-2"
                >
                    {review.genre}
                </div>
            {/if}
            <h1
                class="text-white text-3xl sm:text-4xl lg:text-5xl font-bold font-clash-grotesk leading-tight mb-3"
            >
                {review.title}
            </h1>

            <div
                class="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4"
            >
                {#if review.director}
                    <span
                        >🎬 Directed by <strong class="text-white"
                            >{review.director}</strong
                        ></span
                    >
                {/if}
                {#if review.release_date}
                    <span>📅 {formatDate(review.release_date)}</span>
                {/if}
                {#if review.runtime}
                    <span>⏱ {review.runtime}</span>
                {/if}
            </div>

            <!-- Star rating -->
            <div class="flex items-center gap-2 mb-3">
                <div class="flex">
                    {#each Array(stars.full) as _}
                        <span class="text-yellow-400 text-xl">★</span>
                    {/each}
                    {#if stars.half}
                        <span class="text-yellow-400 text-xl">⯨</span>
                    {/if}
                    {#each Array(stars.empty) as _}
                        <span class="text-gray-600 text-xl">★</span>
                    {/each}
                </div>
                <span class="text-white text-lg font-bold">{review.rating}</span
                >
                <span class="text-gray-400 text-sm">/ 5</span>
            </div>

            {#if review.is_recommended}
                <span
                    class="inline-flex items-center gap-1 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                    >⭐ STAFF RECOMMENDED</span
                >
            {/if}
        </div>
    </div>
</div>

<!-- Content -->
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Main review -->
        <div class="lg:col-span-2 space-y-10">
            <!-- Trailer -->
            {#if embedUrl}
                <section>
                    <h2
                        class="text-xl font-bold text-gray-900 mb-4 font-clash-grotesk flex items-center gap-2"
                    >
                        <span
                            class="w-1 h-6 rounded-full bg-yellow-500 inline-block"
                        ></span>
                        Watch Trailer
                    </h2>
                    <div
                        class="relative w-full rounded-xl overflow-hidden shadow-lg bg-black"
                        style="padding-top: 56.25%;"
                    >
                        <iframe
                            src={embedUrl}
                            title="{review.title} Trailer"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            class="absolute inset-0 w-full h-full"
                        ></iframe>
                    </div>
                </section>
            {/if}

            <!-- Review -->
            <section>
                <h2
                    class="text-xl font-bold text-gray-900 mb-5 font-clash-grotesk flex items-center gap-2"
                >
                    <span
                        class="w-1 h-6 rounded-full bg-yellow-500 inline-block"
                    ></span>
                    Our Review
                </h2>
                <div
                    class="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line"
                >
                    {review.content}
                </div>
            </section>
        </div>

        <!-- Sidebar info -->
        <aside class="space-y-6">
            <div
                class="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4"
            >
                <h3
                    class="font-bold text-gray-900 text-sm uppercase tracking-wider"
                >
                    Movie Details
                </h3>

                <dl class="space-y-3 text-sm">
                    {#if review.genre}
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Genre</dt>
                            <dd class="font-medium text-gray-800">
                                {review.genre}
                            </dd>
                        </div>
                    {/if}
                    {#if review.director}
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Director</dt>
                            <dd class="font-medium text-gray-800">
                                {review.director}
                            </dd>
                        </div>
                    {/if}
                    {#if review.runtime}
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Runtime</dt>
                            <dd class="font-medium text-gray-800">
                                {review.runtime}
                            </dd>
                        </div>
                    {/if}
                    {#if review.release_date}
                        <div class="flex justify-between">
                            <dt class="text-gray-500">Released</dt>
                            <dd class="font-medium text-gray-800">
                                {formatDate(review.release_date)}
                            </dd>
                        </div>
                    {/if}
                    <div
                        class="flex justify-between items-center pt-2 border-t border-gray-200"
                    >
                        <dt class="text-gray-500">Rating</dt>
                        <dd class="flex items-center gap-1">
                            <span class="text-yellow-400">★</span>
                            <span class="font-bold text-gray-800"
                                >{review.rating}/5</span
                            >
                        </dd>
                    </div>
                </dl>
            </div>

            {#if review.cast}
                <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h3
                        class="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3"
                    >
                        Cast
                    </h3>
                    <p class="text-sm text-gray-700 leading-relaxed">
                        {review.cast}
                    </p>
                </div>
            {/if}

            <div class="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                <div class="text-yellow-700 font-bold text-sm mb-1">
                    Reviewed by Talk Africa
                </div>
                <div class="text-yellow-600 text-xs">{review.author}</div>
            </div>
        </aside>
    </div>

    <!-- Comments -->
    <div class="mt-16 pt-16 border-t border-gray-100">
        <CommentSection postId={review.review_id} />
    </div>

    <!-- Related Recommendations -->
    {#if relatedReviews.length > 0}
        <div class="mt-20">
            <MovieRecommendations
                recommendedMovies={relatedReviews}
                title="More Recommendations"
                subtitle="Explore more handpicked African movie gems you might enjoy."
            />
        </div>
    {/if}

    <!-- Back nav -->
    <div class="mt-12 pt-8 border-t border-gray-200">
        <a
            href="/movies"
            class="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-800 font-medium transition-colors"
        >
            ← Back to all reviews
        </a>
    </div>
</div>
