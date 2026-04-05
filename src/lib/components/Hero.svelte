<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import "swiper/css";
    import "swiper/css/pagination";

    let swiperInstance: import("swiper").Swiper | undefined;
    let swiperEl: HTMLDivElement | null = null;
    let paginationEl: HTMLDivElement | null = null;

    import { getOptimizedImageUrl } from "$lib/utils/image";

    const heroImages = [
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389880/talkafrica/hero/ta-1.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389881/talkafrica/hero/ta-10.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389587/talkafrica/hero/ta-11.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389589/talkafrica/hero/ta-12.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389591/talkafrica/hero/ta-13.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389593/talkafrica/hero/ta-14.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389595/talkafrica/hero/ta-15.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389598/talkafrica/hero/ta-16.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389603/talkafrica/hero/ta-17.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389605/talkafrica/hero/ta-18.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389607/talkafrica/hero/ta-19.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389610/talkafrica/hero/ta-2.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389613/talkafrica/hero/ta-20.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389615/talkafrica/hero/ta-21.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389618/talkafrica/hero/ta-22.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389620/talkafrica/hero/ta-3.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389623/talkafrica/hero/ta-4.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389626/talkafrica/hero/ta-5.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389628/talkafrica/hero/ta-6.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389629/talkafrica/hero/ta-7.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389631/talkafrica/hero/ta-8.jpg",
        "https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389634/talkafrica/hero/ta-9.jpg",
    ];

    onMount(async () => {
        if (!swiperEl || !paginationEl) return;
        const [{ default: Swiper }, { Autoplay, Pagination }] =
            await Promise.all([import("swiper"), import("swiper/modules")]);

        swiperInstance = new Swiper(swiperEl, {
            modules: [Autoplay, Pagination],
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: paginationEl,
                clickable: true,
            },
        });
    });

    onDestroy(() => {
        swiperInstance?.destroy(true, true);
        swiperInstance = undefined;
    });
</script>

<section class="relative h-[600px] lg:h-[100svh] overflow-y-hidden w-screen">
    <div class="cont h-full absolute top-0 right-0 bottom-0 left-0 z-[1]">
        <div class="swiper h-full" bind:this={swiperEl}>
            <div class="swiper-wrapper h-full">
                {#each heroImages as img, i}
                    <div class="swiper-slide h-full w-full">
                        <img
                            src={getOptimizedImageUrl(img, { width: 1920, quality: 80 })}
                            alt="Hero background"
                            class="h-full w-full object-cover"
                            loading={i === 0 ? "eager" : "lazy"}
                            decoding={i === 0 ? "sync" : "async"}
                            fetchpriority={i === 0 ? "high" : "auto"}
                        />
                    </div>
                {/each}
            </div>
            <!-- Pagination -->
            <div class="swiper-pagination" bind:this={paginationEl}></div>
        </div>
    </div>

    <div
        class="mask relative z-[2] flex size-full flex-col justify-center bg-secondary/50 bg-gradient-to-r from-secondary/50 to-transparent p-[5rem] px-[var(--side-p)] py-[2rem]"
    >
        <div class="mx-auto">
            <p
                style="text-shadow: 0 0 10px rgba(255, 255, 255, 0.2)"
                class="mb-5 font-clash-grotesk text-[2rem] lg:text-[6rem] leading-none font-bold text-primary/80"
            >
                TalkAfricaNG<span class="hidden text-primary lowercase"
                    >.ng</span
                >
            </p>
            <p class="max-w-[90%] text-[0.7rem] lg:text-[1rem] text-primary/70">
                TalkAfrica NG is a vibrant storytelling platform dedicated to
                capturing the authentic voices of Africa. We tell the stories of
                our people their hustle and bustle, their struggles, and their
                wins. From the bustling streets to rural communities, we shine a
                light on the resilience, creativity, and innovation that define
                the African spirit.
                <br />
                <br />

                Here, stories meet opportunities: a space where culture,
                entrepreneurship, and everyday life intersect. We inspire
                connections, empower voices, and celebrate Africa’s journey one
                story at a time.
                <br />
                <br />

                Telling Africa’s stories. Inspiring the world.
            </p>

            <button
                on:click={() => {
                    document
                        .getElementById("headlines")
                        ?.scrollIntoView({ behavior: "smooth" });
                }}
                class="mt-8 cursor-pointer rounded-[0.3rem] border-2 border-accent/50 bg-transparent px-10 py-3 text-[0.8rem] lg:text-[1.2rem] font-semibold text-accent shadow-lg transition-all duration-200 hover:scale-105 hover:bg-accent/70 hover:text-primary"
            >
                Explore
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 inline"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                </svg>
            </button>
        </div>
        <!-- <div class="flex w-[70%] flex-col gap-[2rem]">
			<p class="text-[4rem] leading-none font-bold text-primary">Talkafrica</p>
			<p
				class="font-space-grotesk font-clash-grotesk text-[1.5rem] leading-tight font-normal text-primary/70"
			>
				TalkAfrica is a vibrant platform designed to empower African entrepreneurs by providing a
				space to connect, collaborate, and share their unique journeys. Here, founders can exchange
				insights, showcase their innovations, and build meaningful relationships with investors,
				mentors, and other like-minded individuals.
			</p>
			<button
				class="bg-accen cursor-pointer self-start rounded-lg border-2 border-accent/50 px-10 py-3 text-[1rem] text-accent"
				>Explore</button
			>
		</div> -->
    </div>
</section>

<style>
    :global(.swiper-pagination) {
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
    }

    :global(.swiper-pagination-bullet) {
        background: rgba(255, 255, 255, 0.5);
        opacity: 1;
    }

    :global(.swiper-pagination-bullet-active) {
        background: white;
    }
</style>
