<script lang="ts">
    import { getCategoryDisplayName } from "$lib/categories";

    export let categories: string[] = [];
    export let author: string | null = null;
    export let publishedDate: string | Date | null = null;
    export let readingTime: number | null = null;

    $: displayCategories =
        categories && categories.length > 0 ? categories : [];

    function formatDate(date: string | Date): string {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function formatReadingTime(minutes: number | null): string {
        if (!minutes) return "";
        if (minutes === 1) return "1 min";
        return `${minutes} min`;
    }
</script>

<!-- Global Article Meta Component -->
<aside class="article-meta" aria-label="Article information">
    <div class="article-meta-info">
        {#if author}
            <div class="article-meta-item">
                <span class="article-meta-label">By</span>
                <span class="article-meta-value font-medium text-gray-900"
                    >{author}</span
                >
            </div>
            <span class="article-meta-separator" aria-hidden="true">&bull;</span
            >
        {/if}

        {#if publishedDate}
            <div class="article-meta-item">
                <time
                    datetime={publishedDate instanceof Date
                        ? publishedDate.toISOString()
                        : new Date(publishedDate).toISOString()}
                    class="article-meta-value"
                >
                    {formatDate(publishedDate)}
                </time>
            </div>
        {/if}

        {#if readingTime}
            <span class="article-meta-separator" aria-hidden="true">&bull;</span
            >
            <div class="article-meta-item">
                <span class="article-meta-value"
                    >{formatReadingTime(readingTime)} read</span
                >
            </div>
        {/if}
    </div>
</aside>

<style>
    /* Article Meta - Clean & Modern */
    .article-meta {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .article-meta-info {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        font-size: 0.95rem;
        color: #6b7280; /* Gray 500 */
        font-family: var(--font-poppins);
        line-height: 1.5;
    }

    .article-meta-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .article-meta-label {
        font-weight: 400;
        color: #9ca3af; /* Gray 400 */
    }

    .article-meta-value {
        color: #374151; /* Gray 700 */
    }

    .font-medium {
        font-weight: 500;
        color: #111827; /* Gray 900 */
    }

    .article-meta-separator {
        color: #d1d5db; /* Gray 300 */
        font-size: 0.75em;
    }

    /* Mobile */
    @media (max-width: 640px) {
        .article-meta-info {
            font-size: 0.875rem;
            gap: 0.5rem;
        }
    }
</style>
