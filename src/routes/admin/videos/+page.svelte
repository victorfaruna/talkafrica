<script lang="ts">
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";
    import { goto } from "$app/navigation";

    export let data;
    let videos = data.videos || [];
    let searchTerm = "";

    async function deleteVideo(id: string) {
        if (!confirm("Are you sure you want to delete this video?")) return;

        try {
            const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
            if (res.ok) {
                videos = videos.filter((v: any) => v.video_id !== id);
            } else {
                alert("Failed to delete video");
            }
        } catch (e) {
            console.error(e);
            alert("Error deleting video");
        }
    }

    $: filteredVideos = videos.filter((v: any) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
</script>

<svelte:head>
    <title>Manage Videos - Talk Africa</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />

    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="videos" />

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            <div class="space-y-8">
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <div>
                        <h2
                            class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2"
                        >
                            Videos Management
                        </h2>
                        <p class="text-sm sm:text-base text-gray-600">
                            Upload and manage your video content
                        </p>
                    </div>
                    <a
                        href="/admin/videos/new"
                        class="flex items-center justify-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg hover:bg-accent/90 transition-colors w-full sm:w-auto"
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
                        Add New Video
                    </a>
                </div>

                <!-- Video List Table -->
                <div
                    class="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                    <div
                        class="px-4 sm:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center border-b border-gray-200"
                    >
                        <input
                            placeholder="Search videos..."
                            class="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            bind:value={searchTerm}
                        />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-600">
                            <thead class="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th class="px-6 py-4">Thumbnail</th>
                                    <th class="px-6 py-4">Title</th>
                                    <th class="px-6 py-4">Category</th>
                                    <th class="px-6 py-4">Views</th>
                                    <th class="px-6 py-4 text-right">Actions</th
                                    >
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                {#each filteredVideos as video}
                                    <tr class="hover:bg-gray-50/50">
                                        <td class="px-6 py-4">
                                            <div
                                                class="w-16 h-10 bg-gray-200 rounded overflow-hidden"
                                            >
                                                <img
                                                    src={video.thumbnail_url}
                                                    alt=""
                                                    class="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td
                                            class="px-6 py-4 font-medium text-gray-900"
                                        >
                                            {video.title}
                                            {#if video.is_featured}
                                                <span
                                                    class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                                                >
                                                    Featured
                                                </span>
                                            {/if}
                                        </td>
                                        <td class="px-6 py-4">
                                            <span
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                            >
                                                {video.category}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">{video.views}</td>
                                        <td class="px-6 py-4 text-right">
                                            <div
                                                class="flex items-center justify-end gap-2"
                                            >
                                                <a
                                                    href={`/admin/videos/${video.video_id}/edit`}
                                                    class="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Edit
                                                </a>
                                                <button
                                                    on:click={() =>
                                                        deleteVideo(
                                                            video.video_id,
                                                        )}
                                                    class="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                {:else}
                                    <tr>
                                        <td
                                            colspan="5"
                                            class="px-6 py-8 text-center text-gray-500"
                                        >
                                            No videos found
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
