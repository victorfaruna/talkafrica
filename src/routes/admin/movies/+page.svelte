<script lang="ts">
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";

    export let data;
    let reviews = data.reviews || [];
    let searchTerm = "";

    async function deleteReview(id: string) {
        if (!confirm("Are you sure you want to delete this movie review?"))
            return;
        try {
            const res = await fetch(`/api/movie-reviews/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                reviews = reviews.filter((r: any) => r.review_id !== id);
            } else {
                alert("Failed to delete review");
            }
        } catch (e) {
            alert("Error deleting review");
        }
    }

    $: filteredReviews = reviews.filter((r: any) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    function starRating(rating: number) {
        return (
            "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))
        );
    }
</script>

<svelte:head>
    <title>The Big Screen - Talk Africa Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="movies" />

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            <div class="space-y-8">
                <!-- Header -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <h2
                            class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1"
                        >
                            🎬 The Big Screen
                        </h2>
                        <p class="text-sm text-gray-500">
                            Manage African movie favorites on The Big Screen
                        </p>
                    </div>
                    <a
                        href="/admin/movies/new"
                        class="flex items-center justify-center gap-2 bg-yellow-500 text-white px-4 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors w-full sm:w-auto font-medium"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add to The Big Screen
                    </a>
                </div>

                <!-- Table -->
                <div
                    class="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                    <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                        <input
                            placeholder="Search movies..."
                            class="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            bind:value={searchTerm}
                        />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-600">
                            <thead class="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th class="px-6 py-4">Poster</th>
                                    <th class="px-6 py-4">Title</th>
                                    <th class="px-6 py-4">Rating</th>
                                    <th class="px-6 py-4">Status</th>
                                    <th class="px-6 py-4">Views</th>
                                    <th class="px-6 py-4 text-right">Actions</th
                                    >
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                {#each filteredReviews as review}
                                    <tr class="hover:bg-gray-50/50">
                                        <td class="px-6 py-4">
                                            <div
                                                class="w-12 h-16 bg-gray-200 rounded overflow-hidden"
                                            >
                                                <img
                                                    src={review.poster_url}
                                                    alt=""
                                                    class="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td
                                            class="px-6 py-4 font-medium text-gray-900"
                                        >
                                            <div>{review.title}</div>
                                            {#if review.genre}
                                                <div
                                                    class="text-xs text-gray-400 mt-0.5"
                                                >
                                                    {review.genre}
                                                </div>
                                            {/if}
                                            {#if review.is_recommended}
                                                <span
                                                    class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700"
                                                >
                                                    ⭐ Recommended
                                                </span>
                                            {/if}
                                        </td>
                                        <td class="px-6 py-4">
                                            <span
                                                class="text-yellow-500 tracking-tight"
                                                >{starRating(
                                                    review.rating,
                                                )}</span
                                            >
                                            <span
                                                class="text-xs text-gray-400 ml-1"
                                                >{review.rating}/5</span
                                            >
                                        </td>
                                        <td class="px-6 py-4">
                                            <span
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {review.status ===
                                                'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'}"
                                            >
                                                {review.status}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">{review.views}</td
                                        >
                                        <td class="px-6 py-4 text-right">
                                            <div
                                                class="flex items-center justify-end gap-3"
                                            >
                                                <a
                                                    href={`/movies/${review.slug}`}
                                                    target="_blank"
                                                    class="text-gray-500 hover:text-gray-900 text-xs"
                                                    >View</a
                                                >
                                                <a
                                                    href={`/admin/movies/${review.review_id}/edit`}
                                                    class="text-blue-600 hover:text-blue-900 font-medium"
                                                    >Edit</a
                                                >
                                                <button
                                                    on:click={() =>
                                                        deleteReview(
                                                            review.review_id,
                                                        )}
                                                    class="text-red-600 hover:text-red-900 font-medium"
                                                    >Delete</button
                                                >
                                            </div>
                                        </td>
                                    </tr>
                                {:else}
                                    <tr>
                                        <td
                                            colspan="6"
                                            class="px-6 py-12 text-center text-gray-500"
                                        >
                                            <div class="text-4xl mb-2">🎬</div>
                                            <div>
                                                No movie reviews yet. Add your
                                                first review!
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
