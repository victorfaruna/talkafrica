<script lang="ts">
    import { browser } from "$app/environment";
    import { onDestroy, onMount } from "svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    const paystackPublicKey = import.meta.env.PUBLIC_PAYSTACK_PUBLIC_KEY || "";
    const bankAccountName =
        import.meta.env.PUBLIC_DONATION_BANK_ACCOUNT_NAME || "";
    const bankAccountNumber =
        import.meta.env.PUBLIC_DONATION_BANK_ACCOUNT_NUMBER || "";
    const bankName = import.meta.env.PUBLIC_DONATION_BANK_NAME || "";
    const donationContactEmail =
        import.meta.env.PUBLIC_DONATION_CONTACT_EMAIL || "";
    const cryptoWalletAddress =
        import.meta.env.PUBLIC_CRYPTO_WALLET_ADDRESS || "";
    const cryptoNetwork = import.meta.env.PUBLIC_CRYPTO_NETWORK || "";
    const cryptoMemo = import.meta.env.PUBLIC_CRYPTO_MEMO || "";

    const donationAmounts = [5000, 10000, 25000, 50000, 100000];

    type DonationMethod = "paystack" | "bank" | "crypto";

    const donationMethods: {
        id: DonationMethod;
        name: string;
        icon: string;
        description: string;
    }[] = [
        {
            id: "paystack",
            name: "Paystack (Cards & Bank Transfer)",
            icon: "💳",
            description: "Donate securely in NGN with card or transfer",
        },
        {
            id: "bank",
            name: "Direct Bank Transfer",
            icon: "🏦",
            description: "Send directly from your Nigerian bank",
        },
        {
            id: "crypto",
            name: "Crypto (USDT/USDC)",
            icon: "₿",
            description: "Send digital assets to our wallet",
        },
    ];

    let selectedAmount = donationAmounts[0];
    let customAmount = "";
    let selectedMethod: DonationMethod = "paystack";
    let showCustomAmount = false;
    let isProcessing = false;
    let donorName = "";
    let donorEmail = "";
    let paystackLoaded = false;
    let copyFeedback: string | null = null;
    let copyTimeout: ReturnType<typeof setTimeout> | undefined;

    const formatter = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    });

    const formatAmount = (amount: number) =>
        formatter.format(Math.max(amount, 0));

    const bankDetailsAvailable = Boolean(
        bankAccountName && bankAccountNumber && bankName
    );
    const cryptoDetailsAvailable = Boolean(cryptoWalletAddress);

    $: displayAmount = selectedAmount > 0 ? selectedAmount : donationAmounts[0];
    $: donateButtonLabel =
        selectedMethod === "paystack"
            ? `Donate ${formatAmount(displayAmount)} via Paystack`
            : selectedMethod === "bank"
              ? "I've completed a bank transfer"
              : "I've sent a crypto donation";
    $: isDonationDisabled =
        selectedAmount <= 0 ||
        isProcessing ||
        (selectedMethod === "paystack" && (!paystackPublicKey || !donorEmail));

    function selectAmount(amount: number) {
        selectedAmount = amount;
        showCustomAmount = false;
        customAmount = "";
    }

    function selectCustomAmount() {
        showCustomAmount = true;
        selectedAmount = 0;
        customAmount = "";
    }

    function handleCustomAmountChange() {
        const amount = parseFloat(customAmount);
        selectedAmount = !isNaN(amount) && amount > 0 ? amount : 0;
    }

    function resetForm() {
        selectedAmount = donationAmounts[0];
        customAmount = "";
        showCustomAmount = false;
        donorName = "";
        donorEmail = "";
        selectedMethod = "paystack";
        isProcessing = false;
        copyFeedback = null;
        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }
    }

    async function ensurePaystackScript() {
        if (!browser) return;

        if (paystackLoaded || (window as any).PaystackPop) {
            paystackLoaded = true;
            return;
        }

        await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector<HTMLScriptElement>(
                'script[src="https://js.paystack.co/v1/inline.js"]'
            );

            if (existing) {
                existing.addEventListener("load", () => {
                    paystackLoaded = true;
                    resolve();
                });
                existing.addEventListener("error", () =>
                    reject(new Error("Failed to load Paystack inline script."))
                );
                return;
            }

            const script = document.createElement("script");
            script.src = "https://js.paystack.co/v1/inline.js";
            script.async = true;
            script.onload = () => {
                paystackLoaded = true;
                resolve();
            };
            script.onerror = () =>
                reject(new Error("Failed to load Paystack inline script."));
            document.body.appendChild(script);
        });
    }

    async function processDonation() {
        if (selectedAmount <= 0) {
            alert("Please choose a donation amount.");
            return;
        }

        if (selectedMethod === "paystack") {
            if (!paystackPublicKey) {
                alert(
                    "Paystack public key is not configured. Please add PUBLIC_PAYSTACK_PUBLIC_KEY to your environment."
                );
                return;
            }

            if (!donorEmail) {
                alert("Please enter your email address to continue.");
                return;
            }

            try {
                await ensurePaystackScript();
            } catch (error) {
                console.error(error);
                alert(
                    "We couldn't load Paystack. Please check your connection and try again."
                );
                return;
            }

            if (!browser || !(window as any).PaystackPop) {
                alert(
                    "Paystack is unavailable in this environment. Please try again on a supported browser."
                );
                return;
            }

            isProcessing = true;

            const handler = (window as any).PaystackPop.setup({
                key: paystackPublicKey,
                email: donorEmail,
                amount: Math.round(selectedAmount * 100),
                currency: "NGN",
                firstname: donorName || undefined,
                label: "TalkAfrica Donation",
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Donor Name",
                            variable_name: "donor_name",
                            value: donorName || "Anonymous",
                        },
                    ],
                },
                callback: (response: { reference: string }) => {
                    isProcessing = false;
                    alert(
                        `Thank you for your donation! Payment reference: ${response.reference}`
                    );
                    resetForm();
                },
                onClose: () => {
                    isProcessing = false;
                },
            });

            handler.openIframe();
            return;
        }

        if (selectedMethod === "bank") {
            alert(
                "Please complete your transfer using the bank details provided below. Thank you for your support!"
            );
            return;
        }

        if (selectedMethod === "crypto") {
            alert(
                "Please send your crypto donation to the wallet address provided below. Thank you for your support!"
            );
        }
    }

    async function copyToClipboard(value: string, successMessage: string) {
        if (!browser || !value) return;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
                copyFeedback = successMessage;
                if (copyTimeout) {
                    clearTimeout(copyTimeout);
                }
                copyTimeout = setTimeout(() => {
                    copyFeedback = null;
                }, 3000);
            }
        } catch (error) {
            console.error("Clipboard copy failed:", error);
        }
    }

    onMount(() => {
        if (browser) {
            ensurePaystackScript().catch((error) =>
                console.error("Paystack script error:", error)
            );
        }
    });

    onDestroy(() => {
        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }
    });
</script>

<svelte:head>
    <title>Donate to TalkAfrica - Support African Innovation</title>
    <meta
        name="description"
        content="Support TalkAfrica's mission to amplify African voices and connect entrepreneurs across the continent."
    />
</svelte:head>

<div
    class="app-container flex flex-col gap-[3rem] [--side-p:1rem] sm:[--side-p:2rem] md:[--side-p:4rem] lg:[--side-p:8rem]"
>
    <Header />

    <!-- Hero Section -->
    <section
        class="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 py-12 sm:py-16 md:py-20"
    >
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
            <div
                class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"
            ></div>
        </div>

        <div class="relative z-10 container mx-auto px-[var(--side-p)]">
            <div class="mx-auto max-w-4xl text-center">
                <h1
                    class="mb-4 sm:mb-6 font-clash-grotesk text-3xl font-bold text-primary sm:text-4xl md:text-6xl"
                >
                    <span class="block">Make a</span>
                    <span
                        class="block bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent"
                    >
                        Difference
                    </span>
                </h1>
                <p
                    class="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-primary/80 px-4 sm:px-0"
                >
                    Your donation helps us continue providing quality content,
                    supporting African entrepreneurs, and building a vibrant
                    community that connects innovators across the continent.
                </p>
            </div>
        </div>
    </section>

    <!-- Donation Form -->
    <section
        class="bg-gradient-to-br from-secondary/5 to-accent/10 py-12 sm:py-16 md:py-20"
    >
        <div class="container mx-auto px-[var(--side-p)]">
            <div class="mx-auto max-w-4xl">
                <!-- Donation Amount Selection -->
                <div
                    class="mb-6 sm:mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg"
                >
                    <h3
                        class="mb-4 sm:mb-6 text-center font-clash-grotesk text-xl sm:text-2xl font-semibold text-secondary"
                    >
                        Choose Your Donation Amount
                    </h3>

                    <!-- Quick Amount Buttons -->
                    <div
                        class="mb-4 sm:mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3"
                    >
                        {#each donationAmounts as amount}
                            <button
                                on:click={() => selectAmount(amount)}
                                class="rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 {selectedAmount ===
                                amount
                                    ? 'border-accent bg-accent/10 font-semibold text-accent'
                                    : 'border-gray-200 hover:border-accent/50 hover:bg-accent/5'}"
                            >
                                <span class="text-lg sm:text-2xl font-bold">
                                    {formatAmount(amount)}
                                </span>
                            </button>
                        {/each}

                        <!-- Custom Amount Button -->
                        <button
                            on:click={selectCustomAmount}
                            class="rounded-xl border-2 p-3 sm:p-4 transition-all duration-200 {showCustomAmount
                                ? 'border-accent bg-accent/10 font-semibold text-accent'
                                : 'border-gray-200 hover:border-accent/50 hover:bg-accent/5'}"
                        >
                            <span class="text-base sm:text-lg font-semibold"
                                >Custom</span
                            >
                        </button>
                    </div>

                    <!-- Custom Amount Input -->
                    {#if showCustomAmount}
                        <div class="mb-4 sm:mb-6">
                            <label
                                for="customAmount"
                                class="mb-2 block text-sm font-medium text-secondary"
                            >
                                Enter Custom Amount
                            </label>
                            <div class="relative">
                                <span
                                    class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500"
                                    >₦
                                </span>
                                <input
                                    id="customAmount"
                                    type="number"
                                    bind:value={customAmount}
                                    on:input={handleCustomAmountChange}
                                    placeholder="0.00"
                                    min="1"
                                    step="0.01"
                                    class="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-8 text-base transition-colors focus:border-accent focus:outline-none"
                                />
                            </div>
                        </div>
                    {/if}

                    <!-- Selected Amount Display -->
                    {#if selectedAmount > 0}
                        <div
                            class="rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-6 text-center"
                        >
                            <p class="mb-2 text-base sm:text-lg text-secondary">
                                Your Donation
                            </p>
                            <p
                                class="text-3xl sm:text-4xl font-bold text-accent"
                            >
                                {formatAmount(selectedAmount)}
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Donor Information -->
                <div
                    class="mb-6 sm:mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg"
                >
                    <h3
                        class="mb-4 sm:mb-6 text-center font-clash-grotesk text-xl sm:text-2xl font-semibold text-secondary"
                    >
                        Your Information
                    </h3>

                    <div class="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <div>
                            <label
                                for="donorName"
                                class="mb-2 block text-sm font-medium text-secondary"
                            >
                                Full Name
                            </label>
                            <input
                                id="donorName"
                                type="text"
                                bind:value={donorName}
                                placeholder="Enter your full name"
                                class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base transition-colors focus:border-accent focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                                for="donorEmail"
                                class="mb-2 block text-sm font-medium text-secondary"
                            >
                                Email Address
                            </label>
                            <input
                                id="donorEmail"
                                type="email"
                                bind:value={donorEmail}
                                placeholder="Enter your email"
                                class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base transition-colors focus:border-accent focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <!-- Payment Method Selection -->
                <div
                    class="mb-6 sm:mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg"
                >
                    <h3
                        class="mb-4 sm:mb-6 text-center font-clash-grotesk text-xl sm:text-2xl font-semibold text-secondary"
                    >
                        Choose Payment Method
                    </h3>

                    <div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                        {#each donationMethods as method}
                            <label class="cursor-pointer">
                                <input
                                    type="radio"
                                    bind:group={selectedMethod}
                                    value={method.id}
                                    class="sr-only"
                                />
                                <div
                                    class="rounded-xl border-2 p-4 sm:p-6 transition-all duration-200 {selectedMethod ===
                                    method.id
                                        ? 'border-accent bg-accent/10'
                                        : 'border-gray-200 hover:border-accent/50 hover:bg-accent/5'}"
                                >
                                    <div
                                        class="flex items-center space-x-3 sm:space-x-4"
                                    >
                                        <span class="text-2xl sm:text-3xl"
                                            >{method.icon}</span
                                        >
                                        <div>
                                            <h4
                                                class="text-base sm:text-lg font-semibold text-secondary"
                                            >
                                                {method.name}
                                            </h4>
                                            <p
                                                class="text-xs sm:text-sm text-tertiary"
                                            >
                                                {method.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Donation Method Guidance -->
                <div
                    class="mb-6 sm:mb-8 rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg"
                >
                    <h3
                        class="mb-4 sm:mb-6 text-center font-clash-grotesk text-xl sm:text-2xl font-semibold text-secondary"
                    >
                        Complete Your Donation
                    </h3>

                    {#if selectedMethod === "paystack"}
                        <div
                            class="space-y-3 text-sm text-secondary text-center sm:text-left"
                        >
                            <p>
                                We will open a secure Paystack checkout in NGN
                                when you click the donate button. You can pay
                                with any Nigerian debit card, bank transfer or
                                USSD.
                            </p>
                            <p>
                                Make sure the amount above looks right before
                                you continue. You will receive an instant
                                receipt after a successful payment.
                            </p>
                            {#if !paystackPublicKey}
                                <p class="text-sm text-red-600">
                                    Paystack public key is not configured.
                                    Please set <code
                                        >PUBLIC_PAYSTACK_PUBLIC_KEY</code
                                    > in your environment.
                                </p>
                            {/if}
                        </div>
                    {:else if selectedMethod === "bank"}
                        {#if bankDetailsAvailable}
                            <div class="space-y-4 text-sm text-secondary">
                                <div
                                    class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs uppercase tracking-wide text-gray-500"
                                        >
                                            Account Name
                                        </span>
                                        <span
                                            class="text-base font-semibold text-secondary"
                                        >
                                            {bankAccountName}
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs uppercase tracking-wide text-gray-500"
                                        >
                                            Bank Name
                                        </span>
                                        <span
                                            class="text-base font-semibold text-secondary"
                                        >
                                            {bankName}
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs uppercase tracking-wide text-gray-500"
                                        >
                                            Account Number
                                        </span>
                                        <span
                                            class="text-base font-semibold text-secondary"
                                        >
                                            {bankAccountNumber}
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs uppercase tracking-wide text-gray-500"
                                        >
                                            Suggested Amount
                                        </span>
                                        <span
                                            class="text-base font-semibold text-secondary"
                                        >
                                            {formatAmount(displayAmount)}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                                >
                                    <button
                                        type="button"
                                        class="inline-flex items-center justify-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                                        on:click={() =>
                                            copyToClipboard(
                                                bankAccountNumber,
                                                "Bank account number copied"
                                            )}
                                    >
                                        <svg
                                            class="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Copy account number
                                    </button>
                                    {#if donationContactEmail}
                                        <p class="text-xs text-gray-500">
                                            Please email your payment
                                            confirmation to
                                            <span
                                                class="font-medium text-secondary"
                                                >{donationContactEmail}</span
                                            > so we can acknowledge your support.
                                        </p>
                                    {/if}
                                </div>
                            </div>
                        {:else}
                            <p
                                class="text-sm text-red-600 text-center sm:text-left"
                            >
                                Bank transfer details are not configured. Set <code
                                    >PUBLIC_DONATION_BANK_ACCOUNT_NAME</code
                                >,
                                <code>PUBLIC_DONATION_BANK_ACCOUNT_NUMBER</code>
                                and <code>PUBLIC_DONATION_BANK_NAME</code> in your
                                environment variables.
                            </p>
                        {/if}
                    {:else if selectedMethod === "crypto"}
                        {#if cryptoDetailsAvailable}
                            <div class="space-y-4 text-sm text-secondary">
                                <div class="flex flex-col gap-3">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs uppercase tracking-wide text-gray-500"
                                        >
                                            Wallet Address
                                        </span>
                                        <code
                                            class="mt-1 block break-all rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700"
                                        >
                                            {cryptoWalletAddress}
                                        </code>
                                    </div>
                                    <div
                                        class="flex flex-wrap items-center gap-2"
                                    >
                                        <button
                                            type="button"
                                            class="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                                            on:click={() =>
                                                copyToClipboard(
                                                    cryptoWalletAddress,
                                                    "Wallet address copied"
                                                )}
                                        >
                                            <svg
                                                class="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Copy wallet address
                                        </button>
                                        {#if cryptoNetwork}
                                            <span
                                                class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                                            >
                                                Network: {cryptoNetwork}
                                            </span>
                                        {/if}
                                        {#if cryptoMemo}
                                            <span
                                                class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                                            >
                                                Memo / Tag: {cryptoMemo}
                                            </span>
                                        {/if}
                                    </div>
                                    <p>
                                        Please double-check the network and
                                        address before sending. Transactions
                                        cannot be reversed.
                                    </p>
                                    {#if donationContactEmail}
                                        <p class="text-xs text-gray-500">
                                            Email your transaction hash to
                                            <span
                                                class="font-medium text-secondary"
                                                >{donationContactEmail}</span
                                            > so we can confirm receipt.
                                        </p>
                                    {/if}
                                </div>
                            </div>
                        {:else}
                            <p
                                class="text-sm text-red-600 text-center sm:text-left"
                            >
                                Crypto wallet details are not configured. Set <code
                                    >PUBLIC_CRYPTO_WALLET_ADDRESS</code
                                > (and optional network or memo variables) in your
                                environment.
                            </p>
                        {/if}
                    {/if}

                    {#if copyFeedback}
                        <p
                            class="mt-3 text-center text-xs font-medium text-accent sm:text-left"
                        >
                            {copyFeedback}
                        </p>
                    {/if}
                </div>

                <!-- Donation Button -->
                <div class="text-center">
                    <button
                        on:click={processDonation}
                        disabled={isDonationDisabled}
                        class="transform rounded-xl bg-accent px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:scale-100 w-full sm:w-auto"
                    >
                        {#if isProcessing}
                            <span
                                class="flex items-center justify-center space-x-2"
                            >
                                <svg
                                    class="h-5 w-5 animate-spin"
                                    viewBox="0 0 24 24"
                                >
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
                            {donateButtonLabel}
                        {/if}
                    </button>
                    {#if selectedMethod === "paystack" && !donorEmail}
                        <p class="mt-2 text-xs text-gray-500">
                            Enter your email address to enable Paystack
                            checkout.
                        </p>
                    {/if}
                </div>

                <!-- Trust Indicators -->
                <div class="mt-8 sm:mt-12 text-center">
                    <div
                        class="grid grid-cols-1 gap-6 sm:gap-8 text-sm text-tertiary md:grid-cols-3"
                    >
                        <div class="flex flex-col items-center">
                            <div
                                class="mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-accent/10"
                            >
                                <span class="text-lg sm:text-xl">🔒</span>
                            </div>
                            <h4
                                class="mb-1 sm:mb-2 text-sm sm:text-base font-semibold text-secondary"
                            >
                                Secure Payment
                            </h4>
                            <p class="text-xs sm:text-sm">
                                All transactions are encrypted and secure
                            </p>
                        </div>
                        <div class="flex flex-col items-center">
                            <div
                                class="mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-accent/10"
                            >
                                <span class="text-lg sm:text-xl">📧</span>
                            </div>
                            <h4
                                class="mb-1 sm:mb-2 text-sm sm:text-base font-semibold text-secondary"
                            >
                                Receipt
                            </h4>
                            <p class="text-xs sm:text-sm">
                                Get an instant receipt via email
                            </p>
                        </div>
                        <div class="flex flex-col items-center">
                            <div
                                class="mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-accent/10"
                            >
                                <span class="text-lg sm:text-xl">💝</span>
                            </div>
                            <h4
                                class="mb-1 sm:mb-2 text-sm sm:text-base font-semibold text-secondary"
                            >
                                Tax Deductible
                            </h4>
                            <p class="text-xs sm:text-sm">
                                Your donation may be tax deductible
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <Footer />
</div>
