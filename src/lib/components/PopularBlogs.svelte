<script>
	const list = [
		{
			title: 'Mastering Fluid Typography: How to Make Text Scale Perfectly Across Screens',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		},
		{
			title: 'Mastering Fluid Typography: How to Make Text Scale Perfectly Across Screens',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		},
		{
			title: 'Mastering Fluid Typography: How to Make Text Scale Perfectly Across Screens',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		},
		{
			title: 'Mastering Fluid Typography: How to Make Text Scale Perfectly Across Screens',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		},
		{
			title: 'Mastering Fluid Typography: How to Make Text Scale Perfectly Across Screens',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		},
		{
			title: 'Mastering Fluid Typography: How to Make Text Scale Perfectly Across Screens',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		}
	];
</script>

<section class="flex flex-col gap-[0.5rem] px-[var(--side-p)] py-[2rem] lg:py-[4rem]">
	<p class="section-title font-clash-grotesk text-[1.2rem] lg:text-[3rem]">Popular Blogs</p>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-x-[0.4rem] gap-y-[0.5rem]">
		{#each list as item}
			<a href={item.url}>
				<div class="flex w-full flex-col gap-4 rounded-2xl px-2 py-4 shadow-lg shadow-secondary/5">
					<img src={item.image} alt={item.title} class="w-full rounded-2xl object-cover" />
					<p class="pr-10 text-[0.8rem] lg:text-[1rem] leading-none font-medium text-secondary/80">{item.title}</p>
					<button class="self-start rounded-[0.5rem] border border-secondary/50 px-5 py-2 text-secondary/50"
						>Read More{" "}<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 inline">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
</svg>
</button
					>
				</div>
			</a>
		{/each}
	</div>
</section>
