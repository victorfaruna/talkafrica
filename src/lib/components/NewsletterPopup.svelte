<script lang="ts">
    import { onMount, tick } from "svelte";
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import ArrowRight from "@lucide/svelte/icons/arrow-right";
    import X from "@lucide/svelte/icons/x";
    import Earth from "@lucide/svelte/icons/earth";
    import UsersRound from "@lucide/svelte/icons/users-round";
    import Eye from "@lucide/svelte/icons/eye";
    import BookOpen from "@lucide/svelte/icons/book-open";
    import Mail from "@lucide/svelte/icons/mail";
    import Check from "@lucide/svelte/icons/check";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import LoaderCircle from "@lucide/svelte/icons/loader-circle";
    import ShieldCheck from "@lucide/svelte/icons/shield-check";
    import { getOptimizedImageUrl } from "$lib/utils/image";

    let dialog: HTMLDialogElement;
    let email = "";
    let isSubmitting = false;
    let isSuccess = false;
    let errorMessage = "";
    let previousOverflow = "";
    let bodyLocked = false;
    let galleryItems: { image_url?: string; image?: string; caption?: string; tag?: string }[] = [];
    const STORAGE_KEY = "newsletter_popup_dismissed";
    const impactCards = [
        { icon: Earth, stat: "500K", text: "People reached" },
        { icon: UsersRound, stat: "5", text: "Countries connected" },
        { icon: Eye, stat: "30K", text: "Story views" },
        { icon: BookOpen, stat: "5+", text: "Years of storytelling" },
    ];

    function unlockBody() {
        if (bodyLocked) {
            document.body.style.overflow = previousOverflow;
            bodyLocked = false;
        }
    }

    function closePopup() {
        dialog?.close();
        unlockBody();
        try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch { /* Storage may be unavailable. */ }
    }

    onMount(() => {
        if ($page.url.pathname.startsWith("/admin")) return;
        const localPreview = dev && ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
        try {
            const dismissed = Number(localStorage.getItem(STORAGE_KEY));
            if (!localPreview && dismissed && Date.now() - dismissed < 7 * 24 * 60 * 60 * 1000) return;
        } catch { /* Continue when storage is unavailable. */ }
        let disposed = false;
        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            if ($page.url.pathname.startsWith("/admin")) return;
            await tick();
            if (disposed || !dialog) return;
            previousOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            bodyLocked = true;
            dialog.showModal();
            try {
                const response = await fetch("/api/our-impact", { signal: controller.signal });
                if (response.ok) {
                    const items = await response.json();
                    if (!disposed) galleryItems = Array.isArray(items) ? items.filter(item => item.image_url || item.image).slice(0, 3) : [];
                }
            } catch { /* Gallery is optional. */ }
        }, localPreview ? 300 : 5000);
        return () => {
            disposed = true;
            clearTimeout(timer);
            controller.abort();
            dialog?.close();
            unlockBody();
        };
    });

    async function handleSubmit() {
        if (!email.trim() || isSubmitting) return;
        isSubmitting = true;
        errorMessage = "";
        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (!response.ok) throw new Error("Subscription failed");
            isSuccess = true;
        } catch {
            errorMessage = "We couldn't subscribe you just now. Please try again.";
        } finally {
            isSubmitting = false;
        }
    }
</script>

<dialog bind:this={dialog} class="newsletter-popup" aria-labelledby="popup-title" aria-describedby="popup-description" on:cancel|preventDefault={closePopup} on:close={unlockBody}>
    <button class="close-button" on:click={closePopup} aria-label="Close newsletter popup" id="popup-close-btn"><X size={20} strokeWidth={1.8} /></button>
    {#if isSuccess}
        <div class="success-panel" role="status">
            <span class="success-icon"><CircleCheck size={36} strokeWidth={1.6} /></span>
            <p class="eyebrow">You're part of the story</p>
            <h2 id="popup-title">Welcome to the community.</h2>
            <p id="popup-description">African stories, fresh perspectives, and voices worth hearing. Look out for us in your inbox.</p>
            <button class="subscribe-button" on:click={closePopup}>Back to the stories <ArrowRight size={18} /></button>
        </div>
    {:else}
        <div class="popup-layout">
            <section class="story-panel" aria-labelledby="impact-title">
                <div class="story-copy">
                    <p class="eyebrow">Voices. Culture. Community.</p>
                    <h2 id="impact-title">Stories that matter.<br /><span>Impact that lasts.</span></h2>
                    <p class="story-description">A continent of stories. A community that brings them to life. Be part of Africa's next chapter.</p>
                </div>
                <div class="impact-stats" aria-label="Our impact">
                    {#each impactCards as card}
                        <div class="stat">
                            <svelte:component this={card.icon} size={19} strokeWidth={1.6} aria-hidden="true" />
                            <strong>{card.stat}</strong>
                            <span>{card.text}</span>
                        </div>
                    {/each}
                </div>
                {#if galleryItems.length}
                    <div class="story-gallery" aria-label="Our community in pictures">
                        {#each galleryItems as item}
                            <figure>
                                <img src={getOptimizedImageUrl(item.image_url || item.image, { width: 360, height: 270, fit: 'fill' })} alt={item.caption || "TalkAfrica community"} loading="lazy" decoding="async" />
                                {#if item.tag}<figcaption>{item.tag}</figcaption>{/if}
                            </figure>
                        {/each}
                    </div>
                {/if}
                <p class="story-footer">From Africa. For the world.</p>
            </section>
            <section class="signup-panel">
                <div class="signup-heading">
                    <div class="mail-icon"><Mail size={24} strokeWidth={1.6} aria-hidden="true" /></div>
                    <p class="eyebrow signup-eyebrow">The TalkAfrica newsletter</p>
                </div>
                <h2 id="popup-title">A little closer<br />to Africa.</h2>
                <p class="signup-description" id="popup-description">The stories, people, and ideas moving the continent. Curated for your inbox.</p>
                <ul class="benefits">
                    <li><Check size={17} strokeWidth={2} aria-hidden="true" /> A fresh perspective, every week</li>
                    <li><Check size={17} strokeWidth={2} aria-hidden="true" /> Original stories &amp; interviews</li>
                    <li><Check size={17} strokeWidth={2} aria-hidden="true" /> Culture, community &amp; possibility</li>
                </ul>
                <form on:submit|preventDefault={handleSubmit} id="newsletter-form" aria-busy={isSubmitting}>
                    <label for="newsletter-email-input">Your email address</label>
                    <div class="input-wrap"><Mail size={18} strokeWidth={1.6} aria-hidden="true" /><input id="newsletter-email-input" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" required disabled={isSubmitting} aria-invalid={Boolean(errorMessage)} aria-describedby={errorMessage ? "newsletter-error" : undefined} /></div>
                    {#if errorMessage}<p class="form-error" id="newsletter-error" role="alert">{errorMessage}</p>{/if}
                    <button class="subscribe-button" type="submit" disabled={isSubmitting} id="newsletter-submit-btn">
                        {#if isSubmitting}<LoaderCircle size={19} class="spinner" aria-hidden="true" /> Joining the community…{:else}Count me in <ArrowRight size={19} strokeWidth={1.8} aria-hidden="true" />{/if}
                    </button>
                </form>
                <p class="privacy-note"><ShieldCheck size={15} strokeWidth={1.7} aria-hidden="true" /> Free to join. Unsubscribe anytime.</p>
                <button class="later-button" on:click={closePopup} disabled={isSubmitting}>I'll explore for now</button>
            </section>
        </div>
    {/if}
</dialog>

<style>
    .newsletter-popup { width: min(960px, calc(100% - 40px)); max-width: none; max-height: calc(100dvh - 40px); margin: auto; padding: 0; border: 1px solid #ffffff38; border-radius: 20px; overflow: auto; overscroll-behavior: contain; background: #faf9f6; color: #172823; box-shadow: 0 28px 100px #0005; scrollbar-width: thin; }
    .newsletter-popup::backdrop { background: #101b24b8; backdrop-filter: blur(6px); }
    .newsletter-popup[open] { display: grid; grid-template-columns: minmax(0, 1fr); animation: enter 240ms ease-out; }
    .popup-layout { grid-area: 1 / 1; display: grid; grid-template-columns: 1.08fr 1fr; }
    .close-button { position: sticky; top: 14px; grid-area: 1 / 1; justify-self: end; align-self: start; margin: 14px; z-index: 2; width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid #17282318; border-radius: 50%; background: #faf9f6; color: #34433d; cursor: pointer; }
    .close-button:hover { background: #ecece5; }
    .story-panel { padding: 36px; background: linear-gradient(180deg, #17251e, #101a15); color: #f7f5ed; min-width: 0; display: flex; flex-direction: column; }
    .story-copy { margin-top: 0; }
    .eyebrow { display: flex; align-items: center; gap: 8px; margin: 0 0 16px; font-size: 10px; line-height: 1.5; font-weight: 600; text-transform: uppercase; letter-spacing: 1.8px; }
    .story-copy .eyebrow { color: #d4c79c; }
    h2 { font-family: var(--font-clash-grotesk, sans-serif); font-weight: 600; letter-spacing: -1.3px; }
    .story-copy h2 { margin: 0; font-size: clamp(28px, 3.4vw, 38px); line-height: 1.12; }
    .story-copy h2 span { color: #f4bb57; }
    .story-description { max-width: 350px; margin: 18px 0 0; font-size: 13px; line-height: 1.8; color: #cfdbd3; }
    .impact-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 18px; border-top: 1px solid #ffffff26; padding-top: 24px; margin-top: 28px; }
    .stat { display: grid; grid-template-columns: 23px 1fr; align-items: center; gap: 6px 9px; }
    .stat :global(svg) { color: #e5bb6f; }
    .stat strong { font-family: var(--font-clash-grotesk, sans-serif); font-size: 27px; line-height: 1; font-weight: 600; }
    .stat span { grid-column: 2; font-size: 10px; line-height: 1.5; color: #c4d4ca; }
    .story-gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 28px; }
    .story-gallery figure { margin: 0; position: relative; aspect-ratio: 1.1; border-radius: 7px; overflow: hidden; background: #ffffff10; }
    .story-gallery img { width: 100%; height: 100%; object-fit: cover; }
    .story-gallery figcaption { position: absolute; inset: auto 0 0; padding: 16px 7px 7px; background: linear-gradient(transparent, #000a); color: #fff; font-size: 8px; text-transform: uppercase; letter-spacing: .6px; }
    .story-footer { margin: auto 0 0; padding-top: 24px; color: #bccfc2; font-size: 10px; letter-spacing: .6px; }
    .signup-panel { padding: 64px 40px 32px; min-width: 0; }
    .signup-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    .mail-icon { width: 48px; height: 48px; flex-shrink: 0; display: grid; place-items: center; border: 1px solid #dcded4; border-radius: 13px; background: #f1f0e8; color: #2c5746; }
    .signup-eyebrow { color: #627368; font-size: 9px; letter-spacing: 1px; margin: 0; white-space: nowrap; }
    .signup-panel h2 { font-size: clamp(32px, 4vw, 45px); line-height: 1.04; margin: 0 0 18px; }
    .signup-description { font-size: 13px; line-height: 1.75; color: #657068; margin: 0; }
    .benefits { display: grid; gap: 11px; padding: 0; margin: 24px 0 28px; list-style: none; }
    .benefits li { display: flex; gap: 9px; align-items: center; font-size: 11px; color: #3a4b41; line-height: 1.5; }
    .benefits :global(svg) { color: #528466; flex-shrink: 0; }
    form label { display: block; font-size: 11px; font-weight: 600; margin-bottom: 9px; }
    .input-wrap { display: flex; align-items: center; gap: 10px; border: 1px solid #d4d8cf; border-radius: 8px; background: #fff; padding: 0 13px; color: #7b877f; }
    .input-wrap:focus-within { border-color: #47745b; outline: 3px solid #47745b20; }
    .input-wrap :global(svg) { flex-shrink: 0; }
    input { width: 100%; min-width: 0; height: 49px; border: 0; background: transparent; font: inherit; font-size: 16px; color: #172823; outline: none; }
    input::placeholder { color: #929a93; font-size: 13px; }
    .subscribe-button { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; min-height: 50px; margin-top: 12px; padding: 12px 16px; background: #fdb022; color: #19261d; border: 1px solid #efa017; border-radius: 8px; font: inherit; font-weight: 600; font-size: 13px; cursor: pointer; transition: background 150ms; }
    .subscribe-button:hover:not(:disabled) { background: #f5a515; }
    button:disabled { opacity: .65; cursor: wait; }
    .privacy-note { display: flex; gap: 6px; align-items: center; justify-content: center; color: #788279; font-size: 9px; margin: 13px 0 0; }
    .later-button { display: block; min-height: 44px; margin: 13px auto 0; padding: 8px; border: 0; background: none; color: #657068; text-decoration: underline; text-underline-offset: 3px; font-size: 11px; cursor: pointer; }
    button:focus-visible { outline: 3px solid #c58c29; outline-offset: 3px; }
    .form-error { color: #a63129; font-size: 12px; line-height: 1.5; margin: 9px 0; }
    .success-panel { grid-area: 1 / 1; padding: 64px 28px 44px; max-width: 480px; margin: auto; text-align: center; }
    .success-icon { display: inline-grid; place-items: center; width: 72px; height: 72px; background: #e7eee4; color: #39714d; border-radius: 50%; margin-bottom: 24px; }
    .success-panel .eyebrow { justify-content: center; color: #627368; }
    .success-panel h2 { font-size: 36px; line-height: 1.1; margin: 0 0 16px; }
    .success-panel > p:not(.eyebrow) { font-size: 14px; line-height: 1.8; color: #657068; }
    .success-panel .subscribe-button { margin-top: 24px; }
    :global(.newsletter-popup .spinner) { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 700px) {
        .newsletter-popup { width: min(480px, calc(100% - 24px)); max-height: calc(100dvh - 24px); border-radius: 16px; }
        .popup-layout { grid-template-columns: 1fr; }
        .signup-panel { grid-row: 1; padding: 32px 24px 18px; background: linear-gradient(180deg, rgba(12, 17, 14, .78), rgba(12, 17, 14, .86)), url('/images/popup-background.jpg') center / cover; color: #f7f5ed; }
        .signup-heading { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding-right: 28px; }
        .mail-icon { width: 40px; height: 40px; flex-shrink: 0; border-radius: 10px; margin-bottom: 0; background: #ffffff10; border-color: #ffffff38; color: #e5bb6f; }
        .signup-panel h2 { font-size: 37px; }
        .signup-description { max-width: 340px; color: #cfdbd3; }
        .benefits { gap: 8px; margin: 18px 0 22px; }
        .signup-eyebrow { margin: 0; font-size: clamp(7px, 2vw, 9px); letter-spacing: 1px; white-space: nowrap; color: #d4c79c; }
        .benefits li { color: #e2e9e3; }
        .benefits :global(svg) { color: #e5bb6f; }
        .privacy-note, .later-button { color: #c4d4ca; }
        .later-button { margin-top: 5px; }
        .story-panel { padding: 24px; }
        .story-copy { margin-top: 0; }
        .story-copy .eyebrow { display: none; }
        .story-copy h2 { font-size: 28px; }
        .story-description { font-size: 12px; margin-top: 12px; }
        .impact-stats { margin-top: 20px; padding-top: 20px; gap: 20px; }
        .stat strong { font-size: 25px; }
        .story-gallery { margin-top: 22px; }
        .story-footer { padding-top: 20px; }
    }
    @media (max-width: 360px) {
        .signup-panel, .story-panel { padding-left: 20px; padding-right: 20px; }
        .signup-panel h2 { font-size: 32px; }
        .privacy-note { font-size: 8px; }
    }
    @media (prefers-reduced-motion: reduce) {
        .newsletter-popup[open], :global(.newsletter-popup .spinner) { animation: none; }
        .subscribe-button { transition: none; }
    }
</style>
