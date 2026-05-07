<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.png";
	import { navigating } from "$app/stores";
	import TopProgressBar from "$lib/components/TopProgressBar.svelte";
	import SEO from "$lib/components/SEO.svelte";
	import NewsletterPopup from "$lib/components/NewsletterPopup.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#ff9900" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<SEO />
<TopProgressBar isNavigating={!!$navigating} />
<NewsletterPopup />
{@render children?.()}
