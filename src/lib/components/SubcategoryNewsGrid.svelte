<script lang="ts">
    import { getOptimizedImageUrl } from "$lib/utils/image";
    import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";

    export let posts: any[] = [];
    export let categoryName = "Stories";
    export let pagination: any = null;

    const href = (post: any) => `/posts/${post.post_id}`;

    function formatDate(value: string | Date | undefined) {
        if (!value) return "";
        return new Intl.DateTimeFormat("en-NG", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(value));
    }

    function formatViews(value = 0) {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return String(value);
    }
</script>

<section class="subcategory-content">
    <div class="content-shell">
        <header class="content-heading">
            <div>
                <span>Latest coverage</span>
                <h2>{categoryName}</h2>
            </div>
            {#if pagination?.totalPosts}
                <p>{pagination.totalPosts} articles</p>
            {/if}
        </header>

        {#if posts.length > 0}
            <section class="opening-grid" aria-label={`Latest ${categoryName} stories`}>
                <div class="primary-stories">
                    {#each posts.slice(0, 3) as post}
                        <article class="story-card">
                            <a class="story-image standard-image" href={href(post)} aria-label={`Read ${post.title}`}>
                                <img
                                    src={getOptimizedImageUrl(post.image || "/images/placeholder.webp", { width: 620, height: 440, fit: "fill" })}
                                    alt={post.title}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </a>
                            <div class="story-byline">
                                <span>{post.author || "TalkAfrica"}</span>
                                <time datetime={post.created_at ? new Date(post.created_at).toISOString() : undefined}>{formatDate(post.created_at)}</time>
                            </div>
                            <h3><a href={href(post)}>{post.title}</a></h3>
                            {#if post.excerpt}<p>{post.excerpt}</p>{/if}
                            <a class="read-link" href={href(post)}>Read story <ArrowIcon /></a>
                        </article>
                    {/each}
                </div>

                {#if posts.length > 3}
                    <aside class="news-rail" aria-label={`More ${categoryName} stories`}>
                        {#each posts.slice(3, 5) as post}
                            <article class="rail-story">
                                <div class="story-byline">
                                    <span>{post.author || "TalkAfrica"}</span>
                                    <time datetime={post.created_at ? new Date(post.created_at).toISOString() : undefined}>{formatDate(post.created_at)}</time>
                                </div>
                                <h3><a href={href(post)}>{post.title}</a></h3>
                                {#if post.excerpt}<p>{post.excerpt}</p>{/if}
                                <div class="rail-footer">
                                    <a class="read-link" href={href(post)}>Read story <ArrowIcon /></a>
                                    <span>{formatViews(post.views)} views</span>
                                </div>
                            </article>
                        {/each}
                    </aside>
                {/if}
            </section>

            {#if posts.length > 5}
                <section class="visual-grid" aria-label={`More from ${categoryName}`}>
                    {#each posts.slice(5, 8) as post, index}
                        <article class:visual-lead={index === 1} class="visual-story">
                            <a class="story-image visual-image" href={href(post)} aria-label={`Read ${post.title}`}>
                                <img
                                    src={getOptimizedImageUrl(post.image || "/images/placeholder.webp", { width: index === 1 ? 900 : 620, height: 600, fit: "fill" })}
                                    alt={post.title}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </a>
                            <div class="story-byline">
                                <span>{post.author || "TalkAfrica"}</span>
                                <time datetime={post.created_at ? new Date(post.created_at).toISOString() : undefined}>{formatDate(post.created_at)}</time>
                            </div>
                            <h3><a href={href(post)}>{post.title}</a></h3>
                            <div class="visual-meta">{formatViews(post.views)} views</div>
                        </article>
                    {/each}
                </section>
            {/if}

            {#if posts.length > 8}
                <section class="more-grid" aria-label={`Additional ${categoryName} stories`}>
                    {#each posts.slice(8) as post}
                        <article class="more-story">
                            <a class="story-image more-image" href={href(post)} aria-label={`Read ${post.title}`}>
                                <img
                                    src={getOptimizedImageUrl(post.image || "/images/placeholder.webp", { width: 520, height: 340, fit: "fill" })}
                                    alt={post.title}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </a>
                            <div class="story-byline">
                                <span>{post.author || "TalkAfrica"}</span>
                                <time datetime={post.created_at ? new Date(post.created_at).toISOString() : undefined}>{formatDate(post.created_at)}</time>
                            </div>
                            <h3><a href={href(post)}>{post.title}</a></h3>
                        </article>
                    {/each}
                </section>
            {/if}
        {:else}
            <section class="empty-state">
                <h2>No articles found</h2>
                <p>New {categoryName.toLowerCase()} stories will appear here when published.</p>
                <a href="/">Return home</a>
            </section>
        {/if}

        {#if pagination?.totalPages > 1}
            <nav class="pagination" aria-label="Article pages">
                {#if pagination.hasPrevPage}
                    <a href={`?page=${pagination.currentPage - 1}`}><ArrowIcon direction="left" /> Previous</a>
                {/if}
                <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                {#if pagination.hasNextPage}
                    <a href={`?page=${pagination.currentPage + 1}`}>Next <ArrowIcon /></a>
                {/if}
            </nav>
        {/if}
    </div>
</section>

<style>
    .subcategory-content {
        background: #fff;
        color: #111827;
    }

    .content-shell {
        width: min(100%, 1500px);
        margin: 0 auto;
        padding: 3.25rem var(--side-p) 5rem;
    }

    .content-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        padding-bottom: 0.85rem;
        border-bottom: 2px solid #111827;
    }

    .content-heading span {
        color: #f59e0b;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }

    .content-heading h2 {
        margin: 0.25rem 0 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(1.8rem, 3.2vw, 3.2rem);
        font-weight: 700;
        line-height: 1;
    }

    .content-heading p {
        margin: 0;
        color: #6b7280;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .opening-grid {
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(290px, 1fr);
        gap: 1.4rem;
        padding-bottom: 2.25rem;
        border-bottom: 1px solid #d1d5db;
    }

    .primary-stories {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;
        padding-right: 1.4rem;
        border-right: 1px solid #d1d5db;
    }

    .story-card,
    .visual-story,
    .more-story {
        min-width: 0;
    }

    .story-image {
        position: relative;
        display: block;
        overflow: hidden;
        background: #e5e7eb;
    }

    .story-image::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: rgba(255, 255, 255, 0.25);
        opacity: 0;
        transition: opacity 300ms ease;
    }

    .story-image img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .story-card:hover .story-image::after,
    .visual-story:hover .story-image::after,
    .more-story:hover .story-image::after {
        opacity: 1;
    }

    .standard-image {
        aspect-ratio: 4 / 3;
    }

    .story-byline {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.35rem 0.75rem;
        margin-top: 0.7rem;
        color: #6b7280;
        font-size: 0.68rem;
    }

    .story-byline span {
        color: #374151;
        font-weight: 700;
    }

    .story-card h3,
    .rail-story h3,
    .visual-story h3,
    .more-story h3 {
        margin: 0.55rem 0 0;
        font-family: var(--font-clash-grotesk);
        font-weight: 650;
        color: #111827;
    }

    .story-card h3 {
        font-size: clamp(1.05rem, 1.45vw, 1.4rem);
        line-height: 1.2;
    }

    .story-card:hover h3 a,
    .rail-story:hover h3 a,
    .visual-story:hover h3 a,
    .more-story:hover h3 a {
        text-decoration: underline;
        text-decoration-color: currentColor;
        text-decoration-thickness: 1px;
        text-underline-offset: 4px;
    }

    .story-card > p,
    .rail-story > p {
        display: -webkit-box;
        overflow: hidden;
        margin: 0.55rem 0 0;
        color: #667085;
        font-size: 0.82rem;
        line-height: 1.5;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    .read-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        margin-top: 0.65rem;
        color: #111827;
        font-size: 0.73rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .read-link:hover {
        color: #f59e0b;
    }

    .news-rail {
        display: grid;
        grid-template-rows: repeat(2, minmax(0, 1fr));
    }

    .rail-story {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0.35rem 0 1.25rem;
    }

    .rail-story + .rail-story {
        padding-top: 1.25rem;
        border-top: 1px solid #d1d5db;
    }

    .rail-story h3 {
        font-size: clamp(1.15rem, 1.65vw, 1.55rem);
        line-height: 1.18;
    }

    .rail-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: auto;
        color: #6b7280;
        font-size: 0.68rem;
    }

    .visual-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr 0.85fr;
        gap: 1.25rem;
        padding: 2.25rem 0;
        border-bottom: 1px solid #d1d5db;
    }

    .visual-image {
        aspect-ratio: 16 / 10;
    }

    .visual-lead .visual-image {
        aspect-ratio: 16 / 11;
    }

    .visual-story h3 {
        font-size: clamp(1.05rem, 1.5vw, 1.45rem);
        line-height: 1.2;
    }

    .visual-lead h3 {
        font-size: clamp(1.25rem, 1.8vw, 1.75rem);
    }

    .visual-meta {
        margin-top: 0.5rem;
        color: #6b7280;
        font-size: 0.7rem;
    }

    .more-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.25rem;
        padding-top: 2.25rem;
    }

    .more-image {
        aspect-ratio: 3 / 2;
    }

    .more-story h3 {
        font-size: 1rem;
        line-height: 1.25;
    }

    .empty-state {
        padding: 5rem 1rem;
        text-align: center;
    }

    .empty-state h2 {
        font-family: var(--font-clash-grotesk);
        font-size: 2rem;
    }

    .empty-state p {
        margin: 0.7rem 0 1.25rem;
        color: #6b7280;
    }

    .empty-state a {
        color: #f59e0b;
        font-weight: 700;
    }

    .pagination {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 3rem;
        min-height: 4.5rem;
        padding: 0.75rem 1rem;
        border-top: 2px solid #111827;
        border-bottom: 1px solid #d1d5db;
        background: #f8fafc;
        font-size: 0.82rem;
        font-weight: 700;
    }

    .pagination a {
        display: inline-flex;
        align-items: center;
        min-height: 2.75rem;
        padding: 0.65rem 1rem;
        border: 1px solid #111827;
        background: #fff;
        color: #111827;
        transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
    }

    .pagination a:last-child {
        margin-left: auto;
    }

    .pagination span {
        position: absolute;
        left: 50%;
        color: #374151;
        text-align: center;
        transform: translateX(-50%);
    }

    .pagination a:hover {
        border-color: #f59e0b;
        background: #f59e0b;
        color: #111827;
    }

    @media (max-width: 980px) {
        .opening-grid {
            grid-template-columns: 1fr;
        }

        .primary-stories {
            padding-right: 0;
            padding-bottom: 1.5rem;
            border-right: 0;
            border-bottom: 1px solid #d1d5db;
        }

        .news-rail {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-rows: auto;
            gap: 1.25rem;
        }

        .rail-story + .rail-story {
            padding-top: 0.35rem;
            padding-left: 1.25rem;
            border-top: 0;
            border-left: 1px solid #d1d5db;
        }
    }

    @media (max-width: 700px) {
        .content-shell {
            padding-top: 2.25rem;
            padding-bottom: 3.5rem;
        }

        .primary-stories,
        .news-rail,
        .visual-grid,
        .more-grid {
            grid-template-columns: 1fr;
        }

        .story-card + .story-card,
        .rail-story + .rail-story,
        .visual-story + .visual-story,
        .more-story + .more-story {
            padding-top: 1.25rem;
            padding-left: 0;
            border-top: 1px solid #d1d5db;
            border-left: 0;
        }

        .story-card {
            display: grid;
            grid-template-columns: 7.5rem minmax(0, 1fr);
            column-gap: 0.9rem;
        }

        .story-card .standard-image {
            grid-row: 1 / 6;
            aspect-ratio: 1 / 1;
        }

        .story-card .story-byline {
            margin-top: 0;
        }

        .story-card > p {
            -webkit-line-clamp: 2;
        }

        .visual-grid {
            padding: 1.5rem 0;
        }

        .more-grid {
            padding-top: 1.5rem;
        }
    }

    @media (max-width: 430px) {
        .content-heading p {
            display: none;
        }

        .story-card {
            grid-template-columns: 6.5rem minmax(0, 1fr);
        }

        .story-card h3 {
            font-size: 1rem;
        }

        .story-card > p,
        .story-card .read-link {
            display: none;
        }

        .story-byline time {
            display: none;
        }

        .pagination {
            min-height: 4rem;
            padding-inline: 0.6rem;
        }

        .pagination span {
            display: none;
        }
    }
</style>
