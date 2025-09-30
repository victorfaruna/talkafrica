<script>
	const list = [
		{
			title: 'How to Make Text Scale Perfectly Across Screens',
			description:
				'Learn how to use CSS clamp(), viewport units, and modern techniques to create responsive, fluid typography that looks great on any device—without relying on heavy libraries.',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		},
		{
			title: 'How to Make Text Scale Perfectly Across Screens',
			description:
				'Learn how to use CSS clamp(), viewport units, and modern techniques to create responsive, fluid typography that looks great on any device—without relying on heavy libraries.',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		},
		{
			title: 'How to Make Text Scale Perfectly Across Screens',
			description:
				'Learn how to use CSS clamp(), viewport units, and modern techniques to create responsive, fluid typography that looks great on any device—without relying on heavy libraries.',
			image: '/images/op.webp',
			url: 'https://picsum.photos/id/10/400/200'
		}
	];
</script>

<section class="mt-5 w-screen px-[var(--side-p)] py-[4rem]">
	<p class="font-clash-grotesk text-[1.2rem] lg:text-[3rem]">Latest Articles</p>

	<div class="mt-5 flex flex-col lg:flex-row gap-[2rem]">
		<div class="list-container flex w-full flex-col gap-5">
			{#each list as item}
				<a href={item.url} target="_blank">
					<div
						class="item flex flex-col lg:flex-row w-full gap-5 rounded-[1rem] bg-primary p-3 shadow-lg shadow-secondary/4"
					>
						<img
							src={item.image}
							alt={item.title}
							class="h-[200px] w-[300px] rounded-[0.7rem] bg-secondary/1 object-cover"
						/>
						<div class="flex flex-col gap-4 py-0 pr-8">
							<div class="title text-[1.2rem] leading-none font-medium text-secondary/80">
								{item.title}
							</div>
							<div class="description text-[0.8rem] text-secondary/50">{item.description}</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
		<div class="trending h-[600px] w-full lg:w-[40%] bg-white p-4 shadow-lg shadow-secondary/4">
			<p class="text-[1rem] font-medium">Trending news</p>
		</div>
	</div>
</section>
