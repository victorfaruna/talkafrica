<script lang="ts">
    import { onMount } from "svelte";

    let categories = $state<any[]>([]);
    let loading = $state(true);
    let error = $state("");
    let showAddForm = $state(false);
    let editingCategory = $state<any>(null);

    // Form data
    let formData = $state({
        name: "",
        slug: "",
        display_name: "",
        description: "",
        parent_id: "",
        icon: "",
        color: "#6B7280",
        sort_order: 0,
        is_active: true,
    });

    onMount(async () => {
        await loadCategories();
    });

    async function loadCategories() {
        try {
            loading = true;
            const response = await fetch(
                "/api/categories?includeInactive=true",
            );
            const data = await response.json();

            if (data.success) {
                categories = data.categories;
            } else {
                error = data.message || "Failed to load categories";
            }
        } catch (err) {
            error = "Network error loading categories";
            console.error("Error loading categories:", err);
        } finally {
            loading = false;
        }
    }

    function startAdd() {
        editingCategory = null;
        formData = {
            name: "",
            slug: "",
            display_name: "",
            description: "",
            parent_id: "",
            icon: "",
            color: "#6B7280",
            sort_order: 0,
            is_active: true,
        };
        showAddForm = true;
    }

    function startEdit(category: any) {
        editingCategory = category;
        formData = {
            name: category.name,
            slug: category.slug,
            display_name: category.display_name,
            description: category.description || "",
            parent_id: category.parent_id || "",
            icon: category.icon || "",
            color: category.color || "#6B7280",
            sort_order: category.sort_order,
            is_active: category.is_active,
        };
        showAddForm = true;
    }

    async function saveCategory() {
        try {
            const method = editingCategory ? "PUT" : "POST";
            const payload = editingCategory
                ? { category_id: editingCategory.category_id, ...formData }
                : formData;

            const response = await fetch("/api/categories", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                showAddForm = false;
                await loadCategories();
            } else {
                error = data.message || "Failed to save category";
            }
        } catch (err) {
            error = "Network error saving category";
            console.error("Error saving category:", err);
        }
    }

    async function deleteCategory(category: any) {
        if (
            !confirm(
                `Are you sure you want to delete "${category.display_name}"?`,
            )
        ) {
            return;
        }

        try {
            const response = await fetch("/api/categories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category_id: category.category_id }),
            });

            const data = await response.json();

            if (data.success) {
                await loadCategories();
            } else {
                error = data.message || "Failed to delete category";
            }
        } catch (err) {
            error = "Network error deleting category";
            console.error("Error deleting category:", err);
        }
    }

    function cancelForm() {
        showAddForm = false;
        editingCategory = null;
    }

    // Generate slug from name
    function updateSlug() {
        formData.slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    // Get main categories for parent selection
    const mainCategories = $derived(categories.filter((cat) => !cat.parent_id));
</script>

<svelte:head>
    <title>Category Management - Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">
                Category Management
            </h1>
            <button
                class="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                onclick={startAdd}
            >
                Add Category
            </button>
        </div>

        {#if error}
            <div
                class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
                {error}
            </div>
        {/if}

        {#if loading}
            <div class="text-center py-8">
                <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"
                ></div>
                <p class="mt-2 text-gray-600">Loading categories...</p>
            </div>
        {:else}
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Category
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Parent
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Sort Order
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each categories as category}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="w-4 h-4 rounded-full mr-3"
                                            style="background-color: {category.color}"
                                        ></div>
                                        <div>
                                            <div
                                                class="text-sm font-medium text-gray-900"
                                            >
                                                {category.display_name}
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                {category.slug}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {category.parent_id
                                        ? categories.find(
                                              (c) =>
                                                  c.category_id ===
                                                  category.parent_id,
                                          )?.display_name || "Unknown"
                                        : "Main Category"}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {category.sort_order}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {category.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'}"
                                    >
                                        {category.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                >
                                    <button
                                        class="text-accent hover:text-accent/80 mr-3"
                                        onclick={() => startEdit(category)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        class="text-red-600 hover:text-red-800"
                                        onclick={() => deleteCategory(category)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>

<!-- Add/Edit Modal -->
{#if showAddForm}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
        <div
            class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        >
            <h2 class="text-xl font-bold mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    saveCategory();
                }}
                class="space-y-4"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Name *
                        </label>
                        <input
                            type="text"
                            bind:value={formData.name}
                            oninput={updateSlug}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Slug *
                        </label>
                        <input
                            type="text"
                            bind:value={formData.slug}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Display Name *
                    </label>
                    <input
                        type="text"
                        bind:value={formData.display_name}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        bind:value={formData.description}
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Parent Category
                        </label>
                        <select
                            bind:value={formData.parent_id}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="">Main Category</option>
                            {#each mainCategories as cat}
                                <option value={cat.category_id}
                                    >{cat.display_name}</option
                                >
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Sort Order
                        </label>
                        <input
                            type="number"
                            bind:value={formData.sort_order}
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Icon
                        </label>
                        <input
                            type="text"
                            bind:value={formData.icon}
                            placeholder="e.g., newspaper, music, sports"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Color
                        </label>
                        <div class="flex items-center gap-2">
                            <input
                                type="color"
                                bind:value={formData.color}
                                class="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                                type="text"
                                bind:value={formData.color}
                                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex items-center">
                    <input
                        type="checkbox"
                        bind:checked={formData.is_active}
                        class="mr-2"
                    />
                    <label class="text-sm font-medium text-gray-700">
                        Active
                    </label>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        onclick={cancelForm}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                    >
                        {editingCategory ? "Update" : "Create"} Category
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
