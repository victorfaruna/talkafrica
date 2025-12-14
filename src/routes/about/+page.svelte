<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import AboutFounder from "$lib/components/AboutFounder.svelte";
    import Team from "$lib/components/Team.svelte";
</script>

<div class="app-container w-full min-h-screen overflow-x-hidden flex flex-col">
    <Header />
    
    <!-- About TalkAfrica Hero Section -->
    <section class="pt-[120px] pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
            <div class="max-w-4xl mx-auto text-center">
                <h1 class="font-clash-grotesk text-[2.5rem] lg:text-[4rem] font-bold leading-tight text-secondary mb-6">
                    About Us
                </h1>
                <div class="h-[3px] w-[120px] bg-accent mx-auto mb-8"></div>
                <p class="text-[1.1rem] lg:text-[1.3rem] leading-relaxed text-secondary/80 max-w-3xl mx-auto">
                    TalkAfrica is a visionary platform committed to showcasing African creativity, 
                    preserving cultural heritage, and reshaping Africa's narrative through authentic 
                    storytelling and impactful content.
                </p>
            </div>
        </div>
    </section>

    <!-- Mission & Vision Section -->
    <section class="py-16 bg-white">
        <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
            <div class="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div>
                    <div class="flex items-baseline gap-4 mb-6">
                        <h2 class="font-clash-grotesk text-[2rem] lg:text-[2.5rem] font-semibold text-secondary">
                            Our Mission
                        </h2>
                        <div class="h-[2px] flex-1 bg-accent"></div>
                    </div>
                    <p class="text-[1rem] lg:text-[1.1rem] leading-relaxed text-secondary/80">
                        To amplify African voices, preserve our rich cultural heritage, and promote 
                        authentic content that reflects the true identity and diversity of the African 
                        continent. We are dedicated to telling stories that matter, showcasing creativity, 
                        and building bridges between cultures.
                    </p>
                </div>
                
                <div>
                    <div class="flex items-baseline gap-4 mb-6">
                        <h2 class="font-clash-grotesk text-[2rem] lg:text-[2.5rem] font-semibold text-secondary">
                            Our Vision
                        </h2>
                        <div class="h-[2px] flex-1 bg-accent"></div>
                    </div>
                    <p class="text-[1rem] lg:text-[1.1rem] leading-relaxed text-secondary/80">
                        To become the leading platform for African storytelling, where authentic narratives 
                        thrive, cultural heritage is celebrated, and the next generation of African 
                        storytellers, journalists, and creatives are empowered to share their voices 
                        with the world.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- About the Founder Section -->
    <AboutFounder />

    <!-- Team Section -->
    <Team />

    <!-- Values Section -->
    <section class="py-16 bg-gray-50">
        <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-baseline justify-between mb-12">
                    <h2 class="font-clash-grotesk text-[2rem] lg:text-[2.5rem] font-semibold text-secondary">
                        Our Values
                    </h2>
                    <div class="h-[2px] w-[80px] bg-accent"></div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-white p-8 rounded-xl border border-secondary/10 shadow-sm">
                        <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 class="font-clash-grotesk text-[1.5rem] font-semibold text-secondary mb-3">
                            Authenticity
                        </h3>
                        <p class="text-secondary/70 leading-relaxed">
                            We believe in telling real stories that reflect the true essence of African 
                            experiences, culture, and identity.
                        </p>
                    </div>
                    
                    <div class="bg-white p-8 rounded-xl border border-secondary/10 shadow-sm">
                        <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 class="font-clash-grotesk text-[1.5rem] font-semibold text-secondary mb-3">
                            Heritage
                        </h3>
                        <p class="text-secondary/70 leading-relaxed">
                            We are committed to preserving and celebrating Africa's rich cultural heritage 
                            for future generations.
                        </p>
                    </div>
                    
                    <div class="bg-white p-8 rounded-xl border border-secondary/10 shadow-sm">
                        <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 class="font-clash-grotesk text-[1.5rem] font-semibold text-secondary mb-3">
                            Community
                        </h3>
                        <p class="text-secondary/70 leading-relaxed">
                            We foster a vibrant community of storytellers, creatives, and change-makers 
                            who are passionate about Africa.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <Footer />
</div>

<style>
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

