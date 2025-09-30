<script>
	import Header from '$lib/components/Header.svelte';
	const { data } = $props();
</script>

<Header />
<div
	style="background-image: url(/images/category/{data.category}.webp)"
	class="banner h-[400px] w-full bg-neutral-600 bg-cover bg-center"
></div>
