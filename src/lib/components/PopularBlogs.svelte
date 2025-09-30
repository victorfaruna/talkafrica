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

<section class="flex flex-col gap-[0.5rem] px-[var(--side-p)] py-[4rem]">
	<p class="section-title font-clash-grotesk text-[3rem]">Popular Blogs</p>
	<div class="grid grid-cols-3 gap-x-[0.4rem] gap-y-[0.5rem]">
		{#each list as item}
			<a href={item.url}>
				<div class="flex w-full flex-col gap-4 rounded-2xl px-2 py-4 shadow-lg shadow-secondary/5">
					<img src={item.image} alt={item.title} class="w-full rounded-2xl object-cover" />
					<p class="pr-10 text-[1rem] leading-none font-medium text-secondary/80">{item.title}</p>
					<button class="self-start rounded-[2rem] border-2 border-accent/80 px-5 py-2 text-accent"
						>Read More</button
					>
				</div>
			</a>
		{/each}
	</div>
</section>
