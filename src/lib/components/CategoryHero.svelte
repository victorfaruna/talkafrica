<script lang="ts">
    import { onMount } from "svelte";

    type HeroPost = {
        post_id: string;
        title: string;
        excerpt?: string | null;
        image?: string | null;
    };

    export let categoryName: string;
    export let categorySlug: string = "";
    export let posts: HeroPost[] = [];
    export let trendingPost: HeroPost | null = null;

    const defaultHeroImage = "/images/big-screen-bg-v2.jpg";
    const categoryHeroImages: Record<string, string> = {
        politics: "/images/category/politics-hero.jpg",
        economy: "/images/category/economy-hero.jpg",
        health: "/images/category/health-hero.jpg",
        technology: "/images/category/technology-hero.png",
        basketball: "/images/category/basketball-hero.png",
        athletics: "/images/category/athletics-hero.png",
        tennis: "/images/category/tennis-hero.png",
        music: "/images/category/music-hero.jpg",
        "celebrity-gossip": "/images/category/celebrity-gossip-hero.jpg",
        travel: "/images/category/travel-hero.jpg",
        lifestyle: "/images/category/lifestyle-hero.png",
        "movie-reviews": "/images/category/movie-reviews-hero.png",
        arts: "/images/category/arts-hero.jpg",
        "african-history": "/images/category/african-history-hero.jpg",
        "animated-folktales": "/images/category/animated-folktales-hero.jpg",
        "fun-facts": "/images/category/fun-facts-hero.jpg",
        "historical-sites": "/images/category/historical-sites-hero.jpg",
    };

    let rotationIndex = 0;
    let interactionIndex: number | null = null;

    $: categoryKey = categorySlug.toLowerCase() || categoryName.toLowerCase();
    $: activeIndex = interactionIndex ?? rotationIndex;
    $: activePost = posts[activeIndex] ?? trendingPost ?? posts[0];
    $: heroImage = categoryHeroImages[categoryKey] ?? defaultHeroImage;
    $: visiblePosts = posts.length
        ? Array.from({ length: Math.min(3, posts.length) }, (_, offset) => {
              const index = (rotationIndex + offset) % posts.length;
              return { post: posts[index], index };
          })
        : [];

    onMount(() => {
        const rotation = window.setInterval(() => {
            if (posts.length > 1 && interactionIndex === null) {
                rotationIndex = (rotationIndex + 1) % posts.length;
            }
        }, 5000);

        return () => window.clearInterval(rotation);
    });
</script>

<section class="category-hero" aria-label={`${categoryName} trending stories`}>
    <img
        class="category-hero__image"
        class:category-hero__image--technology={categoryKey === "technology"}
        class:category-hero__image--african-history={categoryKey === "african-history"}
        class:category-hero__image--tennis={categoryKey === "tennis"}
        src={heroImage}
        alt=""
        loading="eager"
        decoding="async"
        fetchpriority="high"
    />
    <div class="category-hero__overlay"></div>

    {#if activePost}
        <div class="category-hero__inner">
            <div class="category-hero__feature">
                <p class="category-hero__eyebrow">
                    <span aria-hidden="true"></span>
                    Trending Today
                </p>
                <h1>{activePost.title}</h1>
                {#if activePost.excerpt}
                    <p class="category-hero__excerpt">{activePost.excerpt}</p>
                {/if}
                <a class="category-hero__cta" href={`/posts/${activePost.post_id}`}>
                    Read More
                </a>
            </div>

            {#if posts.length > 1}
                <div
                    class="category-hero__list"
                    aria-label="Latest articles"
                    onmouseleave={() => (interactionIndex = null)}
                >
                    <div class="category-hero__list-window">
                    {#each visiblePosts as item}
                        <a
                            href={`/posts/${item.post.post_id}`}
                            class:active={item.index === activeIndex}
                            onmouseenter={() => (interactionIndex = item.index)}
                            onfocus={() => (interactionIndex = item.index)}
                            onblur={() => (interactionIndex = null)}
                        >
                            <strong>{item.post.title}</strong>
                            {#if item.post.excerpt}
                                <span>{item.post.excerpt}</span>
                            {/if}
                        </a>
                    {/each}
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <div class="category-hero__empty">
            <h1>{categoryName}</h1>
            <p>
                Discover the latest stories and insights from {categoryName.toLowerCase()}
                across Africa
            </p>
        </div>
    {/if}
</section>

<style>
    .category-hero {
        position: relative;
        height: 34rem;
        min-height: 34rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        background: #16232a;
        color: #fff;
    }

    .category-hero__image,
    .category-hero__overlay {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    .category-hero__image {
        object-fit: cover;
    }

    .category-hero__image--technology {
        object-position: center 30%;
    }

    .category-hero__image--african-history {
        object-position: center 18%;
    }

    .category-hero__image--tennis {
        object-position: center 35%;
    }

    .category-hero__overlay {
        background: linear-gradient(90deg, rgba(8, 18, 23, 0.82), rgba(20, 39, 48, 0.68));
    }

    .category-hero__inner {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: minmax(0, 1.65fr) minmax(18rem, 0.85fr);
        align-items: center;
        gap: clamp(3rem, 8vw, 8rem);
        width: min(100% - 3rem, 80rem);
        height: 100%;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 5rem 0;
    }

    .category-hero__feature {
        min-width: 0;
    }

    .category-hero__eyebrow {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        margin: 0 0 0.55rem;
        font-size: 1.05rem;
        font-weight: 500;
    }

    .category-hero__eyebrow span {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: var(--color-accent);
    }

    .category-hero__feature h1,
    .category-hero__empty h1 {
        margin: 0;
        font-family: var(--font-clash-grotesk);
        font-size: clamp(2rem, 3.25vw, 3.25rem);
        font-weight: 700;
        line-height: 1.08;
        text-wrap: balance;
    }

    .category-hero__feature h1 {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
    }

    .category-hero__excerpt {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        max-width: 43rem;
        margin: 1rem 0 0;
        font-size: clamp(1rem, 1.4vw, 1.2rem);
        font-weight: 500;
        line-height: 1.35;
    }

    .category-hero__cta {
        display: inline-flex;
        margin-top: 1.8rem;
        padding: 0.8rem 1.75rem;
        border-radius: 0;
        background: var(--color-accent);
        color: #111827;
        font-weight: 600;
        text-decoration: none;
        transition: transform 180ms ease, background-color 180ms ease;
    }

    .category-hero__cta:hover {
        background: color-mix(in srgb, var(--color-accent) 88%, #000);
        transform: translateY(-2px);
    }

    .category-hero__list {
        overflow: hidden;
    }

    .category-hero__list-window {
        display: grid;
        gap: 0.4rem;
    }

    .category-hero__list a {
        display: block;
        width: 100%;
        padding: 0.6rem 0;
        border: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        background: transparent;
        color: rgba(255, 255, 255, 0.48);
        text-align: left;
        text-decoration: none;
        transition:
            padding 360ms cubic-bezier(0.22, 1, 0.36, 1),
            color 240ms ease,
            border-color 240ms ease;
    }

    .category-hero__list a:hover,
    .category-hero__list a.active {
        color: #fff;
        padding: 0.95rem 0 1.1rem;
        border-bottom-color: var(--color-accent);
    }

    .category-hero__list strong,
    .category-hero__list span {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
    }

    .category-hero__list strong {
        -webkit-line-clamp: 2;
        font-family: var(--font-clash-grotesk);
        font-size: 0.92rem;
        line-height: 1.15;
        transition: font-size 360ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .category-hero__list a.active strong {
        font-size: 1.08rem;
    }

    .category-hero__list span {
        -webkit-line-clamp: 2;
        max-height: 0;
        margin-top: 0;
        opacity: 0;
        transform: translateY(-0.35rem);
        font-size: 0.82rem;
        line-height: 1.25;
        transition:
            max-height 380ms cubic-bezier(0.22, 1, 0.36, 1),
            margin-top 380ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 220ms ease,
            transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .category-hero__list a.active span {
        max-height: 3.2rem;
        margin-top: 0.55rem;
        opacity: 1;
        transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
        .category-hero__list a,
        .category-hero__list strong,
        .category-hero__list span {
            transition-duration: 0.01ms;
        }
    }

    .category-hero__empty {
        position: relative;
        z-index: 1;
        width: min(100% - 3rem, 80rem);
        margin: auto;
        text-align: center;
    }

    .category-hero__empty p {
        margin: 1rem auto 0;
        max-width: 40rem;
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        .category-hero {
            height: auto;
            min-height: auto;
        }

        .category-hero__inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            padding: 4.5rem 0 3rem;
        }

        .category-hero__list-window {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem 1.25rem;
        }

        .category-hero__list {
            padding-top: 1.25rem;
            border-top: 1px solid rgba(255, 255, 255, 0.25);
        }
    }

    @media (max-width: 480px) {
        .category-hero__inner,
        .category-hero__empty {
            width: min(100% - 2rem, 80rem);
        }

        .category-hero__list-window {
            grid-template-columns: 1fr;
        }
    }
</style>
