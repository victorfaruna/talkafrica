<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import "swiper/css";
    import "swiper/css/pagination";
    let swiperInstance: import("swiper").Swiper | undefined;
    let swiperEl: HTMLDivElement | null = null;
    let paginationEl: HTMLDivElement | null = null;
    onMount(async () => {
        if (!swiperEl) return;
        const [{ default: Swiper }, { Autoplay, Pagination }] =
            await Promise.all([import("swiper"), import("swiper/modules")]);
        swiperInstance = new Swiper(swiperEl, {
            modules: [Autoplay, Pagination],

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
            pagination: {
                el: paginationEl ?? undefined,
                clickable: true,
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
            name: "Oluwagbemi Delight Adetunji",
            image: "/images/team/oluwagbemi-delight-adetunji.jpg",
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
            image: "/images/placeholder.webp",
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
        { name: "Destiny Sunday", image: "/images/placeholder.webp", role: "" },
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
    ];
</script>

<div
    class="teams-container max-w-[1900px] mx-auto flex flex-col lg:flex-row w-screen justify-between gap-[2rem] lg:gap-[5rem] overflow-x-hidden bg-white px-[var(--side-p)] py-[6rem]"
>
    <div class="flex flex-col gap-4">
        <div class="dash w-[100px] border-b-2 border-accent"></div>
        <p
            class="w-[200px] lg:w-[400px] font-clash-grotesk text-[2rem] lg:text-[3rem] leading-none font-bold text-secondary uppercase lg:text-[5rem]"
        >
            Meet our talented team.
        </p>
    </div>

    <div class="w-full">
        <div class="swiper w-full" bind:this={swiperEl}>
            <div class="swiper-wrapper">
                {#each data as item}
                    <div class="swiper-slide h-auto">
                        <div class="inner flex w-full flex-col gap-3 h-full">
                            <div
                                class="w-full aspect-[3/4] overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    class="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            <div class="flex flex-col justify-start">
                                <p
                                    class="text-[1.2rem] leading-none font-medium text-secondary/80"
                                >
                                    {item.name}
                                </p>
                                <p class="text-[0.8rem] text-secondary/50">
                                    {item.role || "Team Member"}
                                </p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
