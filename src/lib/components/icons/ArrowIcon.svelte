<script lang="ts">
    export let direction: "right" | "left" | "up-right" = "right";
</script>

<svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="1em"
    height="1em"
    aria-hidden="true"
    focusable="false"
>
    {#if direction === "left"}
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
    {:else if direction === "up-right"}
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
    {:else}
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
    {/if}
</svg>

<style>
    svg {
        display: inline-block;
        flex: 0 0 auto;
        vertical-align: -0.125em;
    }
</style>
