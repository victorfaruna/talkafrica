<script lang="ts">
	import { onMount } from 'svelte';

	let isVisible = false;
	let email = '';
	let isSubmitting = false;

	// Show modal after a delay (e.g., 3 seconds)
	onMount(() => {
		const timer = setTimeout(() => {
			isVisible = true;
		}, 3000);

		return () => clearTimeout(timer);
	});

	function closeModal() {
		isVisible = false;
	}

	async function handleSubmit() {
		if (!email.trim()) return;

		isSubmitting = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Reset form and close modal
		email = '';
		isSubmitting = false;
		isVisible = false;

		// You can add actual newsletter subscription logic here
		console.log('Newsletter subscription:', email);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isVisible}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50 backdrop-blur-sm"
		on:click={closeModal}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && closeModal()}
		aria-label="Close modal"
	>
		<!-- Modal Content -->
		<div
			class="relative mx-4 w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 text-white/70 transition-colors hover:text-white"
				on:click={closeModal}
				aria-label="Close modal"
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Content -->
			<div class="text-center text-white">
				<!-- Headline -->
				<h2 id="modal-title" class="mb-2 text-xl leading-tight font-semibold">
					Get the news in front line by subscribe
				</h2>
				<p class="mb-6 text-sm text-gray-300">✍️ our latest updates</p>

				<!-- Form -->
				<form on:submit|preventDefault={handleSubmit} class="flex gap-2">
					<input
						type="email"
						bind:value={email}
						placeholder="Enter your email...."
						class="flex-1 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"
						required
						disabled={isSubmitting}
					/>
					<button
						type="submit"
						class="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white uppercase transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isSubmitting || !email.trim()}
					>
						{isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
