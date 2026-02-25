<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import ArticleHero from "$lib/components/ArticleHero.svelte";
    import ArticleMeta from "$lib/components/ArticleMeta.svelte";
    import CommentSection from "$lib/components/CommentSection.svelte";
    import { calculateReadingTime } from "$lib/utils/reading-time";

    export let data: {
        post: {
            post_id: string;
            title: string;
            content: string;
            excerpt?: string | null;
            image?: string | null;
            categories?: string[];
            created_at?: string | Date;
            author?: string | null;
            editor?: string | null;
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
                        Math.max(0, scrollPercent * 100),
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
        alert("Link copied to clipboard!");
    }
</script>

<svelte:head>
    <title>{post.title} - Talk Africa</title>
    <meta name="description" content={post.excerpt || post.title} />
    <meta name="author" content={post.author || "Talk Africa"} />
    {#if post.created_at}
        <meta
            name="published_time"
            content={new Date(post.created_at).toISOString()}
        />
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
<div class="fixed top-0 left-0 w-full h-1.5 bg-gray-100 z-[100]">
    <div
        class="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-100 ease-out"
        style="width: {readingProgress}%"
    ></div>
</div>

<div class="min-h-screen bg-white">
    <!-- Global Article Hero Component -->
    <ArticleHero title={post.title} excerpt={post.excerpt} image={post.image} />

    <!-- Main Content Wrapper -->
    <main
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative"
    >
        <!-- Metadata Header -->
        <ArticleMeta
            categories={displayCategories}
            author={post.author}
            editor={post.editor}
            publishedDate={post.created_at}
            {readingTime}
        />

        <!-- Article Body -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <!-- Content Column -->
            <article class="lg:col-span-12 article-content">
                {@html post.content
                    .replaceAll("\u00A0", " ")
                    .replaceAll("&nbsp;", " ")}
            </article>
        </div>

        <!-- Categories Footer -->
        {#if displayCategories.length > 0}
            <div class="mt-16 pt-8 border-t border-gray-100">
                <div class="flex flex-wrap items-center gap-3">
                    <span
                        class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                        >Filed under:</span
                    >
                    {#each displayCategories as categorySlug}
                        <a
                            href="/{categorySlug}"
                            class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                        >
                            {categorySlug.replace(/-/g, " ")}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Share Section -->
        <div class="mt-12 py-8 bg-gray-50 rounded-2xl text-center">
            <h3 class="text-lg font-bold text-gray-900 mb-6 font-clash">
                Share this article
            </h3>
            <div class="flex items-center justify-center gap-4">
                <button
                    on:click={shareOnTwitter}
                    class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Share on Twitter"
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                        ><path
                            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                        /></svg
                    >
                </button>
                <button
                    on:click={shareOnLinkedIn}
                    class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-700 hover:text-blue-700 flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Share on LinkedIn"
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                        ><path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        /></svg
                    >
                </button>
                <button
                    on:click={shareOnFacebook}
                    class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Share on Facebook"
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                        ><path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        /></svg
                    >
                </button>
                <button
                    on:click={copyToClipboard}
                    class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Copy Link"
                >
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        /></svg
                    >
                </button>
            </div>
        </div>
    </main>

    <!-- Related Posts Section -->
    {#if relatedPosts.length > 0}
        <div class="bg-gray-50 border-t border-gray-100 py-16 sm:py-24">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-end justify-between mb-12">
                    <div>
                        <h2
                            class="text-3xl font-bold text-gray-900 font-clash mb-2"
                        >
                            Keep Reading
                        </h2>
                        <p class="text-gray-500">
                            More stories you might find interesting
                        </p>
                    </div>
                    <a
                        href="/posts"
                        class="hidden sm:flex text-orange-600 hover:text-orange-700 font-medium items-center gap-1 transition-colors"
                    >
                        View all posts
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            ></path></svg
                        >
                    </a>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {#each relatedPosts as relatedPost}
                        <a
                            href="/posts/{relatedPost.post_id}"
                            class="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                        >
                            <div
                                class="h-64 overflow-hidden relative bg-gray-100"
                            >
                                {#if relatedPost.image}
                                    <img
                                        src={relatedPost.image}
                                        alt={relatedPost.title}
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                {:else}
                                    <div
                                        class="w-full h-full flex items-center justify-center text-gray-300"
                                    >
                                        <svg
                                            class="w-12 h-12"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            ><path
                                                fill-rule="evenodd"
                                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                clip-rule="evenodd"
                                            ></path></svg
                                        >
                                    </div>
                                {/if}
                                <div
                                    class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"
                                ></div>
                            </div>

                            <div class="p-6 flex flex-col flex-grow">
                                {#if relatedPost.category}
                                    <span
                                        class="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3"
                                        >{relatedPost.category}</span
                                    >
                                {/if}
                                <h3
                                    class="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 font-clash"
                                >
                                    {relatedPost.title}
                                </h3>
                                {#if relatedPost.excerpt}
                                    <p
                                        class="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed"
                                    >
                                        {relatedPost.excerpt}
                                    </p>
                                {/if}
                                <div
                                    class="flex items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-50"
                                >
                                    {#if relatedPost.created_at}
                                        <time>
                                            {new Date(
                                                relatedPost.created_at as any,
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </time>
                                    {/if}
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>

                <div class="mt-8 text-center sm:hidden">
                    <a
                        href="/posts"
                        class="inline-flex text-orange-600 hover:text-orange-700 font-medium items-center gap-1 transition-colors"
                    >
                        View all posts
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            ></path></svg
                        >
                    </a>
                </div>
            </div>
        </div>
    {/if}

    <!-- Comments Section -->
    <CommentSection postId={data.post.post_id} />
</div>

<!-- Floating Share Buttons (Mobile Only) -->
{#if showShareButtons}
    <div class="fixed bottom-6 right-6 z-40 md:hidden scale-in-center">
        <button
            on:click={shareOnTwitter}
            class="w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-700 transition-all focus:outline-none focus:ring-4 focus:ring-orange-200"
            aria-label="Share article"
        >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                ><path
                    d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                /></svg
            >
        </button>
    </div>
{/if}

<style>
    .font-clash {
        font-family: var(--font-clash-grotesk);
    }

    .scale-in-center {
        animation: scale-in-center 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            both;
    }

    @keyframes scale-in-center {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>
