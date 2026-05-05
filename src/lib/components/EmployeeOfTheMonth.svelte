<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { onMount } from 'svelte';

    export let employee: any = null;

    let sectionElement: HTMLElement;
    let isVisible = false;

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                isVisible = true;
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (sectionElement) {
            observer.observe(sectionElement);
        }

        // Fallback: Show after 2 seconds if observer hasn't triggered
        const timeout = setTimeout(() => {
            isVisible = true;
        }, 2000);

        return () => {
            observer.disconnect();
            clearTimeout(timeout);
        };
    });

    // Helper to extract social icons or links
    $: socialLinks = employee?.social_links ? employee.social_links.split(',').map((s: string) => s.trim()) : [];
</script>

{#if employee}
    <section 
        bind:this={sectionElement}
        class="employee-section py-12 md:py-20 relative overflow-hidden bg-white"
        id="employee-of-the-month"
    >
        <!-- Background Decorative Elements -->
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full -mr-64 -mt-64 blur-[100px] animate-pulse-slow"></div>
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full -ml-48 -mb-48 blur-[80px] animate-pulse-slow" style="animation-delay: 2s;"></div>
        
        <!-- Subtle Pattern Overlay -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('https://www.transparenttextures.com/patterns/cubes.png');"></div>

        <div class="container mx-auto px-6 max-w-6xl relative z-10">
            <div class:opacity-0={!isVisible} class="transition-opacity duration-1000">
                <div class="text-center mb-12 md:mb-20">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-6">
                        <span class="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                        Recognition & Excellence
                    </div>
                    <h2 class="text-3xl md:text-5xl lg:text-6xl font-bold font-clash-grotesk text-gray-900 tracking-tight leading-none">
                        Employee of the <span class="text-accent italic">Month</span>
                    </h2>
                </div>

                <div class="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    <!-- Image Section -->
                    <div class="lg:col-span-5 order-1">
                        <div class="relative group max-w-md mx-auto lg:max-w-sm">
                            <!-- Decorative Floating Rings -->
                            <div class="absolute -top-10 -left-10 w-32 h-32 border-2 border-accent/20 rounded-full animate-spin-slow"></div>
                            <div class="absolute -bottom-10 -right-10 w-48 h-48 border border-accent/10 rounded-full animate-reverse-spin-slow"></div>

                            <!-- Main Image Container -->
                            <div class="relative z-10 aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] group-hover:shadow-[0_40px_80px_-15px_rgba(255,165,0,0.3)] transition-all duration-700">
                                <img 
                                    src={employee.photo_url} 
                                    alt={employee.name}
                                    class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    loading="lazy"
                                />
                                
                                <!-- Glassmorphism Overlay on Hover -->
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 backdrop-blur-[2px]">
                                    <div class="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                        <p class="text-white/90 text-lg italic font-medium mb-2 leading-relaxed">
                                            "{employee.impact_quote || "Excellence is not an act, but a habit."}"
                                        </p>
                                        <div class="w-12 h-1 bg-accent rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div 
                                class="absolute -bottom-6 -right-2 md:-right-6 z-20 bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-3 hover:scale-105 transition-transform cursor-default"
                            >
                                <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-[8px] md:text-[10px] text-accent font-black uppercase tracking-widest mb-0.5">Performance</p>
                                    <p class="text-base md:text-lg font-bold text-gray-900 leading-none font-clash-grotesk">Exceptional</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Content Section -->
                    <div class="lg:col-span-7 space-y-6 order-2 lg:order-2">
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <div class="h-px w-12 bg-accent/30 hidden md:block"></div>
                                <span class="text-accent font-bold tracking-widest uppercase text-sm">Monthly Spotlight</span>
                            </div>
                            <h3 class="text-4xl md:text-6xl font-bold font-clash-grotesk text-gray-900 leading-[0.9] tracking-tighter">
                                {employee.name}
                            </h3>
                            <p class="text-xl md:text-2xl text-gray-500 font-medium font-clash-grotesk">
                                {employee.role}
                            </p>
                        </div>

                        <div class="relative">
                            <div class="absolute -top-10 -left-10 text-[10rem] font-serif text-accent/5 select-none pointer-events-none leading-none">“</div>
                            <div class="bio-content text-lg md:text-xl text-gray-600 leading-relaxed italic font-serif relative z-10 pl-4 border-l-4 border-accent/20">
                                {employee.bio}
                            </div>
                        </div>

                        <div class="pt-2 md:pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-12">
                            {#if employee.email}
                                <a href="mailto:{employee.email}" class="flex items-center gap-3 md:gap-4 group">
                                    <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-500 group-hover:shadow-xl group-hover:shadow-accent/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Direct Contact</p>
                                        <p class="text-gray-900 font-bold text-base md:text-lg group-hover:text-accent transition-colors leading-tight">{employee.email}</p>
                                    </div>
                                </a>
                            {/if}

                            <div class="flex gap-3 md:gap-4">
                                {#each socialLinks as link}
                                    <a 
                                        href={link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        class="w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent hover:shadow-xl hover:shadow-accent/10 transition-all duration-500 transform hover:-translate-y-2"
                                    >
                                        {#if link.includes('linkedin')}
                                            <svg class="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                        {:else if link.includes('twitter') || link.includes('x.com')}
                                            <svg class="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                        {:else}
                                            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        {/if}
                                    </a>
                                {/each}
                            </div>
                        </div>

                        <div class="relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-gray-50 to-white border border-gray-100 overflow-hidden group/card">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover/card:scale-150"></div>
                            <div class="relative z-10">
                                <h4 class="text-accent font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Key Contribution
                                </h4>
                                <p class="text-gray-600 text-sm md:text-base leading-relaxed font-medium">
                                    {employee.contribution || `Through storytelling and dedicated research, ${employee.name.split(' ')[0]} has been instrumental in amplifying voices that redefine the African narrative on a global scale.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
{/if}

<style>
    .font-clash-grotesk {
        font-family: 'ClashGrotesk', 'Poppins', sans-serif;
    }

    .animate-pulse-slow {
        animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .animate-spin-slow {
        animation: spin 15s linear infinite;
    }

    .animate-reverse-spin-slow {
        animation: spin-reverse 20s linear infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.05; transform: scale(1); }
        50% { opacity: 0.15; transform: scale(1.1); }
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes spin-reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
    }

    .bio-content {
        position: relative;
        z-index: 1;
    }

    :global(.text-accent) {
        color: var(--color-accent, orange);
    }

    :global(.bg-accent) {
        background-color: var(--color-accent, orange);
    }

    :global(.border-accent) {
        border-color: var(--color-accent, orange);
    }
</style>

