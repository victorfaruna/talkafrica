<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import "swiper/css";
    let swiperInstance: import("swiper").Swiper | undefined;
    let swiperEl: HTMLDivElement | null = null;
    onMount(async () => {
        if (!swiperEl) return;
        const [{ default: Swiper }, { Autoplay }] =
            await Promise.all([import("swiper"), import("swiper/modules")]);
        swiperInstance = new Swiper(swiperEl, {
            modules: [Autoplay],

            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
                1440: {
                    slidesPerView: 4,
                },
            },
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    });

    onDestroy(() => {
        swiperInstance?.destroy(true, true);
        swiperInstance = undefined;
    });

    const data = [
        {
            name: "ISAAC OLORUNMOWAJU",
            image: "/images/team/isaac-olorunmowaju.jpg",
            role: "",
        },
        {
            name: "Angel Tomi Olorunmonu",
            image: "/images/team/angel-tomi-olorunmonu.jpg",
            role: "",
        },

        {
            name: "Victoria Ojima Abiodun",
            image: "/images/team/victoria-ojima-abiodun.jpg",
            role: "",
        },
        {
            name: "Fagbemi Janet okikiola",
            image: "/images/team/fagbemi-janet-okikiola.jpg",
            role: "",
        },
        {
            name: "Osho Deborah Adetoni",
            image: "/images/team/osho-deborah-adetoni.jpg",
            role: "",
        },
        {
            name: "Aisha Deborah Egena-Aruwa",
            image: "/images/team/aisha-deborah-egena-aruwa.jpg",
            role: "",
        },
        {
            name: "Armstrong Ogundele",
            image: "/images/team/armstrong-ogundele.jpg",
            role: "",
        },
        {
            name: "Ipinyomi korede precious",
            image: "/images/team/ipinymi-korede-precious.jpg",
            role: "",
        },
        { name: "Destiny Sunday", image: "/images/team/destiny-sunday.jpg", role: "" },
        {
            name: "Ikeun Divine Michael",
            image: "/images/team/divine-micheal-update.jpg",
            role: "",
        },
        {
            name: "Azeema Aliu",
            image: "/images/team/azeema-aliu.jpg",
            role: "",
        },
        {
            name: "Esther Ojoma Sule",
            image: "/images/team/esther-ojoma-sule.jpg",
            role: "",
        },
        {
            name: "Kehinde Samuel Oluwagbemiga",
            image: "/images/team/kehinde-samuel-oluwagbemiga.jpg",
            role: "",
        },
        {
            name: "Akinbusola Godwin olaoluwa",
            image: "/images/team/akinbusola-godwin-olaoluwa.jpg",
            role: "",
        },
        {
            name: "Ajayi Korede",
            image: "/images/team/ajayi-korede.jpg",
            role: "",
        },
        {
            name: "Oreoluwa Omojola",
            image: "/images/team/oreoluwa-omojola.jpg",
            role: "",
        },
        {
            name: "Bernice Temitayo",
            image: "/images/team/bernice-temitayo.jpg",
            role: "",
        },
        {
            name: "Buraimoh Oluwaseun Mercy",
            image: "/images/team/buraimoh-oluwaseun-mercy.jpg",
            role: "",
        },
        {
            name: "Chibueze Ijeoma Blessing(eseoghene)",
            image: "/images/team/chibueze-ijeoma-blessing.jpg",
            role: "",
        },
        {
            name: "Ukachi Rejoice Akarachi",
            image: "/images/team/ukachi-rejoice-akarachi.jpg",
            role: "",
        },
        {
            name: "Adeola Mercy Kuyebi",
            image: "/images/team/adeola-mercy-kuyebi.jpg",
            role: "",
        },
    ];
</script>

<section class="teams-container overflow-hidden border-y border-black/15 bg-white py-16 lg:py-24">
    <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
        <div class="mb-10 grid gap-7 border-b border-secondary pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
                <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">The people behind TalkAfrica</span>
                <h2 class="mt-3 max-w-4xl font-clash-grotesk text-[2.65rem] font-semibold leading-[0.95] tracking-[-0.04em] text-secondary sm:text-[3.6rem] lg:text-[5rem]">
                    Meet the team shaping the stories.
                </h2>
            </div>

            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="flex h-12 w-12 items-center justify-center border border-secondary bg-white text-secondary transition-colors hover:bg-secondary hover:text-white"
                    aria-label="Previous team members"
                    onclick={() => swiperInstance?.slidePrev()}
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                    type="button"
                    class="flex h-12 w-12 items-center justify-center border border-secondary bg-secondary text-white transition-colors hover:bg-accent hover:text-secondary"
                    aria-label="Next team members"
                    onclick={() => swiperInstance?.slideNext()}
                >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>
        </div>

        <div class="swiper w-full overflow-visible" bind:this={swiperEl}>
            <div class="swiper-wrapper">
                {#each data as item, index}
                    <div class="swiper-slide h-auto">
                        <article class="group flex h-full w-full flex-col">
                            <div class="relative aspect-[3/4] overflow-hidden bg-[#eceae4]">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    class="h-full w-full object-cover object-center grayscale-[20%] transition duration-500 group-hover:scale-[1.035] group-hover:grayscale-0"
                                    loading="lazy"
                                />
                                <span class="absolute left-0 top-0 bg-[#0b0b0b] px-3 py-2 text-[0.65rem] font-bold tracking-[0.14em] text-white">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>
                            <div class="flex min-h-[100px] items-start justify-between gap-4 border-x border-b border-black/15 p-4">
                                <div>
                                    <h3 class="font-clash-grotesk text-[1.05rem] font-semibold leading-tight text-secondary">{item.name}</h3>
                                    <p class="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.13em] text-secondary/45">{item.role || "Editorial team"}</p>
                                </div>
                                <span class="mt-1 h-2 w-2 flex-none bg-accent" aria-hidden="true"></span>
                            </div>
                        </article>
                    </div>
                {/each}
            </div>
        </div>

        <div class="mt-8 flex items-center gap-5">
            <span class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-secondary/45">Swipe to explore</span>
            <div class="h-px flex-1 bg-black/15"></div>
            <span class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-secondary/45">{data.length} people</span>
        </div>
    </div>
</section>
