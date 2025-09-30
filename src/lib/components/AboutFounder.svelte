<section class="mx-auto w-full px-[var(--side-p)] py-[3rem]">
	<div class="mb-8 flex items-baseline justify-between">
		<h2 class="font-clash-grotesk text-[1.7rem] lg:text-[2.5rem] font-semibold leading-none text-secondary">About the Founder</h2>
		<div class="h-[2px] w-[80px] bg-accent"></div>
	</div>

	<div class="flex flex-col lg:flex-row gap-10">
		<div class="w-[38%] overflow-hidden rounded-xl border border-secondary/10 bg-primary shadow-sm">
			<picture>
				<source srcset="/images/founder.webp" type="image/webp" />
				<img
					src="/images/founder.webp"
					alt="Portrait of the founder"
					class="block h-full w-full object-cover"
					loading="lazy"
				/>
			</picture>
		</div>

		<div class="flex flex-[1] flex-col gap-4">
			<div>
				<p class="font-clash-grotesk text-[1.75rem] leading-tight font-semibold text-secondary">
					John Emmanuel Fagbemi
				</p>
				<p class="text-[0.95rem] text-tertiary">Founder, TalkAfrica</p>
			</div>

			<p class="text-[1rem] leading-relaxed text-secondary/80">
				John Emmanuel Fagbemi stands at the intersection of culture, creativity, and impact. As a
				storyteller and media advocate, he is committed to reshaping Africa’s narrative by
				amplifying voices, preserving heritage, and championing authentic content rooted in truth
				and identity. John is the founder and CEO of TalkAfrica NG, a visionary platform dedicated
				to amplifying African creativity and preserving cultural heritage. With a B.A. in Music, he
				is also a saxophonist whose creativity flows through both sound and storytelling. A
				dedicated leader and communicator, John has been recognized with multiple awards across
				service, media, and humanitarian work including honors from the Faculty of Arts at Federal
				University Lokoja, the National Association of Kogi State Students, and various journalism
				development organizations. A certified participant in project with PAth project(pay
				attention to him) -millennium fellowship Campus reporter at centre for journalism innovation
				and Development Metropolitan school of business and management UK
			</p>

			<div class="mt-2 flex items-center gap-4">
				<a
					href="#"
					class="inline-flex items-center gap-2 rounded-md border border-accent/40 px-4 py-2 text-[0.9rem] text-accent hover:border-accent hover:bg-accent/5"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-4"
					>
						<path
							d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24h11.495v-9.294H9.691V11.01h3.129V8.41c0-3.1 1.893-4.788 4.66-4.788 1.325 0 2.463.102 2.795.148v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.315h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0z"
						/>
					</svg>
					<span>Connect</span>
				</a>

				<a
					href="#"
					class="inline-flex items-center gap-2 rounded-md border border-secondary/20 px-4 py-2 text-[0.9rem] text-secondary hover:border-secondary/40"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
					<span>Email</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	:global(.font-clash-grotesk) {
		font-family: var(--font-clash-grotesk);
	}
	:global(.text-primary) {
		color: var(--color-primary);
	}
	:global(.text-secondary) {
		color: var(--color-secondary);
	}
	:global(.text-tertiary) {
		color: var(--color-tertiary);
	}
	:global(.bg-primary) {
		background-color: var(--color-primary);
	}
	:global(.bg-accent) {
		background-color: var(--color-accent);
	}
	:global(.border-accent) {
		border-color: var(--color-accent);
	}
</style>
