<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import CategoryHero from "$lib/components/CategoryHero.svelte";
    import SubcategoryNewsGrid from "$lib/components/SubcategoryNewsGrid.svelte";
    import MainCategoryLanding from "$lib/components/MainCategoryLanding.svelte";
    import { page } from "$app/state";
    import { getCategoryBySlug, getCategoryDisplayName } from "$lib/categories";

    const { data } = $props();

    let currentUrl = $derived(page.url.pathname);
    const categoryName = $derived(getCategoryDisplayName(data.category));
    const isSubcategory = $derived(Boolean(getCategoryBySlug(data.category)?.parent_id));

    function timestamp(value: string | Date | undefined) {
        if (!value) return 0;
        return value instanceof Date ? value.getTime() : new Date(value).getTime();
    }

    const heroPosts = $derived.by(() => {
        const candidates = [
            ...(data.featuredPosts ?? []),
            ...(data.posts ?? []),
            ...(data.trendingPosts ?? []),
        ];
        return candidates
            .filter(
                (post, index, all) =>
                    all.findIndex((candidate) => candidate.post_id === post.post_id) === index,
            )
            .sort((a, b) => timestamp(b.created_at) - timestamp(a.created_at))
            .slice(0, 10);
    });
</script>

<Header
    bgClass={isSubcategory ? "bg-gradient-to-b from-secondary/60 to-transparent" : "bg-white border-b border-gray-200"}
    positionClass={isSubcategory ? "absolute top-0 right-0 left-0" : "relative"}
    textClass={isSubcategory ? "text-primary" : "text-black"}
/>

{#if isSubcategory}
    {#key currentUrl}
        <CategoryHero
            {categoryName}
            categorySlug={data.category}
            posts={heroPosts}
            trendingPost={data.trendingPosts?.[0] ?? null}
        />
    {/key}

    <SubcategoryNewsGrid
        posts={data.posts}
        {categoryName}
        pagination={data.pagination}
    />
{:else}
    <MainCategoryLanding
        category={data.category}
        {categoryName}
        posts={data.posts}
        subcategoryGroups={data.subcategoryGroups ?? []}
        pagination={data.pagination}
    />
{/if}

<Footer />
