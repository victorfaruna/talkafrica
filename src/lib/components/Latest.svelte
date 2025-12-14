<script lang="ts">
    export type Post = {
        post_id: string;
        title: string;
        excerpt?: string | null;
        image?: string | null;
        views?: number | null;
    };
    export let posts: Post[];
    export let trendingPosts: Post[] = [];
    
    type ListItem = {
        title: string;
        description: string;
        image: string;
        url: string;
    };
    
    $: list = (posts ?? []).map<ListItem>((p) => ({
        title: p.title,
        description: p.excerpt ?? "",
        image: p.image ?? "/images/placeholder.webp",
        url: `/posts/${p.post_id}`,
    }));
    
    $: trendingList = (trendingPosts ?? []).map<ListItem>((p) => ({
        title: p.title,
        description: p.excerpt ?? "",
        image: p.image ?? "/images/placeholder.webp",
        url: `/posts/${p.post_id}`,
    }));
</script>

<section
    class="mt-5 w-full max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-[var(--side-p)] py-6 sm:py-8 lg:py-[4rem]"
>
    <p class="font-clash-grotesk text-[1rem] sm:text-[1.2rem] lg:text-[3rem]">
        Latest Articles
    </p>

    <div
        class="mt-4 sm:mt-5 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-[2rem]"
    >
        <div class="list-container flex w-full flex-col gap-5">
            {#if list.length === 0}
                <div class="text-secondary/50">No posts yet.</div>
            {:else}
                {#each list as item}
                    <a href={item.url}>
                        <div
                            class="item flex flex-col lg:flex-row w-full gap-5 rounded-[1rem] bg-primary p-3 shadow-lg shadow-secondary/4"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                class="h-[200px] shrink-0 w-[300px] rounded-[0.7rem] bg-secondary/1 object-cover"
                            />
                            <div class="flex flex-col gap-4 py-0 pr-8">
                                <div
                                    class="title text-[0.8rem] lg:text-[1.2rem] leading-none font-medium text-secondary/80"
                                >
                                    {item.title}
                                </div>
                                <div
                                    class="description text-[0.6rem] lg:text-[0.8rem] text-secondary/50"
                                >
                                    {item.description}
                                </div>
                            </div>
                        </div>
                    </a>
                {/each}
            {/if}
        </div>
        <div
            class="trending h-auto min-h-[600px] w-full lg:w-[40%] bg-white p-4 sm:p-6 shadow-lg shadow-secondary/4 rounded-xl"
        >
            <p class="text-[1rem] sm:text-[1.2rem] font-clash-grotesk font-semibold text-secondary mb-4 sm:mb-6">
                Trending News
            </p>
            {#if trendingList.length === 0}
                <div class="text-secondary/50 text-sm">No trending posts yet.</div>
            {:else}
                <div class="flex flex-col gap-4">
                    {#each trendingList as item, index}
                        <a href={item.url} class="group">
                            <div
                                class="flex gap-3 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div
                                    class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-accent text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold"
                                >
                                    {index + 1}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3
                                        class="text-[0.75rem] sm:text-[0.9rem] font-medium text-secondary/90 group-hover:text-accent transition-colors line-clamp-2 mb-1"
                                    >
                                        {item.title}
                                    </h3>
                                    {#if item.image}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            class="mt-2 w-full h-24 sm:h-32 rounded-lg object-cover"
                                        />
                                    {/if}
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</section>
