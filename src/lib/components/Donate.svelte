<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isVisible = false;
	let animationDelay = 0;

	const stats = [
		{ number: '10K+', label: 'Stories Shared' },
		{ number: '5K+', label: 'Entrepreneurs' },
		{ number: '50+', label: 'Countries' }
	];

	function navigateToDonate() {
		goto('/donate');
	}

	onMount(() => {
		isVisible = true;
	});
</script>

<section
	class="relative overflow-hidden bg-gradient-to-br from-primary via-primary/85 to-primary py-24 text-secondary"
>
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div
			class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"
		></div>
	</div>

	<!-- Floating Elements -->
	<div
		class="absolute top-20 left-10 h-20 w-20 animate-pulse rounded-full bg-accent/20 blur-xl"
	></div>
	<div
		class="absolute right-10 bottom-20 h-32 w-32 animate-pulse rounded-full bg-accent/10 blur-2xl"
		style="animation-delay: 1s;"
	></div>
	<div
		class="absolute top-1/2 left-1/4 h-16 w-16 animate-pulse rounded-full bg-accent/15 blur-lg"
		style="animation-delay: 2s;"
	></div>

	<div class="relative z-10 container mx-auto px-[var(--side-p)]">
		<div class="mx-auto max-w-6xl">
			<!-- Main CTA Content -->
			<div class="text-center">
				<!-- Badge -->
				<div
					class="mb-8 inline-flex items-center rounded-full bg-accent/10 px-6 py-3 text-accent backdrop-blur-sm"
				>
					<span class="mr-2 text-2xl">💝</span>
					<span class="text-sm font-semibold">Support Our Mission</span>
				</div>

				<!-- Main Heading -->
				<h2 class="mb-6 font-clash-grotesk text-5xl font-bold text-secondary md:text-7xl">
					<span class="block">Support</span>
					<span
						class="block bg-gradient-to-r from-accent to-primary/70 bg-clip-text text-transparent"
					>
 African Innovation 

					</span>
				</h2>

				<!-- Subheading -->
				<p class="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-secondary/80 md:text-[1rem]">
Join us in amplifying African voices and empowering not just changemakers, but everyday Africans: the unheard, the unseen, those rising from hardship to hope. Together, we’re building a connected continent through stories, creativity, and collective impact.
				</p>

				<!-- CTA Buttons -->
				<div class="mb-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
					<button
						on:click={navigateToDonate}
						class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-accent/90 px-12 py-6 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/25"
					>
						<span class="relative z-10 flex items-center">
							<span class="mr-3 text-xl">🚀</span>
							Donate Now
						</span>
						<div
							class="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent transition-opacity duration-300 group-hover:opacity-0"
						></div>
					</button>

					<button
						class="group flex items-center rounded-2xl border-2 border-secondary/20 bg-primary/5 px-8 py-6 text-lg font-semibold text-secondary backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-accent/10"
					>
						<span class="mr-3 text-2xl">📖</span>
						Learn More
					</button>
				</div>

				<!-- Impact Stats -->
				<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
					{#each stats as stat, index}
						<div
							class="group rounded-2xl bg-secondary/2 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/10"
							style="animation-delay: {index * 0.2}s;"
						>
							<div class="text-center">
								<div class="mb-1 text-[1rem] leading-none font-bold text-accent md:text-[2rem]">
									{stat.number}
								</div>
								<div class="text-[0.8rem] font-medium text-secondary/80">
									{stat.label}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Trust Indicators -->
			<div class="mt-20">
				<div class="text-center">
					<p class="mb-8 text-lg text-secondary/60">Trusted by organizations worldwide</p>

					<!-- Trust Badges -->
					<div class="flex flex-wrap items-center justify-center gap-8 opacity-60">
						<div
							class="flex items-center space-x-2 rounded-xl bg-secondary/10 px-6 py-3 backdrop-blur-sm"
						>
							<span class="text-2xl">🔒</span>
							<span class="text-sm font-medium text-secondary">SSL Secured</span>
						</div>
						<div
							class="flex items-center space-x-2 rounded-xl bg-secondary/10 px-6 py-3 backdrop-blur-sm"
						>
							<span class="text-2xl">📧</span>
							<span class="text-sm font-medium text-secondary">Instant Receipt</span>
						</div>
						<div
							class="flex items-center space-x-2 rounded-xl bg-secondary/10 px-6 py-3 backdrop-blur-sm"
						>
							<span class="text-2xl">💝</span>
							<span class="text-sm font-medium text-secondary">Tax Deductible</span>
						</div>
						<div
							class="flex items-center space-x-2 rounded-xl bg-secondary/10 px-6 py-3 backdrop-blur-sm"
						>
							<span class="text-2xl">🌍</span>
							<span class="text-sm font-medium text-secondary">Global Impact</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Alternative Support Methods -->
			<div class="mt-16 rounded-3xl bg-white/5 p-8 backdrop-blur-sm">
				<h3 class="mb-8 text-center font-clash-grotesk text-2xl font-semibold text-secondary">
					Other Ways to Support
				</h3>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<!-- Mobile Money -->
					<div
						class="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:border-accent/50 hover:bg-accent/5"
					>
						<div class="mb-4 text-4xl">📱</div>
						<h4 class="mb-2 text-lg font-semibold text-secondary">Mobile Money</h4>
						<p class="text-sm text-secondary/70">M-Pesa, Airtel Money, MTN</p>
					</div>

					<!-- Bank Transfer -->
					<div
						class="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:border-accent/50 hover:bg-accent/5"
					>
						<div class="mb-4 text-4xl">🏦</div>
						<h4 class="mb-2 text-lg font-semibold text-secondary">Bank Transfer</h4>
						<p class="text-sm text-secondary/70">Direct bank transfer</p>
					</div>

					<!-- Cryptocurrency -->
					<div
						class="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:border-accent/50 hover:bg-accent/5"
					>
						<div class="mb-4 text-4xl">₿</div>
						<h4 class="mb-2 text-lg font-semibold text-secondary">Crypto</h4>
						<p class="text-sm text-secondary/70">Bitcoin, Ethereum</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
