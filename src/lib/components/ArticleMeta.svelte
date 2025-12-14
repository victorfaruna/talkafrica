<script lang="ts">
    import { getCategoryDisplayName } from "$lib/categories";

    export let categories: string[] = [];
    export let author: string | null = null;
    export let publishedDate: string | Date | null = null;
    export let readingTime: number | null = null;

    $: displayCategories = categories && categories.length > 0 ? categories : [];

    function formatDate(date: string | Date): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function formatReadingTime(minutes: number | null): string {
        if (!minutes) return '';
        if (minutes === 1) return '1 min read';
        return `${minutes} min read`;
    }
</script>

<!-- Global Article Meta Component -->
<aside class="article-meta" aria-label="Article information">
    <div class="article-meta-content">
        {#if displayCategories.length > 0}
            <div class="article-meta-categories">
                {#each displayCategories as categorySlug}
                    <a
                        href="/{categorySlug}"
                        class="article-meta-category"
                        aria-label="Category: {getCategoryDisplayName(categorySlug)}"
                    >
                        {getCategoryDisplayName(categorySlug)}
                    </a>
                {/each}
            </div>
        {/if}

        <div class="article-meta-info">
            {#if author}
                <div class="article-meta-item">
                    <svg
                        class="article-meta-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <span class="article-meta-text">
                        <span class="sr-only">Author: </span>
                        {author}
                    </span>
                </div>
            {/if}

            {#if publishedDate}
                <div class="article-meta-item">
                    <svg
                        class="article-meta-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <time
                        class="article-meta-text"
                        datetime={publishedDate instanceof Date ? publishedDate.toISOString() : new Date(publishedDate).toISOString()}
                    >
                        {formatDate(publishedDate)}
                    </time>
                </div>
            {/if}

            {#if readingTime}
                <div class="article-meta-item">
                    <svg
                        class="article-meta-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span class="article-meta-text">{formatReadingTime(readingTime)}</span>
                </div>
            {/if}
        </div>
    </div>
</aside>

<style>
    /* Article Meta - Global Styles */
    .article-meta {
        margin-bottom: 2.5rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    .article-meta-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    /* Category Pills - Modern and Minimal */
    .article-meta-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.625rem;
    }

    .article-meta-category {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: 0.025em;
        text-transform: uppercase;
        color: var(--color-accent);
        background-color: rgba(255, 165, 0, 0.08);
        border: 1px solid rgba(255, 165, 0, 0.2);
        border-radius: 9999px;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .article-meta-category:hover {
        background-color: rgba(255, 165, 0, 0.15);
        border-color: rgba(255, 165, 0, 0.4);
        transform: translateY(-1px);
    }

    /* Meta Information Row */
    .article-meta-info {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1.5rem;
        font-size: 0.9375rem;
        line-height: 1.5;
    }

    .article-meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #4b5563;
    }

    .article-meta-icon {
        width: 1rem;
        height: 1rem;
        color: #9ca3af;
        flex-shrink: 0;
    }

    .article-meta-text {
        font-weight: 500;
        color: #1f2937;
    }

    /* Screen reader only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    /* Mobile Optimization */
    @media (max-width: 640px) {
        .article-meta {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
        }

        .article-meta-content {
            gap: 1rem;
        }

        .article-meta-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.875rem;
            font-size: 0.875rem;
        }
    }

    @media (min-width: 768px) {
        .article-meta-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>


