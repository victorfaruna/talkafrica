<script context="module" lang="ts">
    export type Post = {
        post_id: string;
        title: string;
        excerpt?: string | null;
        image?: string | null;
        views?: number | null;
    };
</script>

<script lang="ts">
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
    <h2
        class="font-clash-grotesk font-bold text-2xl sm:text-3xl lg:text-5xl border-l-4 border-[var(--color-accent)] pl-4 lg:pl-6 leading-tight"
    >
        Latest Articles
    </h2>

    <div class="mt-8 sm:mt-10 flex flex-col lg:flex-row gap-8 lg:gap-[3rem]">
        <div class="list-container flex w-full flex-col gap-6">
            {#if list.length === 0}
                <div class="text-secondary/50 italic">No posts yet.</div>
            {:else}
                {#each list as item}
                    <a href={item.url} class="block group">
                        <div
                            class="item flex flex-col sm:flex-row w-full gap-5 rounded-2xl bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 ring-1 ring-black/5"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                class="h-[200px] sm:h-[180px] w-full sm:w-[280px] shrink-0 rounded-xl bg-gray-100 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            <div class="flex flex-col gap-3 py-1 pr-4">
                                <h3
                                    class="title text-lg lg:text-xl leading-snug font-bold text-gray-900 group-hover:text-[var(--color-accent)] transition-colors"
                                >
                                    {item.title}
                                </h3>
                                <p
                                    class="description text-sm lg:text-base text-gray-500 line-clamp-3 leading-relaxed"
                                >
                                    {item.description}
                                </p>
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
