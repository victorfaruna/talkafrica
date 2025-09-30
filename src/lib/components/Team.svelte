<script>
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Autoplay, Pagination } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/pagination';
	let swiperInstance;
	onMount(() => {
		swiperInstance = new Swiper('.swiper', {
			modules: [Autoplay, Pagination],
			slidesPerView: 4,
			spaceBetween: 20,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			}
		});
	});

	const data = [
		{ name: 'Korede', image: '/images/op.webp', role: 'Founder' },
		{ name: 'Korede', image: '/images/op.webp', role: 'Founder' },
		{ name: 'Korede', image: '/images/op.webp', role: 'Founder' },
		{ name: 'Korede', image: '/images/op.webp', role: 'Founder' },
		{ name: 'Korede', image: '/images/op.webp', role: 'Founder' },
		{ name: 'Korede', image: '/images/op.webp', role: 'Founder' }
	];
</script>

<div
	class="teams-container flex w-screen justify-between gap-[5rem] overflow-x-hidden bg-white px-[var(--side-p)] py-[6rem]"
>
	<div class="flex flex-col gap-4">
		<div class="dash w-[100px] border-b-2 border-accent"></div>
		<p
			class="w-[400px] font-clash-grotesk text-[3rem] leading-none font-bold text-secondary uppercase lg:text-[5rem]"
		>
			Meet our talented team.
		</p>
	</div>

	<div class="w-full">
		<div class="swiper w-screen">
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
								<p class="text-[1.5rem] leading-none font-medium text-secondary/80">{item.name}</p>
								<p class="text-[0.8rem] text-secondary/50">{item.role}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
