<script lang="ts">
    import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";
</script>

<section id="founder" class="border-t border-black/15 bg-[#f2f1ed] py-16 lg:py-24">
    <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
        <div class="mb-9 grid gap-6 border-b border-secondary pb-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
                <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">Founder · Profile 01</span>
                <h2 class="mt-2 font-clash-grotesk text-[2.55rem] font-semibold leading-none text-secondary sm:text-[3.5rem] lg:text-[4.5rem]">
                    Meet the founder.
                </h2>
            </div>
            <p class="max-w-xl text-[1rem] leading-7 text-secondary/65 lg:justify-self-end lg:text-right">
                The vision, creative conviction, and leadership behind TalkAfrica's commitment to authentic African storytelling.
            </p>
        </div>

        <div class="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div class="group relative min-h-[470px] overflow-hidden bg-secondary sm:min-h-[620px] lg:min-h-[760px]">
                <img
                    src="https://res.cloudinary.com/dwwyegu5r/image/upload/v1775389708/talkafrica/headshot-001.jpg"
                    alt="Portrait of John Emmanuel Fagbemi, founder of TalkAfrica"
                    class="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                    loading="lazy"
                />
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-6 pb-7 pt-28 text-white sm:px-9">
                    <span class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">Founder & Chief Executive Officer</span>
                    <p class="mt-2 font-clash-grotesk text-2xl font-semibold sm:text-3xl">John Emmanuel Fagbemi</p>
                </div>
            </div>

            <div class="flex flex-col bg-[#0b0b0b] text-white">
                <div class="grid border-b border-white/15 sm:grid-cols-3">
                    <div class="border-b border-white/15 px-6 py-5 sm:border-b-0 sm:border-r sm:px-8">
                        <span class="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/40">Discipline</span>
                        <p class="mt-1 font-clash-grotesk font-semibold">Storytelling</p>
                    </div>
                    <div class="border-b border-white/15 px-6 py-5 sm:border-b-0 sm:border-r sm:px-8">
                        <span class="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/40">Creative practice</span>
                        <p class="mt-1 font-clash-grotesk font-semibold">Music & Media</p>
                    </div>
                    <div class="px-6 py-5 sm:px-8">
                        <span class="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/40">Focus</span>
                        <p class="mt-1 font-clash-grotesk font-semibold">African narratives</p>
                    </div>
                </div>

                <div class="flex flex-1 flex-col justify-between p-7 sm:p-10 lg:p-14">
                    <div>
                        <span class="font-clash-grotesk text-6xl leading-none text-accent" aria-hidden="true">“</span>
                        <p class="mt-4 max-w-3xl font-clash-grotesk text-[1.7rem] font-medium leading-[1.3] sm:text-[2.25rem] lg:text-[2.6rem]">
                            Culture, creativity and impact belong in the same conversation.
                        </p>

                        <div class="mt-10 grid gap-6 text-[0.98rem] leading-7 text-white/70 xl:grid-cols-2">
                            <p>
                                John Emmanuel Fagbemi is a storyteller and media advocate dedicated to reshaping Africa's narrative by amplifying voices, preserving heritage, and promoting content rooted in truth and identity.
                            </p>
                            <p>
                                As founder and CEO of TalkAfrica Nigeria, he brings together his training in music, his work as a saxophonist, and a wider commitment to service, media, and humanitarian impact.
                            </p>
                        </div>
                    </div>

                    <div class="mt-12 border-t border-white/15 pt-8">
                        <h3 class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">Selected background</h3>
                        <ul class="mt-5 divide-y divide-white/15 border-y border-white/15">
                            <li class="grid grid-cols-[2rem_1fr] gap-3 py-4 text-sm leading-6 text-white/72">
                                <span class="font-bold text-accent">01</span>
                                <span>Award-winning leader recognised for work across service, media, and humanitarian initiatives.</span>
                            </li>
                            <li class="grid grid-cols-[2rem_1fr] gap-3 py-4 text-sm leading-6 text-white/72">
                                <span class="font-bold text-accent">02</span>
                                <span>Millennium Fellowship alumnus and participant in the Pay Attention to Him Project.</span>
                            </li>
                            <li class="grid grid-cols-[2rem_1fr] gap-3 py-4 text-sm leading-6 text-white/72">
                                <span class="font-bold text-accent">03</span>
                                <span>International certification in Critical Thinking from the Metropolitan School of Business and Management, United Kingdom.</span>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <a
                            href="https://www.linkedin.com/in/john-fagbemi-893825386?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex min-h-12 items-center justify-between gap-6 border border-accent bg-accent px-5 py-3 text-sm font-bold text-secondary transition-colors hover:bg-transparent hover:text-accent"
                        >
                            LinkedIn <ArrowIcon direction="up-right" />
                        </a>
                        <a
                            href="https://www.instagram.com/kingjohndesax?igsh=bzk3bGp1enE4azY3&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex min-h-12 items-center justify-between gap-6 border border-white/35 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent"
                        >
                            Instagram <ArrowIcon direction="up-right" />
                        </a>
                        <a
                            href="mailto:talkafricang@gmail.com"
                            class="inline-flex min-h-12 items-center justify-between gap-6 border border-white/35 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent"
                        >
                            Send email <ArrowIcon />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
