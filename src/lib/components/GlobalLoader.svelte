<script lang="ts">
    import { navigating } from "$app/stores";
    import { fade } from "svelte/transition";
</script>

{#if $navigating}
    <div
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-accent"
        ></div>
    </div>
{/if}
