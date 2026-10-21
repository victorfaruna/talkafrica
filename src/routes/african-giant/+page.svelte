<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import CategoryHero from "$lib/components/CategoryHero.svelte";
    import { getOptimizedImageUrl } from "$lib/utils/image";

    interface Props {
        data: {
            posts: any[];
            pagination: {
                currentPage: number;
                totalPages: number;
                hasNextPage: boolean;
                hasPrevPage: boolean;
                totalPosts: number;
            };
        };
    }

    let { data }: Props = $props();
    let posts = $derived(data.posts || []);
    let latest = $derived(posts[0] ?? null);
    let topTrendingPost = $derived(
        posts.reduce(
            (top, post) => !top || (post.views || 0) > (top.views || 0) ? post : top,
            null,
        ),
    );

    function formatDate(value: string | Date | undefined) {
        if (!value) return "";
        return new Intl.DateTimeFormat("en-NG", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(value));
    }
</script>

<Header />

<div class="african-giant-page">
    <CategoryHero
        categoryName="African Giant of the Week"
        posts={posts.slice(0, 10)}
        trendingPost={topTrendingPost}
    />

    <main>
        {#if !latest}
            <section class="empty-state">
                <span>African Giant</span>
                <h1>Our next inspiring story is coming soon.</h1>
                <p>Return shortly to meet another African shaping culture, industry and the world.</p>
                <a href="/">Return home</a>
            </section>
        {:else}
            <section class="giant-showcase" aria-labelledby="latest-giant-title">
                <div class="showcase-texture" aria-hidden="true"></div>
                <div class="showcase-copy">
                    <span class="showcase-kicker">African Giant</span>
                    <h1 id="latest-giant-title">Every giant.<br />Every story.<br />Africa in focus.</h1>
                    <div class="short-rule" aria-hidden="true"></div>
                    <p>
                        Discover the people transforming African culture, creativity and influence.
                        Each feature is thoughtfully reported to inform, celebrate and inspire.
                    </p>
                    <a class="showcase-cta" href={`/posts/${latest.post_id}`}>
                        Read the latest feature <span aria-hidden="true">→</span>
                    </a>
                </div>

                <div class="cover-stage" aria-label="Featured African Giant stories">
                    {#if posts[2]}
                        <a class="cover cover-back" href={`/posts/${posts[2].post_id}`} aria-label={`Read ${posts[2].title}`}>
                            <img src={getOptimizedImageUrl(posts[2].image, { width: 520, height: 720, fit: "fill" })} alt={posts[2].title} />
                            <span class="cover-shine" aria-hidden="true"></span>
                            <span class="cover-brand">TA</span>
                            <strong>{posts[2].title}</strong>
                        </a>
                    {/if}

                    {#if posts[1]}
                        <a class="cover cover-middle" href={`/posts/${posts[1].post_id}`} aria-label={`Read ${posts[1].title}`}>
                            <img src={getOptimizedImageUrl(posts[1].image, { width: 600, height: 820, fit: "fill" })} alt={posts[1].title} />
                            <span class="cover-shine" aria-hidden="true"></span>
                            <span class="cover-brand">TalkAfrica</span>
                            <strong>{posts[1].title}</strong>
                        </a>
                    {/if}

                    <a class="cover cover-main" href={`/posts/${latest.post_id}`} aria-label={`Read ${latest.title}`}>
                        <img src={getOptimizedImageUrl(latest.image, { width: 760, height: 1040, fit: "fill" })} alt={latest.title} loading="eager" fetchpriority="high" />
                        <span class="cover-shine" aria-hidden="true"></span>
                        <span class="cover-brand">TalkAfrica</span>
                        <span class="cover-edition">African Giant · {formatDate(latest.created_at)}</span>
                        <strong>{latest.title}</strong>
                    </a>
                </div>
            </section>

            {#if posts.length > 1}
                <section class="archive" aria-labelledby="archive-title">
                    <header class="archive-heading">
                        <div>
                            <span>Meet the changemakers</span>
                            <h2 id="archive-title">Previous Features</h2>
                        </div>
                        <span>{data.pagination.totalPosts} stories</span>
                    </header>

                    <div class="archive-grid">
                        {#each posts.slice(1) as post}
                            <article class="archive-card">
                                <a class="archive-image" href={`/posts/${post.post_id}`} aria-label={`Read ${post.title}`}>
                                    <img src={getOptimizedImageUrl(post.image, { width: 620, height: 420, fit: "fill" })} alt={post.title} loading="lazy" decoding="async" />
                                </a>
                                <div class="archive-meta">
                                    <span>{post.author || "TalkAfrica"}</span>
                                    <time datetime={post.created_at ? new Date(post.created_at).toISOString() : undefined}>{formatDate(post.created_at)}</time>
                                </div>
                                <h3><a href={`/posts/${post.post_id}`}>{post.title}</a></h3>
                                {#if post.excerpt}<p>{post.excerpt}</p>{/if}
                                <a class="story-link" href={`/posts/${post.post_id}`}>Read story <span aria-hidden="true">→</span></a>
                            </article>
                        {/each}
                    </div>
                </section>
            {/if}

            {#if data.pagination.totalPages > 1}
                <nav class="pagination" aria-label="African Giant article pages">
                    {#if data.pagination.hasPrevPage}<a href={`?page=${data.pagination.currentPage - 1}`}>← Previous</a>{/if}
                    <span>Page {data.pagination.currentPage} of {data.pagination.totalPages}</span>
                    {#if data.pagination.hasNextPage}<a href={`?page=${data.pagination.currentPage + 1}`}>Next →</a>{/if}
                </nav>
            {/if}
        {/if}
    </main>
</div>

<Footer />

<style>
    .african-giant-page {
        background: #fff;
        color: #111827;
    }

    main {
        width: min(100%, 1500px);
        margin: 0 auto;
        padding: 4.5rem var(--side-p) 5rem;
    }

    .giant-showcase {
        position: relative;
        display: grid;
        grid-template-columns: minmax(18rem, 0.85fr) minmax(30rem, 1.35fr);
        height: clamp(29rem, 36vw, 32rem);
        overflow: visible;
        background: #151515;
        color: #fff;
    }

    .showcase-texture {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        background:
            radial-gradient(circle at 20% 18%, rgba(255,255,255,.055) 0 1px, transparent 2px),
            radial-gradient(circle at 75% 68%, rgba(255,255,255,.04) 0 1px, transparent 2px),
            linear-gradient(115deg, #191919, #0d0d0d 70%);
        background-size: 12px 12px, 17px 17px, auto;
    }

    .showcase-copy {
        position: relative;
        z-index: 2;
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        box-sizing: border-box;
        padding: clamp(2.25rem, 3.5vw, 3.5rem);
    }

    .showcase-kicker {
        display: block;
        margin-bottom: 1rem;
        color: #f59e0b;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }

    .showcase-copy h1 {
        margin: 0;
        max-width: 15ch;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(2rem, 2.8vw, 2.8rem);
        line-height: 1.05;
    }

    .short-rule {
        width: 3.5rem;
        height: 3px;
        margin: 1.35rem 0;
        background: #fff;
    }

    .showcase-copy p {
        max-width: 34rem;
        margin: 0;
        color: rgba(255,255,255,.78);
        font-size: clamp(0.92rem, 1.2vw, 1.08rem);
        line-height: 1.6;
    }

    .showcase-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 1.4rem;
        padding: 0.85rem 1rem;
        background: #f59e0b;
        color: #111827;
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        transition: background-color 180ms ease;
    }

    .showcase-cta:hover {
        background: #fff;
    }

    .cover-stage {
        position: relative;
        z-index: 3;
        height: 100%;
    }

    .cover {
        position: absolute;
        display: block;
        overflow: hidden;
        border: 7px solid #0d0d0d;
        background: #242424;
        box-shadow: 0 1.4rem 2.5rem rgba(0,0,0,.35);
        color: #fff;
        transition:
            width 420ms cubic-bezier(.22, 1, .36, 1),
            top 420ms cubic-bezier(.22, 1, .36, 1),
            right 420ms cubic-bezier(.22, 1, .36, 1),
            left 420ms cubic-bezier(.22, 1, .36, 1),
            box-shadow 420ms ease,
            opacity 300ms ease;
    }

    .cover::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,.82), transparent 52%);
    }

    .cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .cover-shine {
        position: absolute;
        z-index: 4;
        inset: 0;
        background: rgba(255,255,255,.25);
        opacity: 0;
        transition: opacity 300ms ease;
    }

    .cover:hover .cover-shine {
        opacity: 1;
    }

    .cover-brand,
    .cover-edition,
    .cover strong {
        position: absolute;
        z-index: 5;
        left: 1rem;
        right: 1rem;
    }

    .cover-brand {
        top: 0.8rem;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(1.15rem, 2.2vw, 2rem);
        font-weight: 700;
    }

    .cover-edition {
        top: 3.5rem;
        color: rgba(255,255,255,.82);
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    .cover strong {
        bottom: 1.2rem;
        display: -webkit-box;
        overflow: hidden;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(0.8rem, 1.35vw, 1.15rem);
        line-height: 1.15;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }

    .cover-main {
        z-index: 4;
        top: 50%;
        left: 5%;
        width: 52%;
        height: auto;
        aspect-ratio: 3 / 4;
        transform: translateY(-50%);
    }

    .cover-middle {
        z-index: 3;
        top: 54%;
        right: 16%;
        width: 40%;
        height: auto;
        aspect-ratio: 3 / 4;
        transform: translateY(-50%);
    }

    .cover-back {
        z-index: 2;
        top: 57%;
        right: 2%;
        width: 30%;
        height: auto;
        aspect-ratio: 3 / 4;
        transform: translateY(-50%);
    }

    @media (hover: hover) and (pointer: fine) {
        .cover-stage:has(.cover-middle:hover) .cover-middle,
        .cover-stage:has(.cover-middle:focus-visible) .cover-middle {
            z-index: 6;
            top: 50%;
            right: 8%;
            width: 52%;
            box-shadow: 0 2rem 3.5rem rgba(0,0,0,.48);
        }

        .cover-stage:has(.cover-middle:hover) .cover-main,
        .cover-stage:has(.cover-middle:focus-visible) .cover-main {
            z-index: 3;
            left: 2%;
            width: 40%;
            box-shadow: 0 1rem 2rem rgba(0,0,0,.28);
        }

        .cover-stage:has(.cover-middle:hover) .cover-back,
        .cover-stage:has(.cover-middle:focus-visible) .cover-back {
            opacity: .72;
        }

        .cover-stage:has(.cover-back:hover) .cover-back,
        .cover-stage:has(.cover-back:focus-visible) .cover-back {
            z-index: 7;
            top: 50%;
            right: 2%;
            width: 52%;
            opacity: 1;
            box-shadow: 0 2rem 3.5rem rgba(0,0,0,.48);
        }

        .cover-stage:has(.cover-back:hover) .cover-main,
        .cover-stage:has(.cover-back:focus-visible) .cover-main {
            z-index: 3;
            left: 1%;
            width: 40%;
            box-shadow: 0 1rem 2rem rgba(0,0,0,.28);
        }

        .cover-stage:has(.cover-back:hover) .cover-middle,
        .cover-stage:has(.cover-back:focus-visible) .cover-middle {
            z-index: 4;
            right: 14%;
            width: 34%;
            opacity: .78;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .cover {
            transition-duration: .01ms;
        }
    }

    .archive {
        margin-top: 7rem;
    }

    .archive-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 1.25rem;
        padding-bottom: 0.85rem;
        border-bottom: 2px solid #111827;
    }

    .archive-heading > div > span {
        color: #f59e0b;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: .14em;
        text-transform: uppercase;
    }

    .archive-heading h2 {
        margin: .2rem 0 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(1.8rem, 3vw, 2.8rem);
        line-height: 1;
    }

    .archive-heading > span {
        color: #6b7280;
        font-size: .75rem;
        text-transform: uppercase;
    }

    .archive-grid {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 1.5rem;
    }

    .archive-card {
        grid-column: span 2;
    }

    /* When two cards remain, let them share the final row equally. */
    .archive-card:nth-last-child(2):nth-child(3n + 1),
    .archive-card:nth-last-child(2):nth-child(3n + 1) + .archive-card {
        grid-column: span 3;
    }

    .archive-image {
        position: relative;
        display: block;
        aspect-ratio: 3 / 2;
        overflow: hidden;
        background: #e5e7eb;
    }

    .archive-image::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(255,255,255,.25);
        opacity: 0;
        transition: opacity 300ms ease;
    }

    .archive-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .archive-card:hover .archive-image::after {
        opacity: 1;
    }

    .archive-meta {
        display: flex;
        justify-content: space-between;
        gap: .75rem;
        margin-top: .7rem;
        color: #6b7280;
        font-size: .68rem;
    }

    .archive-meta span {
        color: #374151;
        font-weight: 700;
    }

    .archive-card h3 {
        margin: .55rem 0 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(1.05rem, 1.5vw, 1.35rem);
        line-height: 1.2;
    }

    .archive-card:hover h3 a {
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 4px;
    }

    .archive-card p {
        display: -webkit-box;
        overflow: hidden;
        margin: .6rem 0 0;
        color: #667085;
        font-size: .84rem;
        line-height: 1.5;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .story-link {
        display: inline-flex;
        gap: .4rem;
        margin-top: .75rem;
        font-size: .72rem;
        font-weight: 800;
        text-transform: uppercase;
    }

    .story-link:hover {
        color: #f59e0b;
    }

    .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 3rem;
        padding: 1rem;
        border-block: 1px solid #d1d5db;
        background: #f8fafc;
        font-size: .8rem;
        font-weight: 700;
    }

    .pagination a:hover {
        color: #f59e0b;
    }

    .empty-state {
        max-width: 48rem;
        margin: 0 auto;
        padding: 5rem 1rem;
        text-align: center;
    }

    .empty-state > span {
        color: #f59e0b;
        font-size: .7rem;
        font-weight: 800;
        letter-spacing: .14em;
        text-transform: uppercase;
    }

    .empty-state h1 {
        margin: .75rem 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(2rem, 5vw, 4rem);
    }

    .empty-state p {
        color: #6b7280;
    }

    .empty-state a {
        display: inline-block;
        margin-top: 1.5rem;
        color: #f59e0b;
        font-weight: 800;
    }

    @media (max-width: 960px) {
        .giant-showcase {
            grid-template-columns: 1fr;
            height: auto;
        }

        .cover-stage {
            height: 32rem;
            min-height: 32rem;
        }

        .cover-main {
            top: 50%;
            left: 8%;
            height: auto;
            aspect-ratio: 3 / 4;
        }

        .cover-middle {
            top: 54%;
            right: 18%;
            height: auto;
            aspect-ratio: 3 / 4;
        }

        .cover-back {
            top: 57%;
            height: auto;
            aspect-ratio: 3 / 4;
        }

        .archive {
            margin-top: 4rem;
        }
    }

    @media (max-width: 700px) {
        main {
            padding-top: 2.5rem;
        }

        .showcase-copy {
            padding: 2.5rem 1.5rem;
        }

        .cover-stage {
            height: 24rem;
            min-height: 24rem;
        }

        .cover {
            border-width: 4px;
        }

        .cover-main {
            top: 50%;
            left: 4%;
            width: 55%;
            height: auto;
            aspect-ratio: 3 / 4;
        }

        .cover-middle {
            top: 54%;
            right: 13%;
            width: 42%;
            height: auto;
            aspect-ratio: 3 / 4;
        }

        .cover-back {
            top: 57%;
            right: 1%;
            width: 31%;
            height: auto;
            aspect-ratio: 3 / 4;
        }

        .cover-brand {
            font-size: 1rem;
        }

        .cover-edition {
            display: none;
        }

        .archive-grid {
            grid-template-columns: 1fr;
        }

        .archive-card {
            grid-column: auto !important;
            display: grid;
            grid-template-columns: 7.5rem minmax(0, 1fr);
            column-gap: .9rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #d1d5db;
        }

        .archive-card .archive-image {
            grid-row: 1 / 6;
            aspect-ratio: 1 / 1;
        }

        .archive-card .archive-meta {
            margin-top: 0;
        }

        .archive-card h3 {
            font-size: 1rem;
        }

        .archive-card p {
            display: none;
        }
    }
</style>
