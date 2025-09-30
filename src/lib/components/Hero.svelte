<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import 'swiper/css';
    import 'swiper/css/pagination';

    let swiperInstance: import('swiper').Swiper | undefined;
    let swiperEl: HTMLDivElement | null = null;
    let paginationEl: HTMLDivElement | null = null;

    onMount(async () => {
        if (!swiperEl || !paginationEl) return;
        const [{ default: Swiper }, { Autoplay, Pagination }] = await Promise.all([
            import('swiper'),
            import('swiper/modules')
        ]);

        swiperInstance = new Swiper(swiperEl, {
            modules: [Autoplay, Pagination],
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: paginationEl,
                clickable: true
            }
        });
    });

    onDestroy(() => {
        swiperInstance?.destroy(true, true);
        swiperInstance = undefined;
    });
</script>

<section class="relative h-[100svh] w-screen bg-[url(/images/hero/ta-1.jpeg)]">
    <div class="conttt h-[100svh] overflow-y-hidden absolute top-0 right-0 bottom-0 left-0 z-[1]">
        <div class="swiper" bind:this={swiperEl}>
			<div class="swiper-wrapper">
				<div class="swiper-slide">
					<div class="h-screen w-full bg-[url(/images/hero/ta-1.jpeg)] bg-cover bg-center"></div>
				</div>
				<div class="swiper-slide">
					<div class="h-screen w-full bg-[url(/images/hero/ta-2.jpeg)] bg-cover bg-center"></div>
				</div>
				<div class="swiper-slide">
					<div class="h-screen w-full bg-[url(/images/hero/ta-3.jpeg)] bg-cover bg-center"></div>
				</div>
				<div class="swiper-slide">
					<div class="h-screen w-full bg-[url(/images/hero/ta-4.jpeg)] bg-cover bg-center"></div>
				</div>
				<div class="swiper-slide">
					<div class="h-screen w-full bg-[url(/images/hero/ta-5.jpeg)] bg-cover bg-center"></div>
				</div>
				<div class="swiper-slide">
					<div class="h-screen w-full bg-[url(/images/hero/ta-6.jpeg)] bg-cover bg-center"></div>
				</div>
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
				Talkafrica.<span class="hidden text-primary lowercase">.ng</span>
			</p>
			<p class="max-w-[80%] text-[0.7rem] lg:text-[1.2rem] text-primary/70">
				Empowering African entrepreneurs to connect, share their stories, and shape the future of
				innovation across the continent. At TalkAfrica, we provide a vibrant platform where
				founders, creators, and visionaries can collaborate, inspire one another, and gain
				visibility for their unique journeys. Join a growing community dedicated to amplifying
				African voices, fostering meaningful connections, and driving impactful change for
				generations to come.
			</p>

			<button
				class="mt-8 cursor-pointer rounded-[0.3rem] border-2 border-accent/50 bg-transparent px-10 py-3 text-[0.8rem] lg:text-[1.2rem] font-semibold text-accent shadow-lg transition-all duration-200 hover:scale-105 hover:bg-accent/70 hover:text-primary"
			>
				Explore
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
