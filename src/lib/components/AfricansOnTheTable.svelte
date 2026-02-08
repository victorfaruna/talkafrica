<script lang="ts">
    export let posts: any[] = [];
    export let videos: any[] = [];
</script>

<section
    class="w-full relative bg-[#050505] py-20 lg:py-32 overflow-hidden text-white"
>
    <!-- Background Elements -->
    <div
        class="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F7941D]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
    ></div>
    <div
        class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#AA7216]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"
    ></div>
    <!-- Grain/Texture overlay -->
    <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise"
    ></div>

    <div
        class="relative z-10 w-full max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-[var(--side-p)]"
    >
        <!-- Header -->
        <div
            class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <span class="w-12 h-[2px] bg-[#F7941D]"></span>
                    <span
                        class="text-[#F7941D] font-bold tracking-[0.2em] text-sm uppercase"
                        >Premium Content</span
                    >
                </div>
                <div class="flex items-center gap-6">
                    <h2
                        class="font-clash-grotesk font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-white"
                    >
                        Africans on <br />
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-[#F7941D] to-[#FDB022]"
                            >the Table</span
                        >
                    </h2>
                    <div
                        class="block relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rotate-6 hover:rotate-0 transition-transform duration-500 shrink-0"
                    >
                        <div
                            class="absolute inset-0 bg-[#F7941D] rounded-2xl rotate-6 opacity-20"
                        ></div>
                        <img
                            src="/images/africans-on-the-table.jpg"
                            alt="Africans on the Table"
                            class="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl border-2 border-[#F7941D]/20"
                        />
                    </div>
                </div>
            </div>
            <p
                class="max-w-md text-lg text-gray-400 font-medium leading-relaxed border-l-2 border-[#F7941D]/30 pl-6"
            >
                Where African voices lead the conversation—owning our stories,
                shaping narratives, and influencing the future.
            </p>
        </div>

        <!-- Content Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <!-- Left: Main Featured Item (7 cols) -->
            <div class="lg:col-span-7 xl:col-span-8">
                {#if videos.length > 0}
                    <!-- Featured Video -->
                    {#each videos.slice(0, 1) as video}
                        <div
                            class="group relative w-full aspect-[3/4] md:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/9] rounded-[2rem] overflow-hidden bg-gray-900 border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(247,148,29,0.15)]"
                        >
                            <!-- Image -->
                            <img
                                src={video.thumbnail_url ||
                                    "/images/placeholder.webp"}
                                alt={video.title}
                                class="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-700"
                            />

                            <!-- Overlay Gradient -->
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
                            ></div>

                            <!-- Play Button (Centered) -->
                            <div
                                class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                            >
                                <div
                                    class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-[#F7941D] group-hover:border-[#F7941D] transition-all duration-300"
                                >
                                    <svg
                                        class="w-8 h-8 md:w-10 md:h-10 text-white fill-current ml-1"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>

                            <!-- Content Overlay -->
                            <div
                                class="absolute bottom-0 left-0 w-full p-6 md:p-12 z-30"
                            >
                                <div class="flex items-center gap-3 mb-4">
                                    <span
                                        class="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 text-xs font-bold text-white uppercase tracking-wider"
                                    >
                                        Video
                                    </span>
                                    <span
                                        class="text-[#F7941D] text-sm font-bold"
                                        >Featured Discussion</span
                                    >
                                </div>
                                <h3
                                    class="font-clash-grotesk font-bold text-2xl md:text-5xl leading-tight mb-4 text-white group-hover:text-[#F7941D] transition-colors"
                                >
                                    {video.title}
                                </h3>
                                <div class="flex items-center gap-4 mt-6">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold"
                                    >
                                        AO
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-white text-sm font-bold"
                                            >TalkAfrica Team</span
                                        >
                                        <span class="text-white/50 text-xs"
                                            >Host</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                {:else if posts.length > 0}
                    <!-- Featured Post (if no video) -->
                    {#each posts.slice(0, 1) as post}
                        <a
                            href="/posts/{post.post_id}"
                            class="block group relative w-full aspect-[3/4] md:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/9] rounded-[2rem] overflow-hidden bg-gray-900 border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(247,148,29,0.15)]"
                        >
                            <img
                                src={post.image || "/images/placeholder.webp"}
                                alt={post.title}
                                class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
                            ></div>

                            <div
                                class="absolute bottom-0 left-0 w-full p-6 md:p-12 z-30"
                            >
                                <div class="flex items-center gap-3 mb-4">
                                    <span
                                        class="px-3 py-1 bg-[#F7941D] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#F7941D]/20"
                                    >
                                        Featured Article
                                    </span>
                                </div>
                                <h3
                                    class="font-clash-grotesk font-bold text-2xl md:text-5xl leading-tight mb-4 text-white group-hover:text-[#F7941D] transition-colors"
                                >
                                    {post.title}
                                </h3>
                                <p
                                    class="text-gray-300 text-lg line-clamp-2 max-w-3xl mb-6"
                                >
                                    {post.excerpt}
                                </p>

                                <!-- Author -->
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10"
                                    >
                                        <svg
                                            class="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            ></path></svg
                                        >
                                    </div>
                                    <div>
                                        <p
                                            class="text-white text-sm font-bold leading-none"
                                        >
                                            {post.author || "TalkAfrica"}
                                        </p>
                                        <p class="text-white/40 text-xs mt-1">
                                            Contributor
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/each}
                {:else}
                    <div
                        class="w-full h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-white/5"
                    >
                        <p class="text-white/30 font-clash-grotesk text-2xl">
                            Coming Soon
                        </p>
                    </div>
                {/if}
            </div>

            <!-- Right: Secondary Stack (5 cols) -->
            <div class="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
                <!-- If video featured, show posts. If post featured, show other posts -->
                {#if videos.length > 0 && posts.length > 0}
                    {#each posts.slice(0, 3) as post}
                        <a
                            href="/posts/{post.post_id}"
                            class="group relative flex items-center gap-5 p-4 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                        >
                            <div
                                class="w-28 h-28 shrink-0 rounded-2xl overflow-hidden relative"
                            >
                                <img
                                    src={post.image ||
                                        "/images/placeholder.webp"}
                                    alt={post.title}
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div class="flex-1 min-w-0 pr-2">
                                <div class="flex items-center gap-2 mb-2">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-[#F7941D]"
                                    ></span>
                                    <span
                                        class="text-[#F7941D] text-[10px] font-bold uppercase tracking-widest"
                                        >Article</span
                                    >
                                </div>
                                <h4
                                    class="text-white font-clash-grotesk font-semibold text-xl leading-snug group-hover:text-[#F7941D] transition-colors line-clamp-2"
                                >
                                    {post.title}
                                </h4>
                                <div
                                    class="mt-3 flex items-center gap-2 text-white/40 text-xs"
                                >
                                    <span>{post.author || "Admin"}</span>
                                    <span>•</span>
                                    <span
                                        >{new Date(
                                            post.created_at,
                                        ).toLocaleDateString()}</span
                                    >
                                </div>
                            </div>
                        </a>
                    {/each}
                {:else if posts.length > 1}
                    {#each posts.slice(1, 4) as post}
                        <a
                            href="/posts/{post.post_id}"
                            class="group relative flex items-center gap-5 p-4 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300"
                        >
                            <div
                                class="w-28 h-28 shrink-0 rounded-2xl overflow-hidden relative"
                            >
                                <img
                                    src={post.image ||
                                        "/images/placeholder.webp"}
                                    alt={post.title}
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div class="flex-1 min-w-0 pr-2">
                                <div class="flex items-center gap-2 mb-2">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-[#F7941D]"
                                    ></span>
                                    <span
                                        class="text-[#F7941D] text-[10px] font-bold uppercase tracking-widest"
                                        >Article</span
                                    >
                                </div>
                                <h4
                                    class="text-white font-clash-grotesk font-semibold text-xl leading-snug group-hover:text-[#F7941D] transition-colors line-clamp-2"
                                >
                                    {post.title}
                                </h4>
                                <div
                                    class="mt-3 flex items-center gap-2 text-white/40 text-xs"
                                >
                                    <span>{post.author || "Admin"}</span>
                                    <span>•</span>
                                    <span
                                        >{new Date(
                                            post.created_at,
                                        ).toLocaleDateString()}</span
                                    >
                                </div>
                            </div>
                        </a>
                    {/each}
                {/if}

                <!-- View All Link -->
                <a
                    href="/category/africans-on-the-table"
                    class="mt-auto group flex items-center justify-between p-6 rounded-3xl border border-[#F7941D]/30 hover:bg-[#F7941D] transition-all duration-300"
                >
                    <div>
                        <span
                            class="block text-white font-bold text-lg group-hover:text-white"
                            >View All Conversations</span
                        >
                        <span
                            class="text-white/50 text-sm group-hover:text-white/80"
                            >Explore more voices</span
                        >
                    </div>
                    <div
                        class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#F7941D] transition-all"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            ></path></svg
                        >
                    </div>
                </a>
            </div>
        </div>
    </div>
</section>
