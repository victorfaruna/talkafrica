<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { quartOut } from "svelte/easing";

    const { posts = [] } = $props();

    let currentIndex = $state(0);
    let autoplayInterval: any;

    function nextPost() {
        if (posts.length === 0) return;
        currentIndex = (currentIndex + 1) % posts.length;
    }

    function prevPost() {
        if (posts.length === 0) return;
        currentIndex = (currentIndex - 1 + posts.length) % posts.length;
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextPost, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    onMount(() => {
        startAutoplay();
    });

    onDestroy(() => {
        stopAutoplay();
    });
</script>

{#if posts.length > 0}
    <div
        class="w-screen max-w-[1900px] mx-auto px-[var(--side-p)] mt-6 mb-6 z-10 relative"
    >
        <div
            class="w-full bg-white shadow-md rounded-xl flex items-center pr-2 lg:pr-4 overflow-hidden h-[50px] lg:h-[60px]"
            role="region"
            aria-label="Trending News Ticker"
            onmouseenter={stopAutoplay}
            onmouseleave={startAutoplay}
        >
            <!-- Label -->
            <div
                class="bg-black text-[var(--color-accent)] px-2 lg:px-6 h-full flex items-center justify-center font-black text-[9px] lg:text-sm shrink-0 transition-all duration-300 gap-1 lg:gap-2"
            >
                <div class="animate-pulse lg:block hidden">⚡</div>
                <div class="animate-pulse lg:hidden text-[10px]">⚡</div>
                <span class="tracking-widest uppercase hidden sm:inline"
                    >Trending Now</span
                >
                <span class="tracking-widest uppercase sm:hidden">Trending</span
                >
            </div>

            <!-- Content Area -->
            <div class="flex-1 relative h-full overflow-hidden mx-4">
                {#key currentIndex}
                    <div
                        class="absolute inset-0 flex items-center"
                        in:fly={{
                            y: 20,
                            duration: 400,
                            delay: 100,
                            easing: quartOut,
                        }}
                        out:fly={{ y: -20, duration: 400, easing: quartOut }}
                    >
                        <a
                            href="/posts/{posts[currentIndex].post_id}"
                            class="text-gray-900 hover:text-[var(--color-accent)] font-semibold text-sm lg:text-base truncate w-full block transition-colors"
                        >
                            {posts[currentIndex].title}
                        </a>
                    </div>
                {/key}
            </div>

            <!-- Navigation -->
            <div
                class="flex items-center gap-1 lg:gap-2 shrink-0 border-l border-gray-100 pl-2 lg:pl-4"
            >
                <button
                    onclick={prevPost}
                    class="p-1.5 lg:p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors"
                    aria-label="Previous trending post"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-3 h-3 lg:w-4 lg:h-4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>
                <button
                    onclick={nextPost}
                    class="p-1.5 lg:p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-colors"
                    aria-label="Next trending post"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        class="w-3 h-3 lg:w-4 lg:h-4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
{/if}
