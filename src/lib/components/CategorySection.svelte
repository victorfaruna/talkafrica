<script lang="ts">
    import { getOptimizedImageUrl } from "$lib/utils/image";
    import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";
    import { postPath } from "$lib/post-url";

    export let category = "politics";
    export let categoryName = "Politics";
    export let posts: any[] = [];
    export let color = "#f59e0b";
    export let special = false;

    $: leadPost = posts?.[0];

    const articleHref = (post: any) => postPath(post);

    const formatDate = (value: string | Date | null | undefined) => {
        if (!value) return "";
        return new Intl.DateTimeFormat("en-NG", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(value));
    };
</script>

<section
    class="category-section mx-auto w-full max-w-[1900px] px-[var(--side-p)] py-10 lg:py-16"
    style={`--section-accent: ${special ? "#fdb022" : color}`}
    aria-labelledby={`category-${category}`}
>
    <div class="section-heading">
        <div>
            <span class="section-kicker">Top stories</span>
            <h2 id={`category-${category}`}>{categoryName}</h2>
        </div>
        <a class="view-all" href={`/${category}`}>
            View all <ArrowIcon />
        </a>
    </div>

    {#if posts && posts.length > 0}
        <div class="stories-layout">
            <article class="lead-story">
                <a class="lead-image image-link" href={articleHref(leadPost)} aria-label={`Read ${leadPost.title}`}>
                    <img
                        src={getOptimizedImageUrl(leadPost.image, {
                            width: 1000,
                            height: 650,
                            fit: "fill",
                        })}
                        alt={leadPost.title}
                        loading="lazy"
                        decoding="async"
                    />
                </a>

                <div class="lead-copy">
                    <h3>
                        <a href={articleHref(leadPost)}>{leadPost.title}</a>
                    </h3>
                    {#if leadPost.excerpt}
                        <p>{leadPost.excerpt}</p>
                    {/if}
                    <div class="story-meta">
                        {#if leadPost.author}<span>{leadPost.author}</span>{/if}
                        {#if leadPost.created_at}<span>{formatDate(leadPost.created_at)}</span>{/if}
                        {#if leadPost.views !== null && leadPost.views !== undefined}
                            <span class="views">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>
                                {leadPost.views}
                            </span>
                        {/if}
                    </div>
                </div>
            </article>

            <div class="story-list">
                {#each posts.slice(1, 6) as post}
                    <article class="list-story">
                        <a class="list-image image-link" href={articleHref(post)} aria-label={`Read ${post.title}`}>
                            <img
                                src={getOptimizedImageUrl(post.image, {
                                    width: 320,
                                    height: 210,
                                    fit: "fill",
                                })}
                                alt={post.title}
                                loading="lazy"
                                decoding="async"
                            />
                        </a>
                        <div class="list-copy">
                            <h3><a href={articleHref(post)}>{post.title}</a></h3>
                            <div class="story-meta">
                                {#if post.author}<span>{post.author}</span>{/if}
                                {#if post.created_at}<span>{formatDate(post.created_at)}</span>{/if}
                                {#if post.views !== null && post.views !== undefined}
                                    <span class="views">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>
                                        {post.views}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </article>
                {/each}
            </div>
        </div>
    {:else}
        <p class="empty-state">No stories found in {categoryName}.</p>
    {/if}
</section>

<style>
    .category-section {
        color: #111827;
    }

    .section-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 1.25rem;
        padding-bottom: 0.9rem;
        border-bottom: 2px solid #111827;
    }

    .section-kicker {
        display: block;
        margin-bottom: 0.2rem;
        color: var(--section-accent);
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }

    h2 {
        margin: 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(1.75rem, 3vw, 2.8rem);
        font-weight: 700;
        line-height: 1;
    }

    .view-all {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        padding-bottom: 0.15rem;
        color: #111827;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        transition: color 180ms ease;
    }

    .view-all:hover {
        color: var(--section-accent);
    }

    .stories-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
        gap: 2rem;
    }

    .lead-story {
        min-width: 0;
        padding-right: 2rem;
        border-right: 1px solid #e5e7eb;
    }

    .image-link {
        display: block;
        overflow: hidden;
        background: #e5e7eb;
    }

    .image-link img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 350ms ease;
    }

    .image-link:hover img {
        transform: scale(1.025);
    }

    .lead-image {
        aspect-ratio: 16 / 9;
    }

    .lead-copy {
        padding-top: 1rem;
    }

    .lead-copy h3,
    .list-copy h3 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 700;
        color: #111;
    }

    .lead-copy h3 {
        max-width: 32ch;
        font-size: clamp(1.45rem, 2.2vw, 2.25rem);
        line-height: 1.12;
    }

    .lead-copy h3 a:hover,
    .list-copy h3 a:hover {
        text-decoration: underline;
        text-decoration-color: var(--section-accent);
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
    }

    .lead-copy > p {
        max-width: 70ch;
        margin: 0.65rem 0 0;
        color: #5b6472;
        font-size: 0.95rem;
        line-height: 1.55;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .story-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem 0.7rem;
        margin-top: 0.75rem;
        color: #6b7280;
        font-size: 0.72rem;
    }

    .story-meta > span + span::before {
        content: "";
        display: inline-block;
        width: 3px;
        height: 3px;
        margin-right: 0.7rem;
        vertical-align: middle;
        background: var(--section-accent);
    }

    .views {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    }

    .views svg {
        width: 0.85rem;
        height: 0.85rem;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.7;
    }

    .story-list {
        min-width: 0;
    }

    .list-story {
        display: grid;
        grid-template-columns: 9rem minmax(0, 1fr);
        gap: 1rem;
        padding: 0 0 1rem;
    }

    .list-story + .list-story {
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }

    .list-image {
        aspect-ratio: 3 / 2;
    }

    .list-copy {
        min-width: 0;
    }

    .list-copy h3 {
        font-size: clamp(1rem, 1.35vw, 1.2rem);
        line-height: 1.25;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    .empty-state {
        padding: 3rem 0;
        color: #6b7280;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
    }

    @media (max-width: 900px) {
        .stories-layout {
            grid-template-columns: 1fr;
            gap: 1.25rem;
        }

        .lead-story {
            padding-right: 0;
            padding-bottom: 1.5rem;
            border-right: 0;
            border-bottom: 1px solid #d1d5db;
        }
    }

    @media (max-width: 540px) {
        .category-section {
            padding-top: 2.25rem;
            padding-bottom: 2.25rem;
        }

        .section-heading {
            align-items: center;
            margin-bottom: 1rem;
        }

        .section-kicker {
            font-size: 0.62rem;
        }

        .view-all {
            font-size: 0.68rem;
        }

        .lead-image {
            aspect-ratio: 4 / 3;
        }

        .lead-copy h3 {
            font-size: 1.45rem;
        }

        .lead-copy > p {
            font-size: 0.85rem;
        }

        .list-story {
            grid-template-columns: 7rem minmax(0, 1fr);
            gap: 0.8rem;
        }

        .list-copy h3 {
            font-size: 0.98rem;
            -webkit-line-clamp: 3;
        }

        .list-copy .story-meta span:nth-child(2) {
            display: none;
        }
    }
</style>
