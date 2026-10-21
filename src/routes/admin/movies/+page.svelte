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

</script>

<svelte:head>
    <title>The Big Screen - Talk Africa Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="movies" />

        <main class="min-w-0 flex-1 p-3 sm:p-6 lg:p-8">
            <div class="space-y-5 sm:space-y-8">
                <!-- Header -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <h2
                            class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1"
                        >
                            The Big Screen
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
                    class="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                    <div class="px-4 sm:px-6 py-3 border-b border-gray-200">
                        <input
                            placeholder="Search movies..."
                            class="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            bind:value={searchTerm}
                        />
                    </div>

                    <!-- Mobile movie cards -->
                    <div class="divide-y divide-gray-100 sm:hidden">
                        {#each filteredReviews as review}
                            <article class="p-4">
                                <div class="flex min-w-0 gap-3">
                                    <div class="h-24 w-16 flex-none overflow-hidden rounded bg-gray-200">
                                        <img src={review.poster_url} alt={review.title} class="h-full w-full object-cover" />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <h3 class="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{review.title}</h3>
                                        {#if review.genre}<p class="mt-0.5 text-xs text-gray-500">{review.genre}</p>{/if}
                                        <div class="mt-2 flex flex-wrap items-center gap-2">
                                            <span class="inline-flex items-center gap-1 text-xs font-semibold text-yellow-600">
                                                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.75l2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.94l-5.56 2.93 1.06-6.2L3 9.28l6.22-.9L12 2.75z" /></svg>
                                                {review.rating}/5
                                            </span>
                                            <span class="rounded-full px-2 py-0.5 text-[11px] font-medium {review.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">{review.status}</span>
                                            <span class="text-[11px] text-gray-500">{review.views} views</span>
                                        </div>
                                        {#if review.is_recommended}
                                            <span class="mt-2 inline-flex rounded bg-yellow-100 px-2 py-1 text-[11px] font-medium text-yellow-800">Recommended</span>
                                        {/if}
                                    </div>
                                </div>
                                <div class="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center text-xs font-medium">
                                    <a href={`/movies/${review.slug}`} target="_blank" class="rounded border border-gray-200 px-2 py-2 text-gray-600">View</a>
                                    <a href={`/admin/movies/${review.review_id}/edit`} class="rounded border border-blue-200 px-2 py-2 text-blue-700">Edit</a>
                                    <button on:click={() => deleteReview(review.review_id)} class="rounded border border-red-200 px-2 py-2 text-red-700">Delete</button>
                                </div>
                            </article>
                        {:else}
                            <div class="px-5 py-12 text-center text-sm text-gray-500">No movie reviews yet. Add your first review.</div>
                        {/each}
                    </div>

                    <!-- Desktop movie table -->
                    <div class="hidden overflow-x-auto sm:block">
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
                                                    Recommended
                                                </span>
                                            {/if}
                                        </td>
                                        <td class="px-6 py-4">
                                            <span
                                                class="text-yellow-500 tracking-tight"
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
