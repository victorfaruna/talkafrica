<script>
    export let category = "politics";
    export let categoryName = "Politics";
    export let posts = [];
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
        class="posts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
        {#if posts && posts.length > 0}
            {#each posts.slice(0, 3) as post, index}
                <article class="post-card h-full block group">
                    <a
                        href="/posts/{post.slug || post.post_id}"
                        class="card-link h-full block group"
                        aria-label={`Read ${post.title}`}
                    >
                        <div
                            class="flex w-full h-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-transparent hover:border-gray-100 ring-1 ring-black/5"
                        >
                            <div
                                class="overflow-hidden rounded-xl aspect-[4/3] w-full relative"
                            >
                                <img
                                    src={post.image ||
                                        "/images/placeholder.jpg"}
                                    alt={post.title}
                                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {#if index === 0}
                                    <span
                                        class="trending-badge absolute top-3 left-3 px-3 py-1.5 rounded-lg text-[10px] lg:text-xs font-semibold lowercase"
                                        style="background: {special
                                            ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.85), rgba(253, 176, 34, 0.85))'
                                            : 'rgba(71, 85, 105, 0.5)'}; color: {special
                                            ? '#000'
                                            : 'white'}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"
                                    >
                                        trending
                                    </span>
                                {/if}
                            </div>
                            <div
                                class="card-content flex flex-col flex-grow gap-3"
                            >
                                <h3
                                    class="post-title text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors"
                                >
                                    {post.title}
                                </h3>
                                <button
                                    class="read-more mt-auto self-start text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                                    style="color: {special ? '#fdb022' : color}"
                                >
                                    Read Article
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        class="w-4 h-4"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                        />
                                    </svg>
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
