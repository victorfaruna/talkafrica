<script lang="ts">
    export let title: string;
    export let excerpt: string | null | undefined = null;
    export let image: string | null | undefined = null;
    export let dek: string | null | undefined = null; // Optional subheading/dek
    
    // Calculate estimated reading time from content
    function estimateReadingTime(content: string): number {
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
        const wordCount = text.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
</script>

<!-- Global Article Hero Component -->
<header class="article-hero">
    {#if image}
        <div class="article-hero-with-image">
            <img
                src={image}
                alt={title}
                class="article-hero-image"
                loading="eager"
            />
            <!-- Subtle dark overlay for text contrast -->
            <div class="article-hero-overlay"></div>
            <div class="article-hero-content">
                <nav class="article-hero-nav">
                    <a href="/" class="article-hero-back-link">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path
                                fill-rule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span>Back to Home</span>
                    </a>
                </nav>
                <h1 class="article-hero-title">{title}</h1>
                {#if dek}
                    <p class="article-hero-dek">{dek}</p>
                {/if}
                {#if excerpt}
                    <p class="article-hero-excerpt">{excerpt}</p>
                {/if}
            </div>
        </div>
    {:else}
        <!-- No image: clean accent background -->
        <div class="article-hero-no-image">
            <nav class="article-hero-nav">
                <a href="/" class="article-hero-back-link">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                            fill-rule="evenodd"
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    <span>Back to Home</span>
                </a>
            </nav>
            <div class="article-hero-content-wrapper">
                <h1 class="article-hero-title-standalone">{title}</h1>
                {#if dek}
                    <p class="article-hero-dek">{dek}</p>
                {/if}
                {#if excerpt}
                    <p class="article-hero-excerpt">{excerpt}</p>
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

    /* Hero with Image */
    .article-hero-with-image {
        position: relative;
        min-height: 400px;
        height: 55vh;
        max-height: 700px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .article-hero-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    /* Subtle dark overlay for consistent text contrast */
    .article-hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.6) 100%
        );
        z-index: 1;
    }

    .article-hero-content {
        position: relative;
        z-index: 2;
        max-width: 900px;
        width: 100%;
        padding: 2rem 1.5rem;
        text-align: center;
        color: white;
    }

    /* Hero without Image */
    .article-hero-no-image {
        background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent) 98%, rgba(255, 165, 0, 0.95) 100%);
        padding: 3rem 1.5rem 4rem;
        position: relative;
    }

    .article-hero-content-wrapper {
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
        color: var(--color-secondary);
    }

    /* Navigation */
    .article-hero-nav {
        margin-bottom: 2rem;
    }

    .article-hero-back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9375rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .article-hero-no-image .article-hero-back-link {
        color: rgba(0, 0, 0, 0.75);
    }

    .article-hero-back-link:hover {
        color: white;
    }

    .article-hero-no-image .article-hero-back-link:hover {
        color: black;
    }

    /* Title Typography - Editorial, Premium Feel */
    .article-hero-title,
    .article-hero-title-standalone {
        font-family: var(--font-clash-grotesk);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.03em;
        margin: 0 0 1.5rem 0;
        text-rendering: optimizeLegibility;
    }

    .article-hero-title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        color: white;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .article-hero-title-standalone {
        font-size: clamp(2.25rem, 6vw, 4rem);
        color: var(--color-secondary);
        margin-bottom: 1.75rem;
    }

    /* Dek (Subheading) - Optional framing text */
    .article-hero-dek {
        font-size: clamp(1rem, 2vw, 1.25rem);
        font-weight: 600;
        line-height: 1.5;
        letter-spacing: 0.01em;
        margin: 0 0 1.25rem 0;
        opacity: 0.95;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .article-hero-content .article-hero-dek {
        color: rgba(255, 255, 255, 0.95);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    .article-hero-content-wrapper .article-hero-dek {
        color: rgba(0, 0, 0, 0.7);
    }

    /* Excerpt */
    .article-hero-excerpt {
        font-size: clamp(1.125rem, 2.5vw, 1.5rem);
        line-height: 1.6;
        font-weight: 400;
        margin: 0;
        max-width: 42rem;
        margin-left: auto;
        margin-right: auto;
        opacity: 0.95;
    }

    .article-hero-content .article-hero-excerpt {
        color: rgba(255, 255, 255, 0.98);
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .article-hero-content-wrapper .article-hero-excerpt {
        color: rgba(0, 0, 0, 0.85);
    }

    /* Mobile Optimization */
    @media (max-width: 640px) {
        .article-hero-with-image {
            min-height: 350px;
            height: 45vh;
        }

        .article-hero-content {
            padding: 1.5rem 1rem;
        }

        .article-hero-no-image {
            padding: 2rem 1rem 3rem;
        }

        .article-hero-nav {
            margin-bottom: 1.5rem;
        }

        .article-hero-title,
        .article-hero-title-standalone {
            margin-bottom: 1.25rem;
        }
    }

    @media (min-width: 1024px) {
        .article-hero-content {
            padding: 3rem 2rem;
        }

        .article-hero-no-image {
            padding: 4rem 2rem 5rem;
        }
    }
</style>


