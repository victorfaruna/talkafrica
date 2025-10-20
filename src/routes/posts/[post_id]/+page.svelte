<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    export let data: {
        post: {
            title: string;
            content: string;
            excerpt?: string | null;
            image?: string | null;
            category?: string | null;
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
    {#if post.image}
        <meta property="og:image" content={post.image} />
    {/if}
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.excerpt || post.title} />
    <meta property="og:url" content={currentUrl} />
    <meta property="og:type" content="article" />
</svelte:head>

<!-- Reading Progress Bar -->
<div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div
        class="h-full bg-gradient-to-r from-accent to-blue-600 transition-all duration-300 ease-out"
        style="width: {readingProgress}%"
    ></div>
</div>

<div class="min-h-screen bg-white overflow-x-hidden">
    <!-- Hero Section -->
    <div class="relative">
        {#if post.image}
            <div
                class="relative h-[50vh] sm:h-[60vh] min-h-[300px] sm:min-h-[400px] overflow-hidden"
            >
                <img
                    src={post.image}
                    alt={post.title}
                    class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black bg-opacity-40"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div
                        class="text-center text-white px-4 sm:px-6 max-w-4xl w-full"
                    >
                        <div class="mb-4">
                            <a
                                href="/"
                                class="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm sm:text-base"
                            >
                                <svg
                                    class="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                Back to Home
                            </a>
                        </div>
                        <h1
                            class="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4 sm:mb-6 break-words"
                        >
                            {post.title}
                        </h1>
                        {#if post.excerpt}
                            <p
                                class="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto"
                            >
                                {post.excerpt}
                            </p>
                        {/if}
                    </div>
                </div>
            </div>
        {:else}
            <!-- No image hero -->
            <div
                class="bg-gradient-to-br from-gray-900 to-gray-800 py-12 sm:py-20"
            >
                <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div class="mb-6">
                        <a
                            href="/"
                            class="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm sm:text-base"
                        >
                            <svg
                                class="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                            Back to Home
                        </a>
                    </div>
                    <h1
                        class="text-2xl sm:text-4xl md:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 break-words"
                    >
                        {post.title}
                    </h1>
                    {#if post.excerpt}
                        <p
                            class="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto"
                        >
                            {post.excerpt}
                        </p>
                    {/if}
                </div>
            </div>
        {/if}
    </div>

    <!-- Article Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <!-- Article Meta -->
        <div
            class="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200"
        >
            {#if post.category}
                <span
                    class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-accent/10 text-accent"
                >
                    {post.category}
                </span>
            {/if}
            <div
                class="flex flex-wrap items-center text-gray-600 text-xs sm:text-sm gap-2"
            >
                {#if post.author}
                    <span class="font-medium">By {post.author}</span>
                {/if}
                {#if post.created_at}
                    <span class="hidden sm:inline">•</span>
                    <time
                        datetime={new Date(
                            post.created_at as any
                        ).toISOString()}
                        class="block sm:inline"
                    >
                        {new Date(post.created_at as any).toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }
                        )}
                    </time>
                {/if}
            </div>
        </div>

        <!-- Article Content -->
        <article
            class="prose prose-sm sm:prose-lg prose-gray max-w-none overflow-x-hidden"
        >
            {@html post.content}
        </article>

        <!-- Share Buttons -->
        <div class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div
                class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
                <span class="text-sm font-medium text-gray-700"
                    >Share this article:</span
                >
                <div class="flex flex-wrap gap-2">
                    <button
                        on:click={shareOnTwitter}
                        class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
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
                        class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
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
                        class="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
                        class="inline-flex items-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
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
    </div>

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
    :global(.prose) {
        color: #374151;
        line-height: 1.75;
    }

    :global(.prose h1) {
        color: #111827;
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    :global(.prose h2) {
        color: #111827;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1.3;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    :global(.prose h3) {
        color: #111827;
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.4;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
    }

    :global(.prose p) {
        margin-bottom: 1.5rem;
        font-size: 1.125rem;
    }

    :global(.prose a) {
        color: var(--accent);
        text-decoration: none;
        font-weight: 500;
    }

    :global(.prose a:hover) {
        text-decoration: underline;
    }

    :global(.prose blockquote) {
        border-left: 4px solid var(--accent);
        padding-left: 1.5rem;
        margin: 2rem 0;
        font-style: italic;
        color: #6b7280;
    }

    :global(.prose ul, .prose ol) {
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
    }

    :global(.prose li) {
        margin-bottom: 0.5rem;
    }

    :global(.prose img) {
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        margin: 2rem 0;
        max-width: 100%;
        height: auto;
    }

    :global(.prose code) {
        background-color: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: #dc2626;
    }

    :global(.prose pre) {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        overflow-x: auto;
        margin: 2rem 0;
        max-width: 100%;
    }

    :global(.prose pre code) {
        background-color: transparent;
        color: inherit;
        padding: 0;
    }

    /* Line clamp utility */
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
