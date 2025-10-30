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
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Oluwagbemi Delight Adetunji",
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Angel Tomi Olorunmonu",
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Freeman David Nana",
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Victoria Ojima Abiodun",
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Fagbemi Janet okikiola",
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Osho Deborah Adetoni",
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Armstrong Ogundele",
            image: "/images/placeholder.webp",
            role: "",
        },
        {
            name: "Ipinymi korede precious",
            image: "/images/placeholder.webp",
            role: "",
        },
        { name: "Destiny Sunday", image: "/images/placeholder.webp", role: "" },
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
                    <div class="swiper-slide">
                        <div class="inner flex w-full flex-col gap-3">
                            <img
                                width="200"
                                height="230"
                                src={item.image}
                                alt={item.name}
                                class="w-full rounded-2xl object-cover"
                            />
                            <div>
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
