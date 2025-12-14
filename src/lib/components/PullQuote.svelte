<script lang="ts">
    export let quote: string;
    export let attribution: string | null = null;
</script>

<!-- Global Pull Quote Component for Storytelling -->
<aside class="pull-quote" role="complementary" aria-label="Quote">
    <blockquote class="pull-quote-content">
        <p class="pull-quote-text">{quote}</p>
        {#if attribution}
            <cite class="pull-quote-attribution">— {attribution}</cite>
        {/if}
    </blockquote>
</aside>

<style>
    /* Pull Quote - Global Styles */
    .pull-quote {
        margin: 3rem auto;
        max-width: 42rem;
        padding: 2rem 0;
    }

    .pull-quote-content {
        margin: 0;
        padding: 0;
        border: none;
        position: relative;
    }

    .pull-quote-text {
        font-size: 1.5rem;
        line-height: 1.6;
        font-weight: 600;
        color: #1f2937;
        font-style: normal;
        margin: 0 0 1rem 0;
        position: relative;
        padding-left: 2rem;
    }

    .pull-quote-text::before {
        content: '"';
        position: absolute;
        left: 0;
        top: -0.5rem;
        font-size: 4rem;
        line-height: 1;
        color: var(--color-accent);
        opacity: 0.3;
        font-family: Georgia, serif;
    }

    .pull-quote-attribution {
        display: block;
        font-size: 0.9375rem;
        font-weight: 500;
        color: #6b5563;
        font-style: normal;
        text-align: right;
        margin-top: 1rem;
    }

    .pull-quote-attribution::before {
        content: '';
    }

    /* Mobile Optimization */
    @media (max-width: 640px) {
        .pull-quote {
            margin: 2rem auto;
            padding: 1.5rem 0;
        }

        .pull-quote-text {
            font-size: 1.25rem;
            padding-left: 1.5rem;
        }

        .pull-quote-text::before {
            font-size: 3rem;
            left: -0.25rem;
        }
    }

    @media (min-width: 1024px) {
        .pull-quote-text {
            font-size: 1.75rem;
        }
    }
</style>


