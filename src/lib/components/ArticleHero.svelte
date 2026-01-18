<script lang="ts">
    export let title: string;
    export let excerpt: string | null | undefined = null;
    export let image: string | null | undefined = null;
    export let dek: string | null | undefined = null; // Optional subheading/dek
</script>

<!-- Global Article Hero Component -->
<header class="article-hero">
    {#if image}
        <div class="article-hero-with-image">
            <!-- Image with gentle zoom effect on load (handled via CSS/JS if needed, here just clean) -->
            <img
                src={image}
                alt={title}
                class="article-hero-image"
                loading="eager"
            />
            <!-- Gradient Overlay for readability -->
            <div class="article-hero-overlay"></div>

            <div class="article-hero-content">
                <nav class="article-hero-nav">
                    <a href="/" class="article-hero-back-link group">
                        <span
                            class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors"
                        >
                            <svg
                                class="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </span>
                        <span
                            class="sr-only sm:not-sr-only sm:inline-block border-b border-transparent group-hover:border-white/80 transition-all"
                            >Back to Home</span
                        >
                    </a>
                </nav>

                <h1 class="article-hero-title text-balance">{title}</h1>

                {#if dek}
                    <p class="article-hero-dek text-balance">{dek}</p>
                {/if}
            </div>
        </div>
    {:else}
        <!-- No image: Clean minimal layout -->
        <div class="article-hero-no-image">
            <nav class="article-hero-nav">
                <a
                    href="/"
                    class="article-hero-back-link group text-gray-600 hover:text-orange-600"
                >
                    <span
                        class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </span>
                    <span
                        class="sr-only sm:not-sr-only sm:inline-block border-b border-transparent group-hover:border-orange-600/50 transition-all"
                        >Back to Home</span
                    >
                </a>
            </nav>
            <div class="article-hero-content-wrapper">
                <h1 class="article-hero-title-standalone text-balance">
                    {title}
                </h1>
                {#if dek}
                    <p class="article-hero-dek text-balance">{dek}</p>
                {/if}
                {#if excerpt}
                    <p class="article-hero-excerpt text-balance">{excerpt}</p>
                {/if}
            </div>
        </div>
    {/if}
</header>

<style>
    /* Article Hero - Global Styles */
    .article-hero {
        position: relative;
        width: 100%;
    }

    .text-balance {
        text-wrap: balance;
    }

    /* Hero with Image */
    .article-hero-with-image {
        position: relative;
        min-height: 500px;
        height: 70vh;
        max-height: 800px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #000;
        border-radius: 1rem; /* rounded-2xl equivalent */
    }

    .article-hero-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        opacity: 0.9;
    }

    /* Elegant gradient overlay */
    .article-hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.4) 40%,
            rgba(0, 0, 0, 0.8) 100%
        );
        z-index: 1;
    }

    .article-hero-content {
        position: relative;
        z-index: 2;
        max-width: 1100px;
        width: 100%;
        padding: 2rem;
        text-align: center;
        color: white;
        margin-top: 4rem; /* Optical balance */
    }

    /* Hero without Image */
    .article-hero-no-image {
        background-color: #fff;
        padding: 4rem 1.5rem 3rem;
        position: relative;
        border-bottom: 1px solid #f3f4f6;
        border-radius: 1rem;
    }

    .article-hero-content-wrapper {
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
    }

    /* Navigation */
    .article-hero-nav {
        margin-bottom: 2rem;
        display: flex;
        justify-content: center;
        /* Removed absolute positioning to prevent overlap with title */
        position: relative;
        z-index: 10;
    }

    .article-hero-back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.95);
        text-decoration: none;
        padding: 0.5rem 1.25rem;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 9999px;
        backdrop-filter: blur(8px);
        transition: all 0.3s ease;
    }

    .article-hero-back-link:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.4);
    }

    .article-hero-no-image .article-hero-back-link {
        color: #c2410c; /* Orange 700 */
        background-color: rgba(234, 88, 12, 0.1); /* Orange/10 */
        border-color: rgba(234, 88, 12, 0.2);
    }

    .article-hero-no-image .article-hero-back-link:hover {
        background-color: rgba(234, 88, 12, 0.15);
        border-color: rgba(234, 88, 12, 0.4);
    }

    /* Title Typography */
    .article-hero-title,
    .article-hero-title-standalone {
        font-family: var(--font-clash-grotesk);
        font-weight: 700;
        line-height: 1.05;
        letter-spacing: -0.01em;
        margin: 0 0 1.5rem 0;
    }

    .article-hero-title {
        font-size: clamp(2.5rem, 5vw, 5rem);
        color: white;
        text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    }

    .article-hero-title-standalone {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        color: #09090b;
        margin-bottom: 1.5rem;
    }

    /* Dek (Subheading) */
    .article-hero-dek {
        font-size: clamp(1.125rem, 2vw, 1.5rem);
        font-weight: 500;
        line-height: 1.4;
        margin: 0 auto;
        max-width: 65ch;
    }

    .article-hero-content .article-hero-dek {
        color: rgba(255, 255, 255, 0.9);
    }

    .article-hero-content-wrapper .article-hero-dek {
        color: #4b5563;
    }

    /* Excerpt */
    .article-hero-excerpt {
        font-size: 1.25rem;
        line-height: 1.6;
        color: #52525b;
        margin: 1.5rem auto 0;
        max-width: 60ch;
        font-family: "Georgia", serif;
    }

    /* Mobile Optimization */
    @media (max-width: 640px) {
        .article-hero-with-image {
            min-height: 350px;
            height: 60vh;
        }

        .article-hero-content {
            padding: 1.5rem;
            margin-top: 2rem;
        }

        .article-hero-no-image {
            padding-top: 6rem;
        }
    }
</style>
