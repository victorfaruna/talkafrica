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
                    href="#"
                    class="cta-button-outline group flex items-center justify-center gap-2 rounded-xl border-2 border-accent bg-accent/10 backdrop-blur-sm px-4 md:px-6 py-3.5 md:py-3 text-[0.85rem] md:text-[0.95rem] font-semibold text-accent shadow-md hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105"
                >
                    <svg
                        class="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.333C0 23.403.597 24 1.325 24h11.495v-9.294H9.691V11.01h3.129V8.41c0-3.1 1.893-4.788 4.66-4.788 1.325 0 2.463.102 2.795.148v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.764v2.315h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.667V1.333C24 .597 23.403 0 22.675 0z"
                        />
                    </svg>
                    <span class="hidden sm:inline">Connect on Facebook</span>
                    <span class="inline sm:hidden">Facebook</span>
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
