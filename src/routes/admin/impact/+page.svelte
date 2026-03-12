<script lang="ts">
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";

    export let data;
    let items = data.items || [];
    let isDeleting = false;

    async function deleteItem(id: string) {
        if (!confirm("Are you sure you want to delete this gallery item?"))
            return;

        isDeleting = true;
        try {
            const res = await fetch(`/api/our-impact/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                items = items.filter((item: any) => item.id !== id);
            } else {
                const errorData = await res.json();
                alert(`Failed to delete item: ${errorData.error}`);
            }
        } catch (e) {
            console.error("Error deleting item:", e);
            alert("An error occurred while deleting the item.");
        } finally {
            isDeleting = false;
        }
    }
</script>

<svelte:head>
    <title>Our Impact Gallery - Talk Africa Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <Header />
    <div class="flex flex-col lg:flex-row">
        <Sidebar activeTab="impact" />

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
                            🖼️ Our Impact Gallery
                        </h2>
                        <p class="text-sm text-gray-500">
                            Manage the images and stories shown in the Our
                            Gallery section on the homepage.
                        </p>
                    </div>
                    <a
                        href="/admin/impact/new"
                        class="flex items-center justify-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto font-medium"
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
                        Add New Image
                    </a>
                </div>

                <!-- Table -->
                <div
                    class="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-600">
                            <thead class="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th class="px-6 py-4 w-24">Order</th>
                                    <th class="px-6 py-4">Image</th>
                                    <th class="px-6 py-4">Caption & Tag</th>
                                    <th class="px-6 py-4 text-right">Actions</th
                                    >
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                {#each items as item}
                                    <tr class="hover:bg-gray-50/50">
                                        <td
                                            class="px-6 py-4 font-medium text-gray-900"
                                        >
                                            {item.display_order}
                                        </td>
                                        <td class="px-6 py-4">
                                            <div
                                                class="w-24 h-16 bg-gray-200 rounded overflow-hidden"
                                            >
                                                <img
                                                    src={item.image_url}
                                                    alt="Gallery preview"
                                                    class="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td
                                            class="px-6 py-4 font-medium text-gray-900"
                                        >
                                            <div class="line-clamp-2">
                                                {item.caption}
                                            </div>
                                            {#if item.tag}
                                                <span
                                                    class="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 uppercase tracking-wider"
                                                >
                                                    {item.tag}
                                                </span>
                                            {/if}
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <div
                                                class="flex items-center justify-end gap-3"
                                            >
                                                <button
                                                    on:click={() =>
                                                        deleteItem(item.id)}
                                                    disabled={isDeleting}
                                                    class="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                {:else}
                                    <tr>
                                        <td
                                            colspan="4"
                                            class="px-6 py-12 text-center text-gray-500"
                                        >
                                            <div class="text-4xl mb-2">🖼️</div>
                                            <div>
                                                No gallery items yet. Add your
                                                first image!
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
