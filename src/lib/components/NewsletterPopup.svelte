<script>
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";

    let showPopup = false;
    let email = "";
    let isSubmitting = false;
    let isSuccess = false;

    const STORAGE_KEY = "newsletter_popup_dismissed";
    const DAYS_TO_HIDE = 7;

    onMount(() => {
        if (!browser) return;

        // Don't show popup on admin pages
        if ($page.url.pathname.startsWith("/admin")) {
            return;
        }

        // Check if popup was already dismissed
        const dismissedDate = localStorage.getItem(STORAGE_KEY);
        if (dismissedDate) {
            const daysSinceDismissed =
                (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < DAYS_TO_HIDE) {
                return; // Don't show popup
            }
        }

        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            showPopup = true;
        }, 5000);

        return () => clearTimeout(timer);
    });

    function closePopup() {
        showPopup = false;
        if (browser) {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closePopup();
        }
    }

    async function handleSubmit() {
        if (!email || isSubmitting) return;

        isSubmitting = true;

        try {
            // TODO: Replace with your actual newsletter API endpoint
            // const response = await fetch('/api/newsletter/subscribe', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            isSuccess = true;
            setTimeout(() => {
                closePopup();
            }, 2000);
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            alert("Failed to subscribe. Please try again.");
        } finally {
            isSubmitting = false;
        }
    }
</script>

{#if showPopup}
    <div
        class="newsletter-backdrop"
        on:click={handleBackdropClick}
        on:keydown={(e) => e.key === "Escape" && closePopup()}
        role="button"
        tabindex="0"
    >
        <div class="newsletter-popup">
            <!-- Close Button -->
            <button
                class="close-button"
                on:click={closePopup}
                aria-label="Close popup"
            >
                <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {#if !isSuccess}
                <!-- Icon/Illustration -->
                <div class="icon-container">
                    <svg
                        class="w-16 h-16 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <!-- Heading -->
                <h2 class="popup-title">Stay Connected with Africa</h2>

                <!-- Description -->
                <p class="popup-description">
                    Get the latest African stories, culture, and insights
                    delivered straight to your inbox.
                </p>

                <!-- Benefits List -->
                <ul class="benefits-list">
                    <li>
                        <svg
                            class="w-5 h-5 text-accent"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        Weekly curated African content
                    </li>
                    <li>
                        <svg
                            class="w-5 h-5 text-accent"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        Exclusive stories & interviews
                    </li>
                    <li>
                        <svg
                            class="w-5 h-5 text-accent"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        No spam, unsubscribe anytime
                    </li>
                </ul>

                <!-- Email Form -->
                <form
                    on:submit|preventDefault={handleSubmit}
                    class="newsletter-form"
                >
                    <input
                        type="email"
                        bind:value={email}
                        placeholder="Enter your email address"
                        required
                        class="email-input"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        class="submit-button"
                        disabled={isSubmitting}
                    >
                        {#if isSubmitting}
                            <svg
                                class="animate-spin h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                />
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        {:else}
                            Subscribe
                        {/if}
                    </button>
                </form>
            {:else}
                <!-- Success State -->
                <div class="success-container">
                    <svg
                        class="w-20 h-20 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 class="success-title">Successfully Subscribed!</h2>
                    <p class="success-message">
                        Thank you for joining our community. Check your inbox
                        for a confirmation email.
                    </p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .newsletter-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1rem;
        animation: fadeIn 0.3s ease-out;
    }

    .newsletter-popup {
        position: relative;
        background: white;
        border-radius: 24px;
        padding: 2.5rem;
        max-width: 480px;
        width: 100%;
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(247, 148, 29, 0.1);
        animation: slideUp 0.4s ease-out;
    }

    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.05);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-secondary);
        transition: all 0.2s;
    }

    .close-button:hover {
        background: rgba(247, 148, 29, 0.1);
        color: var(--color-accent);
        transform: scale(1.1);
    }

    .icon-container {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
    }

    .popup-title {
        font-family: var(--font-clash-grotesk);
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-secondary);
        text-align: center;
        margin-bottom: 0.75rem;
        line-height: 1.2;
    }

    .popup-description {
        text-align: center;
        color: var(--color-secondary);
        opacity: 0.8;
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 1.5rem;
    }

    .benefits-list {
        list-style: none;
        padding: 0;
        margin: 0 0 2rem 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .benefits-list li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        color: var(--color-secondary);
    }

    .newsletter-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .email-input {
        width: 100%;
        padding: 0.875rem 1.125rem;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        font-size: 0.95rem;
        transition: all 0.2s;
        outline: none;
    }

    .email-input:focus {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px rgba(247, 148, 29, 0.1);
    }

    .email-input:disabled {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: not-allowed;
    }

    .submit-button {
        width: 100%;
        padding: 0.875rem 1.5rem;
        background: linear-gradient(
            135deg,
            var(--color-accent) 0%,
            #e68a1e 100%
        );
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .submit-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(247, 148, 29, 0.3);
    }

    .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .success-container {
        text-align: center;
        padding: 2rem 0;
    }

    .success-container svg {
        margin: 0 auto 1.5rem;
    }

    .success-title {
        font-family: var(--font-clash-grotesk);
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-secondary);
        margin-bottom: 0.75rem;
    }

    .success-message {
        color: var(--color-secondary);
        opacity: 0.8;
        font-size: 0.95rem;
        line-height: 1.6;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    /* Mobile Responsive */
    @media (max-width: 640px) {
        .newsletter-popup {
            padding: 2rem 1.5rem;
            border-radius: 20px;
        }

        .popup-title {
            font-size: 1.5rem;
        }

        .popup-description {
            font-size: 0.9rem;
        }

        .benefits-list li {
            font-size: 0.85rem;
        }
    }
</style>
