<script lang="ts">
    import { onDestroy } from "svelte";

    export let isNavigating = false;

    let width = 0;
    let visible = false;
    let interval: any;

    $: if (isNavigating) {
        start();
    } else if (visible) {
        complete();
    }

    function start() {
        width = 0;
        visible = true;
        clearInterval(interval);
        // Trickle animation
        interval = setInterval(() => {
            if (width < 90) {
                width += Math.random() * 5;
            }
        }, 200);
    }

    function complete() {
        clearInterval(interval);
        width = 100;
        setTimeout(() => {
            visible = false;
            width = 0;
        }, 300); // Fade out delay
    }

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

{#if visible}
    <div class="progress-container">
        <div class="progress-bar" style="width: {width}%"></div>
    </div>
{/if}

<style>
    .progress-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        z-index: 9999;
        pointer-events: none;
    }

    .progress-bar {
        height: 100%;
        background: var(--color-accent, orange);
        transition: width 0.2s ease;
        box-shadow:
            0 0 10px var(--color-accent, orange),
            0 0 5px var(--color-accent, orange);
    }
</style>
