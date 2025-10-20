<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { page } from "$app/state";

    const { data } = $props();

    // Force re-render when URL changes
    let currentUrl = $derived(page.url.pathname);

    // Format date helper
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    // Format views helper
    function formatViews(views: number) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + "M";
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + "K";
        }
        return views.toString();
    }

    import { getCategoryDisplayName } from "$lib/categories";

    const categoryName = $derived(getCategoryDisplayName(data.category));
</script>

<Header />

<!-- Hero Section -->
{#key currentUrl}
    <section
        class="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden"
    >
        <div
            class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style="background-image: url(/images/category/{data.category}.webp)"
        ></div>
        <div
            class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
        ></div>

        <div
            class="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto"
        >
            <h1
                class="text-3xl sm:text-5xl md:text-7xl font-clash-grotesk font-bold mb-4 sm:mb-6 capitalize"
            >
                {categoryName}
            </h1>
            <p
                class="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto"
            >
                Discover the latest stories and insights from {categoryName.toLowerCase()}
                across Africa
            </p>
            <div
                class="flex items-center justify-center gap-4 text-white/80 text-sm sm:text-base"
            >
                <span class="flex items-center gap-2">
                    <svg
                        class="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    {data.pagination.totalPosts} Articles
                </span>
            </div>
        </div>
    </section>
{/key}

<!-- Main Content -->
<main class="bg-primary text-secondary">
    {#key currentUrl}
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <!-- Featured Posts Section -->
            {#if data.featuredPosts && data.featuredPosts.length > 0}
                <section class="mb-12 sm:mb-16">
                    <h2
                        class="text-2xl sm:text-3xl font-clash-grotesk font-bold mb-6 sm:mb-8 text-center"
                    >
                        Featured Stories
                    </h2>
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {#each data.featuredPosts as post, index}
                            <article
                                class="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div
                                    class="relative h-48 sm:h-64 overflow-hidden"
                                >
                                    <img
                                        src={post.image ||
                                            "/images/placeholder.webp"}
                                        alt={post.title}
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                                    ></div>
                                    <div class="absolute top-4 left-4">
                                        <span
                                            class="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            Featured
                                        </span>
                                    </div>
                                </div>
                                <div class="p-4 sm:p-6">
                                    <div
                                        class="flex items-center gap-2 text-xs sm:text-sm text-tertiary mb-3"
                                    >
                                        <span
                                            >{formatDate(post.created_at)}</span
                                        >
                                        <span>•</span>
                                        <span
                                            >{formatViews(post.views)} views</span
                                        >
                                    </div>
                                    <h3
                                        class="text-xl font-clash-grotesk font-semibold mb-3 line-clamp-2 group-hover:text-accent transition-colors"
                                    >
                                        <a href="/posts/{post.post_id}"
                                            >{post.title}</a
                                        >
                                    </h3>
                                    <p class="text-tertiary line-clamp-3 mb-4">
                                        {post.excerpt}
                                    </p>
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span
                                            class="text-xs sm:text-sm text-tertiary"
                                            >By {post.author}</span
                                        >
                                        <a
                                            href="/posts/{post.post_id}"
                                            class="text-accent font-medium hover:underline"
                                        >
                                            Read More →
                                        </a>
                                    </div>
                                </div>
                            </article>
                        {/each}
                    </div>
                </section>
            {/if}

            <!-- Main Posts Grid -->
            <section class="mb-12 sm:mb-16">
                <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4"
                >
                    <h2
                        class="text-2xl sm:text-3xl font-clash-grotesk font-bold"
                    >
                        Latest {categoryName}
                    </h2>
                    <div class="flex items-center gap-2 sm:gap-4">
                        <span class="text-tertiary text-sm">Sort by:</span>
                        <select
                            class="bg-white border border-tertiary/20 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm"
                        >
                            <option value="latest">Latest</option>
                            <option value="popular">Most Popular</option>
                            <option value="trending">Trending</option>
                        </select>
                    </div>
                </div>

                {#if data.posts && data.posts.length > 0}
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    >
                        {#each data.posts as post}
                            <article
                                class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <div
                                    class="relative h-40 sm:h-48 overflow-hidden"
                                >
                                    <img
                                        src={post.image ||
                                            "/images/placeholder.webp"}
                                        alt={post.title}
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                                    ></div>
                                    <div class="absolute top-3 left-3">
                                        <span
                                            class="bg-white/90 text-primary px-2 py-1 rounded-full text-xs font-medium capitalize"
                                        >
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div class="p-4 sm:p-6">
                                    <div
                                        class="flex items-center gap-2 text-xs sm:text-sm text-tertiary mb-3"
                                    >
                                        <span
                                            >{formatDate(post.created_at)}</span
                                        >
                                        <span>•</span>
                                        <span
                                            >{formatViews(post.views)} views</span
                                        >
                                    </div>
                                    <h3
                                        class="text-lg font-clash-grotesk font-semibold mb-3 line-clamp-2 group-hover:text-accent transition-colors"
                                    >
                                        <a href="/posts/{post.post_id}"
                                            >{post.title}</a
                                        >
                                    </h3>
                                    <p
                                        class="text-tertiary line-clamp-2 mb-4 text-sm"
                                    >
                                        {post.excerpt}
                                    </p>
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span
                                            class="text-xs sm:text-sm text-tertiary"
                                            >By {post.author}</span
                                        >
                                        <a
                                            href="/posts/{post.post_id}"
                                            class="text-accent font-medium hover:underline text-sm"
                                        >
                                            Read More →
                                        </a>
                                    </div>
                                </div>
                            </article>
                        {/each}
                    </div>
                {:else}
                    <div class="text-center py-16">
                        <div
                            class="w-24 h-24 mx-auto mb-6 bg-tertiary/10 rounded-full flex items-center justify-center"
                        >
                            <svg
                                class="w-12 h-12 text-tertiary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <h3
                            class="text-2xl font-clash-grotesk font-semibold mb-4"
                        >
                            No articles found
                        </h3>
                        <p class="text-tertiary mb-6">
                            We're working on bringing you the latest {categoryName.toLowerCase()}
                            content. Check back soon!
                        </p>
                        <a
                            href="/"
                            class="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back to Home
                        </a>
                    </div>
                {/if}
            </section>

            <!-- Trending Posts Sidebar -->
            {#if data.trendingPosts && data.trendingPosts.length > 0}
                <section class="mb-12 sm:mb-16">
                    <div class="bg-white rounded-2xl shadow-lg p-8">
                        <h3 class="text-2xl font-clash-grotesk font-bold mb-6">
                            Trending in {categoryName}
                        </h3>
                        <div class="space-y-4">
                            {#each data.trendingPosts as post, index}
                                <div
                                    class="flex items-start gap-4 p-4 rounded-lg hover:bg-tertiary/5 transition-colors"
                                >
                                    <div
                                        class="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold"
                                    >
                                        {index + 1}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4
                                            class="font-medium text-sm line-clamp-2 hover:text-accent transition-colors"
                                        >
                                            <a href="/posts/{post.post_id}"
                                                >{post.title}</a
                                            >
                                        </h4>
                                        <div
                                            class="flex items-center gap-2 mt-2 text-xs text-tertiary"
                                        >
                                            <span
                                                >{formatViews(post.views)} views</span
                                            >
                                            <span>•</span>
                                            <span
                                                >{formatDate(
                                                    post.created_at
                                                )}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </section>
            {/if}

            <!-- Pagination -->
            {#if data.pagination && data.pagination.totalPages > 1}
                <nav class="flex items-center justify-center gap-2">
                    {#if data.pagination.hasPrevPage}
                        <a
                            href="?page={data.pagination.currentPage - 1}"
                            class="flex items-center gap-2 px-4 py-2 bg-white border border-tertiary/20 rounded-lg hover:bg-tertiary/5 transition-colors"
                        >
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Previous
                        </a>
                    {/if}

                    <div class="flex items-center gap-1">
                        {#each Array.from( { length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
                                const start = Math.max(1, data.pagination.currentPage - 2);
                                const pageNum = start + i;
                                return pageNum <= data.pagination.totalPages ? pageNum : null;
                            } ).filter(Boolean) as pageNum}
                            <a
                                href="?page={pageNum}"
                                class="px-3 py-2 rounded-lg transition-colors {pageNum ===
                                data.pagination.currentPage
                                    ? 'bg-accent text-white'
                                    : 'bg-white border border-tertiary/20 hover:bg-tertiary/5'}"
                            >
                                {pageNum}
                            </a>
                        {/each}
                    </div>

                    {#if data.pagination.hasNextPage}
                        <a
                            href="?page={data.pagination.currentPage + 1}"
                            class="flex items-center gap-2 px-4 py-2 bg-white border border-tertiary/20 rounded-lg hover:bg-tertiary/5 transition-colors"
                        >
                            Next
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </a>
                    {/if}
                </nav>
            {/if}
        </div>
    {/key}
</main>

<Footer />

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
