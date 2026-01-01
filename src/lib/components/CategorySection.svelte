<script lang="ts">
    export let category = "politics";
    export let categoryName = "Politics";
    export let posts: any[] = [];
    export let color = "#16a34a";
    export let special = false;
</script>

<section
    class="category-section flex max-w-[1900px] mx-auto flex-col gap-[0.5rem] px-[var(--side-p)] py-[2rem] lg:py-[4rem]"
    class:african-giant-section={special}
>
    <div
        class="section-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 lg:mb-8"
    >
        <h2
            class="font-clash-grotesk font-bold text-2xl lg:text-5xl border-l-4 pl-4 lg:pl-6 leading-tight"
            style="border-color: {special ? '#ffd700' : color}"
        >
            Top Stories in <span
                class="category-name"
                style="color: {special ? '#ffd700' : color}"
                >{categoryName}</span
            >
        </h2>
        <a
            href="/{category}"
            class="view-all-btn px-6 py-2.5 rounded-full text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            style="background: {special
                ? 'linear-gradient(135deg, #ffd700, #fdb022)'
                : color}; color: {special ? '#000' : 'white'}"
        >
            View All
        </a>
    </div>

    <div
        class="posts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
    >
        {#if posts && posts.length > 0}
            {#each posts.slice(0, 3) as post, index}
                <article class="post-card h-full block group">
                    <a
                        href="/posts/{post.slug || post.post_id}"
                        class="card-link h-full block group"
                        aria-label={`Read ${post.title}`}
                    >
                        <!-- Mobile: Enhanced Horizontal Card with Category Accent | Desktop: Vertical Card -->
                        <div
                            class="flex flex-row sm:flex-col w-full h-full gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-md sm:shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border-l-4 sm:border-l-0 sm:border border-transparent hover:border-gray-100 ring-1 ring-black/5"
                            style="border-left-color: {special
                                ? '#ffd700'
                                : color}"
                        >
                            <!-- Image: Left on mobile (larger), Top on desktop -->
                            <div
                                class="flex-shrink-0 w-[120px] sm:w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl relative"
                            >
                                <img
                                    src={post.image ||
                                        "/images/placeholder.webp"}
                                    alt={post.title}
                                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {#if index === 0}
                                    <span
                                        class="trending-badge absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold lowercase shadow-md"
                                        style="background: {special
                                            ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(253, 176, 34, 0.95))'
                                            : 'rgba(71, 85, 105, 0.85)'}; color: {special
                                            ? '#000'
                                            : 'white'}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
                                    >
                                        trending
                                    </span>
                                {/if}
                            </div>

                            <!-- Content: Right on mobile with category badge, Bottom on desktop -->
                            <div
                                class="card-content flex flex-col flex-grow gap-2 sm:gap-3 justify-between min-w-0"
                            >
                                <!-- Category Badge - visible on mobile only -->
                                <span
                                    class="category-badge sm:hidden inline-block self-start px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                                    style="background: {special
                                        ? 'rgba(255, 215, 0, 0.15)'
                                        : `${color}15`}; color: {special
                                        ? '#fdb022'
                                        : color}"
                                >
                                    {categoryName}
                                </span>

                                <h3
                                    class="post-title text-sm sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:transition-colors"
                                    style="color: inherit"
                                    class:group-hover:special-color={special}
                                >
                                    {post.title}
                                </h3>
                                <button
                                    class="read-more self-start text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2 group-hover:gap-2 sm:group-hover:gap-3 transition-all"
                                    style="color: {special ? '#fdb022' : color}"
                                >
                                    Read More →
                                </button>
                            </div>
                        </div>
                    </a>
                </article>
            {/each}
        {:else}
            <p class="text-gray-500 col-span-full text-center py-10">
                No stories found in {categoryName}.
            </p>
        {/if}
    </div>
</section>

<style>
    .african-giant-section {
        background: linear-gradient(135deg, #fff9e6, #ffffff);
        border-radius: 12px;
    }
</style>
