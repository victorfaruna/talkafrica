<script lang="ts">
    import SubcategoryNewsGrid from "$lib/components/SubcategoryNewsGrid.svelte";
    import { getCategoryBySlug, getSubcategories } from "$lib/categories";
    import { getOptimizedImageUrl } from "$lib/utils/image";

    export let category: string;
    export let categoryName: string;
    export let posts: any[] = [];
    export let subcategoryGroups: any[] = [];
    export let pagination: any = null;

    $: definition = getCategoryBySlug(category);
    $: subcategories = getSubcategories(category);
    $: heroImage = category === "politics"
        ? "/images/category/politics-hero.jpg"
        : category === "economy"
          ? "/images/category/economy-hero.jpg"
          : category === "health"
            ? "/images/category/health-hero.jpg"
            : null;

    const href = (post: any) => `/posts/${post.post_id}`;

    function formatDate(value: string | Date | undefined) {
        if (!value) return "";
        return new Intl.DateTimeFormat("en-NG", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(value));
    }
</script>

<main class="main-category-page">
    <section class="category-intro" class:has-hero-image={heroImage}>
        {#if heroImage}
            <img
                class="category-intro-image"
                src={heroImage}
                alt=""
                loading="eager"
                decoding="async"
                fetchpriority="high"
            />
            <div class="category-intro-overlay"></div>
        {/if}
        <div class="intro-inner">
            <span class="eyebrow">TalkAfrica coverage</span>
            <div class="intro-copy">
                <h1 class:long-title={category === "entertainment"}>{categoryName}</h1>
                <p>{definition?.description || `The latest ${categoryName.toLowerCase()} stories, analysis and perspectives from across Africa.`}</p>
            </div>

            {#if subcategories.length > 0}
                <nav class="subcategory-nav" aria-label={`${categoryName} sections`}>
                    {#each subcategories as item}
                        <a href={`/${item.slug}`}>{item.display_name}<span aria-hidden="true">→</span></a>
                    {/each}
                </nav>
            {/if}
        </div>
    </section>

    <SubcategoryNewsGrid {posts} {categoryName} {pagination} />

    {#if subcategoryGroups.length > 0}
        <section class="subcategory-coverage">
            <div class="coverage-inner">
                {#each subcategoryGroups as group}
                    {#if group.posts?.length > 0}
                        <section class="coverage-section" aria-labelledby={`coverage-${group.slug}`}>
                            <header class="coverage-heading">
                                <div>
                                    <span>More from</span>
                                    <h2 id={`coverage-${group.slug}`}>{group.display_name}</h2>
                                </div>
                                <a href={`/${group.slug}`}>View all <span aria-hidden="true">→</span></a>
                            </header>

                            <div class="coverage-grid">
                                {#each group.posts.slice(0, 4) as post, index}
                                    <article class:coverage-lead={index === 0} class="coverage-card">
                                        <a class="coverage-image" href={href(post)} aria-label={`Read ${post.title}`}>
                                            <img
                                                src={getOptimizedImageUrl(post.image || "/images/placeholder.webp", {
                                                    width: index === 0 ? 760 : 460,
                                                    height: index === 0 ? 520 : 320,
                                                    fit: "fill",
                                                })}
                                                alt={post.title}
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </a>
                                        <div class="card-meta">
                                            <span>{post.author || "TalkAfrica"}</span>
                                            <time datetime={post.created_at ? new Date(post.created_at).toISOString() : undefined}>{formatDate(post.created_at)}</time>
                                        </div>
                                        <h3><a href={href(post)}>{post.title}</a></h3>
                                        {#if index === 0 && post.excerpt}<p>{post.excerpt}</p>{/if}
                                    </article>
                                {/each}
                            </div>
                        </section>
                    {/if}
                {/each}
            </div>
        </section>
    {/if}
</main>

<style>
    .main-category-page {
        background: #fff;
        color: #111827;
    }

    .category-intro {
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid #d1d5db;
        background: #f8fafc;
    }

    .category-intro-image,
    .category-intro-overlay {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    .category-intro-image {
        object-fit: cover;
        object-position: center;
    }

    .category-intro-overlay {
        background: linear-gradient(90deg, rgba(5, 9, 14, 0.9) 0%, rgba(5, 9, 14, 0.7) 52%, rgba(5, 9, 14, 0.34) 100%);
    }

    .intro-inner,
    .coverage-inner {
        width: min(100%, 1500px);
        margin: 0 auto;
        padding-inline: var(--side-p);
    }

    .intro-inner {
        padding-top: 4.5rem;
        padding-bottom: 2.5rem;
    }

    .has-hero-image .intro-inner {
        position: relative;
        z-index: 1;
        min-height: 31rem;
        padding-top: 7rem;
        padding-bottom: 2.5rem;
    }

    .has-hero-image .intro-copy h1 {
        color: #fff;
    }

    .has-hero-image .intro-copy p {
        color: rgba(255, 255, 255, 0.78);
    }

    .has-hero-image .subcategory-nav {
        border-color: rgba(255, 255, 255, 0.45);
    }

    .has-hero-image .subcategory-nav a {
        border-color: rgba(255, 255, 255, 0.35);
        background: rgba(7, 11, 16, 0.72);
        color: #fff;
        backdrop-filter: blur(8px);
    }

    .has-hero-image .subcategory-nav a:hover {
        background: #f59e0b;
        color: #111827;
    }

    .eyebrow,
    .coverage-heading > div > span {
        color: #f59e0b;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }

    .intro-copy {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
        align-items: end;
        gap: 3rem;
        margin-top: 0.6rem;
    }

    .intro-copy h1 {
        margin: 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(3.2rem, 8vw, 8rem);
        font-weight: 700;
        letter-spacing: -0.055em;
        line-height: 0.88;
    }

    .intro-copy p {
        max-width: 42rem;
        margin: 0;
        color: #4b5563;
        font-size: clamp(0.95rem, 1.35vw, 1.15rem);
        line-height: 1.6;
    }

    .subcategory-nav {
        display: flex;
        flex-wrap: wrap;
        margin-top: 2.5rem;
        border-top: 1px solid #111827;
        border-left: 1px solid #111827;
    }

    .subcategory-nav a {
        display: inline-flex;
        flex: 1 1 12rem;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 3.5rem;
        padding: 0.8rem 1rem;
        border-right: 1px solid #111827;
        border-bottom: 1px solid #111827;
        background: #fff;
        font-size: 0.83rem;
        font-weight: 700;
        transition: background-color 180ms ease, color 180ms ease;
    }

    .subcategory-nav a:hover {
        background: #111827;
        color: #fff;
    }

    .subcategory-coverage {
        padding: 0 0 5rem;
    }

    .coverage-section {
        padding-top: 4rem;
    }

    .coverage-heading {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 1.25rem;
        padding-bottom: 0.85rem;
        border-bottom: 2px solid #111827;
    }

    .coverage-heading h2 {
        margin: 0.2rem 0 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(1.75rem, 3vw, 2.7rem);
        font-weight: 700;
        line-height: 1;
    }

    .coverage-heading > a {
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    .coverage-heading > a:hover {
        color: #f59e0b;
    }

    .coverage-grid {
        display: grid;
        grid-template-columns: 1.35fr repeat(3, minmax(0, 0.75fr));
        gap: 1.2rem;
    }

    .coverage-card {
        min-width: 0;
    }

    .coverage-image {
        position: relative;
        display: block;
        aspect-ratio: 3 / 2;
        overflow: hidden;
        background: #e5e7eb;
    }

    .coverage-lead .coverage-image {
        aspect-ratio: 16 / 10;
    }

    .coverage-image::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: rgba(255, 255, 255, 0.25);
        opacity: 0;
        transition: opacity 300ms ease;
    }

    .coverage-image img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .coverage-card:hover .coverage-image::after {
        opacity: 1;
    }

    .card-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-top: 0.7rem;
        color: #6b7280;
        font-size: 0.67rem;
    }

    .card-meta span {
        color: #374151;
        font-weight: 700;
    }

    .coverage-card h3 {
        margin: 0.55rem 0 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(1rem, 1.3vw, 1.25rem);
        font-weight: 650;
        line-height: 1.22;
    }

    .coverage-lead h3 {
        font-size: clamp(1.25rem, 1.8vw, 1.7rem);
    }

    .coverage-card:hover h3 a {
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 4px;
    }

    .coverage-card p {
        display: -webkit-box;
        overflow: hidden;
        margin: 0.55rem 0 0;
        color: #667085;
        font-size: 0.83rem;
        line-height: 1.5;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    @media (max-width: 980px) {
        .intro-copy {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .coverage-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 600px) {
        .intro-inner {
            padding-top: 3rem;
        }

        .has-hero-image .intro-inner {
            min-height: 29rem;
            padding-top: 4.5rem;
        }

        .category-intro-overlay {
            background: linear-gradient(180deg, rgba(5, 9, 14, 0.68) 0%, rgba(5, 9, 14, 0.88) 100%);
        }

        .intro-copy h1 {
            font-size: clamp(3rem, 18vw, 5rem);
        }

        .intro-copy h1.long-title {
            font-size: clamp(2.4rem, 12vw, 3.5rem);
            letter-spacing: -0.045em;
        }

        .subcategory-nav a {
            flex-basis: 50%;
            min-width: 0;
            font-size: 0.75rem;
        }

        .coverage-section {
            padding-top: 3rem;
        }

        .coverage-grid {
            grid-template-columns: 1fr;
        }

        .coverage-card {
            display: grid;
            grid-template-columns: 7rem minmax(0, 1fr);
            column-gap: 0.85rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #d1d5db;
        }

        .coverage-card .coverage-image {
            grid-row: 1 / 5;
            aspect-ratio: 1 / 1;
        }

        .coverage-card .card-meta {
            margin-top: 0;
        }

        .coverage-card h3,
        .coverage-lead h3 {
            font-size: 1rem;
        }

        .coverage-card p {
            display: none;
        }
    }
</style>
