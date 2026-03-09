<script lang="ts">
    import MovieCard from "$lib/components/movies/MovieCard.svelte";

    export let data;
    let reviews = data.reviews || [];

    $: recommended = reviews.filter((r: any) => r.is_recommended);
    $: allOther = reviews.filter((r: any) => !r.is_recommended);
</script>

<svelte:head>
    <title>African Movie Reviews & Recommendations - Talk Africa</title>
    <meta
        name="description"
        content="Discover the best African movies with expert reviews and recommendations from Talk Africa. Nollywood, African cinema, and more."
    />
</svelte:head>

<!-- Hero -->
<section class="relative bg-gray-950 text-white overflow-hidden">
    <div
        class="absolute inset-0 bg-gradient-to-br from-yellow-900/40 via-gray-950 to-gray-950"
    ></div>
    <!-- Decorative film strip pattern -->
    <div
        class="absolute inset-0 opacity-5"
        style="background-image: repeating-linear-gradient(90deg, white 0, white 2px, transparent 2px, transparent 60px); background-size: 60px 100%;"
    ></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div class="max-w-2xl">
            <div class="flex items-center gap-2 mb-4">
                <span class="h-1 w-8 rounded-full bg-yellow-500"></span>
                <span
                    class="text-yellow-500 text-sm font-semibold uppercase tracking-widest"
                    >African Cinema</span
                >
            </div>
            <h1
                class="font-clash-grotesk text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
            >
                Movie Reviews &<br /><span class="text-yellow-500"
                    >Recommendations</span
                >
            </h1>
            <p class="text-gray-300 text-lg leading-relaxed">
                Expert reviews of the finest African films — from Nollywood
                blockbusters to independent gems across the continent.
            </p>
        </div>
    </div>
</section>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    {#if reviews.length === 0}
        <div class="text-center py-24 text-gray-400">
            <div class="text-5xl mb-4">🎬</div>
            <p class="text-xl font-medium text-gray-600">
                No reviews yet. Check back soon!
            </p>
        </div>
    {:else}
        <!-- Recommended Section -->
        {#if recommended.length > 0}
            <section>
                <div class="flex items-center gap-3 mb-8">
                    <span class="h-1 w-6 rounded-full bg-yellow-500"></span>
                    <h2
                        class="text-2xl font-bold text-gray-900 font-clash-grotesk"
                    >
                        🎬 The Big Screen
                    </h2>
                </div>
                <div
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                    {#each recommended as review}
                        <MovieCard {review} />
                    {/each}
                </div>
            </section>
        {/if}

        <!-- All Reviews -->
        {#if allOther.length > 0}
            <section>
                <div class="flex items-center gap-3 mb-8">
                    <span class="h-1 w-6 rounded-full bg-gray-400"></span>
                    <h2
                        class="text-2xl font-bold text-gray-900 font-clash-grotesk"
                    >
                        All Reviews
                    </h2>
                </div>
                <div
                    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                    {#each allOther as review}
                        <MovieCard {review} />
                    {/each}
                </div>
            </section>
        {/if}
    {/if}
</div>
