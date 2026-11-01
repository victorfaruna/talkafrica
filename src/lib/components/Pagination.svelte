<script lang="ts">
    import { page } from '$app/stores';
    export let pagination: { currentPage: number; hasPrevPage: boolean; hasNextPage: boolean };
    function href(number: number) {
        const url = new URL($page.url);
        url.searchParams.set('page', String(number));
        return url.pathname + url.search;
    }
</script>

{#if pagination.hasPrevPage || pagination.hasNextPage}
    <nav aria-label="Pagination" class="flex items-center justify-center gap-5 p-5">
        {#if pagination.hasPrevPage}<a class="rounded border px-4 py-2" href={href(pagination.currentPage - 1)} rel="prev">Previous</a>{/if}
        <span>Page {pagination.currentPage}</span>
        {#if pagination.hasNextPage}<a class="rounded border px-4 py-2" href={href(pagination.currentPage + 1)} rel="next">Next</a>{/if}
    </nav>
{/if}
