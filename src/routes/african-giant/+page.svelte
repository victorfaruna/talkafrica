<script lang="ts">
    import { fade } from "svelte/transition";
    export let data;

    // Derived state for posts
    $: posts = data.posts || [];
    $: pagination = data.pagination;
</script>

<svelte:head>
    <title>African Giant of the Week - TalkAfrica</title>
    <meta
        name="description"
        content="Celebrating Africa's most influential leaders, innovators, and changemakers who are shaping the continent's future."
    />
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-20">
    <!-- Hero Header -->
    <header
        class="relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-24 px-4 overflow-hidden"
    >
        <div
            class="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-repeat"
        ></div>
        <div class="container mx-auto max-w-6xl relative z-10 text-center">
            <div
                class="inline-block p-4 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-bounce-slow"
            >
                <span class="text-4xl">👑</span>
            </div>
            <h1
                class="text-4xl md:text-6xl font-clash-grotesk font-bold mb-6 tracking-tight"
            >
                African Giant of the Week
            </h1>
            <p
                class="text-xl md:text-2xl max-w-3xl mx-auto text-yellow-50 font-light leading-relaxed"
            >
                Celebrating Africa's most influential leaders, innovators, and
                changemakers who are shaping the continent's future.
            </p>
        </div>

        <!-- Decoration -->
        <div
            class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"
        ></div>
    </header>

    <!-- Content -->
    <div class="container mx-auto max-w-7xl px-4 -mt-10 relative z-20">
        {#if posts.length === 0}
            <div
                class="bg-white rounded-2xl shadow-lg p-12 text-center"
                in:fade
            >
                <div
                    class="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <svg
                        class="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        ></path></svg
                    >
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                    No Giants Found Yet
                </h3>
                <p class="text-gray-500">
                    We appear to be fresh out of giants for the moment. Check
                    back soon!
                </p>
            </div>
        {:else}
            <!-- Featured Latest Giant (First item) -->
            {#if posts[0]}
                <div
                    class="bg-white rounded-3xl shadow-xl overflow-hidden mb-16 transform transition hover:shadow-2xl duration-300"
                    in:fade
                >
                    <div class="grid lg:grid-cols-2 gap-0">
                        <div class="relative h-96 lg:h-auto min-h-[400px]">
                            <img
                                src={posts[0].image ||
                                    "/images/placeholder.jpg"}
                                alt={posts[0].title}
                                class="absolute inset-0 w-full h-full object-cover"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10"
                            ></div>
                        </div>
                        <div class="p-10 lg:p-16 flex flex-col justify-center">
                            <div class="mb-6">
                                <span
                                    class="bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wide"
                                >
                                    Latest Feature
                                </span>
                            </div>
                            <h2
                                class="text-3xl lg:text-5xl font-clash-grotesk font-bold text-gray-900 mb-6 leading-tight"
                            >
                                <a
                                    href="/posts/{posts[0].post_id}"
                                    class="hover:text-yellow-600 transition-colors"
                                >
                                    {posts[0].title}
                                </a>
                            </h2>
                            <p
                                class="text-lg text-gray-600 mb-8 leading-relaxed line-clamp-3"
                            >
                                {posts[0].excerpt}
                            </p>
                            <div class="flex items-center gap-6">
                                <a
                                    href="/posts/{posts[0].post_id}"
                                    class="bg-gray-900 text-white text-lg font-medium px-8 py-3 rounded-xl hover:bg-yellow-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-yellow-500/30"
                                >
                                    Read Full Story
                                </a>
                                <span class="text-gray-500 text-sm">
                                    {new Date(
                                        posts[0].created_at,
                                    ).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Previous Giants Grid -->
            {#if posts.length > 1}
                <div class="mb-12">
                    <h3
                        class="text-2xl font-bold text-gray-900 mb-8 flex items-center"
                    >
                        <span class="w-2 h-8 bg-yellow-500 mr-4 rounded-full"
                        ></span>
                        Previous Features
                    </h3>

                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {#each posts.slice(1) as post}
                            <article
                                class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group h-full border border-gray-100"
                            >
                                <a
                                    href="/posts/{post.post_id}"
                                    class="relative h-64 overflow-hidden block"
                                >
                                    <img
                                        src={post.image ||
                                            "/images/placeholder.jpg"}
                                        alt={post.title}
                                        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div
                                        class="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                                    >
                                        African Giant
                                    </div>
                                </a>
                                <div class="p-6 flex flex-col flex-1">
                                    <div
                                        class="text-sm text-gray-500 mb-3 flex items-center"
                                    >
                                        <svg
                                            class="w-4 h-4 mr-2 text-yellow-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            ></path></svg
                                        >
                                        {new Date(
                                            post.created_at,
                                        ).toLocaleDateString()}
                                    </div>
                                    <h3
                                        class="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-yellow-600 transition-colors"
                                    >
                                        <a href="/posts/{post.post_id}">
                                            {post.title}
                                        </a>
                                    </h3>
                                    <p
                                        class="text-gray-600 text-sm line-clamp-3 mb-6 flex-1"
                                    >
                                        {post.excerpt}
                                    </p>
                                    <a
                                        href="/posts/{post.post_id}"
                                        class="inline-flex items-center text-yellow-600 font-semibold text-sm hover:text-yellow-700"
                                    >
                                        Read Story <svg
                                            class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
                                    </a>
                                </div>
                            </article>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Pagination -->
            {#if pagination.totalPages > 1}
                <div class="flex justify-center mt-12 gap-2">
                    {#if pagination.hasPrevPage}
                        <a
                            href="?page={pagination.currentPage - 1}"
                            class="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 transition-all shadow-sm font-medium"
                        >
                            ← Previous
                        </a>
                    {/if}

                    <span
                        class="px-5 py-2.5 bg-gray-900 text-white rounded-lg shadow-sm font-medium"
                    >
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>

                    {#if pagination.hasNextPage}
                        <a
                            href="?page={pagination.currentPage + 1}"
                            class="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 transition-all shadow-sm font-medium"
                        >
                            Next →
                        </a>
                    {/if}
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    @keyframes bounce-slow {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    .animate-bounce-slow {
        animation: bounce-slow 3s infinite ease-in-out;
    }
</style>
