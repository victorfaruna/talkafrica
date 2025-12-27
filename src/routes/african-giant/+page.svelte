<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    let posts: any[] = [];
    let loading = true;

    async function loadPosts() {
        try {
            loading = true;
            const response = await fetch(
                `/api/posts?category=african-giant&status=published&limit=12`,
            );
            const data = await response.json();

            if (data.success) {
                posts = data.posts || [];
            } else {
                console.error("Failed to load posts:", data);
                posts = [];
            }
        } catch (error) {
            console.error("Error loading African Giant posts:", error);
            posts = [];
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        loadPosts();
    });

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function formatViews(views: number) {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
        if (views >= 1000) return (views / 1000).toFixed(1) + "K";
        return views.toString();
    }
</script>

<svelte:head>
    <title>African Giant of the Week - TalkAfrica</title>
    <meta
        name="description"
        content="Celebrating Africa's most influential leaders, innovators, and changemakers who are shaping the continent's future."
    />
</svelte:head>

<Header />

<div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30"
>
    <!-- Hero Header -->
    <header
        class="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 text-white py-24 px-4 overflow-hidden"
    >
        <!-- Animated Background Pattern -->
        <div class="absolute inset-0 opacity-10">
            <div
                class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"
            ></div>
            <div
                class="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"
                style="animation-delay: 1s;"
            ></div>
        </div>

        <div class="container mx-auto max-w-6xl relative z-10 text-center">
            <div
                class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm mb-8 shadow-2xl"
                in:fly={{ y: -20, duration: 600 }}
            >
                <span class="text-6xl">👑</span>
            </div>
            <h1
                class="text-5xl md:text-7xl font-clash-grotesk font-bold mb-6 tracking-tight leading-tight"
                in:fly={{ y: 20, duration: 600, delay: 100 }}
            >
                African Giant of the Week
            </h1>
            <p
                class="text-xl md:text-2xl max-w-3xl mx-auto text-white/95 leading-relaxed font-light"
                in:fly={{ y: 20, duration: 600, delay: 200 }}
            >
                Celebrating Africa's most influential leaders, innovators, and
                changemakers who are shaping the continent's future.
            </p>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto max-w-7xl px-4 py-16">
        {#if loading}
            <div
                class="flex flex-col items-center justify-center py-32"
                in:fade
            >
                <div class="relative">
                    <div
                        class="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"
                    ></div>
                    <div
                        class="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-orange-300 rounded-full animate-spin"
                        style="animation-duration: 1.5s; animation-direction: reverse;"
                    ></div>
                </div>
                <p class="mt-8 text-lg text-gray-600 font-medium">
                    Loading African Giants...
                </p>
            </div>
        {:else if posts.length === 0}
            <!-- Enhanced Empty State -->
            <div class="max-w-2xl mx-auto" in:fade>
                <div
                    class="bg-white rounded-3xl shadow-2xl p-16 text-center border border-orange-100/50 relative overflow-hidden"
                >
                    <div
                        class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-30 -mr-32 -mt-32"
                    ></div>

                    <div class="relative">
                        <div
                            class="w-28 h-28 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transform hover:scale-105 transition-transform"
                        >
                            <svg
                                class="w-14 h-14"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                ></path>
                            </svg>
                        </div>
                        <h3
                            class="text-4xl font-clash-grotesk font-bold text-gray-900 mb-6"
                        >
                            No Giants Found Yet
                        </h3>
                        <p
                            class="text-gray-600 text-xl mb-10 max-w-md mx-auto leading-relaxed"
                        >
                            We're currently preparing to feature our next
                            African Giant. Check back soon to discover inspiring
                            stories!
                        </p>
                        <a
                            href="/"
                            class="inline-flex items-center gap-3 bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        {:else}
            <!-- Featured Latest Giant -->
            {#if posts[0]}
                <div class="mb-20" in:fly={{ y: 40, duration: 600 }}>
                    <div
                        class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 group hover:shadow-orange-500/10 transition-all duration-500"
                    >
                        <div class="grid lg:grid-cols-5 gap-0">
                            <!-- Image Column -->
                            <div
                                class="lg:col-span-2 relative h-96 lg:h-auto lg:min-h-[500px] overflow-hidden"
                            >
                                <img
                                    src={posts[0].image ||
                                        "/images/placeholder.jpg"}
                                    alt={posts[0].title}
                                    class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div
                                    class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/40 via-black/10 to-transparent"
                                ></div>

                                <!-- Featured Badge -->
                                <div class="absolute top-8 left-8">
                                    <span
                                        class="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl backdrop-blur-sm"
                                    >
                                        <svg
                                            class="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        Latest Feature
                                    </span>
                                </div>
                            </div>

                            <!-- Content Column -->
                            <div
                                class="lg:col-span-3 p-10 lg:p-16 flex flex-col justify-center"
                            >
                                <div
                                    class="flex items-center gap-4 mb-6 text-sm text-gray-500"
                                >
                                    <span class="flex items-center gap-2">
                                        <svg
                                            class="w-5 h-5 text-orange-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        By {posts[0].author || "Admin"}
                                    </span>
                                    <span>•</span>
                                    <span class="flex items-center gap-2">
                                        <svg
                                            class="w-5 h-5 text-orange-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        {formatDate(posts[0].created_at)}
                                    </span>
                                    <span>•</span>
                                    <span class="flex items-center gap-2">
                                        <svg
                                            class="w-5 h-5 text-orange-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        {formatViews(posts[0].views || 0)} views
                                    </span>
                                </div>

                                <h2
                                    class="text-3xl lg:text-5xl xl:text-6xl font-clash-grotesk font-bold text-gray-900 mb-6 leading-tight"
                                >
                                    <a
                                        href="/posts/{posts[0].post_id}"
                                        class="hover:text-orange-600 transition-colors"
                                    >
                                        {posts[0].title}
                                    </a>
                                </h2>

                                <p
                                    class="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed line-clamp-3"
                                >
                                    {posts[0].excerpt}
                                </p>

                                <div class="flex flex-wrap items-center gap-4">
                                    <a
                                        href="/posts/{posts[0].post_id}"
                                        class="inline-flex items-center gap-3 bg-orange-500 text-white text-lg font-bold px-10 py-4 rounded-2xl hover:bg-orange-600 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                                    >
                                        Read Full Story
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
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Previous Features Grid -->
            {#if posts.length > 1}
                <div class="mb-16">
                    <div class="flex items-center gap-4 mb-12">
                        <div
                            class="w-1.5 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"
                        ></div>
                        <h3
                            class="text-3xl md:text-4xl font-clash-grotesk font-bold text-gray-900"
                        >
                            Previous Features
                        </h3>
                    </div>

                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {#each posts.slice(1) as post, index}
                            <article
                                class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group border border-gray-100 hover:border-orange-200"
                                in:fly={{
                                    y: 40,
                                    duration: 600,
                                    delay: index * 100,
                                }}
                            >
                                <a
                                    href="/posts/{post.post_id}"
                                    class="relative h-56 overflow-hidden block"
                                >
                                    <img
                                        src={post.image ||
                                            "/images/placeholder.jpg"}
                                        alt={post.title}
                                        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    ></div>

                                    <div class="absolute top-4 right-4">
                                        <span
                                            class="bg-white/95 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full shadow-lg text-orange-600"
                                        >
                                            African Giant
                                        </span>
                                    </div>
                                </a>

                                <div class="p-6 flex flex-col flex-1">
                                    <div
                                        class="flex items-center gap-3 text-sm text-gray-500 mb-4"
                                    >
                                        <span class="flex items-center gap-1.5">
                                            <svg
                                                class="w-4 h-4 text-orange-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {formatDate(post.created_at)}
                                        </span>
                                    </div>

                                    <h3
                                        class="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2"
                                    >
                                        <a href="/posts/{post.post_id}">
                                            {post.title}
                                        </a>
                                    </h3>

                                    <p
                                        class="text-gray-600 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed"
                                    >
                                        {post.excerpt}
                                    </p>

                                    <a
                                        href="/posts/{post.post_id}"
                                        class="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:text-orange-700 group/link"
                                    >
                                        Read Story
                                        <svg
                                            class="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </article>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </main>
</div>

<Footer />

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.1;
        }
        50% {
            opacity: 0.2;
        }
    }

    .animate-pulse {
        animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>
