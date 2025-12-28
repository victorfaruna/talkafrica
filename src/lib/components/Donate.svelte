<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	let isVisible = false;

	const stats = [
		{ number: "10K+", label: "Stories Published" },
		{ number: "100K+", label: "Monthly Readers" },
		{ number: "50+", label: "Countries Reached" },
	];

	function navigateToDonate() {
		goto("/donate");
	}

	function navigateToAbout() {
		goto("/about");
	}

	onMount(() => {
		isVisible = true;
	});
</script>

<section
	id="support-mission"
	class="section-donate relative overflow-hidden bg-white py-20 md:py-24"
>
	<!-- Background Decoration -->
	<div class="absolute inset-0 pointer-events-none">
		<div
			class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
		></div>
		<div
			class="absolute -top-24 -right-24 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-50"
		></div>
		<div
			class="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50"
		></div>
	</div>

	<div class="relative z-10 container mx-auto px-6 md:px-12 max-w-6xl">
		<!-- MAIN CONTENT SECTION: Mission & CTA -->
		<div class="mx-auto max-w-3xl text-center">
			<!-- Badge -->
			<div
				class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-8 animate-fade-in-up"
			>
				<span class="text-base">💝</span> Support Our Mission
			</div>

			<!-- Main Heading -->
			<h2
				class="mb-6 font-clash-grotesk text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
			>
				<span class="text-gray-900">Amplify</span>
				<span class="text-accent">African Voices</span>
			</h2>

			<!-- Description -->
			<p
				class="mx-auto mb-10 text-lg md:text-xl leading-relaxed text-gray-600"
			>
				Your contribution helps us continue telling authentic African
				stories and amplifying voices across the continent. Join us in
				preserving our rich cultural heritage through in-depth
				reporting.
			</p>

			<!-- CTA Buttons -->
			<div
				class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
			>
				<button
					on:click={navigateToDonate}
					class="w-full sm:w-auto relative overflow-hidden rounded-xl bg-accent px-10 py-5 text-lg font-bold text-white shadow-lg shadow-orange-200/50 transition-all duration-300 hover:brightness-105 hover:scale-[1.02] hover:shadow-xl active:scale-95"
				>
					<span
						class="relative z-10 flex items-center justify-center gap-3"
					>
						Donate Now <span class="text-xl">❤️</span>
					</span>
				</button>

				<button
					on:click={navigateToAbout}
					class="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl border-2 border-orange-100 bg-white px-10 py-5 text-lg font-semibold text-accent transition-all duration-300 hover:border-accent/30 hover:bg-orange-50"
				>
					Learn More <span class="text-xl">→</span>
				</button>
			</div>

			<!-- Trust Indicators -->
			<div class="mb-20">
				<div
					class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70"
				>
					<div
						class="flex items-center gap-2 text-sm font-medium text-gray-500"
					>
						<svg
							class="w-4 h-4 text-green-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							></path></svg
						>
						SSL Secured
					</div>
					<div
						class="flex items-center gap-2 text-sm font-medium text-gray-500"
					>
						<svg
							class="w-4 h-4 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							></path></svg
						>
						Instant Receipt
					</div>
					<div
						class="flex items-center gap-2 text-sm font-medium text-gray-500"
					>
						<svg
							class="w-4 h-4 text-purple-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path></svg
						>
						Tax Deductible
					</div>
					<div
						class="flex items-center gap-2 text-sm font-medium text-gray-500"
					>
						<svg
							class="w-4 h-4 text-orange-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path></svg
						>
						Global Impact
					</div>
				</div>
			</div>
		</div>

		<!-- IMPACT STATS - Auto-scrolling horizontal on mobile, Grid on desktop -->
		<div class="w-full overflow-hidden md:overflow-visible">
			<!-- Mobile: Horizontal Auto-scroll (Compact Size) -->
			<div class="md:hidden relative">
				<div class="stats-scroll-container">
					<!-- Triple stats for seamless infinite scroll -->
					{#each [...stats, ...stats, ...stats] as stat}
						<div
							class="stat-card flex-shrink-0 w-[240px] group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm"
						>
							<div
								class="text-2xl font-bold text-gray-900 mb-1.5 font-clash-grotesk tracking-tight"
							>
								{stat.number}
							</div>
							<div
								class="text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								{stat.label}
							</div>
							<!-- Subtle gradient -->
							<div
								class="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/30 pointer-events-none"
							></div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Desktop: Grid Layout -->
			<div
				class="hidden md:grid grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto"
			>
				{#each stats as stat}
					<div
						class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-orange-100"
					>
						<div
							class="text-3xl md:text-4xl font-bold text-gray-900 mb-1.5 font-clash-grotesk tracking-tight"
						>
							{stat.number}
						</div>
						<div
							class="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider"
						>
							{stat.label}
						</div>
						<!-- Subtle hover gradient -->
						<div
							class="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
						></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* Clean Animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fadeInUp 0.6s ease-out forwards;
	}

	/* Infinite Horizontal Scroll for Stats */
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(
				calc(-240px * 3 - 0.75rem * 3)
			); /* Move exactly 3 cards (240px each) + 3 gaps (0.75rem each) */
		}
	}

	.stats-scroll-container {
		display: flex;
		gap: 0.75rem;
		animation: scroll 8s linear infinite;
		will-change: transform;
	}

	/* Pause on hover */
	.stats-scroll-container:hover {
		animation-play-state: paused;
	}
</style>
