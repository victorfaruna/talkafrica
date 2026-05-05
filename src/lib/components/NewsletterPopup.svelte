<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { getOptimizedImageUrl } from "$lib/utils/image";

    let showPopup = false;
    let email = "";
    let isSubmitting = false;
    let isSuccess = false;
    let cardsVisible = false;
    let formVisible = false;

    // Gallery state
    let galleryItems: any[] = [];
    let galleryContainer: HTMLDivElement;
    let galleryFrame: number;
    let galleryPaused = false;

    async function fetchGallery() {
        try {
            const res = await fetch("/api/our-impact");
            if (res.ok) {
                const data = await res.json();
                galleryItems = Array.isArray(data) ? data : [];
            }
        } catch (e) {
            // fail silently — gallery is decorative
        }
    }

    function startGalleryScroll() {
        if (!browser || !galleryContainer) return;
        const speed = 1.2;
        const tick = () => {
            if (!galleryPaused && galleryContainer) {
                galleryContainer.scrollLeft += speed;
                const half = galleryContainer.scrollWidth / 2;
                if (galleryContainer.scrollLeft >= half) {
                    galleryContainer.scrollLeft = 0;
                }
            }
            galleryFrame = requestAnimationFrame(tick);
        };
        galleryFrame = requestAnimationFrame(tick);
    }

    const STORAGE_KEY = "newsletter_popup_dismissed";
    const DAYS_TO_HIDE = 7;

    const impactCards = [
        {
            badge: "REACH",
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" stroke="#FDB022" stroke-width="2.5"/><path d="M4 24h40M24 4C18 10 14 16.5 14 24s4 14 10 20M24 4C30 10 34 16.5 34 24s-4 14-10 20" stroke="#FDB022" stroke-width="2" stroke-linecap="round"/></svg>`,
            stat: "500K",
            text: "Total outreach",
        },
        {
            badge: "COMMUNITY",
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="18" r="7" stroke="#FDB022" stroke-width="2.5"/><path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#FDB022" stroke-width="2.5" stroke-linecap="round"/><circle cx="10" cy="20" r="4.5" stroke="#FDB022" stroke-width="2"/><circle cx="38" cy="20" r="4.5" stroke="#FDB022" stroke-width="2"/></svg>`,
            stat: "5",
            text: "Countries connected",
        },
        {
            badge: "IMPACT",
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 6L28.5 16.5H40L30.5 23L34.5 34L24 27.5L13.5 34L17.5 23L8 16.5H19.5L24 6Z" stroke="#FDB022" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
            stat: "30K",
            text: "Total views",
        },
        {
            badge: "LEGACY",
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="12" width="32" height="26" rx="3" stroke="#FDB022" stroke-width="2.5"/><path d="M16 12V10a8 8 0 0116 0v2" stroke="#FDB022" stroke-width="2.5" stroke-linecap="round"/><path d="M24 22v8M20 26h8" stroke="#FDB022" stroke-width="2.5" stroke-linecap="round"/></svg>`,
            stat: "5+",
            text: "Years preserving African narratives",
        },
    ];

    onMount(() => {
        if (!browser) return;

        // Don't show popup on admin pages
        if ($page.url.pathname.startsWith("/admin")) {
            return;
        }

        // Prefetch gallery images immediately
        fetchGallery();

        // Check if popup was already dismissed
        const dismissedDate = localStorage.getItem(STORAGE_KEY);
        if (dismissedDate) {
            const daysSinceDismissed =
                (Date.now() - parseInt(dismissedDate)) / (1000 * 60 * 60 * 24);
            if (daysSinceDismissed < DAYS_TO_HIDE) {
                return;
            }
        }

        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            showPopup = true;
            // Stagger in the cards then form
            setTimeout(() => (cardsVisible = true), 200);
            setTimeout(() => (formVisible = true), 700);
            // Start gallery scroll once popup is visible
            setTimeout(() => startGalleryScroll(), 400);
        }, 5000);

        return () => clearTimeout(timer);
    });

    onDestroy(() => {
        if (galleryFrame) cancelAnimationFrame(galleryFrame);
    });

    function closePopup() {
        showPopup = false;
        cardsVisible = false;
        formVisible = false;
        if (browser) {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }
    }

    function handleBackdropClick(event: any) {
        if (event.target === event.currentTarget) {
            closePopup();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") closePopup();
    }

    async function handleSubmit() {
        if (!email || isSubmitting) return;

        isSubmitting = true;

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to subscribe");
            }

            isSuccess = true;
            setTimeout(() => {
                closePopup();
            }, 2500);
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            alert("Failed to subscribe. Please try again.");
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showPopup}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="newsletter-backdrop"
        on:click={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
    >
        <div class="newsletter-popup" role="document">
            <!-- Close Button -->
            <button
                class="close-button"
                on:click={closePopup}
                aria-label="Close popup"
                id="popup-close-btn"
            >
                <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {#if !isSuccess}
                <!-- ===== IMPACT SHOWCASE SECTION ===== -->
                <section class="impact-showcase">
                    <div class="impact-header">
                        <span class="legacy-label">TalkAfrika's Legacy</span>
                        <h2 class="impact-title" id="popup-title">
                            Stories That Matter,<br />
                            <span class="highlight">Impact That Lasts</span>
                        </h2>
                        <p class="impact-desc">
                            Beyond headlines, we are building a legacy of
                            truth, reach, and community across the continent.
                        </p>
                    </div>

                    <!-- 4 Impact Cards -->
                    <div class="impact-cards" class:cards-visible={cardsVisible}>
                        {#each impactCards as card, i}
                            <div
                                class="impact-card"
                                style="transition-delay: {i * 100}ms"
                            >
                                <span class="impact-badge">{card.badge}</span>
                                <div class="card-icon">
                                    {@html card.icon}
                                </div>
                                <div class="card-stat">{card.stat}</div>
                                <p class="card-text">{card.text}</p>
                            </div>
                        {/each}
                    </div>
                </section>

                <!-- ===== IMAGE GALLERY STRIP ===== -->
                {#if galleryItems.length > 0}
                    <div
                        class="gallery-strip-wrap"
                        on:mouseenter={() => (galleryPaused = true)}
                        on:mouseleave={() => (galleryPaused = false)}
                        role="region"
                        aria-label="TalkAfrika impact image gallery"
                    >
                        <div
                            bind:this={galleryContainer}
                            class="gallery-strip"
                        >
                            <!-- duplicated for seamless loop -->
                            {#each [...galleryItems, ...galleryItems] as item}
                                <div class="gallery-item">
                                    <img
                                        src={getOptimizedImageUrl(item.image_url || item.image, { width: 320, height: 220, fit: 'fill' })}
                                        alt={item.caption}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {#if item.tag}
                                        <span class="gallery-tag">{item.tag}</span>
                                    {/if}
                                    <div class="gallery-caption">{item.caption}</div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Divider -->
                <div class="section-divider">
                    <span class="divider-line"></span>
                    <span class="divider-line"></span>
                </div>

                <!-- ===== NEWSLETTER FORM SECTION ===== -->
                <section
                    class="newsletter-section"
                    class:form-visible={formVisible}
                >
                    <h3 class="popup-title">Stay Connected with Africa</h3>
                    <p class="popup-description">
                        Get these stories delivered to your inbox
                    </p>

                    <!-- Benefits -->
                    <ul class="benefits-list">
                        <li>
                            <span class="check-icon">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>
                            Weekly curated African content
                        </li>
                        <li>
                            <span class="check-icon">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>
                            Exclusive stories &amp; interviews
                        </li>
                        <li>
                            <span class="check-icon">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>
                            No spam, unsubscribe anytime
                        </li>
                    </ul>

                    <!-- Email Form -->
                    <form
                        on:submit|preventDefault={handleSubmit}
                        class="email-form"
                        id="newsletter-form"
                    >
                        <input
                            type="email"
                            bind:value={email}
                            placeholder="Enter your email address"
                            required
                            class="email-input"
                            disabled={isSubmitting}
                            id="newsletter-email-input"
                            autocomplete="email"
                        />
                        <button
                            type="submit"
                            class="submit-button"
                            disabled={isSubmitting}
                            id="newsletter-submit-btn"
                        >
                            {#if isSubmitting}
                                <svg
                                    class="spinner"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
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
                                Subscribe Free
                            {/if}
                        </button>
                    </form>
                </section>
            {:else}
                <!-- ===== SUCCESS STATE ===== -->
                <div class="success-container">
                    <div class="success-icon-wrap">
                        <svg
                            width="56"
                            height="56"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            class="success-svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 class="success-title">You're In!</h2>
                    <p class="success-message">
                        Welcome to TalkAfrika's community. Expect African
                        stories, culture, and insights in your inbox soon.
                    </p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    /* ===================== BACKDROP ===================== */
    .newsletter-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 0.75rem;
        animation: fadeIn 0.3s ease-out;
        overflow-y: hidden;
    }

    /* ===================== POPUP SHELL ===================== */
    .newsletter-popup {
        position: relative;
        background: #fff;
        border-radius: 24px;
        padding: 2.5rem 2.5rem 2rem;
        width: 100%;
        max-width: 760px;
        max-height: min(85vh, 700px);
        overflow-y: auto;
        box-shadow:
            0 30px 60px -12px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(253, 176, 34, 0.12);
        animation: slideUp 0.42s cubic-bezier(0.22, 1, 0.36, 1);
        scrollbar-width: thin;
        scrollbar-color: rgba(253, 176, 34, 0.3) transparent;
    }

    .newsletter-popup::-webkit-scrollbar {
        width: 4px;
    }
    .newsletter-popup::-webkit-scrollbar-thumb {
        background: rgba(253, 176, 34, 0.35);
        border-radius: 4px;
    }

    /* ===================== CLOSE BUTTON ===================== */
    .close-button {
        position: absolute;
        top: 1.1rem;
        right: 1.1rem;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.06);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #555;
        transition: all 0.2s ease;
        z-index: 10;
        flex-shrink: 0;
    }

    .close-button:hover {
        background: rgba(253, 176, 34, 0.15);
        color: #FDB022;
        transform: scale(1.1) rotate(90deg);
    }

    /* ===================== IMPACT SHOWCASE ===================== */
    .impact-showcase {
        margin-bottom: 1.5rem;
    }

    .impact-header {
        text-align: center;
        margin-bottom: 1.25rem;
        padding-right: 2rem; /* avoid overlap with close btn */
    }

    .legacy-label {
        display: inline-block;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #FDB022;
        font-family: 'Poppins', system-ui, sans-serif;
        margin-bottom: 0.5rem;
    }

    .impact-title {
        font-size: clamp(1.35rem, 3.5vw, 1.85rem);
        font-weight: 800;
        color: #111;
        line-height: 1.15;
        margin: 0.35rem 0 0.65rem;
        font-family: var(--font-clash-grotesk, 'Clash Grotesk', system-ui, sans-serif);
    }

    .impact-title .highlight {
        color: #FDB022;
    }

    .impact-desc {
        font-size: 0.88rem;
        color: #666;
        line-height: 1.6;
        max-width: 480px;
        margin: 0 auto;
    }

    /* ===== IMPACT CARDS GRID ===== */
    .impact-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.65rem;
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.45s ease, transform 0.45s ease;
    }

    .impact-cards.cards-visible {
        opacity: 1;
        transform: translateY(0);
    }

    .impact-card {
        background: #fff;
        border: 1.5px solid #f0f0f0;
        border-radius: 12px;
        padding: 1rem 0.75rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        opacity: 0;
        transform: translateY(20px);
        transition:
            opacity 0.4s ease,
            transform 0.4s ease,
            border-color 0.25s,
            box-shadow 0.25s;
    }

    /* Stagger via parent visibility */
    .cards-visible .impact-card {
        opacity: 1;
        transform: translateY(0);
    }

    .impact-card:hover {
        border-color: #FDB022;
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(253, 176, 34, 0.15);
    }

    .impact-badge {
        display: inline-block;
        background: #FDB022;
        color: #fff;
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        padding: 3px 10px;
        border-radius: 20px;
        white-space: nowrap;
    }

    .card-icon {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-icon :global(svg) {
        width: 100%;
        height: 100%;
    }

    .card-stat {
        font-size: 1.25rem;
        font-weight: 800;
        color: #111;
        line-height: 1;
        font-family: var(--font-clash-grotesk, system-ui, sans-serif);
    }

    .card-text {
        font-size: 0.7rem;
        color: #777;
        line-height: 1.4;
        margin: 0;
    }

    /* ===================== GALLERY STRIP ===================== */
    .gallery-strip-wrap {
        margin: 1.25rem -2.5rem 0;
        overflow: hidden;
        position: relative;
    }

    /* Fade edges */
    .gallery-strip-wrap::before,
    .gallery-strip-wrap::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 60px;
        z-index: 2;
        pointer-events: none;
    }
    .gallery-strip-wrap::before {
        left: 0;
        background: linear-gradient(to right, rgba(255,255,255,0.6), transparent);
        width: 30px;
    }
    .gallery-strip-wrap::after {
        right: 0;
        background: linear-gradient(to left, rgba(255,255,255,0.6), transparent);
        width: 30px;
    }

    .gallery-strip {
        display: flex;
        gap: 0.6rem;
        overflow-x: auto;
        padding: 0.5rem 2.5rem 0.75rem;
        scrollbar-width: none;
        -ms-overflow-style: none;
        cursor: grab;
    }
    .gallery-strip::-webkit-scrollbar {
        display: none;
    }

    .gallery-item {
        flex-shrink: 0;
        width: 180px;
        height: 120px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .gallery-item:hover {
        transform: scale(1.04);
        box-shadow: 0 8px 20px rgba(253, 176, 34, 0.2);
    }
    .gallery-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    .gallery-item:hover img {
        transform: scale(1.08);
    }

    .gallery-tag {
        position: absolute;
        top: 6px;
        left: 6px;
        background: rgba(253, 176, 34, 0.85);
        backdrop-filter: blur(4px);
        color: #fff;
        font-size: 0.55rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        padding: 2px 7px;
        border-radius: 20px;
        z-index: 2;
    }

    .gallery-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.5rem 0.6rem 0.4rem;
        background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
        color: #fff;
        font-size: 0.62rem;
        font-weight: 600;
        line-height: 1.3;
        transform: translateY(100%);
        transition: transform 0.3s ease;
    }
    .gallery-item:hover .gallery-caption {
        transform: translateY(0);
    }

    /* ===================== DIVIDER ===================== */
    .section-divider {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 1.25rem 0 1.25rem;
    }

    .divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(
            to right,
            transparent,
            rgba(253, 176, 34, 0.3),
            transparent
        );
    }

    .divider-icon {
        font-size: 1.1rem;
        flex-shrink: 0;
    }

    /* ===================== NEWSLETTER FORM SECTION ===================== */
    .newsletter-section {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.4s ease, transform 0.4s ease;
    }

    .newsletter-section.form-visible {
        opacity: 1;
        transform: translateY(0);
    }

    .popup-title {
        font-family: var(--font-clash-grotesk, system-ui, sans-serif);
        font-size: 1.3rem;
        font-weight: 700;
        color: #111;
        text-align: center;
        margin: 0 0 0.4rem;
    }

    .popup-description {
        text-align: center;
        color: #666;
        font-size: 0.88rem;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    /* Benefits */
    .benefits-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1.25rem;
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .benefits-list li {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.8rem;
        color: #444;
        white-space: nowrap;
    }

    .check-icon {
        display: flex;
        align-items: center;
        color: #FDB022;
        flex-shrink: 0;
    }

    /* Email Form */
    .email-form {
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
    }

    .email-input {
        width: 100%;
        padding: 0.85rem 1.1rem;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        font-size: 0.92rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        outline: none;
        color: #111;
        box-sizing: border-box;
    }

    .email-input:focus {
        border-color: #FDB022;
        box-shadow: 0 0 0 3px rgba(253, 176, 34, 0.12);
    }

    .email-input:disabled {
        background: rgba(0, 0, 0, 0.04);
        cursor: not-allowed;
    }

    .submit-button {
        width: 100%;
        padding: 0.875rem 1.5rem;
        background: #FDB022;
        color: #fff;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        letter-spacing: 0.01em;
    }

    .submit-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(253, 176, 34, 0.35);
    }

    .submit-button:active:not(:disabled) {
        transform: translateY(0);
    }

    .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    /* ===================== SUCCESS ===================== */
    .success-container {
        text-align: center;
        padding: 3rem 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .success-icon-wrap {
        width: 80px;
        height: 80px;
        background: rgba(34, 197, 94, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .success-svg {
        color: #22c55e;
    }

    .success-title {
        font-family: var(--font-clash-grotesk, system-ui, sans-serif);
        font-size: 1.8rem;
        font-weight: 800;
        color: #111;
        margin: 0;
    }

    .success-message {
        color: #666;
        font-size: 0.92rem;
        line-height: 1.6;
        max-width: 380px;
        margin: 0 auto;
    }

    /* ===================== SPINNER ===================== */
    .spinner {
        animation: spin 1s linear infinite;
    }

    /* ===================== ANIMATIONS ===================== */
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* ===================== RESPONSIVE ===================== */

    /* Tablet: 2×2 grid */
    @media (max-width: 768px) {
        .newsletter-popup {
            padding: 2rem 1.5rem 1.75rem;
            border-radius: 20px;
        }

        .impact-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.6rem;
        }

        .impact-title {
            font-size: 1.4rem;
        }

        .benefits-list {
            gap: 0.75rem;
        }

        .gallery-strip-wrap {
            margin: 1rem -1.5rem 0;
        }
        .gallery-item {
            width: 150px;
            height: 100px;
        }
    }

    /* Mobile: single column or 2-col compact */
    @media (max-width: 480px) {
        .newsletter-popup {
            padding: 1.5rem 1rem 1.25rem;
            border-radius: 18px;
            max-height: 92vh;
        }

        .impact-cards {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }

        .impact-card {
            padding: 0.85rem 0.6rem;
        }

        .card-stat {
            font-size: 1.1rem;
        }

        .impact-title {
            font-size: 1.2rem;
        }

        .impact-desc {
            display: none;
        }

        .benefits-list {
            display: none;
        }

        .popup-title {
            font-size: 1.1rem;
        }

        .gallery-strip-wrap {
            margin: 0.5rem -1rem 0;
        }
        .gallery-item {
            width: 110px;
            height: 75px;
        }
    }
</style>
