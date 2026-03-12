<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";

    interface GalleryItem {
        id: number;
        image: string;
        caption: string;
        tag?: string;
    }

    export let items: any[] = [];

    let scrollContainer: HTMLElement;
    let autoPlayInterval: any;
    let isPaused = false;
    let scrollPos = 0;

    function startAutoPlay() {
        if (!browser) return;
        autoPlayInterval = setInterval(() => {
            if (!isPaused && scrollContainer) {
                const maxScroll =
                    scrollContainer.scrollWidth - scrollContainer.clientWidth;
                if (scrollContainer.scrollLeft >= maxScroll - 5) {
                    scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollContainer.scrollBy({ left: 400, behavior: "smooth" });
                }
            }
        }, 5000);
    }

    onMount(() => {
        startAutoPlay();
        return () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        };
    });
</script>

<section class="py-24 bg-white overflow-hidden relative">
    <!-- Subtle African Pattern Background -->
    <div
        class="absolute inset-0 opacity-[0.015] pointer-events-none african-pattern"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Header -->
        <div class="text-center mb-20">
            <div class="mb-6">
                <span
                    class="text-[#FDB022] text-sm md:text-base font-black uppercase tracking-[0.5em] font-poppins"
                >
                    TalkAfrika's Legacy
                </span>
            </div>
            <h2
                class="text-5xl md:text-7xl lg:text-8xl font-black font-clash-grotesk text-gray-900 mb-8 tracking-tighter leading-[0.95]"
            >
                Stories That Matter,<br />
                <span class="text-[#FDB022]">Impact That Lasts</span>
            </h2>
            <p
                class="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed"
            >
                Beyond headlines, we are building a legacy of truth, reach, and
                community across the continent.
            </p>
        </div>

        <!-- Gallery Wrapper -->
        <div
            class="relative group"
            on:mouseenter={() => (isPaused = true)}
            on:mouseleave={() => (isPaused = false)}
        >
            <div
                bind:this={scrollContainer}
                class="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
                role="region"
                aria-label="Impact image gallery"
            >
                {#each items as item}
                    <div
                        class="flex-shrink-0 w-[300px] md:w-[450px] aspect-[4/3] relative rounded-[2rem] overflow-hidden group/item snap-center shadow-lg transition-transform duration-500 hover:scale-[1.02]"
                    >
                        <img
                            src={item.image_url || item.image}
                            alt={item.caption}
                            class="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                        />

                        <!-- Brand Overlay -->
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover/item:opacity-90 transition-opacity"
                        ></div>

                        <!-- Tag -->
                        {#if item.tag}
                            <div
                                class="absolute top-6 left-6 px-4 py-1 bg-[#FDB022] text-white text-xs font-bold rounded-full uppercase tracking-widest z-20"
                            >
                                {item.tag}
                            </div>
                        {/if}

                        <!-- Caption -->
                        <div
                            class="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500"
                        >
                            <p
                                class="text-white text-lg font-bold font-clash-grotesk leading-tight"
                            >
                                {item.caption}
                            </p>
                        </div>

                        <!-- Brand Border (Hover) -->
                        <div
                            class="absolute inset-0 border-0 group-hover/item:border-[6px] border-[#FDB022] transition-all duration-300 rounded-[2rem] z-30 pointer-events-none"
                        ></div>
                    </div>
                {/each}
            </div>

            <!-- Custom Navigation Hints (Desktop Only) -->
            <div
                class="absolute inset-y-0 -left-4 items-center hidden md:flex pointer-events-none"
            >
                <div
                    class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <svg
                        class="w-6 h-6 text-[#FDB022]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M15 19l-7-7 7-7"
                        /></svg
                    >
                </div>
            </div>
            <div
                class="absolute inset-y-0 -right-4 items-center hidden md:flex pointer-events-none"
            >
                <div
                    class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <svg
                        class="w-6 h-6 text-[#FDB022]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            d="M9 5l7 7-7 7"
                        /></svg
                    >
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .font-clash-grotesk {
        font-family:
            "Clash Grotesk",
            system-ui,
            -apple-system,
            sans-serif;
    }

    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .african-pattern {
        background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34L38 36L40 34L38 32Z' fill='%23000'/%3E%3C/g%3E%3C/svg%3E");
    }
</style>
