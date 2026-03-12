<script lang="ts">
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";
    import { goto } from "$app/navigation";

    // Form state
    let caption = "";
    let tag = "Community";
    let display_order = 0;

    let imageFile: File | null = null;
    let imagePreview = "";

    let isSubmitting = false;
    let uploadProgress = 0;

    const availableTags = [
        "Community",
        "Culture",
        "Tech",
        "Editorial",
        "Big Screen",
        "Impact",
    ];

    function handleImageSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            imageFile = input.files[0];
            imagePreview = URL.createObjectURL(imageFile);
        }
    }

    async function uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Upload failed");
        return data.url;
    }

    async function handleSubmit() {
        if (!caption || !imageFile) {
            alert("Please provide a caption and upload an image.");
            return;
        }

        isSubmitting = true;
        uploadProgress = 10;

        try {
            // Upload image
            const imageUrl = await uploadImage(imageFile);
            uploadProgress = 60;

            const payload = {
                image_url: imageUrl,
                caption,
                tag,
                display_order: parseInt(String(display_order)) || 0,
            };

            const res = await fetch("/api/our-impact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                uploadProgress = 100;
                goto("/admin/impact");
            } else {
                const err = await res.json();
                throw new Error(err.error || "Failed to save");
            }
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:head>
    <title>Add to Impact Gallery - Talk Africa Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="impact" />

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                    <a
                        href="/admin/impact"
                        class="text-gray-500 hover:text-gray-800">← Back</a
                    >
                    <h2 class="text-2xl font-semibold text-gray-900">
                        🖼️ Add to Impact Gallery
                    </h2>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left: Main content -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Content Details -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider"
                            >
                                Gallery Details
                            </h3>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Caption / Story *
                                </label>
                                <textarea
                                    bind:value={caption}
                                    rows="4"
                                    placeholder="e.g. Capturing the heartbeat of African cinematic innovation."
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none resize-y text-gray-700"
                                ></textarea>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Category Tag
                                    </label>
                                    <select
                                        bind:value={tag}
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none bg-white"
                                    >
                                        {#each availableTags as t}
                                            <option value={t}>{t}</option>
                                        {/each}
                                    </select>
                                </div>
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Display Order
                                    </label>
                                    <input
                                        bind:value={display_order}
                                        type="number"
                                        placeholder="0"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                    />
                                    <p class="text-xs text-gray-400 mt-1">
                                        Lower numbers appear first.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Sidebar settings -->
                    <div class="space-y-6">
                        <!-- Image Upload -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider"
                            >
                                Gallery Image *
                            </h3>
                            {#if imagePreview}
                                <div class="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Image Preview"
                                        class="w-full aspect-video object-cover rounded-lg"
                                    />
                                    <button
                                        on:click={() => {
                                            imageFile = null;
                                            imagePreview = "";
                                        }}
                                        class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                                        >✕</button
                                    >
                                </div>
                            {:else}
                                <label
                                    for="image-upload"
                                    class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-accent hover:bg-orange-50/30 transition-colors"
                                >
                                    <span class="text-3xl mb-2">📸</span>
                                    <span
                                        class="text-sm text-gray-500 text-center"
                                    >
                                        Upload impact image<br />
                                        <span class="text-xs text-gray-400"
                                            >High quality landscape image</span
                                        >
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image-upload"
                                        class="hidden"
                                        on:change={handleImageSelect}
                                    />
                                </label>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-3"
                        >
                            {#if isSubmitting}
                                <div
                                    class="text-center text-sm text-gray-500 mb-2"
                                >
                                    Uploading... {uploadProgress}%
                                </div>
                                <div
                                    class="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-accent transition-all duration-300 rounded-full"
                                        style="width:{uploadProgress}%"
                                    ></div>
                                </div>
                            {:else}
                                <button
                                    on:click={handleSubmit}
                                    class="w-full px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
                                >
                                    Add to Gallery
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
