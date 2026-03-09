<script lang="ts">
    import MovieCard from "./movies/MovieCard.svelte";
    import { onMount } from "svelte";

    export let recommendedMovies: any[] = [];
    export let title = "The Big Screen";
    export let subtitle =
        "Curated excellence from the heart of African cinema.";

    let scrollContainer: HTMLDivElement;
    let showLeftArrow = false;
    let showRightArrow = true;
    let autoPlayInterval: any;
    let isPaused = false;

    function handleScroll() {
        if (!scrollContainer) return;
        showLeftArrow = scrollContainer.scrollLeft > 10;
        showRightArrow =
            scrollContainer.scrollLeft <
            scrollContainer.scrollWidth - scrollContainer.clientWidth - 10;
    }

    function scroll(direction: "left" | "right") {
        if (!scrollContainer) return;
        const scrollAmount = scrollContainer.clientWidth * 0.8;

        // If we're at the end and scrolling right, wrap to start
        if (direction === "right" && !showRightArrow) {
            scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else if (direction === "left" && !showLeftArrow) {
            scrollContainer.scrollTo({
                left: scrollContainer.scrollWidth,
                behavior: "smooth",
            });
        } else {
            scrollContainer.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (!isPaused) {
                scroll("right");
            }
        }, 4000); // Rotate every 4 seconds
    }

    function stopAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    onMount(() => {
        handleScroll();
        startAutoPlay();
        return () => stopAutoPlay();
    });
</script>

<section class="relative py-20 bg-stone-950 text-white overflow-hidden">
    <!-- African-inspired decorative pattern -->
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNEwzOCAzNkw0MCAzNEwzOCAzMkwzNiAzNFpNMTYgMzRMMTggMzZMMjAgMzRMMTggMzJMMTYgMzRaTTE2IDE0TDE4IDE2TDIwIDE0TDE4IDEyTDE2IDE0Wk0zNiAxNEwzOCAxNkw0MCAxNEwzOCAxMkwzNiAxNFoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMSIvPjwvZz48L3N2Zz4=');"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
            class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
            <div class="max-w-2xl">
                <div class="flex items-center gap-2 mb-3">
                    <span class="h-1 w-8 rounded-full bg-yellow-500"></span>
                    <span
                        class="text-yellow-500 text-sm font-bold uppercase tracking-[0.3em]"
                        >Cinematic</span
                    >
                    >
                </div>
                <h2
                    class="text-4xl sm:text-5xl lg:text-6xl font-black font-clash-grotesk text-white tracking-tighter"
                >
                    {title}
                </h2>
                <p class="text-gray-400 mt-3 text-lg">
                    {subtitle}
                </p>
            </div>

            <div class="flex items-center gap-3">
                <button
                    on:click={() => scroll("left")}
                    class="p-3 rounded-full border border-gray-800 hover:border-yellow-500 hover:text-yellow-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={!showLeftArrow}
                    aria-label="Scroll left"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <button
                    on:click={() => scroll("right")}
                    class="p-3 rounded-full border border-gray-800 hover:border-yellow-500 hover:text-yellow-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={!showRightArrow}
                    aria-label="Scroll right"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
                <a
                    href="/movies"
                    class="ml-4 text-yellow-500 font-semibold hover:text-yellow-400 transition-colors hidden sm:block"
                >
                    View All Reviews →
                </a>
            </div>
        </div>

        {#if recommendedMovies.length === 0}
            <div
                class="py-20 text-center border border-dashed border-gray-800 rounded-2xl"
            >
                <p class="text-gray-500">
                    Coming soon: Handpicked movie recommendations.
                </p>
            </div>
        {:else}
            <div
                bind:this={scrollContainer}
                on:scroll={handleScroll}
                on:mouseenter={() => (isPaused = true)}
                on:mouseleave={() => (isPaused = false)}
                role="region"
                aria-live="polite"
                class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
            >
                {#each recommendedMovies as movie}
                    <div class="flex-shrink-0 w-64 sm:w-72 snap-start">
                        <MovieCard review={movie} />
                    </div>
                {/each}
            </div>
        {/if}

        <div class="sm:hidden mt-6 text-center">
            <a href="/movies" class="text-yellow-500 font-semibold">
                View All Reviews →
            </a>
        </div>
    </div>
</section>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
