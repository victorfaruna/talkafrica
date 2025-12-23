<script lang="ts">
    import { register } from "swiper/element/bundle";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { quartOut } from "svelte/easing";

    type Post = {
        post_id: string;
        title: string;
        image?: string | null;
        excerpt?: string | null;
        category?: string | null;
    };

    const { featured }: { featured: Post[] } = $props();

    let activeIndex = $state(0);

    const fallback = "/images/placeholder.webp";

    let swiperEl: any;

    // Initialize Swiper Web Components
    onMount(() => {
        register();

        const initSwiper = () => {
            const swiperParams = {
                slidesPerView: 1,
                spaceBetween: 0,
                loop: true,
                speed: 800,
                effect: "creative",
                creativeEffect: {
                    prev: {
                        shadow: true,
                        translate: [0, "-100%", -1],
                    },
                    next: {
                        translate: [0, "100%", 0],
                    },
                },
                observer: true,
                observeParents: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                injectStyles: [
                    `
                    :host .swiper-pagination {
                        display: none;
                    } 
                    `,
                ],
                on: {
                    slideChange: (s: any) => {
                        activeIndex = s.realIndex;
                    },
                },
            };

            if (swiperEl) {
                Object.assign(swiperEl, swiperParams);
                swiperEl.initialize();
            }
        };

        // Delay slightly to ensure DOM is ready and layout is calculated
        requestAnimationFrame(() => {
            initSwiper();
        });
    });
</script>

<section
    id="headlines"
    class="flex w-screen max-w-[1900px] mx-auto flex-col gap-[2rem] px-[var(--side-p)] pt-[2rem]"
>
    <!-- Grid Container with Fixed Height on Desktop -->
    <div class="flex flex-col lg:flex-row gap-2 w-full lg:h-[520px]">
        <!-- Left Column: Carousel (70%) -->
        <div class="w-full lg:w-[70%] h-[280px] lg:h-full relative group">
            <!-- Navigation removed as requested -->

            <swiper-container
                bind:this={swiperEl}
                init="false"
                class="h-full w-full rounded-[8px] overflow-hidden block"
            >
                {#each featured as post}
                    <swiper-slide class="w-full h-full relative block">
                        <a
                            href={`/posts/${post.post_id}`}
                            class="block relative w-full h-full"
                            aria-label={post.title}
                        >
                            <img
                                src={post.image || fallback}
                                alt={post.title}
                                class="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                            ></div>

                            <div
                                class="absolute bottom-0 p-4 lg:p-8 text-white w-full pointer-events-none"
                            >
                                {#if post.category}
                                    <span
                                        class="mb-3 inline-block rounded bg-white/20 px-2 py-1 text-xs backdrop-blur-sm"
                                    >
                                        {post.category}
                                    </span>
                                {/if}
                                <h3
                                    class="text-xl lg:text-3xl font-bold leading-tight mb-2 drop-shadow-md"
                                >
                                    {post.title}
                                </h3>
                                {#if post.excerpt}
                                    <p
                                        class="hidden lg:block text-white/90 text-sm lg:text-base line-clamp-2 max-w-[90%]"
                                    >
                                        {post.excerpt}
                                    </p>
                                {/if}
                            </div>
                        </a>
                    </swiper-slide>
                {/each}
            </swiper-container>
        </div>

        <!-- Right Column: Sidebar Static Items (30%) -->
        <div
            class="flex flex-row lg:flex-col gap-2 w-full flex-[1] lg:h-full overflow-hidden"
        >
            <!-- Top Box: activeIndex + 1 -->
            <div
                class="relative w-full h-[160px] lg:h-auto lg:flex-1 overflow-hidden rounded-[8px]"
            >
                {#key (activeIndex + 1) % featured.length}
                    {@const s = featured[(activeIndex + 1) % featured.length]}
                    <a
                        class="group absolute inset-0 block w-full h-full"
                        href={`/posts/${s.post_id}`}
                        aria-label={s.title}
                        in:fly={{ x: "-100%", duration: 800, easing: quartOut }}
                        out:fly={{ x: "100%", duration: 800, easing: quartOut }}
                    >
                        <img
                            src={s.image || fallback}
                            alt={s.title}
                            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                        ></div>
                        <div class="absolute bottom-0 p-3 text-white">
                            {#if s.category}
                                <span
                                    class="mb-2 inline-block rounded bg-white/20 px-2 py-0.5 text-[10px] backdrop-blur-sm"
                                >
                                    {s.category}
                                </span>
                            {/if}
                            <h4
                                class="text-sm lg:text-base font-semibold leading-snug line-clamp-3 group-hover:underline decoration-orange-500/50 underline-offset-4"
                            >
                                {s.title}
                            </h4>
                        </div>
                    </a>
                {/key}
            </div>

            <!-- Bottom Box: activeIndex + 2 -->
            <div
                class="relative w-full h-[160px] lg:h-auto lg:flex-1 overflow-hidden rounded-[8px]"
            >
                {#key (activeIndex + 2) % featured.length}
                    {@const s = featured[(activeIndex + 2) % featured.length]}
                    <a
                        class="group absolute inset-0 block w-full h-full"
                        href={`/posts/${s.post_id}`}
                        aria-label={s.title}
                        in:fly={{ x: "100%", duration: 800, easing: quartOut }}
                        out:fly={{
                            x: "-100%",
                            duration: 800,
                            easing: quartOut,
                        }}
                    >
                        <img
                            src={s.image || fallback}
                            alt={s.title}
                            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                        ></div>
                        <div class="absolute bottom-0 p-3 text-white">
                            {#if s.category}
                                <span
                                    class="mb-2 inline-block rounded bg-white/20 px-2 py-0.5 text-[10px] backdrop-blur-sm"
                                >
                                    {s.category}
                                </span>
                            {/if}
                            <h4
                                class="text-sm lg:text-base font-semibold leading-snug line-clamp-3 group-hover:underline decoration-orange-500/50 underline-offset-4"
                            >
                                {s.title}
                            </h4>
                        </div>
                    </a>
                {/key}
            </div>
        </div>
    </div>
</section>

<style>
    .item {
        @apply rounded-[8px];
    }
</style>
