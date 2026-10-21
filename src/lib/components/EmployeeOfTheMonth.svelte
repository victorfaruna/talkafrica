<script lang="ts">
    export let employee: any = null;

    function formatUrl(url: string | null) {
        if (!url) return "";
        const cleaned = url.trim();
        return cleaned.startsWith("http://") || cleaned.startsWith("https://")
            ? cleaned
            : `https://${cleaned}`;
    }

    function formatWhatsApp(number: string | null) {
        if (!number) return "";
        const cleaned = number.replace(/\D/g, "");
        return `https://wa.me/${cleaned}?text=Hello! I saw your profile as the Employee of the Month on TalkAfrica.`;
    }
</script>

{#if employee}
    <section id="employee-of-the-month" class="border-t border-black/15 bg-white py-16 lg:py-24">
        <div class="mx-auto w-full max-w-[1900px] px-[var(--side-p)]">
            <div class="mb-9 grid gap-6 border-b border-secondary pb-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                    <span class="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-accent">Recognition · Monthly spotlight</span>
                    <h2 class="mt-2 font-clash-grotesk text-[2.55rem] font-semibold leading-none text-secondary sm:text-[3.5rem] lg:text-[4.5rem]">
                        Employee of the month.
                    </h2>
                </div>
                <p class="max-w-md text-[0.95rem] leading-7 text-secondary/60 lg:text-right">
                    Celebrating the people whose consistency, ideas, and care move TalkAfrica forward.
                </p>
            </div>

            <div class="grid lg:grid-cols-[0.78fr_1.22fr]">
                <div class="group relative min-h-[470px] overflow-hidden bg-[#e8e5de] sm:min-h-[650px] lg:min-h-[720px]">
                    <img
                        src={employee.photo_url}
                        alt={employee.name}
                        class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                        loading="lazy"
                    />
                    <div class="absolute left-0 top-0 bg-accent px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-secondary">
                        Outstanding contribution
                    </div>
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-7 pt-28 text-white sm:px-9">
                        <span class="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent">This month's honouree</span>
                        <h3 class="mt-2 font-clash-grotesk text-3xl font-semibold leading-tight sm:text-4xl">{employee.name}</h3>
                        <p class="mt-2 text-sm text-white/65">{employee.role}</p>
                    </div>
                </div>

                <div class="flex flex-col border border-t-0 border-black/15 bg-[#f2f1ed] lg:min-h-[720px] lg:border-l-0 lg:border-t">
                    <div class="grid border-b border-black/15 sm:grid-cols-2">
                        <div class="border-b border-black/15 px-6 py-5 sm:border-b-0 sm:border-r sm:px-9">
                            <span class="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-secondary/45">Recognition</span>
                            <p class="mt-1 font-clash-grotesk font-semibold text-secondary">Exceptional performance</p>
                        </div>
                        <div class="px-6 py-5 sm:px-9">
                            <span class="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-secondary/45">Edition</span>
                            <p class="mt-1 font-clash-grotesk font-semibold text-secondary">Employee spotlight</p>
                        </div>
                    </div>

                    <div class="flex flex-1 flex-col justify-between p-7 sm:p-10 lg:p-14">
                        <div>
                            <span class="font-clash-grotesk text-6xl leading-none text-accent" aria-hidden="true">“</span>
                            <p class="mt-3 max-w-3xl font-clash-grotesk text-[1.65rem] font-medium leading-[1.35] text-secondary sm:text-[2.1rem] lg:text-[2.45rem]">
                                {employee.impact_quote || "Excellence is built through consistency, purpose, and care."}
                            </p>

                            <div class="mt-10 border-l-4 border-accent pl-5 text-[1rem] leading-8 text-secondary/70 lg:text-[1.08rem]">
                                {employee.bio}
                            </div>

                            <div class="mt-10 border-y border-black/15 py-6">
                                <span class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-accent">Key contribution</span>
                                <p class="mt-3 max-w-3xl text-[0.96rem] leading-7 text-secondary/70">
                                    {employee.contribution || `Through storytelling and dedicated research, ${employee.name.split(" ")[0]} has helped amplify voices that redefine the African narrative on a global scale.`}
                                </p>
                            </div>
                        </div>

                        <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            {#if employee.email}
                                <a href={`mailto:${employee.email}`} class="inline-flex min-h-12 items-center justify-between gap-6 border border-secondary bg-secondary px-5 py-3 text-sm font-bold text-white transition-colors hover:border-accent hover:bg-accent hover:text-secondary">
                                    Email <span aria-hidden="true">→</span>
                                </a>
                            {/if}
                            {#if employee.linkedin_url}
                                <a href={formatUrl(employee.linkedin_url)} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-12 items-center justify-between gap-6 border border-secondary/35 px-5 py-3 text-sm font-bold text-secondary transition-colors hover:border-secondary hover:bg-white">
                                    LinkedIn <span aria-hidden="true">↗</span>
                                </a>
                            {/if}
                            {#if employee.twitter_url}
                                <a href={formatUrl(employee.twitter_url)} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-12 items-center justify-between gap-6 border border-secondary/35 px-5 py-3 text-sm font-bold text-secondary transition-colors hover:border-secondary hover:bg-white">
                                    X / Twitter <span aria-hidden="true">↗</span>
                                </a>
                            {/if}
                            {#if employee.whatsapp_number}
                                <a href={formatWhatsApp(employee.whatsapp_number)} target="_blank" rel="noopener noreferrer" class="inline-flex min-h-12 items-center justify-between gap-6 border border-secondary/35 px-5 py-3 text-sm font-bold text-secondary transition-colors hover:border-secondary hover:bg-white">
                                    WhatsApp <span aria-hidden="true">↗</span>
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
{/if}
