<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import ArticleHero from "$lib/components/ArticleHero.svelte";
    import ArticleMeta from "$lib/components/ArticleMeta.svelte";
    import CommentSection from "$lib/components/CommentSection.svelte";
    import SEO from "$lib/components/SEO.svelte";
    import ShareButtons from "$lib/components/ShareButtons.svelte";
    import { calculateReadingTime } from "$lib/utils/reading-time";
    import { getOptimizedImageUrl } from "$lib/utils/image";

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
            : (post as any).category
              ? [(post as any).category]
              : [];

    // Calculate reading time
    const readingTime = calculateReadingTime(post.content);

    let readingProgress = 0;
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
            return () => window.removeEventListener("scroll", updateProgress);
        }
    });
</script>

<SEO 
    title={post.title} 
    description={(post.excerpt ?? undefined) as string | undefined} 
    image={(post.image ?? undefined) as string | undefined} 
    type="article"
    author={(post.author ?? undefined) as string | undefined} 
    publishedDate={post.created_at}
    schemaType="Article"
/>

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
        <ShareButtons title={post.title} url={currentUrl} label="article" />
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
                                        src={getOptimizedImageUrl(relatedPost.image, { width: 400, height: 250 })}
                                        alt={relatedPost.title}
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                        decoding="async"
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
