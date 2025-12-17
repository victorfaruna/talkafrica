<script lang="ts">
    type Post = {
        post_id: string;
        title: string;
        image?: string | null;
        excerpt?: string | null;
        category?: string | null;
    };
    const { posts }: { posts: Post[] } = $props();

    const fallback = "/images/placeholder.webp";

    const primary = $derived(posts?.[0]);
    const secondary = $derived(posts?.slice(1, 3));

    console.log(posts);
</script>

<section
    id="headlines"
    class="flex w-screen max-w-[1900px] mx-auto flex-col gap-[2rem] px-[var(--side-p)] pt-[4rem]"
>
    <div class="flex flex-col lg:flex-row gap-2 w-full">
        <a
            class="group relative item w-full lg:w-[70%] h-[220px] lg:h-[520px] overflow-hidden"
            href={primary ? `/posts/${primary.post_id}` : "#"}
            aria-label={primary ? primary.title : "Headline"}
        >
            <img
                src={primary?.image || fallback}
                alt={primary?.title || "Headline"}
                class="absolute inset-0 h-full w-full object-cover"
            />
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            ></div>
            <div class="absolute bottom-0 p-4 lg:p-6 text-white">
                {#if primary?.category}
                    <span
                        class="mb-2 inline-block rounded bg-white/20 px-2 py-1 text-xs"
                        >{primary.category}</span
                    >
                {/if}
                <h3
                    class="text-lg lg:text-2xl font-semibold leading-snug group-hover:underline"
                >
                    {primary?.title || "—"}
                </h3>
                {#if primary?.excerpt}
                    <p class="mt-2 hidden lg:block text-white/80 line-clamp-2">
                        {primary.excerpt}
                    </p>
                {/if}
            </div>
        </a>
        <div class="flex flex-row lg:flex-col gap-2 w-full flex-[1]">
            {#each secondary as s}
                <a
                    class="group relative item w-full h-[160px] lg:h-[256px] overflow-hidden"
                    href={`/posts/${s.post_id}`}
                    aria-label={s.title}
                >
                    <img
                        src={s.image || fallback}
                        alt={s.title}
                        class="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                    ></div>
                    <div class="absolute bottom-0 p-3 text-white">
                        {#if s.category}
                            <span
                                class="mb-2 inline-block rounded bg-white/20 px-2 py-0.5 text-[10px]"
                                >{s.category}</span
                            >
                        {/if}
                        <h4
                            class="text-sm lg:text-base font-semibold leading-snug line-clamp-2 group-hover:underline"
                        >
                            {s.title}
                        </h4>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<style>
    .item {
        @apply rounded-[8px];
    }
</style>
