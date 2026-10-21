<script lang="ts">
    const moments = [
        { src: "/media/emergence/photos/emergence-17.jpg", alt: "Emergence guests at the Lagos event photo wall" },
        { src: "/media/emergence/photos/emergence-04.jpg", alt: "A speaker leading a conversation at Emergence Lagos" },
        { src: "/media/emergence/photos/emergence-07.jpg", alt: "A guest enjoying a conversation at Emergence Lagos" },
        { src: "/media/emergence/photos/emergence-13.jpg", alt: "Emergence attendees taking part in a group activity" },
        { src: "/media/emergence/photos/emergence-10.jpg", alt: "Young African creatives at the Emergence photo wall" },
        { src: "/media/emergence/photos/emergence-01.jpg", alt: "An Emergence participant outdoors in Lagos" },
        { src: "/media/emergence/photos/emergence-11.jpg", alt: "A candid moment from the Emergence creative hangout" },
        { src: "/media/emergence/photos/emergence-16.jpg", alt: "Community members at Emergence Lagos" },
    ];
</script>

<section class="emergence-section overflow-hidden bg-[#0b0b0b] py-16 text-white lg:py-24" aria-labelledby="emergence-heading">
    <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
        <div class="grid gap-10 border-b border-white/20 pb-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:pb-14">
            <div>
                <div class="mb-5 flex items-center gap-4">
                    <span class="h-3 w-3 bg-[#f59e0b]" aria-hidden="true"></span>
                    <span class="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#f59e0b]">TalkAfrica presents</span>
                </div>
                <h2 id="emergence-heading" class="font-clash-grotesk text-[clamp(3.7rem,10vw,9rem)] font-semibold uppercase leading-[0.78] tracking-[-0.07em]">
                    Emergence
                </h2>
                <p class="mt-6 font-clash-grotesk text-[1.35rem] font-medium leading-tight text-white/85 sm:text-[1.8rem] lg:max-w-4xl lg:text-[2.35rem]">
                    Where young African creatives meet, connect, and build what comes next.
                </p>
            </div>

            <div class="border-l-4 border-[#f59e0b] pl-5 lg:justify-self-end lg:pl-7">
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/45">Past edition</span>
                <p class="mt-2 font-clash-grotesk text-2xl font-semibold">Ikeja, Lagos</p>
                <p class="mt-2 max-w-sm text-sm leading-6 text-white/60">Good conversations. New connections. A proper creative hangout.</p>
            </div>
        </div>

        <div class="grid border-b border-white/20 lg:grid-cols-[1.28fr_0.72fr]">
            <div class="relative min-h-[360px] overflow-hidden border-white/20 bg-black sm:min-h-[520px] lg:min-h-[560px] lg:border-r">
                <iframe
                    src="https://player.cloudinary.com/embed/?cloud_name=dwwyegu5r&public_id=IMG_0745_w0zlss"
                    title="Emergence Lagos event film"
                    class="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowfullscreen
                ></iframe>
                <span class="pointer-events-none absolute left-0 top-0 z-10 bg-[#f59e0b] px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-black">Watch the Lagos film</span>
            </div>

            <div class="flex flex-col justify-between px-0 py-9 lg:p-10 xl:p-14">
                <div>
                    <span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#f59e0b]">The first gathering</span>
                    <h3 class="mt-4 font-clash-grotesk text-[2.1rem] font-semibold leading-[1.05] sm:text-[2.8rem]">Creativity feels different when community is in the room.</h3>
                    <p class="mt-7 text-[0.98rem] leading-7 text-white/62">
                        The Young Africans Creative Hangout brought the creative community together in Ikeja for honest conversations, shared ideas, new friendships, and space to simply enjoy being together.
                    </p>
                </div>

                <div class="mt-10 grid grid-cols-3 border-l border-t border-white/20">
                    <div class="border-b border-r border-white/20 p-4">
                        <span class="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/40">Built for</span>
                        <p class="mt-2 text-sm font-semibold">Creatives</p>
                    </div>
                    <div class="border-b border-r border-white/20 p-4">
                        <span class="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/40">Centred on</span>
                        <p class="mt-2 text-sm font-semibold">Community</p>
                    </div>
                    <div class="border-b border-r border-white/20 p-4">
                        <span class="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/40">Powered by</span>
                        <p class="mt-2 text-sm font-semibold">Connection</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="py-12 lg:py-16">
            <div class="mb-8 flex items-end justify-between gap-5">
                <div>
                    <span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#f59e0b]">From the archive</span>
                    <h3 class="mt-2 font-clash-grotesk text-[2rem] font-semibold leading-none sm:text-[3rem]">Scenes from Emergence.</h3>
                </div>
                <span class="hidden text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/40 sm:block">Drag to explore →</span>
            </div>

            <div class="emergence-gallery -mx-[var(--side-p)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--side-p)] pb-5 sm:gap-4">
                {#each moments as moment, index}
                    <figure class="group relative aspect-[3/4] w-[72vw] max-w-[360px] flex-none snap-start overflow-hidden bg-[#171717] sm:w-[42vw] lg:w-[24vw]">
                        <img
                            src={moment.src}
                            alt={moment.alt}
                            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                            loading="lazy"
                        />
                        <div class="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-20">
                            <figcaption class="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white/80">Lagos archive</figcaption>
                            <span class="text-[0.65rem] font-bold text-[#f59e0b]">{String(index + 1).padStart(2, "0")}</span>
                        </div>
                    </figure>
                {/each}
            </div>
        </div>

        <div class="grid border border-[#f59e0b] bg-[#f59e0b] text-black lg:grid-cols-[0.32fr_1fr_auto] lg:items-stretch">
            <div class="border-b border-black/20 p-6 lg:border-b-0 lg:border-r lg:p-9">
                <span class="text-[0.65rem] font-black uppercase tracking-[0.22em]">Up next</span>
                <p class="mt-2 font-clash-grotesk text-3xl font-semibold">Coming soon</p>
            </div>
            <div class="p-6 lg:p-9">
                <h3 class="font-clash-grotesk text-[1.8rem] font-semibold leading-tight sm:text-[2.4rem]">The next Emergence is taking shape.</h3>
                <p class="mt-3 max-w-2xl text-sm leading-6 text-black/65">Another city, another room full of ideas, and another chance to find your creative community. Dates and location will be announced soon.</p>
            </div>
            <a
                href="mailto:talkafricang@gmail.com?subject=Keep me updated about Emergence"
                class="group flex min-h-20 items-center justify-between gap-8 border-t border-black bg-black px-6 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-black lg:min-w-[220px] lg:border-l lg:border-t-0 lg:px-8"
            >
                Keep me posted
                <span class="text-xl text-[#f59e0b] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
        </div>
    </div>
</section>

<style>
    .emergence-gallery {
        scrollbar-color: rgba(245, 158, 11, 0.8) rgba(255, 255, 255, 0.08);
        scrollbar-width: thin;
    }

    .emergence-gallery::-webkit-scrollbar {
        height: 4px;
    }

    .emergence-gallery::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.08);
    }

    .emergence-gallery::-webkit-scrollbar-thumb {
        background: #f59e0b;
    }

    @media (prefers-reduced-motion: reduce) {
        .emergence-section :global(*) {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
        }
    }
</style>
