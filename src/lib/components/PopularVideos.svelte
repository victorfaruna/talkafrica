<script lang="ts">
    import { fade } from "svelte/transition";

    export let videos: any[] = [];

    // Default to first video or placeholders if none exist
    let mainVideo = videos.length > 0 ? videos[0] : null;

    function setMainVideo(video: any) {
        mainVideo = video;
    }

    function formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    }
</script>

<section class="py-12 bg-white">
    <div class="container mx-auto px-4 md:px-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <h2
                class="text-2xl md:text-3xl font-bold text-secondary font-clash-grotesk"
            >
                Popular Videos
            </h2>
            <a
                href="/videos"
                class="text-sm font-medium text-gray-600 hover:text-accent transition-colors underline decoration-gray-300 hover:decoration-accent underline-offset-4"
            >
                Discover All
            </a>
        </div>

        {#if videos.length === 0}
            <div
                class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200"
            >
                <p class="text-gray-500">No videos available yet.</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Sidebar: Playlist -->
                <div class="lg:col-span-1 space-y-6">
                    {#each videos.slice(0, 3) as video}
                        <button
                            class="w-full group text-left flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                            on:click={() => setMainVideo(video)}
                        >
                            <!-- Thumbnail -->
                            <div
                                class="relative w-32 h-20 md:w-36 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200"
                            >
                                <img
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div
                                    class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div
                                        class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                                    >
                                        <svg
                                            class="w-4 h-4 text-accent ml-0.5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path d="M8 5v14l11-7z" /></svg
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <span
                                    class={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded mb-1 text-green-700 bg-green-50`}
                                >
                                    {video.category}
                                </span>
                                <h3
                                    class="text-sm font-bold text-gray-900 group-hover:text-accent transition-colors line-clamp-2 leading-snug"
                                >
                                    {video.title}
                                </h3>
                                <div
                                    class="flex items-center gap-3 mt-2 text-xs text-gray-500"
                                >
                                    <div class="flex items-center gap-1">
                                        <svg
                                            class="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            /></svg
                                        >
                                        <span class="truncate max-w-[80px]"
                                            >{video.author}</span
                                        >
                                    </div>
                                    <!-- Optional: Share count or duration -->
                                    {#if video.duration}
                                        <div class="flex items-center gap-1">
                                            <svg
                                                class="w-3 h-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                ><path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                /></svg
                                            >
                                            <span>{video.duration}</span>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>

                <!-- Right Side: Main Player -->
                <div class="lg:col-span-2">
                    {#if mainVideo}
                        <div
                            class="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl group"
                            transition:fade
                        >
                            <video
                                src={mainVideo.video_url}
                                poster={mainVideo.thumbnail_url}
                                controls
                                class="w-full h-full object-contain"
                            >
                                <track kind="captions" />
                                <!-- Adding empty track manually to satisfy a11y -->
                            </video>
                        </div>
                        <div class="mt-6">
                            <div class="flex items-center gap-3 mb-3">
                                <span
                                    class="px-3 py-1 text-xs font-bold text-white bg-accent rounded-full"
                                >
                                    {mainVideo.category}
                                </span>
                            </div>
                            <h3
                                class="text-2xl md:text-3xl font-bold text-secondary mb-3 leading-tight"
                            >
                                {mainVideo.title}
                            </h3>
                            <div
                                class="flex items-center gap-6 text-sm text-gray-600 border-b border-gray-100 pb-4 mb-4"
                            >
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden"
                                    >
                                        <!-- Placeholder avatar since we don't have author image in schema yet -->
                                        <svg
                                            class="w-full h-full text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                                            /></svg
                                        >
                                    </div>
                                    <span class="font-medium"
                                        >{mainVideo.author}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <svg
                                        class="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        /></svg
                                    >
                                    <span
                                        >{formatDate(
                                            mainVideo.created_at,
                                        )}</span
                                    >
                                </div>
                                {#if mainVideo.duration}
                                    <div class="flex items-center gap-2">
                                        <svg
                                            class="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            ><path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            /></svg
                                        >
                                        <span>{mainVideo.duration} read</span>
                                        <!-- Mockup said 'read', likely meant 'watch' or duration -->
                                    </div>
                                {/if}
                            </div>
                            <p class="text-gray-600 leading-relaxed max-w-3xl">
                                {mainVideo.description}
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>
</section>
