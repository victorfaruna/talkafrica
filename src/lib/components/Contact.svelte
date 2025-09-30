<script>
	let email = '';
	let isSubmitting = false;

	async function handleSubscribe() {
		if (!email.trim()) return;

		isSubmitting = true;
		try {
			// TODO: Implement actual newsletter subscription logic
			console.log('Subscribing email:', email);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert('Thank you for subscribing!');
			email = '';
		} catch (error) {
			console.error('Subscription error:', error);
			alert('Something went wrong. Please try again.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex w-screen items-center justify-center px-4 py-20 text-center">
	<!-- Newsletter Subscription Container -->
	<div class="mx-auto max-h-[95%] rounded-[2rem] bg-secondary/90 p-8 text-center md:p-20">
		<img src="/images/eee.webp" alt="newsletter" class="mx-auto w-[150px]" />
		<!-- Headline -->
		<div class="mb-8">
			<p class="font-clash-grotesk text-[2rem] lg:text-[3rem] font-semibold text-primary leading-none">
				Subscribe to our newsletter
			</p>
			<h2 class="mb-2 text-[0.5rem] text-primary/80 md:text-[1rem]">
				Get the news in front line by subscribing to our newsletter
			</h2>
			<!-- <p class="text-lg text-white md:text-xl">✍️ our latest updates</p> -->
		</div>

		<!-- Email Input and Subscribe Button -->
		<form
			on:submit|preventDefault={handleSubscribe}
			class="mx-auto flex max-w-md flex-col gap-4 sm:flex-row"
		>
			<input
				type="email"
				bind:value={email}
				placeholder="Enter your email...."
				required
				class="flex-1 rounded-lg border border-primary/50 px-4 py-3 text-primary/90 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
				disabled={isSubmitting}
			/>
			<button
				type="submit"
				disabled={isSubmitting || !email.trim()}
				class="rounded-lg bg-red-600 px-6 py-3 font-medium tracking-wide whitespace-nowrap text-white uppercase transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-500"
			>
				{isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
			</button>
		</form>
	</div>
</div>

<style>
	/* Custom styles for better visual hierarchy */
	.font-clash-grotesk {
		font-family: var(--font-clash-grotesk);
	}
</style>
