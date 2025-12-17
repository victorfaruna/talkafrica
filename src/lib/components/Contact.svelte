<script>
	let email = "";
	let isSubmitting = false;

	async function handleSubscribe() {
		if (!email.trim()) return;

		isSubmitting = true;
		try {
			// TODO: Implement actual newsletter subscription logic
			console.log("Subscribing email:", email);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Thank you for subscribing!");
			email = "";
		} catch (error) {
			console.error("Subscription error:", error);
			alert("Something went wrong. Please try again.");
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div
	class="flex w-full items-center justify-center px-4 py-20 bg-transparent overflow-hidden"
>
	<!-- Newsletter Subscription Container -->
	<div
		class="relative w-full max-w-[1000px] rounded-[3rem] bg-[#0A0A0A] px-6 py-16 md:px-12 md:py-20 text-center ring-1 ring-white/10 isolate overflow-hidden shadow-2xl"
	>
		<!-- Decorative Background Gradients -->
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"
		></div>

		<!-- Icon -->
		<div class="mb-10 relative inline-block">
			<img
				src="/images/eee.webp"
				alt="Newsletter"
				class="mx-auto w-32 md:w-40 drop-shadow-2xl animate-float"
			/>
			<div
				class="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 rounded-full"
			></div>
		</div>

		<!-- Headline -->
		<div class="mb-12 space-y-4">
			<h2
				class="font-clash-grotesk text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
			>
				Subscribe to our newsletter
			</h2>
			<p
				class="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
			>
				Get the latest news and updates delivered straight to your
				inbox. Join our community of readers today.
			</p>
		</div>

		<!-- Email Input and Subscribe Button -->
		<form
			on:submit|preventDefault={handleSubscribe}
			class="mx-auto flex w-full max-w-2xl flex-col md:flex-row relative z-10 shadow-xl rounded-2xl md:rounded-xl overflow-hidden"
		>
			<div class="relative flex-1 group">
				<div
					class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6 text-zinc-500 group-focus-within:text-white transition-colors duration-300"
					>
						<path
							d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
						/>
						<path
							d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
						/>
					</svg>
				</div>
				<input
					type="email"
					bind:value={email}
					placeholder="Enter your email address..."
					required
					class="w-full bg-white/5 border-none py-5 pl-16 pr-6 text-white text-lg placeholder-zinc-500 focus:bg-white/10 outline-none transition-all duration-300 h-[72px]"
					disabled={isSubmitting}
				/>
			</div>
			<button
				type="submit"
				disabled={isSubmitting || !email.trim()}
				class="w-full md:w-auto bg-accent text-white px-10 py-5 font-bold text-lg tracking-wide whitespace-nowrap hover:bg-orange-600 transition-all duration-300 disabled:cursor-not-allowed h-[72px]"
			>
				{isSubmitting ? "Subscribing..." : "Subscribe Now"}
			</button>
		</form>

		<!-- Trust Text -->
		<div
			class="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-4 h-4"
			>
				<path
					fill-rule="evenodd"
					d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>No spam. Unsubscribe anytime.</span>
		</div>
	</div>
</div>

<style>
	.font-clash-grotesk {
		font-family: var(--font-clash-grotesk);
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
	.animate-float {
		animation: float 6s ease-in-out infinite;
	}
</style>
