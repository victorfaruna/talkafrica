<script lang="ts">
	export let post: any = null;
	import { getOptimizedImageUrl } from "$lib/utils/image";
	import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";
</script>

<section class="bg-[#0a0a0a] py-14 text-white md:py-20">
	<div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
		<header
			class="mb-8 flex items-end justify-between border-b border-white/15 pb-5 md:mb-10"
		>
			<div class="flex items-center gap-4 md:gap-6">
				<span
					class="font-clash-grotesk text-sm font-semibold tracking-[0.2em] text-accent"
					>01</span
				>
				<div>
					<p class="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
						Weekly spotlight
					</p>
					<h2
						class="font-clash-grotesk text-2xl font-bold leading-none sm:text-3xl lg:text-5xl"
					>
						African Giant
					</h2>
				</div>
			</div>

			<a
				href="/african-giant"
				class="hidden items-center gap-2 text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline sm:inline-flex"
			>
				Explore all giants
				<ArrowIcon />
			</a>
		</header>

		{#if post}
			<a
				href="/posts/{post.post_id}"
				class="group grid overflow-hidden border border-white/15 bg-[#111] lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]"
				aria-label={`Read ${post.title}`}
			>
				<div class="relative min-h-[310px] overflow-hidden sm:min-h-[440px] lg:min-h-[560px]">
					<img
						src={getOptimizedImageUrl(post.featured_image || post.image, {
							width: 1200,
							height: 800,
							fit: "fill",
						})}
						alt={post.title}
						class="absolute inset-0 h-full w-full object-cover"
						loading="lazy"
						decoding="async"
					/>
					<div
						class="pointer-events-none absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						aria-hidden="true"
					></div>
					<div
						class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent lg:hidden"
					></div>
				</div>

				<div class="relative flex flex-col justify-between p-6 sm:p-9 lg:p-12 xl:p-14">
					<div>
						<div class="mb-8 flex items-center gap-3">
							<span class="h-px w-10 bg-accent"></span>
							<span class="text-xs font-bold uppercase tracking-[0.2em] text-accent">
								Featured profile
							</span>
						</div>

						<h3
							class="font-clash-grotesk text-2xl font-bold leading-[1.08] text-white group-hover:underline decoration-2 underline-offset-4 sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
						>
							{post.title}
						</h3>

						{#if post.excerpt}
							<p
								class="mt-6 line-clamp-4 text-base leading-relaxed text-white/60 lg:text-lg"
							>
								{post.excerpt}
							</p>
						{/if}
					</div>

					<div class="mt-10 flex items-center justify-between border-t border-white/15 pt-6">
						<span class="text-sm font-bold text-white">Read the full story</span>
						<span
							class="flex h-11 w-11 items-center justify-center bg-accent text-xl text-black"
							aria-hidden="true"><ArrowIcon /></span
						>
					</div>
				</div>
			</a>
		{:else}
			<div class="border border-white/15 bg-[#111] px-6 py-16 text-center">
				<p class="font-clash-grotesk text-2xl font-bold">The next giant is coming.</p>
				<p class="mt-2 text-white/55">Check back soon for our next featured profile.</p>
			</div>
		{/if}

		<a
			href="/african-giant"
			class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline sm:hidden"
		>
			Explore all giants
			<ArrowIcon />
		</a>
	</div>
</section>
