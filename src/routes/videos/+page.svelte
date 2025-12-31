<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    export let data;
    let videos = data.videos || [];
</script>

<svelte:head>
    <title>Videos - Talk Africa</title>
</svelte:head>

<div class="app-container min-h-screen flex flex-col">
    <Header />

    <main class="flex-grow py-12 bg-gray-50">
        <div class="container mx-auto px-4 md:px-6">
            <h1
                class="text-3xl md:text-4xl font-bold text-secondary font-clash-grotesk mb-8 text-center"
            >
                Talk Africa Videos
            </h1>

            {#if videos.length === 0}
                <div class="text-center py-20">
                    <p class="text-gray-500 text-lg">No videos uploaded yet.</p>
                </div>
            {:else}
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {#each videos as video}
                        <div
                            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                        >
                            <!-- Thumbnail -->
                            <div class="relative aspect-video bg-gray-200">
                                <img
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div
                                    class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div
                                        class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md"
                                    >
                                        <svg
                                            class="w-5 h-5 text-accent ml-0.5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path d="M8 5v14l11-7z" /></svg
                                        >
                                    </div>
                                </div>
                                {#if video.duration}
                                    <div
                                        class="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded font-medium"
                                    >
                                        {video.duration}
                                    </div>
                                {/if}
                            </div>

                            <!-- Content -->
                            <div class="p-4">
                                <span
                                    class="text-xs font-semibold text-accent uppercase tracking-wide"
                                >
                                    {video.category}
                                </span>
                                <h3
                                    class="mt-1 text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-accent transition-colors"
                                >
                                    {video.title}
                                </h3>
                                <div
                                    class="flex items-center justify-between mt-3 text-xs text-gray-500"
                                >
                                    <span>{video.author}</span>
                                    <span
                                        >{new Date(
                                            video.created_at,
                                        ).toLocaleDateString()}</span
                                    >
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </main>

    <Footer />
</div>
