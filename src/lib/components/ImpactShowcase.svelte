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

    let scrollContainer: HTMLDivElement;
    let animationFrame: number;
    let isPaused = false;
    let scrollSpeed = 1.5; // Increased speed for faster rotation

    function startContinuousScroll() {
        if (!browser || !scrollContainer) return;

        const animate = () => {
            if (!isPaused && scrollContainer) {
                scrollContainer.scrollLeft += scrollSpeed;

                // Seamless loop logic
                const maxScroll = scrollContainer.scrollWidth / 2;
                if (scrollContainer.scrollLeft >= maxScroll) {
                    scrollContainer.scrollLeft = 0;
                }
            }
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
    }

    function scrollPrev() {
        if (!scrollContainer) return;
        isPaused = true;
        scrollContainer.scrollBy({ left: -450, behavior: "smooth" });
        setTimeout(() => (isPaused = false), 5000); // Resume after 5s
    }

    function scrollNext() {
        if (!scrollContainer) return;
        isPaused = true;
        scrollContainer.scrollBy({ left: 450, behavior: "smooth" });
        setTimeout(() => (isPaused = false), 5000); // Resume after 5s
    }

    onMount(() => {
        startContinuousScroll();
        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    });
</script>

<section class="py-12 lg:py-24 bg-white overflow-hidden relative">
    <!-- Subtle African Pattern Background -->
    <div
        class="absolute inset-0 opacity-[0.015] pointer-events-none african-pattern"
    ></div>

    <div class="max-w-[1900px] mx-auto px-[var(--side-p)] relative z-10">
        <!-- Header -->
        <div class="text-center mb-12 lg:mb-20">
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
                class="flex gap-6 overflow-x-auto px-4 md:px-12 pb-12 no-scrollbar"
                role="region"
                aria-label="Impact image gallery"
            >
                {#each [...items, ...items] as item}
                    <div
                        class="flex-shrink-0 w-[300px] md:w-[450px] aspect-[4/3] relative rounded-[2rem] overflow-hidden group/item snap-center shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(253,176,34,0.15)]"
                    >
                        <img
                            src={item.image_url || item.image}
                            alt={item.caption}
                            class="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                        />

                        <!-- Main Overlay (Bottom Shadow for Caption) -->
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover/item:opacity-90 transition-opacity"
                        ></div>

                        <!-- Tag -->
                        {#if item.tag}
                            <div
                                class="absolute top-5 left-5 px-3 py-1 bg-[#FDB022]/40 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full z-20 shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                                style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
                            >
                                {item.tag}
                            </div>
                        {/if}

                        <!-- Caption -->
                        <div
                            class="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover/item:translate-y-0 transition-transform duration-500"
                        >
                            <p
                                class="text-white text-base font-bold font-clash-grotesk leading-tight"
                            >
                                {item.caption}
                            </p>
                        </div>

                        <!-- Brand Border (Hover) / High Quality Polish -->
                        <div
                            class="absolute inset-0 border-0 group-hover/item:border-[2px] border-[#FDB022] transition-all duration-300 rounded-[2rem] z-30 pointer-events-none group-hover/item:shadow-[inset_0_0_0_1px_rgba(253,176,34,0.5)]"
                        ></div>
                    </div>
                {/each}
            </div>

            <!-- Custom Navigation Hints (Desktop Only) -->
            <button
                class="absolute inset-y-0 -left-6 items-center hidden md:flex pointer-events-auto cursor-pointer z-40 bg-transparent border-none appearance-none"
                on:click={scrollPrev}
                aria-label="Previous image"
            >
                <div
                    class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg"
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
            </button>
            <button
                class="absolute inset-y-0 -right-6 items-center hidden md:flex pointer-events-auto cursor-pointer z-40 bg-transparent border-none appearance-none"
                on:click={scrollNext}
                aria-label="Next image"
            >
                <div
                    class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg"
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
            </button>
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
