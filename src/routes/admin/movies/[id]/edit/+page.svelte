<script lang="ts">
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";
    import { goto } from "$app/navigation";

    export let data;
    const review = data.review;

    // Form state
    let title = review.title || "";
    let genre = review.genre || "";
    let director = review.director || "";
    let cast = review.cast || "";
    let release_date = review.release_date || "";
    let runtime = review.runtime || "";
    let rating = review.rating || 4.0;
    let trailer_url = review.trailer_url || "";
    let content = review.content || "";
    let status = review.status || "draft";
    let is_recommended = review.is_recommended || false;

    let posterFile: File | null = null;
    let backdropFile: File | null = null;
    let posterPreview = review.poster_url || "";
    let backdropPreview = review.backdrop_url || "";

    let isSubmitting = false;
    let uploadProgress = 0;

    function handlePosterSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            posterFile = input.files[0];
            posterPreview = URL.createObjectURL(posterFile);
        }
    }

    function handleBackdropSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            backdropFile = input.files[0];
            backdropPreview = URL.createObjectURL(backdropFile);
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

    function generateSlug(t: string) {
        return t
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    async function handleSubmit(submitStatus: string) {
        if (!title || !content) {
            alert("Please fill in Title and Recommendation Content.");
            return;
        }

        isSubmitting = true;
        uploadProgress = 10;

        try {
            // Upload images only if changed
            let posterUrl = posterPreview;
            if (posterFile) {
                posterUrl = await uploadImage(posterFile);
                uploadProgress = 50;
            }

            let backdropUrl = backdropPreview;
            if (backdropFile) {
                backdropUrl = await uploadImage(backdropFile);
                uploadProgress = 80;
            }

            const payload = {
                title,
                slug: generateSlug(title),
                genre,
                director,
                cast,
                release_date: release_date || null,
                runtime,
                rating: parseFloat(String(rating)),
                poster_url: posterUrl,
                backdrop_url: backdropUrl || null,
                trailer_url: trailer_url || null,
                content,
                status: submitStatus,
                is_recommended,
            };

            const res = await fetch(`/api/movie-reviews/${review.review_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                uploadProgress = 100;
                goto("/admin/movies");
            } else {
                const err = await res.json();
                throw new Error(err.error || "Failed to update");
            }
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:head>
    <title>Edit Entry - The Big Screen - Talk Africa Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="movies" />

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            <div class="max-w-4xl mx-auto">
                <div class="flex items-center gap-3 mb-6">
                    <a
                        href="/admin/movies"
                        class="text-gray-500 hover:text-gray-800">← Back</a
                    >
                    <h2 class="text-2xl font-semibold text-gray-900">
                        🎬 Edit The Big Screen Entry
                    </h2>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left: Main content -->
                    <div class="lg:col-span-2 space-y-6">
                        <!-- Basic Info -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider"
                            >
                                The Big Screen Entry Info
                            </h3>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Movie Title *</label
                                >
                                <input
                                    bind:value={title}
                                    type="text"
                                    placeholder="e.g. King of Boys"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                />
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Genre</label
                                    >
                                    <input
                                        bind:value={genre}
                                        type="text"
                                        placeholder="e.g. Drama, Thriller"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Director</label
                                    >
                                    <input
                                        bind:value={director}
                                        type="text"
                                        placeholder="e.g. Kemi Adetiba"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Cast</label
                                >
                                <input
                                    bind:value={cast}
                                    type="text"
                                    placeholder="e.g. Sola Sobowale, Jim Iyke"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                />
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Release Date</label
                                    >
                                    <input
                                        bind:value={release_date}
                                        type="date"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-700 mb-1"
                                        >Runtime</label
                                    >
                                    <input
                                        bind:value={runtime}
                                        type="text"
                                        placeholder="e.g. 2h 15m"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                    >Trailer URL (YouTube embed or link)</label
                                >
                                <input
                                    bind:value={trailer_url}
                                    type="url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                />
                            </div>
                        </div>

                        <!-- Recommendation Content -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-4"
                            >
                                Your Highlight *
                            </h3>
                            <textarea
                                bind:value={content}
                                rows="12"
                                placeholder="Write your full recommendation here..."
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-y text-gray-700 leading-relaxed"
                            ></textarea>
                        </div>
                    </div>

                    <!-- Right: Sidebar settings -->
                    <div class="space-y-6">
                        <!-- Poster Upload -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider"
                            >
                                Movie Poster *
                            </h3>
                            {#if posterPreview}
                                <div class="relative">
                                    <img
                                        src={posterPreview}
                                        alt="Poster Preview"
                                        class="w-full aspect-[2/3] object-cover rounded-lg"
                                    />
                                    <button
                                        on:click={() => {
                                            posterFile = null;
                                            posterPreview = "";
                                        }}
                                        class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                                        >✕</button
                                    >
                                </div>
                            {:else}
                                <label
                                    for="poster-upload"
                                    class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-colors"
                                >
                                    <span class="text-3xl mb-2">🎭</span>
                                    <span
                                        class="text-sm text-gray-500 text-center"
                                        >Upload movie poster</span
                                    >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="poster-upload"
                                        class="hidden"
                                        on:change={handlePosterSelect}
                                    />
                                </label>
                            {/if}
                        </div>

                        <!-- Backdrop Upload -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider"
                            >
                                Backdrop Image
                            </h3>
                            {#if backdropPreview}
                                <div class="relative">
                                    <img
                                        src={backdropPreview}
                                        alt="Backdrop Preview"
                                        class="w-full aspect-video object-cover rounded-lg"
                                    />
                                    <button
                                        on:click={() => {
                                            backdropFile = null;
                                            backdropPreview = "";
                                        }}
                                        class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                                        >✕</button
                                    >
                                </div>
                            {:else}
                                <label
                                    for="backdrop-upload"
                                    class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-colors"
                                >
                                    <span class="text-2xl mb-1">🖼️</span>
                                    <span
                                        class="text-xs text-gray-500 text-center"
                                        >Upload backdrop</span
                                    >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="backdrop-upload"
                                        class="hidden"
                                        on:change={handleBackdropSelect}
                                    />
                                </label>
                            {/if}
                        </div>

                        <!-- Rating -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-3"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider"
                            >
                                Rating
                            </h3>
                            <div class="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    bind:value={rating}
                                    class="flex-1 accent-yellow-600"
                                />
                                <span
                                    class="text-lg font-bold text-yellow-600 w-10 text-right"
                                    >{rating}</span
                                >
                            </div>
                        </div>

                        <!-- Options -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
                        >
                            <h3
                                class="font-semibold text-gray-800 text-sm uppercase tracking-wider"
                            >
                                Options
                            </h3>
                            <label
                                class="flex items-center gap-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={is_recommended}
                                    class="w-4 h-4 accent-yellow-600 rounded"
                                />
                                <div>
                                    <div
                                        class="text-sm font-medium text-gray-700"
                                    >
                                        Mark as Recommended
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        Shows on the homepage recommendations
                                    </div>
                                </div>
                            </label>
                        </div>

                        <!-- Actions -->
                        <div
                            class="bg-white rounded-xl border border-gray-200 p-6 space-y-3"
                        >
                            {#if isSubmitting}
                                <div
                                    class="text-center text-sm text-gray-500 mb-2"
                                >
                                    Updating... {uploadProgress}%
                                </div>
                            {:else}
                                <button
                                    on:click={() => handleSubmit("published")}
                                    class="w-full px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium transition-colors"
                                >
                                    Update The Big Screen Entry
                                </button>
                                <button
                                    on:click={() => handleSubmit("draft")}
                                    class="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                >
                                    Save as Draft
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
