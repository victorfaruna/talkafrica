<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    export let url: string = "";
    export let title: string = "";
    export let label: string = "article";
    export let message: string = "";
    export let showFloating: boolean = true;

    let showShareButtons = false;
    let ticking = false;

    onMount(() => {
        if (browser) {
            if (!url) {
                url = window.location.href;
            }

            // Show share buttons after scrolling
            const handleScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        showShareButtons = window.scrollY > 300;
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }
    });

    function getShareText() {
        if (message) return message;
        return `Check out this ${label}: ${title}`;
    }

    function shareOnTwitter() {
        const text = getShareText();
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
    }

    function shareOnLinkedIn() {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
    }

    function shareOnFacebook() {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank", "width=600,height=400");
    }

    function shareOnWhatsApp() {
        const text = getShareText();
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        window.open(shareUrl, "_blank");
    }

    async function handleNativeShare() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: getShareText(),
                    url: url,
                });
            } catch (err) {
                console.error("Native share failed:", err);
            }
        } else {
            // Fallback if Web Share API is not supported
            shareOnTwitter();
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    }
</script>

<!-- Share Section -->
<div class="mt-12 py-8 bg-gray-50 rounded-2xl text-center">
    <h3 class="text-lg font-bold text-gray-900 mb-6 font-clash">
        {#if label === "The Big Screen"}
            Share from {label}
        {:else}
            Share this {label}
        {/if}
    </h3>
    <div class="flex items-center justify-center gap-4">
        <button
            on:click={shareOnTwitter}
            class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Share on Twitter"
        >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                ><path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                /></svg
            >
        </button>
        <button
            on:click={shareOnLinkedIn}
            class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-700 hover:text-blue-700 flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Share on LinkedIn"
        >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                ><path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                /></svg
            >
        </button>
        <button
            on:click={shareOnFacebook}
            class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600 flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Share on Facebook"
        >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                ><path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                /></svg
            >
        </button>
        <button
            on:click={shareOnWhatsApp}
            class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-500 flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Share on WhatsApp"
        >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
        </button>
        <button
            on:click={copyToClipboard}
            class="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Copy Link"
        >
            <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                /></svg
            >
        </button>
    </div>
</div>

<!-- Floating Share Buttons (Mobile Only) -->
{#if showFloating && showShareButtons}
    <div class="fixed bottom-6 right-6 z-40 md:hidden scale-in-center">
        <button
            on:click={handleNativeShare}
            class="w-14 h-14 bg-accent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-accent/90 transition-all focus:outline-none focus:ring-4 focus:ring-accent/20"
            aria-label="Share {label}"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
        </button>
    </div>
{/if}

<style>
    .font-clash {
        font-family: var(--font-clash-grotesk);
    }

    .scale-in-center {
        animation: scale-in-center 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            both;
    }

    @keyframes scale-in-center {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>
