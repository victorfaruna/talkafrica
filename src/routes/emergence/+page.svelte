<script lang="ts">
    import { afterNavigate, disableScrollHandling } from "$app/navigation";
    import Homepage from "../+page.svelte";

    export let data;

    afterNavigate(() => {
        disableScrollHandling();
        document.getElementById("emergence")?.scrollIntoView({
            block: "start",
            behavior: "instant",
        });
    });
</script>

<Homepage {data} />
