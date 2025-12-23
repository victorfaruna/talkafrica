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

    import TrendingNews from "./TrendingNews.svelte";
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
        <div class="trending h-auto min-h-[600px] w-full lg:w-[40%]">
            <TrendingNews posts={trendingPosts || []} />
        </div>
    </div>
</section>
