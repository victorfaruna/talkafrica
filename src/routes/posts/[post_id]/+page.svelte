<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import ArticleHero from "$lib/components/ArticleHero.svelte";
    import ArticleMeta from "$lib/components/ArticleMeta.svelte";
    import { calculateReadingTime } from "$lib/utils/reading-time";

    export let data: {
        post: {
            title: string;
            content: string;
            excerpt?: string | null;
            image?: string | null;
            category?: string | null;
            categories?: string[];
            created_at?: string | Date;
            author?: string | null;
        };
        relatedPosts: Array<{
            post_id: string;
            title: string;
            excerpt?: string | null;
            image?: string | null;
            category?: string | null;
            created_at?: string | Date;
        }>;
    };
    const { post, relatedPosts } = data;

    // Get categories to display (prefer categories array, fallback to single category)
    const displayCategories =
        post.categories && post.categories.length > 0
            ? post.categories
            : post.category
              ? [post.category]
              : [];

    // Calculate reading time
    const readingTime = calculateReadingTime(post.content);

    let readingProgress = 0;
    let showShareButtons = false;
    let currentUrl = "";

    onMount(() => {
        if (browser) {
            currentUrl = window.location.href;

            // Reading progress indicator
            const updateProgress = () => {
                const article = document.querySelector("article");
                if (article) {
                    const scrollTop = window.pageYOffset;
                    const docHeight = article.offsetHeight;
                    const winHeight = window.innerHeight;
                    const scrollPercent = scrollTop / (docHeight - winHeight);
                    readingProgress = Math.min(
                        100,
                        Math.max(0, scrollPercent * 100)
                    );
                }
            };

            window.addEventListener("scroll", updateProgress);
            updateProgress();

            // Show share buttons after scrolling
            const handleScroll = () => {
                showShareButtons = window.pageYOffset > 300;
            };
            window.addEventListener("scroll", handleScroll);
        }
    });

    function shareOnTwitter() {
        const text = `Check out this article: ${post.title}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    }

    function shareOnLinkedIn() {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    }

    function shareOnFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(currentUrl);
        // You could add a toast notification here
    }
</script>

<svelte:head>
    <title>{post.title} - Talk Africa</title>
    <meta name="description" content={post.excerpt || post.title} />
    <meta name="author" content={post.author || "Talk Africa"} />
    {#if post.created_at}
        <meta name="published_time" content={new Date(post.created_at).toISOString()} />
    {/if}
    {#if post.image}
        <meta property="og:image" content={post.image} />
    {/if}
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.excerpt || post.title} />
    <meta property="og:url" content={currentUrl} />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={post.title} />
    <meta name="twitter:description" content={post.excerpt || post.title} />
    {#if post.image}
        <meta name="twitter:image" content={post.image} />
    {/if}
</svelte:head>

<!-- Reading Progress Bar -->
<div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div
        class="h-full bg-gradient-to-r from-accent to-blue-600 transition-all duration-300 ease-out"
        style="width: {readingProgress}%"
    ></div>
</div>

<div class="min-h-screen bg-white overflow-x-hidden">
    <!-- Global Article Hero Component -->
    <ArticleHero
        title={post.title}
        excerpt={post.excerpt}
        image={post.image}
    />

    <!-- Article Content Layout -->
    <main class="article-layout">
        <!-- Global Article Meta Component -->
        <ArticleMeta
            categories={displayCategories}
            author={post.author}
            publishedDate={post.created_at}
            readingTime={readingTime}
        />

        <!-- Article Content - Uses global styles -->
        <article class="article-content">
            {@html post.content}
        </article>

        <!-- Share Buttons -->
        <div class="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-gray-200/60">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                <span class="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share this article
                </span>
                <div class="flex flex-wrap gap-3">
                    <button
                        on:click={shareOnTwitter}
                        class="inline-flex items-center px-4 sm:px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                        <svg
                            class="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                            />
                        </svg>
                        <span class="hidden sm:inline">Twitter</span>
                    </button>
                    <button
                        on:click={shareOnLinkedIn}
                        class="inline-flex items-center px-4 sm:px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                        <svg
                            class="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                            />
                        </svg>
                        <span class="hidden sm:inline">LinkedIn</span>
                    </button>
                    <button
                        on:click={shareOnFacebook}
                        class="inline-flex items-center px-4 sm:px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                        <svg
                            class="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            />
                        </svg>
                        <span class="hidden sm:inline">Facebook</span>
                    </button>
                    <button
                        on:click={copyToClipboard}
                        class="inline-flex items-center px-4 sm:px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm"
                    >
                        <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        <span class="hidden sm:inline">Copy Link</span>
                    </button>
                </div>
            </div>
        </div>
    </main>

    <!-- Related Posts Section -->
    {#if relatedPosts.length > 0}
        <div class="bg-gray-50 py-12 sm:py-16">
            <div class="max-w-6xl mx-auto px-4 sm:px-6">
                <h2
                    class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
                >
                    Related Articles
                </h2>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                    {#each relatedPosts as relatedPost}
                        <a
                            href="/posts/{relatedPost.post_id}"
                            class="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group overflow-hidden"
                        >
                            {#if relatedPost.image}
                                <div
                                    class="h-40 sm:h-48 overflow-hidden rounded-t-xl"
                                >
                                    <img
                                        src={relatedPost.image}
                                        alt={relatedPost.title}
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            {:else}
                                <div
                                    class="h-40 sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl flex items-center justify-center"
                                >
                                    <svg
                                        class="w-12 h-12 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                            clip-rule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                            {/if}
                            <div class="p-4 sm:p-6">
                                {#if relatedPost.category}
                                    <span
                                        class="text-xs sm:text-sm text-accent font-medium"
                                        >{relatedPost.category}</span
                                    >
                                {/if}
                                <h3
                                    class="text-lg sm:text-xl font-semibold text-gray-900 mt-2 mb-3 group-hover:text-accent transition-colors line-clamp-2"
                                >
                                    {relatedPost.title}
                                </h3>
                                {#if relatedPost.excerpt}
                                    <p
                                        class="text-gray-600 text-sm line-clamp-3"
                                    >
                                        {relatedPost.excerpt}
                                    </p>
                                {/if}
                                {#if relatedPost.created_at}
                                    <p class="text-xs text-gray-500 mt-3">
                                        {new Date(
                                            relatedPost.created_at as any
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                {/if}
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- Floating Share Buttons (shown after scroll) -->
{#if showShareButtons}
    <div
        class="fixed right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-40 hidden sm:block"
    >
        <div class="flex flex-col gap-2 md:gap-3">
            <button
                on:click={shareOnTwitter}
                class="w-10 h-10 md:w-12 md:h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg"
                title="Share on Twitter"
                aria-label="Share on Twitter"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                    />
                </svg>
            </button>
            <button
                on:click={shareOnLinkedIn}
                class="w-10 h-10 md:w-12 md:h-12 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center shadow-lg"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    />
                </svg>
            </button>
            <button
                on:click={copyToClipboard}
                class="w-10 h-10 md:w-12 md:h-12 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center shadow-lg"
                title="Copy Link"
                aria-label="Copy Link"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                </svg>
            </button>
        </div>
    </div>
{/if}

<style>
    /* Line clamp utility */
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
