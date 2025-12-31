<script>
    import { onMount } from "svelte";

    let isVisible = false;

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        isVisible = true;
                    }
                });
            },
            { threshold: 0.1 },
        );

        const section = document.querySelector(".founder-section");
        if (section) {
            observer.observe(section);
        }

        return () => observer.disconnect();
    });
</script>

<section
    class="founder-section relative mx-auto w-full max-w-[1900px] px-[var(--side-p)] py-[4rem] lg:py-[5rem] overflow-hidden"
>
    <!-- Decorative Background Elements -->
    <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl -z-10"
    ></div>
    <div
        class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl -z-10"
    ></div>

    <!-- Section Header -->
    <div
        class="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
    >
        <div class="relative">
            <h2
                class="font-clash-grotesk text-[2rem] lg:text-[3rem] font-bold leading-none text-secondary mb-2"
                class:animate-fade-in={isVisible}
            >
                Meet the Founder
            </h2>
            <div
                class="h-[3px] w-[120px] bg-gradient-to-r from-accent to-accent/30 rounded-full animate-pulse-slow"
            ></div>
        </div>

        <!-- Professional Badge -->
        <div
            class="founder-badge px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 backdrop-blur-sm"
        >
            <div class="flex items-center gap-2">
                <svg
                    class="w-5 h-5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fill-rule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                    />
                </svg>
                <span class="text-[0.85rem] font-semibold text-secondary"
                    >Verified Founder</span
                >
            </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <!-- Founder Image -->
        <div
            class="w-full lg:w-[40%] relative group"
            class:animate-slide-in-left={isVisible}
        >
            <div
                class="image-container relative h-[450px] lg:h-[600px] overflow-hidden rounded-2xl"
            >
                <!-- Gradient Overlay Border -->
                <div
                    class="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-accent/10 rounded-2xl z-10 pointer-events-none"
                ></div>

                <!-- Image -->
                <picture>
                    <source
                        srcset="/images/headshot-001.webp"
                        type="image/webp"
                    />
                    <img
                        src="/images/headshot-001.webp"
                        alt="Portrait of John Emmanuel Fagbemi - Founder of TalkAfrica"
                        class="founder-image block h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                </picture>

                <!-- Decorative Quote Icon -->
                <div
                    class="absolute top-6 left-6 w-16 h-16 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center z-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-300"
                >
                    <svg
                        class="w-8 h-8 text-accent"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                        />
                    </svg>
                </div>

                <!-- Bottom Gradient Overlay -->
                <div
                    class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent z-10"
                ></div>
            </div>
        </div>

        <!-- Content Section -->
        <div
            class="flex-1 flex flex-col gap-6"
            class:animate-slide-in-right={isVisible}
        >
            <!-- Name & Title Card -->
            <div
                class="content-card p-6 lg:p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-secondary/10 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h3
                            class="font-clash-grotesk text-[1.9rem] lg:text-[2.5rem] leading-tight font-bold text-secondary mb-2 bg-gradient-to-r from-secondary to-secondary/70 bg-clip-text"
                        >
                            John Emmanuel Fagbemi
                        </h3>
                        <p
                            class="flex items-center gap-2 text-[1rem] lg:text-[1.1rem] text-accent font-medium"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            Founder & Chief Executive Officer
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bio Content -->
            <div
                class="content-card p-6 lg:p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-secondary/10 shadow-md"
            >
                <p
                    class="text-[0.95rem] lg:text-[1.05rem] leading-relaxed text-secondary/90 mb-6"
                >
                    <span class="text-accent font-semibold text-[1.1rem]"
                        >John Emmanuel Fagbemi</span
                    > stands at the intersection of culture, creativity, and impact.
                    As a storyteller and media advocate, he is dedicated to reshaping
                    Africa's narrative by amplifying voices, preserving heritage,
                    and promoting authentic content rooted in truth and identity.
                </p>

                <p
                    class="text-[0.95rem] lg:text-[1.05rem] leading-relaxed text-secondary/80 mb-6"
                >
                    He is the founder and chief executive officer of <span
                        class="text-accent font-semibold"
                        >TalkAfrica Nigeria</span
                    >, a visionary platform committed to showcasing African
                    creativity and preserving cultural heritage. With a
                    Bachelor's degree in Music, John is also a talented
                    saxophonist whose creativity flows seamlessly through both
                    sound and storytelling.
                </p>

                <!-- Achievements Highlights -->
                <div class="space-y-3 mb-6">
                    <div class="flex items-start gap-3">
                        <svg
                            class="w-5 h-5 text-accent mt-1 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <p class="text-[0.95rem] text-secondary/80">
                            <span class="font-semibold text-secondary"
                                >Award-winning leader</span
                            > recognized for service, media, and humanitarian work
                        </p>
                    </div>
                    <div class="flex items-start gap-3">
                        <svg
                            class="w-5 h-5 text-accent mt-1 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <p class="text-[0.95rem] text-secondary/80">
                            <span class="font-semibold text-secondary"
                                >Millennium Fellowship alumnus</span
                            > and certified participant in the Pay Attention to Him
                            Project
                        </p>
                    </div>
                    <div class="flex items-start gap-3">
                        <svg
                            class="w-5 h-5 text-accent mt-1 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <p class="text-[0.95rem] text-secondary/80">
                            <span class="font-semibold text-secondary"
                                >International certification in Critical
                                Thinking</span
                            >, demonstrating global exposure to analytical and
                            problem-solving skills from the Metropolitan School
                            of Business and Management, United Kingdom
                        </p>
                    </div>
                </div>
            </div>

            <!-- Contact CTAs -->
            <div
                class="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center md:gap-4"
            >
                <a
                    href="https://www.linkedin.com/in/john-fagbemi-893825386?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cta-button-outline group flex items-center justify-center gap-2 rounded-xl border-2 border-accent bg-accent/10 backdrop-blur-sm px-4 md:px-6 py-3.5 md:py-3 text-[0.85rem] md:text-[0.95rem] font-semibold text-accent shadow-md hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
                >
                    <svg
                        class="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        />
                    </svg>
                    <span class="hidden sm:inline">Connect on LinkedIn</span>
                    <span class="inline sm:hidden">LinkedIn</span>
                </a>

                <a
                    href="https://www.instagram.com/kingjohndesax?igsh=bzk3bGp1enE4azY3&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cta-button-outline group flex items-center justify-center gap-2 rounded-xl border-2 border-accent bg-accent/10 backdrop-blur-sm px-4 md:px-6 py-3.5 md:py-3 text-[0.85rem] md:text-[0.95rem] font-semibold text-accent shadow-md hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
                >
                    <svg
                        class="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"
                        />
                    </svg>
                    <span class="hidden sm:inline">Follow on Instagram</span>
                    <span class="inline sm:hidden">Instagram</span>
                </a>

                <a
                    href="mailto:talkafricanigeria@gmail.com"
                    class="cta-button-outline group flex items-center justify-center gap-2 rounded-xl border-2 border-accent bg-accent/10 backdrop-blur-sm px-4 md:px-6 py-3.5 md:py-3 text-[0.85rem] md:text-[0.95rem] font-semibold text-accent shadow-md hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
                >
                    <svg
                        class="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    <span class="hidden sm:inline">Send Email</span>
                    <span class="inline sm:hidden">Email</span>
                </a>
            </div>
        </div>
    </div>
</section>

<style>
    :global(.font-clash-grotesk) {
        font-family: var(--font-clash-grotesk);
    }
    :global(.text-secondary) {
        color: var(--color-secondary);
    }
    :global(.text-tertiary) {
        color: var(--color-tertiary);
    }
    :global(.text-accent) {
        color: var(--color-accent);
    }

    /* Image Container Effects */
    .image-container {
        position: relative;
        box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .image-container:hover {
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 2px var(--color-accent);
    }

    /* Smooth Scroll Animations */
    .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
    }

    .animate-slide-in-left {
        animation: slideInLeft 0.9s ease-out forwards;
    }

    .animate-slide-in-right {
        animation: slideInRight 0.9s ease-out 0.2s forwards;
        opacity: 0;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Pulse Animation for Accent Line */
    .animate-pulse-slow {
        animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    /* Content Cards */
    .content-card {
        transition: all 0.3s ease;
    }

    .content-card:hover {
        transform: translateY(-2px);
    }

    /* Gradient Text Effect */
    .bg-clip-text {
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
        .founder-section {
            padding-top: 3rem;
            padding-bottom: 3rem;
        }
    }
</style>
