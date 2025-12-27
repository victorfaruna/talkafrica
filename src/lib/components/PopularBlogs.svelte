<script lang="ts">
    export let posts: Array<{
        post_id: string;
        title: string;
        image?: string | null;
        excerpt?: string | null;
    }>;
    $: list = (posts ?? []).slice(0, 8).map((p) => ({
        title: p.title,
        image: p.image ?? "/images/placeholder.webp",
        url: `/posts/${p.post_id}`,
    }));
</script>

<section
    class="flex max-w-[1900px] mx-auto flex-col gap-[0.5rem] px-[var(--side-p)] py-[2rem] lg:py-[4rem]"
>
    <h2
        class="section-title font-clash-grotesk font-bold text-2xl lg:text-5xl mb-8 lg:mb-12 border-l-4 border-[var(--color-accent)] pl-4 lg:pl-6 leading-tight"
    >
        Popular Blogs
    </h2>
    <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
    >
        {#if list.length === 0}
            <div class="text-secondary/50 col-span-full text-center py-10">
                No popular posts yet.
            </div>
        {:else}
            {#each list as item}
                <a
                    href={item.url}
                    aria-label={`Read ${item.title}`}
                    class="h-full block group"
                >
                    <!-- Mobile: Horizontal Card | Desktop: Vertical Card -->
                    <div
                        class="flex flex-row sm:flex-col w-full h-full gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-transparent hover:border-gray-100 ring-1 ring-black/5"
                    >
                        <!-- Image: Left on mobile, Top on desktop -->
                        <div
                            class="flex-shrink-0 w-[100px] sm:w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl relative"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>

                        <!-- Content: Right on mobile, Bottom on desktop -->
                        <div
                            class="flex flex-col flex-grow gap-2 sm:gap-3 justify-between min-w-0"
                        >
                            <h3
                                class="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors"
                            >
                                {item.title}
                            </h3>
                            <button
                                class="self-start text-xs sm:text-sm font-semibold text-[var(--color-accent)] flex items-center gap-1 sm:gap-2 group-hover:gap-2 sm:group-hover:gap-3 transition-all"
                            >
                                Read Article
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    class="w-3 h-3 sm:w-4 sm:h-4"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </a>
            {/each}
        {/if}
    </div>
</section>
