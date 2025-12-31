<script lang="ts">
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";
    import { goto } from "$app/navigation";

    export let data;
    let video = data.video;

    let title = video.title;
    let description = video.description || "";
    let category = video.category;
    let author = video.author;
    let isFeatured = video.is_featured;
    let video_url = video.video_url;
    let thumbnail_url = video.thumbnail_url;
    let duration = video.duration;

    let videoFile: File | null = null;
    let thumbnailFile: File | null = null;

    let isUploading = false;
    let uploadProgress = 0;

    let categories = [
        "Travel",
        "Health",
        "Fashion",
        "Technology",
        "Lifestyle",
        "News",
    ];

    async function handleFileSelect(event: Event, type: "video" | "thumbnail") {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            if (type === "video") videoFile = input.files[0];
            else thumbnailFile = input.files[0];
        }
    }

    async function uploadFile(file: File, endpoint: string) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(endpoint, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data;
    }

    async function handleSubmit() {
        if (!title || !description) {
            alert("Please fill in required fields");
            return;
        }

        isUploading = true;
        uploadProgress = 10;

        try {
            // Optional: Upload new thumbnail if selected
            let newThumbUrl = thumbnail_url;
            if (thumbnailFile) {
                const thumbRes = await uploadFile(thumbnailFile, "/api/upload");
                newThumbUrl = thumbRes.url;
                uploadProgress = 40;
            }

            // Optional: Upload new video if selected
            let newVideoUrl = video_url;
            let newDuration = duration;
            if (videoFile) {
                const videoRes = await uploadFile(
                    videoFile,
                    "/api/upload-video",
                );
                newVideoUrl = videoRes.url;
                newDuration = videoRes.duration
                    ? formatDuration(videoRes.duration)
                    : "0:00";
                uploadProgress = 80;
            }

            // Update DB
            const payload = {
                title,
                description,
                category,
                author,
                video_url: newVideoUrl,
                thumbnail_url: newThumbUrl,
                duration: newDuration,
                is_featured: isFeatured,
            };

            const saveRes = await fetch(`/api/videos/${video.video_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (saveRes.ok) {
                uploadProgress = 100;
                goto("/admin/videos");
            } else {
                throw new Error("Failed to update video");
            }
        } catch (e: any) {
            console.error(e);
            alert("Error: " + e.message);
        } finally {
            isUploading = false;
        }
    }

    function formatDuration(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    }
</script>

<svelte:head>
    <title>Edit Video - Talk Africa</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />

    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="videos" />

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            <div class="max-w-3xl mx-auto">
                <h2 class="text-2xl font-semibold text-gray-900 mb-6">
                    Edit Video
                </h2>

                <div
                    class="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-6"
                >
                    <!-- Video Upload -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Video</label
                        >
                        {#if video_url && !videoFile}
                            <div
                                class="mb-2 p-4 bg-gray-50 rounded border border-gray-200 flex items-center justify-between"
                            >
                                <span
                                    class="text-xs text-gray-500 truncate max-w-xs"
                                    >{video_url}</span
                                >
                                <span
                                    class="text-xs font-semibold text-gray-700"
                                    >Current Video</span
                                >
                            </div>
                        {/if}
                        <div
                            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors"
                        >
                            {#if videoFile}
                                <div
                                    class="flex items-center justify-center gap-2 text-green-600"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        /></svg
                                    >
                                    <span class="font-medium"
                                        >{videoFile.name} ({(
                                            videoFile.size /
                                            (1024 * 1024)
                                        ).toFixed(1)} MB)</span
                                    >
                                </div>
                            {:else}
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/quicktime"
                                    class="hidden"
                                    id="video-upload"
                                    on:change={(e) =>
                                        handleFileSelect(e, "video")}
                                />
                                <label
                                    for="video-upload"
                                    class="cursor-pointer flex flex-col items-center"
                                >
                                    <span class="text-base text-gray-600"
                                        >Replace Video File (Optional)</span
                                    >
                                    <span class="text-xs text-gray-400 mt-1"
                                        >Leave empty to keep current video</span
                                    >
                                </label>
                            {/if}
                        </div>
                    </div>

                    <!-- Thumbnail Upload -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Thumbnail</label
                        >
                        {#if thumbnail_url && !thumbnailFile}
                            <div
                                class="mb-2 w-32 h-20 bg-gray-200 rounded overflow-hidden"
                            >
                                <img
                                    src={thumbnail_url}
                                    alt="Current"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                        {/if}
                        <div
                            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors"
                        >
                            {#if thumbnailFile}
                                <div
                                    class="flex items-center justify-center gap-2 text-green-600"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        ><path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M5 13l4 4L19 7"
                                        /></svg
                                    >
                                    <span class="font-medium"
                                        >{thumbnailFile.name}</span
                                    >
                                </div>
                            {:else}
                                <input
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    id="thumb-upload"
                                    on:change={(e) =>
                                        handleFileSelect(e, "thumbnail")}
                                />
                                <label
                                    for="thumb-upload"
                                    class="cursor-pointer flex flex-col items-center"
                                >
                                    <span class="text-base text-gray-600"
                                        >Replace Thumbnail (Optional)</span
                                    >
                                </label>
                            {/if}
                        </div>
                    </div>

                    <!-- Title -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Title *</label
                        >
                        <input
                            bind:value={title}
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                        />
                    </div>

                    <!-- Description -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                            >Description *</label
                        >
                        <textarea
                            bind:value={description}
                            rows="4"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                        ></textarea>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <!-- Category -->
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Category *</label
                            >
                            <select
                                bind:value={category}
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                            >
                                {#each categories as cat}
                                    <option value={cat}>{cat}</option>
                                {/each}
                            </select>
                        </div>

                        <!-- Author -->
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-1"
                                >Author</label
                            >
                            <input
                                bind:value={author}
                                type="text"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <!-- Featured -->
                    <div class="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            bind:checked={isFeatured}
                            class="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                        />
                        <label
                            for="featured"
                            class="text-sm font-medium text-gray-700"
                            >Featured Video</label
                        >
                    </div>

                    <!-- Actions -->
                    <div
                        class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100"
                    >
                        <a
                            href="/admin/videos"
                            class="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                            >Cancel</a
                        >
                        <button
                            on:click={handleSubmit}
                            disabled={isUploading}
                            class="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {#if isUploading}
                                <svg
                                    class="animate-spin h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Updating...
                            {:else}
                                Update Video
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
