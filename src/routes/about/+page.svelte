<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import AboutFounder from "$lib/components/AboutFounder.svelte";
    import Team from "$lib/components/Team.svelte";
    import EmployeeOfTheMonth from "$lib/components/EmployeeOfTheMonth.svelte";

    export let data;
</script>

<!-- SEO is handled by layout -->


<div class="app-container about-square-edges w-full min-h-screen overflow-x-hidden flex flex-col">
    <Header
        bgClass="bg-gradient-to-b from-secondary/10 to-transparent"
        textClass="text-black"
    />
    
    <!-- About TalkAfrica editorial introduction -->
    <section class="about-intro border-b border-black/15 bg-[#f2f1ed] pt-[120px] lg:pt-[138px]">
        <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
            <div class="border-x border-black/15">
                <div class="flex items-center justify-between border-b border-black/15 px-5 py-4 sm:px-8 lg:px-12">
                    <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">
                        The story behind the platform
                    </span>
                    <span class="hidden text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-secondary/45 sm:block">
                        Est. in Africa · Built for the world
                    </span>
                </div>

                <div class="grid lg:min-h-[410px] lg:grid-cols-[1.25fr_0.75fr]">
                    <div class="flex items-end px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
                        <div>
                            <span class="mb-5 block h-[4px] w-16 bg-accent"></span>
                            <h1 class="font-clash-grotesk text-[clamp(4rem,10vw,9.5rem)] font-bold uppercase leading-[0.78] tracking-[-0.075em] text-secondary">
                                About<br />Us
                            </h1>
                        </div>
                    </div>

                    <div class="flex flex-col justify-between border-t border-black/15 bg-white px-5 py-10 sm:px-8 lg:border-l lg:border-t-0 lg:px-12 lg:py-16">
                        <span class="font-clash-grotesk text-5xl font-semibold leading-none text-accent lg:text-7xl" aria-hidden="true">“</span>
                        <div class="mt-8 lg:mt-0">
                            <p class="font-clash-grotesk text-[1.45rem] font-medium leading-[1.28] text-secondary sm:text-[1.75rem] lg:text-[2rem]">
                                African stories deserve to be told with truth, depth and imagination.
                            </p>
                            <p class="mt-6 max-w-xl text-[0.98rem] leading-7 text-secondary/70 lg:text-[1.05rem]">
                                TalkAfrica is committed to showcasing African creativity, preserving cultural heritage, and reshaping the continent's narrative through authentic, impactful storytelling.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="grid border-t border-black/15 sm:grid-cols-3">
                    <div class="border-b border-black/15 px-5 py-5 sm:border-b-0 sm:border-r sm:px-8 lg:px-12">
                        <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-secondary/45">01</span>
                        <p class="mt-1 font-clash-grotesk text-lg font-semibold text-secondary">Authentic voices</p>
                    </div>
                    <div class="border-b border-black/15 px-5 py-5 sm:border-b-0 sm:border-r sm:px-8 lg:px-12">
                        <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-secondary/45">02</span>
                        <p class="mt-1 font-clash-grotesk text-lg font-semibold text-secondary">Cultural memory</p>
                    </div>
                    <div class="px-5 py-5 sm:px-8 lg:px-12">
                        <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-secondary/45">03</span>
                        <p class="mt-1 font-clash-grotesk text-lg font-semibold text-secondary">African possibility</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Vision editorial statements -->
    <section class="bg-white py-16 lg:py-24">
        <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
            <div class="mb-8 flex items-end justify-between gap-6 border-b border-secondary pb-5 lg:mb-10">
                <div>
                    <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">What guides us</span>
                    <h2 class="mt-2 font-clash-grotesk text-[2.2rem] font-semibold leading-none text-secondary lg:text-[3.4rem]">
                        Purpose in every story.
                    </h2>
                </div>
                <span class="hidden text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-secondary/45 md:block">Mission · Vision</span>
            </div>

            <div class="grid lg:grid-cols-[1.15fr_0.85fr]">
                <article class="flex min-h-[360px] flex-col justify-between bg-[#0b0b0b] p-7 text-white sm:p-10 lg:min-h-[430px] lg:p-14">
                    <div class="flex items-center justify-between border-b border-white/20 pb-5">
                        <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">Our Mission</span>
                        <span class="font-clash-grotesk text-xl text-white/35">01</span>
                    </div>
                    <p class="mt-12 max-w-3xl font-clash-grotesk text-[1.7rem] font-medium leading-[1.3] sm:text-[2.15rem] lg:text-[2.55rem]">
                        Amplify African voices and tell the stories that reflect who we truly are.
                    </p>
                    <p class="mt-10 max-w-2xl text-[0.96rem] leading-7 text-white/65 lg:text-[1.04rem]">
                        We preserve our rich cultural heritage, showcase creativity, and create authentic content that reflects the identity and diversity of the African continent—building bridges between people and cultures.
                    </p>
                </article>

                <article class="flex min-h-[360px] flex-col justify-between border border-t-0 border-secondary/20 bg-[#f59e0b] p-7 text-secondary sm:p-10 lg:min-h-[430px] lg:border-l-0 lg:border-t lg:p-14">
                    <div class="flex items-center justify-between border-b border-secondary/25 pb-5">
                        <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em]">Our Vision</span>
                        <span class="font-clash-grotesk text-xl text-secondary/40">02</span>
                    </div>
                    <p class="mt-12 font-clash-grotesk text-[1.7rem] font-medium leading-[1.3] sm:text-[2.15rem] lg:text-[2.55rem]">
                        A world where African narratives thrive on their own terms.
                    </p>
                    <p class="mt-10 text-[0.96rem] leading-7 text-secondary/75 lg:text-[1.04rem]">
                        We envision a leading home for African storytelling—one that celebrates heritage and empowers the next generation of storytellers, journalists, and creatives to share their voices with the world.
                    </p>
                </article>
            </div>
        </div>
    </section>

    <!-- About the Founder Section -->
    <AboutFounder />

    <!-- Team Section -->
    <Team />

    <!-- Values Section -->
    <section class="border-y border-black/15 bg-[#f2f1ed] py-16 lg:py-24">
        <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
            <div class="mb-9 grid gap-6 border-b border-secondary pb-6 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
                <div>
                    <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">The standard we keep</span>
                    <h2 class="mt-2 font-clash-grotesk text-[2.5rem] font-semibold leading-none text-secondary lg:text-[4rem]">Our values.</h2>
                </div>
                <p class="max-w-2xl text-[1rem] leading-7 text-secondary/65 lg:justify-self-end lg:text-right">Three principles shape what we publish, how we work, and the relationship we build with every community whose story we carry.</p>
            </div>

            <div class="grid border-l border-t border-black/15 md:grid-cols-3">
                <article class="group min-h-[330px] border-b border-r border-black/15 bg-white p-7 transition-colors duration-300 hover:bg-[#0b0b0b] sm:p-9">
                    <div class="flex items-center justify-between">
                        <span class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">Value 01</span>
                        <svg class="h-6 w-6 text-secondary transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9 12 2 2 4-4m5.6-4A12 12 0 0 1 12 3 12 12 0 0 1 3.4 6 12 12 0 0 0 3 9c0 5.6 3.8 10.3 9 11.6 5.2-1.3 9-6 9-11.6 0-1-.1-2-.4-3Z" /></svg>
                    </div>
                    <h3 class="mt-20 font-clash-grotesk text-[1.8rem] font-semibold text-secondary transition-colors group-hover:text-white">Authenticity</h3>
                    <p class="mt-4 leading-7 text-secondary/65 transition-colors group-hover:text-white/65">We tell real stories that reflect the true essence of African experiences, cultures, and identities.</p>
                </article>

                <article class="group min-h-[330px] border-b border-r border-black/15 bg-[#f59e0b] p-7 transition-colors duration-300 hover:bg-[#0b0b0b] sm:p-9">
                    <div class="flex items-center justify-between">
                        <span class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-secondary">Value 02</span>
                        <svg class="h-6 w-6 text-secondary transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v14m0-14C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6v13c1.2-.5 2.8-1 4.5-1s3.3.5 4.5 1m0-13c1.2-.5 2.8-1 4.5-1s3.3.5 4.5 1v13c-1.2-.5-2.8-1-4.5-1s-3.3.5-4.5 1" /></svg>
                    </div>
                    <h3 class="mt-20 font-clash-grotesk text-[1.8rem] font-semibold text-secondary transition-colors group-hover:text-white">Heritage</h3>
                    <p class="mt-4 leading-7 text-secondary/75 transition-colors group-hover:text-white/65">We preserve and celebrate Africa's rich cultural inheritance so it remains alive for future generations.</p>
                </article>

                <article class="group min-h-[330px] border-b border-r border-black/15 bg-white p-7 transition-colors duration-300 hover:bg-[#0b0b0b] sm:p-9">
                    <div class="flex items-center justify-between">
                        <span class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">Value 03</span>
                        <svg class="h-6 w-6 text-secondary transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 0 0-5.4-1.9M17 20H7m10 0v-2c0-.7-.1-1.3-.4-1.9M7 20H2v-2a3 3 0 0 1 5.4-1.9M7 20v-2c0-.7.1-1.3.4-1.9m0 0a5 5 0 0 1 9.2 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                    </div>
                    <h3 class="mt-20 font-clash-grotesk text-[1.8rem] font-semibold text-secondary transition-colors group-hover:text-white">Community</h3>
                    <p class="mt-4 leading-7 text-secondary/65 transition-colors group-hover:text-white/65">We bring together storytellers, creatives, and changemakers united by a passion for Africa.</p>
                </article>
            </div>
        </div>
    </section>
    
    <EmployeeOfTheMonth employee={data.employeeOfTheMonth} />
    <Footer />
</div>

<style>
    :global(.about-square-edges *),
    :global(.about-square-edges *::before),
    :global(.about-square-edges *::after) {
        border-radius: 0 !important;
    }

    :global(.font-clash-grotesk) {
        font-family: var(--font-clash-grotesk);
    }
    :global(.text-secondary) {
        color: var(--color-secondary);
    }
    :global(.bg-accent) {
        background-color: var(--color-accent);
    }
</style>
