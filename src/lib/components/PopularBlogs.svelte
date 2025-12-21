<script lang="ts">
    export let posts: Array<{
        post_id: string;
        title: string;
        image?: string | null;
        excerpt?: string | null;
    }>;
    $: list = (posts ?? []).slice(0, 6).map((p) => ({
        title: p.title,
        image: p.image ?? "/images/placeholder.webp",
        url: `/posts/${p.post_id}`,
    }));
</script>

<section
    class="flex max-w-[1900px] mx-auto flex-col gap-[0.5rem] px-[var(--side-p)] py-[2rem] lg:py-[4rem]"
>
    <p class="section-title font-clash-grotesk text-[1.2rem] lg:text-[3rem]">
        Popular Blogs
    </p>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-[0.4rem] gap-y-[0.5rem]">
        {#if list.length === 0}
            <div class="text-secondary/50">No popular posts yet.</div>
        {:else}
            {#each list as item}
                <a
                    href={item.url}
                    aria-label={`Read ${item.title}`}
                    class="h-full block group"
                >
                    <div
                        class="flex w-full h-full flex-col gap-4 rounded-2xl px-2 py-4 shadow-lg shadow-secondary/5 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl bg-white justify-between"
                    >
                        <div
                            class="overflow-hidden rounded-2xl h-[] lg:h-[250px] w-full"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <p
                            class="pr-10 text-[0.8rem] lg:text-[1rem] leading-none font-medium text-secondary/80 line-clamp-2 flex-grow"
                        >
                            {item.title}
                        </p>
                        <button
                            class="self-start mt-auto rounded-[0.5rem] border border-accent/50 px-5 py-2 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
                            aria-label={`Read ${item.title}`}
                        >
                            Read More <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6 inline"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                                />
                            </svg>
                        </button>
                    </div>
                </a>
            {/each}
        {/if}
    </div>
</section>
