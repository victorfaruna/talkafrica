<script lang="ts">
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";
    import { goto } from "$app/navigation";

    let title = "";
    let description = "";
    let category = "Travel";
    let author = "Robert Fox";
    let isFeatured = false;
    let videoFile: File | null = null;
    let thumbnailFile: File | null = null;

    let isUploading = false;
    let uploadProgress = 0; // Fake progress for UX

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
        return data; // returns { url, duration, etc }
    }

    async function handleSubmit() {
        if (!videoFile || !thumbnailFile || !title || !description) {
            alert("Please fill in all required fields");
            return;
        }

        isUploading = true;
        uploadProgress = 10;

        try {
            // 1. Upload Thumbnail
            const thumbRes = await uploadFile(thumbnailFile, "/api/upload");
            uploadProgress = 40;

            // 2. Upload Video
            const videoRes = await uploadFile(videoFile, "/api/upload-video");
            uploadProgress = 80;

            // 3. Save to DB
            const payload = {
                title,
                description,
                category,
                author,
                video_url: videoRes.url,
                thumbnail_url: thumbRes.url,
                duration: videoRes.duration
                    ? formatDuration(videoRes.duration)
                    : "0:00",
                is_featured: isFeatured,
            };

            const saveRes = await fetch("/api/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (saveRes.ok) {
                uploadProgress = 100;
                goto("/admin/videos");
            } else {
                throw new Error("Failed to save video metadata");
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
    <title>Add New Video - Talk Africa</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />

    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="videos" />

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            <div class="max-w-3xl mx-auto">
                <h2 class="text-2xl font-semibold text-gray-900 mb-6">
                    Add New Video
                </h2>

                <div
                    class="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-6"
                >
                    <!-- Video Upload -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Video Upload *</label
                        >
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
                                    <span class="text-4xl mb-2">📹</span>
                                    <span class="text-gray-600"
                                        >Drag & drop video file or click to
                                        browse</span
                                    >
                                    <span class="text-xs text-gray-400 mt-1"
                                        >Supports: MP4, WebM, MOV (Max 500MB)</span
                                    >
                                </label>
                            {/if}
                        </div>
                    </div>

                    <!-- Thumbnail Upload -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Thumbnail Image *</label
                        >
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
                                    <span class="text-4xl mb-2">🖼️</span>
                                    <span class="text-gray-600"
                                        >Upload thumbnail (1280x720)</span
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
                            >Featured Video (Show on homepage)</label
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
                                Uploading ({uploadProgress}%)
                            {:else}
                                Publish Video
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
