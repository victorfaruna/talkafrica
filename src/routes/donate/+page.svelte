<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let selectedAmount = 0;
	let customAmount = '';
	let selectedMethod = 'paypal';
	let showCustomAmount = false;
	let isProcessing = false;
	let donorName = '';
	let donorEmail = '';

	const donationAmounts = [10, 25, 50, 100, 250, 500];
	const donationMethods = [
		{ id: 'paypal', name: 'PayPal', icon: '💳', description: 'Quick and secure' },
		{ id: 'stripe', name: 'Credit Card', icon: '💳', description: 'Visa, Mastercard, Amex' },
		{ id: 'bank', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank transfer' },
		{ id: 'crypto', name: 'Cryptocurrency', icon: '₿', description: 'Bitcoin, Ethereum' }
	];

	function selectAmount(amount: number) {
		selectedAmount = amount;
		showCustomAmount = false;
		customAmount = '';
	}

	function selectCustomAmount() {
		showCustomAmount = true;
		selectedAmount = 0;
	}

	function handleCustomAmountChange() {
		const amount = parseFloat(customAmount);
		if (!isNaN(amount) && amount > 0) {
			selectedAmount = amount;
		}
	}

	async function processDonation() {
		if (selectedAmount <= 0) return;

		isProcessing = true;

		// Simulate processing delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Here you would integrate with actual payment processors
		console.log(`Processing ${selectedAmount} donation via ${selectedMethod}`);

		// Reset form
		selectedAmount = 0;
		customAmount = '';
		showCustomAmount = false;
		donorName = '';
		donorEmail = '';
		isProcessing = false;

		alert('Thank you for your donation! (This is a demo)');
	}

	onMount(() => {
		// Initialize with first amount
		selectedAmount = donationAmounts[0];
	});
</script>

<svelte:head>
	<title>Donate to TalkAfrica - Support African Innovation</title>
	<meta
		name="description"
		content="Support TalkAfrica's mission to amplify African voices and connect entrepreneurs across the continent."
	/>
</svelte:head>

<div class="app-container flex flex-col gap-[3rem] [--side-p:8rem]">
	<Header />

	<!-- Hero Section -->
	<section
		class="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 py-20"
	>
		<!-- Background Pattern -->
		<div class="absolute inset-0 opacity-5">
			<div
				class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"
			></div>
		</div>

		<div class="relative z-10 container mx-auto px-[var(--side-p)]">
			<div class="mx-auto max-w-4xl text-center">
				<h1 class="mb-6 font-clash-grotesk text-4xl font-bold text-primary md:text-6xl">
					<span class="block">Make a</span>
					<span
						class="block bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent"
					>
						Difference
					</span>
				</h1>
				<p class="mx-auto max-w-2xl text-xl leading-relaxed text-primary/80">
					Your donation helps us continue providing quality content, supporting African
					entrepreneurs, and building a vibrant community that connects innovators across the
					continent.
				</p>
			</div>
		</div>
	</section>

	<!-- Donation Form -->
	<section class="bg-gradient-to-br from-secondary/5 to-accent/10 py-20">
		<div class="container mx-auto px-[var(--side-p)]">
			<div class="mx-auto max-w-4xl">
				<!-- Donation Amount Selection -->
				<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
					<h3 class="mb-6 text-center font-clash-grotesk text-2xl font-semibold text-secondary">
						Choose Your Donation Amount
					</h3>

					<!-- Quick Amount Buttons -->
					<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
						{#each donationAmounts as amount}
							<button
								on:click={() => selectAmount(amount)}
								class="rounded-xl border-2 p-4 transition-all duration-200 {selectedAmount ===
								amount
									? 'border-accent bg-accent/10 font-semibold text-accent'
									: 'border-gray-200 hover:border-accent/50 hover:bg-accent/5'}"
							>
								<span class="text-2xl font-bold">${amount}</span>
							</button>
						{/each}

						<!-- Custom Amount Button -->
						<button
							on:click={selectCustomAmount}
							class="rounded-xl border-2 p-4 transition-all duration-200 {showCustomAmount
								? 'border-accent bg-accent/10 font-semibold text-accent'
								: 'border-gray-200 hover:border-accent/50 hover:bg-accent/5'}"
						>
							<span class="text-lg font-semibold">Custom</span>
						</button>
					</div>

					<!-- Custom Amount Input -->
					{#if showCustomAmount}
						<div class="mb-6">
							<label for="customAmount" class="mb-2 block text-sm font-medium text-secondary">
								Enter Custom Amount
							</label>
							<div class="relative">
								<span class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
									>$</span
								>
								<input
									id="customAmount"
									type="number"
									bind:value={customAmount}
									on:input={handleCustomAmountChange}
									placeholder="0.00"
									min="1"
									step="0.01"
									class="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-8 transition-colors focus:border-accent focus:outline-none"
								/>
							</div>
						</div>
					{/if}

					<!-- Selected Amount Display -->
					{#if selectedAmount > 0}
						<div class="rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
							<p class="mb-2 text-lg text-secondary">Your Donation</p>
							<p class="text-4xl font-bold text-accent">${selectedAmount}</p>
						</div>
					{/if}
				</div>

				<!-- Donor Information -->
				<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
					<h3 class="mb-6 text-center font-clash-grotesk text-2xl font-semibold text-secondary">
						Your Information
					</h3>

					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label for="donorName" class="mb-2 block text-sm font-medium text-secondary">
								Full Name
							</label>
							<input
								id="donorName"
								type="text"
								bind:value={donorName}
								placeholder="Enter your full name"
								class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-accent focus:outline-none"
							/>
						</div>
						<div>
							<label for="donorEmail" class="mb-2 block text-sm font-medium text-secondary">
								Email Address
							</label>
							<input
								id="donorEmail"
								type="email"
								bind:value={donorEmail}
								placeholder="Enter your email"
								class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-colors focus:border-accent focus:outline-none"
							/>
						</div>
					</div>
				</div>

				<!-- Payment Method Selection -->
				<div class="mb-8 rounded-2xl bg-white p-8 shadow-lg">
					<h3 class="mb-6 text-center font-clash-grotesk text-2xl font-semibold text-secondary">
						Choose Payment Method
					</h3>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each donationMethods as method}
							<label class="cursor-pointer">
								<input type="radio" bind:group={selectedMethod} value={method.id} class="sr-only" />
								<div
									class="rounded-xl border-2 p-6 transition-all duration-200 {selectedMethod ===
									method.id
										? 'border-accent bg-accent/10'
										: 'border-gray-200 hover:border-accent/50 hover:bg-accent/5'}"
								>
									<div class="flex items-center space-x-4">
										<span class="text-3xl">{method.icon}</span>
										<div>
											<h4 class="text-lg font-semibold text-secondary">{method.name}</h4>
											<p class="text-sm text-tertiary">{method.description}</p>
										</div>
									</div>
								</div>
							</label>
						{/each}
					</div>
				</div>

				<!-- Donation Button -->
				<div class="text-center">
					<button
						on:click={processDonation}
						disabled={selectedAmount <= 0 || isProcessing}
						class="transform rounded-xl bg-accent px-12 py-4 text-lg font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:scale-100"
					>
						{#if isProcessing}
							<span class="flex items-center justify-center space-x-2">
								<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
										fill="none"
									/>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								<span>Processing...</span>
							</span>
						{:else}
							Donate ${selectedAmount}
						{/if}
					</button>
				</div>

				<!-- Trust Indicators -->
				<div class="mt-12 text-center">
					<div class="grid grid-cols-1 gap-8 text-sm text-tertiary md:grid-cols-3">
						<div class="flex flex-col items-center">
							<div
								class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10"
							>
								<span class="text-xl">🔒</span>
							</div>
							<h4 class="mb-2 font-semibold text-secondary">Secure Payment</h4>
							<p>All transactions are encrypted and secure</p>
						</div>
						<div class="flex flex-col items-center">
							<div
								class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10"
							>
								<span class="text-xl">📧</span>
							</div>
							<h4 class="mb-2 font-semibold text-secondary">Receipt</h4>
							<p>Get an instant receipt via email</p>
						</div>
						<div class="flex flex-col items-center">
							<div
								class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10"
							>
								<span class="text-xl">💝</span>
							</div>
							<h4 class="mb-2 font-semibold text-secondary">Tax Deductible</h4>
							<p>Your donation may be tax deductible</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<Footer />
</div>
