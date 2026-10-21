<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { afterNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import ArticleHero from "$lib/components/ArticleHero.svelte";
    import ArticleMeta from "$lib/components/ArticleMeta.svelte";
    import CommentSection from "$lib/components/CommentSection.svelte";
    import ShareButtons from "$lib/components/ShareButtons.svelte";
    import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";
    import { calculateReadingTime } from "$lib/utils/reading-time";
    import { getOptimizedImageUrl } from "$lib/utils/image";
    import { getCategoryColor, getCategoryDisplayName, getAllCategories } from "$lib/categories";

    export let data: {
        post: {
            post_id: string;
            title: string;
            content: string;
            excerpt?: string | null;
            image?: string | null;
            categories?: string[];
            category?: string | null;
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
            author?: string | null;
            created_at?: string | Date;
        }>;
        prevPost?: {
            post_id: string;
            title: string;
        } | null;
        nextPost?: {
            post_id: string;
            title: string;
        } | null;
        latestPosts?: Array<{
            post_id: string;
            title: string;
            excerpt?: string | null;
            image?: string | null;
            category?: string | null;
            author?: string | null;
            created_at?: string | Date;
        }>;
        africansOnTablePost?: {
            post_id: string;
            title: string;
            excerpt?: string | null;
            image?: string | null;
            category?: string | null;
            author?: string | null;
            created_at?: string | Date;
        } | null;
    };

    $: post = data.post;
    $: relatedPosts = data.relatedPosts;

    const allCategories = getAllCategories().filter(cat => cat.is_active);

    // Get categories to display (prefer categories array, fallback to single category)
    $: displayCategories =
        post?.categories && post.categories.length > 0
            ? post.categories
            : (post as any)?.category
              ? [(post as any).category]
              : [];

    $: primaryCategorySlug = displayCategories.length > 0 ? displayCategories[0] : "";
    $: primaryCategoryName = primaryCategorySlug ? getCategoryDisplayName(primaryCategorySlug) : "";
    $: primaryCategoryColor = primaryCategorySlug ? getCategoryColor(primaryCategorySlug) : "#FDB022";

    // Calculate reading time
    $: readingTime = post?.content ? calculateReadingTime(post.content) : 0;

    let readingProgress = 0;
    $: currentUrl = browser ? ($page.url.href || window.location.href) : "";
    let desktopShareOpen = false;
    let linkCopied = false;

    function formatDate(date: string | Date | null | undefined): string {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function formatReadingTime(minutes: number | null): string {
        if (!minutes) return "";
        if (minutes === 1) return "1 min";
        return `${minutes} min`;
    }

    function toggleDesktopShare() {
        desktopShareOpen = !desktopShareOpen;
    }

    function shareOnTwitter() {
        const text = `Check out this article: ${post.title}`;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
        desktopShareOpen = false;
    }

    function shareOnFacebook() {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
        desktopShareOpen = false;
    }

    function shareOnLinkedIn() {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
        desktopShareOpen = false;
    }

    function shareOnWhatsApp() {
        const text = `Check out this article: ${post.title}`;
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + currentUrl)}`;
        window.open(shareUrl, "_blank");
        desktopShareOpen = false;
    }

    function copyLink() {
        if (browser && navigator.clipboard) {
            navigator.clipboard.writeText(currentUrl);
            linkCopied = true;
            setTimeout(() => {
                linkCopied = false;
                desktopShareOpen = false;
            }, 1800);
        }
    }

    // ── Layout enforcement (desktop vs mobile) ──────────────
    afterNavigate(() => {
        if (browser) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            readingProgress = 0;
        }
    });

    onMount(() => {
        if (browser) {
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

            const handleWindowClick = (e: MouseEvent) => {
                if (desktopShareOpen) {
                    const target = e.target as HTMLElement;
                    if (!target.closest('.share-menu-container')) {
                        desktopShareOpen = false;
                    }
                }
            };

            window.addEventListener("scroll", updateProgress);
            window.addEventListener("click", handleWindowClick);
            updateProgress();
            return () => {
                window.removeEventListener("scroll", updateProgress);
                window.removeEventListener("click", handleWindowClick);
            };
        }
    });
</script>

<!-- Reading Progress Bar -->
<div class="fixed top-0 left-0 w-full h-[3px] bg-gray-100/50 z-[100]">
    <div
        class="h-full bg-accent transition-all duration-100 ease-out"
        style="width: {readingProgress}%"
    ></div>
</div>

<!-- ======================================================== -->
<!-- 1. MOBILE & TABLET LAYOUT (< 768px)                      -->
<!-- ======================================================== -->
<div class="article-page ta-mobile-container min-h-screen bg-white">
    <!-- Global Article Hero Component -->
    <ArticleHero title={post.title} excerpt={post.excerpt} image={post.image} />

    <!-- Main Content Wrapper -->
    <main
        class="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 relative font-poppins"
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
        <div class="grid grid-cols-1 gap-8 my-6">
            <!-- Content Column -->
            <article class="article-content">
                {@html post.content
                    .replaceAll("\u00A0", " ")
                    .replaceAll("&nbsp;", " ")}
            </article>
        </div>

        <!-- Categories Footer -->
        {#if displayCategories.length > 0}
            <div class="mt-12 pt-6 border-t border-gray-100">
                <div class="flex flex-wrap items-center justify-start gap-2">
                    <span
                        class="text-xs font-semibold text-gray-500 uppercase tracking-wider w-full mb-1"
                        >Filed under:</span
                    >
                    {#each displayCategories as categorySlug}
                        <a
                            href="/{categorySlug}"
                            class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-[#FDB022]/15 hover:text-[#b47a00] transition-colors duration-200"
                        >
                            {categorySlug.replace(/-/g, " ")}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Share Section -->
        <div class="my-6">
            <ShareButtons title={post.title} url={currentUrl} label="article" />
        </div>

        <!-- Previous / Next Article Navigation (Mobile) -->
        {#if data.prevPost || data.nextPost}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-8 pt-6 border-t border-gray-100">
                {#if data.prevPost}
                    <a
                        href="/posts/{data.prevPost.post_id}"
                        data-sveltekit-reload
                        class="group p-4 rounded-xl border border-gray-200 bg-white hover:border-[#FDB022] hover:bg-amber-50/30 transition-all flex flex-col justify-between"
                    >
                        <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style="color: #FDB022;">
                            <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                            <span>Previous Article</span>
                        </div>
                        <p class="text-sm font-bold font-clash-grotesk text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug">
                            {data.prevPost.title}
                        </p>
                    </a>
                {:else}
                    <div></div>
                {/if}

                {#if data.nextPost}
                    <a
                        href="/posts/{data.nextPost.post_id}"
                        data-sveltekit-reload
                        class="group p-4 rounded-xl border border-gray-200 bg-white hover:border-[#FDB022] hover:bg-amber-50/30 transition-all flex flex-col justify-between text-right"
                    >
                        <div class="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style="color: #FDB022;">
                            <span>Next Article</span>
                            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </div>
                        <p class="text-sm font-bold font-clash-grotesk text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug">
                            {data.nextPost.title}
                        </p>
                    </a>
                {:else}
                    <div></div>
                {/if}
            </div>
        {/if}
    </main>

    <!-- Related Posts Section (Mobile/Tablet) -->
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
                        class="hidden sm:flex font-medium items-center gap-1 transition-opacity hover:opacity-85"
                        style="color: #FDB022;"
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
                            data-sveltekit-reload
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
                                        class="text-xs font-bold uppercase tracking-wider mb-3 font-clash-grotesk"
                                        style="color: #FDB022;"
                                        >{relatedPost.category}</span
                                    >
                                {/if}
                                <h3
                                    class="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FDB022] transition-colors line-clamp-2 font-clash-grotesk"
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
            </div>
        </div>
    {/if}

    <!-- Comments Section (Mobile) -->
    <CommentSection postId={data.post.post_id} idPrefix="mobile-" />

    <!-- Modules on Mobile / Small Screens -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <!-- Module 1: Latest News -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                <span class="w-1.5 h-5 bg-[#FDB022] rounded-full inline-block"></span>
                <h3 class="text-base font-bold text-gray-900 font-clash-grotesk uppercase tracking-wide">Latest News</h3>
            </div>
            <div class="divide-y divide-gray-100">
                {#if data.latestPosts && data.latestPosts.length > 0}
                    {#each data.latestPosts as latestItem, i}
                        {#if i === 0}
                            <a href="/posts/{latestItem.post_id}" data-sveltekit-reload class="group block pb-4 mb-1">
                                <div class="w-full h-44 rounded-xl overflow-hidden bg-gray-100 mb-3">
                                    {#if latestItem.image}
                                        <img src={getOptimizedImageUrl(latestItem.image, { width: 600, height: 350 })} alt={latestItem.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    {/if}
                                </div>
                                <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-3 leading-snug mb-2 font-clash-grotesk">
                                    {latestItem.title}
                                </h4>
                                {#if latestItem.excerpt}
                                    <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">{latestItem.excerpt}</p>
                                {/if}
                            </a>
                        {:else}
                            <a href="/posts/{latestItem.post_id}" data-sveltekit-reload class="group flex items-start gap-3 py-3.5 hover:bg-amber-50/40 -mx-2 px-2 rounded-lg transition-colors">
                                <div class="w-20 h-[60px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                    {#if latestItem.image}
                                        <img src={getOptimizedImageUrl(latestItem.image, { width: 160, height: 120 })} alt={latestItem.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                                    {/if}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug mb-1 font-clash-grotesk">
                                        {latestItem.title}
                                    </h4>
                                    {#if latestItem.created_at}
                                        <time class="text-[11px] text-gray-400 block">{formatDate(latestItem.created_at)}</time>
                                    {/if}
                                </div>
                            </a>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>

        <!-- Module 2: Africans on the Table Spotlight -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2.5">
                    <span class="w-1.5 h-5 bg-[#FDB022] rounded-full inline-block"></span>
                    <h3 class="text-base font-bold text-gray-900 font-clash-grotesk uppercase tracking-wide">Africans on the Table</h3>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDB022]/15 text-[#b47a00]">Spotlight</span>
            </div>
            {#if data.africansOnTablePost}
                <a href="/posts/{data.africansOnTablePost.post_id}" data-sveltekit-reload class="group block">
                    <div class="relative w-full h-44 rounded-xl overflow-hidden bg-gray-100 mb-3">
                        <img src={getOptimizedImageUrl(data.africansOnTablePost.image || '/images/africans-on-the-table.jpg', { width: 600, height: 350 })} alt={data.africansOnTablePost.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div class="absolute top-2.5 left-2.5">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-sm text-[#FDB022] border border-[#FDB022]/30">
                                <span class="w-1.5 h-1.5 rounded-full bg-[#FDB022]"></span>Featured Voice
                            </span>
                        </div>
                    </div>
                    <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug mb-1.5 font-clash-grotesk">
                        {data.africansOnTablePost.title}
                    </h4>
                    {#if data.africansOnTablePost.excerpt}
                        <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{data.africansOnTablePost.excerpt}</p>
                    {/if}
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                        <span class="text-gray-400">{data.africansOnTablePost.author ? `By ${data.africansOnTablePost.author}` : 'Talk Africa'}</span>
                        <span class="inline-flex items-center gap-1 font-semibold" style="color: #FDB022;">Read Story <ArrowIcon /></span>
                    </div>
                </a>
            {:else}
                <a href="/africans-on-the-table" class="group block">
                    <div class="relative w-full h-44 rounded-xl overflow-hidden bg-gray-900 mb-3">
                        <img src="/images/africans-on-the-table.jpg" alt="Africans on the Table" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#FDB022] transition-colors leading-snug mb-1.5 font-clash-grotesk">
                        Where African Voices Lead the Conversation
                    </h4>
                    <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        Owning our stories, shaping narratives, and influencing the future from our own table.
                    </p>
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                        <span class="text-gray-400">Talk Africa Special</span>
                        <span class="inline-flex items-center gap-1 font-semibold" style="color: #FDB022;">Explore Series <ArrowIcon /></span>
                    </div>
                </a>
            {/if}
        </div>

        <!-- Module 3: Topics -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                <span class="w-1.5 h-5 bg-[#FDB022] rounded-full inline-block"></span>
                <h3 class="text-base font-bold text-gray-900 font-clash-grotesk uppercase tracking-wide">Topics</h3>
            </div>
            <div class="flex flex-wrap gap-2">
                {#each allCategories as cat}
                    <a href="/{cat.slug}" class="inline-block px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-[#FDB022] hover:text-white transition-all duration-200">
                        {cat.display_name}
                    </a>
                {/each}
            </div>
        </div>
    </div>
</div>

<!-- ======================================================== -->
<!-- 2. DESKTOP LAYOUT (≥ 768px)                               -->
<!-- Full 2-column layout with breadcrumb, meta row with       -->
<!-- right-aligned share, prev/next, related posts & sidebar   -->
<!-- ======================================================== -->
<div class="article-page ta-desktop-container bg-white min-h-screen">
    <!-- Brand Header using homepage brand color and font (no gradient) -->
    <Header
        positionClass="relative"
        bgClass="bg-accent shadow-sm"
        navFontClass="font-clash-grotesk"
    />

    <!-- Main Container -->
    <main class="mx-auto max-w-7xl px-4 py-6 font-poppins sm:px-6 sm:py-8 xl:px-8 xl:py-10">
        <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            <!-- Left Main Column (8 of 12) -->
            <div class="min-w-0 lg:col-span-8">
                <!-- 1. Breadcrumb Navigation -->
                <nav class="article-breadcrumb flex items-center flex-wrap gap-2 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
                    <a href="/" class="hover:text-[#FDB022] transition-colors font-medium">Home</a>
                    <span class="text-gray-300 select-none">›</span>
                    {#if primaryCategorySlug}
                        <a href="/{primaryCategorySlug}" class="hover:text-[#FDB022] transition-colors font-medium capitalize">
                            {primaryCategoryName}
                        </a>
                        <span class="text-gray-300 select-none">›</span>
                    {/if}
                    <span class="text-gray-400 line-clamp-1 max-w-md" aria-current="page">{post.title}</span>
                </nav>

                <!-- 2. Category Tag -->
                {#if primaryCategorySlug}
                    <div class="mb-3">
                        <a
                            href="/{primaryCategorySlug}"
                            class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-clash-grotesk hover:opacity-85 transition-opacity"
                            style="color: #FDB022;"
                        >
                            <span
                                class="w-2 h-2 rounded-full inline-block"
                                style="background-color: #FDB022;"
                            ></span>
                            <span>{primaryCategoryName}</span>
                        </a>
                    </div>
                {/if}

                <!-- 3. Headline Title -->
                <h1 class="article-headline mb-5 font-clash-grotesk text-2xl font-bold leading-[1.22] tracking-normal text-gray-900 sm:text-3xl sm:leading-[1.18] sm:tracking-tight xl:text-[40px]">
                    {post.title}
                </h1>

                <!-- Meta Row: Author • Date • Read time — with Share button aligned to the far right -->
                <div class="article-meta-row mb-6 flex flex-col items-start justify-between gap-3 border-y border-gray-100 py-3.5 text-xs text-gray-600 sm:mb-8 sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
                    <div class="article-byline flex items-center flex-wrap gap-2">
                        {#if post.author}
                            <span>By <strong class="text-gray-900 font-medium">{post.author}</strong></span>
                            {#if post.editor}
                                <span class="text-gray-300">•</span>
                                <span>Edited by <strong class="text-gray-900 font-medium">{post.editor}</strong></span>
                            {/if}
                            {#if post.created_at || readingTime}
                                <span class="text-gray-300">•</span>
                            {/if}
                        {/if}
                        {#if post.created_at}
                            <time datetime={new Date(post.created_at).toISOString()}>
                                {formatDate(post.created_at)}
                            </time>
                            {#if readingTime}
                                <span class="text-gray-300">•</span>
                            {/if}
                        {/if}
                        {#if readingTime}
                            <span>{formatReadingTime(readingTime)} read</span>
                        {/if}
                    </div>

                    <!-- Share button aligned to far right -->
                    <div class="article-share relative share-menu-container flex-shrink-0 self-end sm:self-auto">
                        <button
                            type="button"
                            on:click={toggleDesktopShare}
                            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:border-[#FDB022] hover:text-[#FDB022] hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#FDB022]/30"
                            aria-label="Share article"
                            aria-expanded={desktopShareOpen}
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span class="share-label">Share</span>
                        </button>

                        {#if desktopShareOpen}
                            <div
                                class="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn"
                            >
                                <button
                                    on:click={shareOnTwitter}
                                    class="w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-amber-50 hover:text-[#b47a00] transition-colors text-left"
                                >
                                    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                                    <span>Twitter / X</span>
                                </button>
                                <button
                                    on:click={shareOnFacebook}
                                    class="w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-amber-50 hover:text-[#b47a00] transition-colors text-left"
                                >
                                    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    <span>Facebook</span>
                                </button>
                                <button
                                    on:click={shareOnLinkedIn}
                                    class="w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-amber-50 hover:text-[#b47a00] transition-colors text-left"
                                >
                                    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                    <span>LinkedIn</span>
                                </button>
                                <button
                                    on:click={shareOnWhatsApp}
                                    class="w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-amber-50 hover:text-[#b47a00] transition-colors text-left"
                                >
                                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    <span>WhatsApp</span>
                                </button>
                                <div class="border-t border-gray-100 my-1"></div>
                                <button
                                    on:click={copyLink}
                                    class="w-full flex items-center gap-3 px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-amber-50 hover:text-[#b47a00] transition-colors text-left"
                                >
                                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                    <span>{linkCopied ? "Link Copied!" : "Copy Link"}</span>
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- 4. Featured Image inside article container -->
                {#if post.image}
                    <div class="mb-6 overflow-hidden border border-gray-100 bg-gray-100 shadow-sm sm:mb-8 sm:max-h-[520px]">
                        <img
                            src={getOptimizedImageUrl(post.image, { width: 1400, height: 800 })}
                            alt={post.title}
                            class="h-auto max-h-[520px] w-full object-cover object-center"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                        />
                    </div>
                {/if}

                <!-- Article Content Body -->
                <article class="article-content article-content-desktop leading-relaxed !max-w-none !px-0 !mx-0">
                    {@html post.content
                        .replaceAll("\u00A0", " ")
                        .replaceAll("&nbsp;", " ")}
                </article>

                <!-- Filed Under Categories Footer -->
                {#if displayCategories.length > 0}
                    <div class="mt-12 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2">Filed under:</span>
                        {#each displayCategories as categorySlug}
                            <a
                                href="/{categorySlug}"
                                class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-[#FDB022]/15 hover:text-[#b47a00] transition-colors"
                            >
                                {categorySlug.replace(/-/g, " ")}
                            </a>
                        {/each}
                    </div>
                {/if}

                <!-- Bottom Share Section -->
                <div class="mt-8">
                    <ShareButtons title={post.title} url={currentUrl} label="article" showFloating={false} />
                </div>

                <!-- 5. Previous / Next Article Navigation (NEW) -->
                {#if data.prevPost || data.nextPost}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-8 border-t border-gray-200">
                        {#if data.prevPost}
                            <a
                                href="/posts/{data.prevPost.post_id}"
                                data-sveltekit-reload
                                class="group p-4 rounded-xl border border-gray-200 bg-white hover:border-[#FDB022] hover:bg-amber-50/30 transition-all flex flex-col justify-between"
                            >
                                <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2" style="color: #FDB022;">
                                    <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                                    <span>Previous Article</span>
                                </div>
                                <p class="text-sm font-bold font-clash-grotesk text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug">
                                    {data.prevPost.title}
                                </p>
                            </a>
                        {:else}
                            <div></div>
                        {/if}

                        {#if data.nextPost}
                            <a
                                href="/posts/{data.nextPost.post_id}"
                                data-sveltekit-reload
                                class="group p-4 rounded-xl border border-gray-200 bg-white hover:border-[#FDB022] hover:bg-amber-50/30 transition-all flex flex-col justify-between text-right"
                            >
                                <div class="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2" style="color: #FDB022;">
                                    <span>Next Article</span>
                                    <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                                </div>
                                <p class="text-sm font-bold font-clash-grotesk text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug">
                                    {data.nextPost.title}
                                </p>
                            </a>
                        {:else}
                            <div></div>
                        {/if}
                    </div>
                {/if}

                <!-- 6. Related Posts (NEW — 3-column grid) -->
                {#if relatedPosts && relatedPosts.length > 0}
                    <div class="my-12 pt-8 border-t border-gray-200">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-gray-900 font-clash-grotesk">Related Posts</h2>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {#each relatedPosts.slice(0, 3) as relPost}
                                <a
                                    href="/posts/{relPost.post_id}"
                                    data-sveltekit-reload
                                    class="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                                >
                                    <div class="h-44 overflow-hidden relative bg-gray-100">
                                        {#if relPost.image}
                                            <img
                                                src={getOptimizedImageUrl(relPost.image, { width: 450, height: 280 })}
                                                alt={relPost.title}
                                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        {:else}
                                            <div class="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="p-4 flex flex-col flex-grow">
                                        {#if relPost.category}
                                            <span class="text-[11px] font-bold uppercase tracking-wider mb-1.5 font-clash-grotesk" style="color: #FDB022;">
                                                {getCategoryDisplayName(relPost.category)}
                                            </span>
                                        {/if}
                                        <h3 class="text-sm font-bold text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-2 font-clash-grotesk leading-snug mb-3">
                                            {relPost.title}
                                        </h3>
                                        <div class="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                                            {#if relPost.author}
                                                <span class="font-medium text-gray-600 truncate max-w-[120px]">{relPost.author}</span>
                                            {/if}
                                            {#if relPost.created_at}
                                                <time>{formatDate(relPost.created_at)}</time>
                                            {/if}
                                        </div>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- 7. Comments Section (Desktop) -->
                <div class="mt-10 pt-8 border-t border-gray-200">
                    <CommentSection postId={data.post.post_id} idPrefix="desktop-" />
                </div>
            </div>

            <!-- 8. Right Sticky Sidebar (4 of 12) -->
            <aside class="border-t border-gray-200 pt-8 lg:sticky lg:top-6 lg:col-span-4 lg:border-0 lg:pt-0">
                <div class="space-y-5 pr-1 sidebar-scrollbar">
                    <!-- Module 1: Latest News Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <!-- Sidebar Header with brand yellow vertical accent bar -->
                        <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                            <span class="w-1.5 h-5 bg-[#FDB022] rounded-full inline-block"></span>
                            <h3 class="text-base font-bold text-gray-900 font-clash-grotesk uppercase tracking-wide">Latest News</h3>
                        </div>

                        <!-- List of recent articles: first is featured, rest are thumbnail layout -->
                        <div class="divide-y divide-gray-100">
                            {#if data.latestPosts && data.latestPosts.length > 0}
                                {#each data.latestPosts as latestItem, i}
                                    {#if i === 0}
                                        <!-- Featured first article: large image on top -->
                                        <a
                                            href="/posts/{latestItem.post_id}"
                                            data-sveltekit-reload
                                            class="group block pb-4 mb-1 hover:opacity-95 transition-opacity"
                                        >
                                            <!-- Large image -->
                                            <div class="w-full h-44 rounded-xl overflow-hidden bg-gray-100 mb-3">
                                                {#if latestItem.image}
                                                    <img
                                                        src={getOptimizedImageUrl(latestItem.image, { width: 600, height: 350 })}
                                                        alt={latestItem.title}
                                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                {:else}
                                                    <div class="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                        <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                                                    </div>
                                                {/if}
                                            </div>
                                            <!-- Title -->
                                            <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-3 leading-snug mb-2 font-clash-grotesk">
                                                {latestItem.title}
                                            </h4>
                                            <!-- Author + Date row -->
                                            <div class="flex items-center gap-3 text-[11px] text-gray-500 mb-2">
                                                {#if latestItem.author}
                                                    <span>By {latestItem.author}</span>
                                                {/if}
                                                {#if latestItem.created_at}
                                                    <span class="flex items-center gap-1">
                                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                        {formatDate(latestItem.created_at)}
                                                    </span>
                                                {/if}
                                            </div>
                                            <!-- Excerpt -->
                                            {#if latestItem.excerpt}
                                                <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                    {latestItem.excerpt}
                                                </p>
                                            {/if}
                                        </a>
                                    {:else}
                                        <!-- Regular thumbnail layout for the rest -->
                                        <a
                                            href="/posts/{latestItem.post_id}"
                                            data-sveltekit-reload
                                            class="group flex items-start gap-3 py-3.5 last:pb-1 hover:bg-amber-50/40 -mx-2 px-2 rounded-lg transition-colors"
                                        >
                                            <div class="w-20 h-[60px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                                                {#if latestItem.image}
                                                    <img
                                                        src={getOptimizedImageUrl(latestItem.image, { width: 160, height: 120 })}
                                                        alt={latestItem.title}
                                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                {:else}
                                                    <div class="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
                                                    </div>
                                                {/if}
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h4 class="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug mb-1 font-clash-grotesk">
                                                    {latestItem.title}
                                                </h4>
                                                {#if latestItem.created_at}
                                                    <time class="text-[11px] text-gray-400 block">
                                                        {formatDate(latestItem.created_at)}
                                                    </time>
                                                {/if}
                                            </div>
                                        </a>
                                    {/if}
                                {/each}
                            {:else}
                                <p class="text-xs text-gray-400 py-3">No other recent articles.</p>
                            {/if}
                        </div>
                    </div>

                    <!-- Module 2: "Africans on the Table" Spotlight Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <!-- Header with yellow vertical accent bar -->
                        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div class="flex items-center gap-2.5">
                                <span class="w-1.5 h-5 bg-[#FDB022] rounded-full inline-block"></span>
                                <h3 class="text-base font-bold text-gray-900 font-clash-grotesk uppercase tracking-wide">
                                    Africans on the Table
                                </h3>
                            </div>
                            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDB022]/15 text-[#b47a00]">
                                Spotlight
                            </span>
                        </div>

                        {#if data.africansOnTablePost}
                            <!-- Featured post from Africans on the Table -->
                            <a
                                href="/posts/{data.africansOnTablePost.post_id}"
                                data-sveltekit-reload
                                class="group block"
                            >
                                <div class="relative w-full h-44 rounded-xl overflow-hidden bg-gray-100 mb-3">
                                    <img
                                        src={getOptimizedImageUrl(data.africansOnTablePost.image || '/images/africans-on-the-table.jpg', { width: 600, height: 350 })}
                                        alt={data.africansOnTablePost.title}
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div class="absolute top-2.5 left-2.5">
                                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-sm text-[#FDB022] border border-[#FDB022]/30">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[#FDB022]"></span>
                                            Featured Voice
                                        </span>
                                    </div>
                                </div>
                                <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#FDB022] transition-colors line-clamp-2 leading-snug mb-1.5 font-clash-grotesk">
                                    {data.africansOnTablePost.title}
                                </h4>
                                {#if data.africansOnTablePost.excerpt}
                                    <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                                        {data.africansOnTablePost.excerpt}
                                    </p>
                                {/if}
                                <div class="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                                    <span class="text-gray-400 truncate max-w-[140px]">
                                        {data.africansOnTablePost.author ? `By ${data.africansOnTablePost.author}` : 'Talk Africa'}
                                    </span>
                                    <span class="font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1" style="color: #FDB022;">
                                        Read Story <ArrowIcon />
                                    </span>
                                </div>
                            </a>
                        {:else}
                            <!-- Fallback spotlight to series -->
                            <a
                                href="/africans-on-the-table"
                                class="group block"
                            >
                                <div class="relative w-full h-44 rounded-xl overflow-hidden bg-gray-900 mb-3">
                                    <img
                                        src="/images/africans-on-the-table.jpg"
                                        alt="Africans on the Table"
                                        class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                                    <div class="absolute bottom-3 left-3 right-3">
                                        <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FDB022] text-black mb-1">
                                            Featured Series
                                        </span>
                                    </div>
                                </div>
                                <h4 class="text-sm font-bold text-gray-900 group-hover:text-[#FDB022] transition-colors leading-snug mb-1.5 font-clash-grotesk">
                                    Where African Voices Lead the Conversation
                                </h4>
                                <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                                    Owning our stories, shaping narratives, and influencing the future from our own table.
                                </p>
                                <div class="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                                    <span class="text-gray-400">Talk Africa Special</span>
                                    <span class="font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1" style="color: #FDB022;">
                                        Explore Series <ArrowIcon />
                                    </span>
                                </div>
                            </a>
                        {/if}
                    </div>

                    <!-- Module 3: Tags / Topics Cloud Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <!-- Header with yellow vertical accent bar -->
                        <div class="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                            <span class="w-1.5 h-5 bg-[#FDB022] rounded-full inline-block"></span>
                            <h3 class="text-base font-bold text-gray-900 font-clash-grotesk uppercase tracking-wide">
                                Topics
                            </h3>
                        </div>

                        <!-- Tags pill cloud -->
                        <div class="flex flex-wrap gap-2">
                            {#each allCategories as cat}
                                <a
                                    href="/{cat.slug}"
                                    class="inline-block px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-[#FDB022] hover:text-white transition-all duration-200 hover:scale-[1.03]"
                                >
                                    {cat.display_name}
                                </a>
                            {/each}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </main>

    <!-- Footer -->
    <Footer />
</div>

<style>
    /* Article design system: editorial square geometry and restrained hover. */
    :global(.article-page),
    :global(.article-page *) {
        border-radius: 0 !important;
    }

    :global(.article-page a.group),
    :global(.article-page .group) {
        transition:
            border-color 220ms ease,
            background-color 220ms ease,
            color 220ms ease,
            box-shadow 220ms ease !important;
    }

    @media (hover: hover) {
        :global(.article-page a.group:hover),
        :global(.article-page .group:hover) {
            transform: none !important;
            border-color: #e5e7eb !important;
        }

        :global(.article-page a.group img),
        :global(.article-page .group img) {
            transition: transform 350ms ease, filter 350ms ease !important;
        }

        :global(.article-page a.group:hover img),
        :global(.article-page .group:hover img) {
            transform: scale(1.035) !important;
            filter: brightness(1.06);
        }

        :global(.article-page a.group:hover h3),
        :global(.article-page a.group:hover h4),
        :global(.article-page .group:hover h3),
        :global(.article-page .group:hover h4) {
            color: #111827 !important;
            text-decoration: none !important;
        }
    }

    :global(.article-content-desktop) {
        max-width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .font-clash-grotesk {
        font-family: 'ClashGrotesk', sans-serif;
    }

    .font-poppins {
        font-family: 'Poppins', sans-serif;
    }

    @media (max-width: 639px) {
        .article-breadcrumb > :nth-last-child(-n + 2) {
            display: none;
        }

        .article-headline {
            font-size: clamp(1.55rem, 7vw, 1.9rem);
            line-height: 1.2;
            overflow-wrap: normal;
            word-break: normal;
        }

        .article-meta-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            column-gap: 0.75rem;
        }

        .article-byline {
            min-width: 0;
            row-gap: 0.4rem;
        }

        .article-share {
            align-self: center;
        }

        .article-share > button {
            width: 2.5rem;
            height: 2.5rem;
            justify-content: center;
            padding: 0;
        }

        .article-share .share-label {
            display: none;
        }
    }

    /* ── Layout switching: :global() bypasses Svelte scoping ── */
    /* Default: show mobile, hide desktop (mobile-first) */
    :global(.ta-desktop-container) {
        display: block;
    }
    :global(.ta-mobile-container) {
        display: none !important;
    }
    /* Desktop (≥768px): flip them */

    /* Sticky is now on the aside element directly via inline style */
    .article-sidebar {
        width: 100%;
    }

    .sidebar-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .sidebar-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb {
        background: #e5e7eb;
        border-radius: 9999px;
    }
    .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #d1d5db;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.15s ease-out forwards;
    }
</style>
