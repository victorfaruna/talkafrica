<script lang="ts">
    export let review: {
        review_id: string;
        title: string;
        slug: string;
        genre?: string;
        director?: string;
        release_date?: string;
        rating: number;
        poster_url: string;
        is_recommended: boolean;
    };

    function starRating(rating: number) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return { full, half, empty: 5 - full - (half ? 1 : 0) };
    }
    $: stars = starRating(review.rating);
</script>

<a href={`/movies/${review.slug}`} class="group block">
    <div
        class="relative rounded-xl overflow-hidden bg-gray-900 aspect-[2/3] shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1"
    >
        <!-- Poster Image -->
        <img
            src={review.poster_url}
            alt={review.title}
            class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />

        <!-- Overlay gradient -->
        <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
        ></div>

        <!-- Recommended badge -->
        {#if review.is_recommended}
            <div class="absolute top-3 left-3">
                <span
                    class="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg"
                    >⭐ RECOMMENDED</span
                >
            </div>
        {/if}

        <!-- Bottom info -->
        <div class="absolute bottom-0 left-0 right-0 p-4">
            {#if review.genre}
                <div
                    class="text-xs text-yellow-500 font-semibold uppercase tracking-wider mb-1"
                >
                    {review.genre}
                </div>
            {/if}
            <h3
                class="text-white font-bold text-base leading-tight mb-2 group-hover:text-yellow-400 transition-colors"
            >
                {review.title}
            </h3>

            <!-- Star rating -->
            <div class="flex items-center gap-1">
                {#each Array(stars.full) as _}
                    <span class="text-yellow-400 text-sm">★</span>
                {/each}
                {#if stars.half}
                    <span class="text-yellow-400 text-sm">⯨</span>
                {/if}
                {#each Array(stars.empty) as _}
                    <span class="text-gray-600 text-sm">★</span>
                {/each}
                <span class="text-gray-300 text-xs ml-1">{review.rating}/5</span
                >
            </div>

            {#if review.release_date}
                <div class="text-gray-400 text-xs mt-1">
                    {new Date(review.release_date).getFullYear()}
                </div>
            {/if}
        </div>
    </div>
</a>
