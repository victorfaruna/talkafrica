<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Header from "$lib/components/admin/Header.svelte";
    import Sidebar from "$lib/components/admin/Sidebar.svelte";

    export let data;

    // Admin state management
    let activeTab = "dashboard";

    // Sync activeTab with URL query param
    $: {
        const tab = $page.url.searchParams.get("tab");
        if (
            tab &&
            ["dashboard", "posts", "users", "media", "settings"].includes(tab)
        ) {
            activeTab = tab;
        } else {
            activeTab = "dashboard";
        }
    }

    let posts: any[] = data.posts || [];
    let users: any[] = [];
    let stats = data.stats || {
        totalPosts: 0,
        totalAdmins: 0,
        totalViews: 0,
        totalComments: 0,
        viewsToday: 0,
        onlineUsers: 0,
        totalUsers: 0,
    };

    // Posts management state
    let showDeleteModal = false;
    let deletePostId = "";

    // Categories (unused here; managed in new post page)

    function editPost(post: any) {
        goto(`/admin/posts/new?post_id=${post.post_id}`);
    }

    function confirmDelete(postId: string) {
        deletePostId = postId;
        showDeleteModal = true;
    }

    async function deletePost() {
        try {
            const response = await fetch("/api/posts", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post_id: deletePostId }),
            });

            const data = await response.json();

            if (data.success) {
                posts = posts.filter((p) => p.post_id !== deletePostId);
                showDeleteModal = false;
                deletePostId = "";
            } else {
                alert("Failed to delete post: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    }

    async function togglePublish(post: any) {
        const next = post.status === "published" ? "draft" : "published";
        try {
            const response = await fetch("/api/posts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: post.post_id, status: next }),
            });
            const data = await response.json();
            if (data.success) {
                posts = posts.map((p) =>
                    p.post_id === post.post_id ? { ...p, status: next } : p,
                );
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function toggleFeatured(post: any) {
        const next = !post.featured;
        try {
            const response = await fetch("/api/posts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_id: post.post_id, featured: next }),
            });
            const data = await response.json();
            if (data.success) {
                posts = posts.map((p) =>
                    p.post_id === post.post_id ? { ...p, featured: next } : p,
                );
            }
        } catch (e) {
            console.error(e);
        }
    }

    let filterStatus: "all" | "draft" | "published" = "all";
    let searchTerm: string = "";
    $: filteredPosts = posts
        .filter((p) =>
            filterStatus === "all" ? true : p.status === filterStatus,
        )
        .filter((p) =>
            searchTerm
                ? (p.title || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  (p.excerpt || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true,
        );

    // Post creation handled in the dedicated new/edit page

    // Image uploads handled in the dedicated new/edit page
</script>

<svelte:head>
    <title>Admin Dashboard - Talk Africa</title>
    <link
        href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
        rel="stylesheet"
    />
    <script
        src="https://unpkg.com/heroicons@2.0.18/24/outline/index.js"
    ></script>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header />

    <div class="flex flex-col lg:flex-row">
        <!-- Sidebar -->
        <Sidebar {activeTab} />

        <!-- Main Content -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8">
            {#if activeTab === "dashboard"}
                <!-- Dashboard -->
                <div class="space-y-8">
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                            Overview
                        </h2>
                        <p class="text-gray-600">
                            Welcome back! Here's what's happening with your
                            content.
                        </p>
                    </div>

                    <!-- Stats Cards -->
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        <div
                            class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                                    >
                                        <svg
                                            class="w-6 h-6 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <p
                                        class="text-sm font-medium text-gray-600"
                                    >
                                        Total Posts
                                    </p>
                                    <p
                                        class="text-2xl font-semibold text-gray-900"
                                    >
                                        {stats.totalPosts}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"
                                    >
                                        <svg
                                            class="w-6 h-6 text-teal-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <p
                                        class="text-sm font-medium text-gray-600"
                                    >
                                        Views Today
                                    </p>
                                    <p
                                        class="text-2xl font-semibold text-gray-900"
                                    >
                                        {stats.viewsToday}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                                    >
                                        <svg
                                            class="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <p
                                        class="text-sm font-medium text-gray-600"
                                    >
                                        Total Admins
                                    </p>
                                    <p
                                        class="text-2xl font-semibold text-gray-900"
                                    >
                                        {stats.totalAdmins}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                                    >
                                        <svg
                                            class="w-6 h-6 text-purple-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <p
                                        class="text-sm font-medium text-gray-600"
                                    >
                                        Total Views
                                    </p>
                                    <p
                                        class="text-2xl font-semibold text-gray-900"
                                    >
                                        {stats.totalViews.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div
                                        class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                                    >
                                        <svg
                                            class="w-6 h-6 text-orange-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <p
                                        class="text-sm font-medium text-gray-600"
                                    >
                                        Comments
                                    </p>
                                    <p
                                        class="text-2xl font-semibold text-gray-900"
                                    >
                                        {stats.totalComments}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Posts -->
                    <div class="bg-white rounded-xl border border-gray-200">
                        <div
                            class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200"
                        >
                            <div class="flex items-center justify-between">
                                <h3
                                    class="text-base sm:text-lg font-semibold text-gray-900"
                                >
                                    Recent Posts
                                </h3>
                                <button
                                    on:click={() => (activeTab = "posts")}
                                    class="text-xs sm:text-sm text-accent hover:text-accent/80 font-medium"
                                >
                                    View all
                                </button>
                            </div>
                        </div>
                        <div class="p-3 sm:p-6">
                            <div class="space-y-2 sm:space-y-4">
                                {#each posts.slice(0, 5) as post}
                                    <div
                                        class="flex flex-col gap-2 py-2 sm:py-3 border-b border-gray-100 last:border-0"
                                    >
                                        <div class="flex items-start gap-2">
                                            <div
                                                class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1 flex-shrink-0 {post.status ===
                                                'published'
                                                    ? 'bg-green-500'
                                                    : 'bg-yellow-500'}"
                                            ></div>
                                            <div class="flex-1 min-w-0">
                                                <h4
                                                    class="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2"
                                                >
                                                    {post.title}
                                                </h4>
                                                <div
                                                    class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1"
                                                >
                                                    <span
                                                        class="text-[10px] sm:text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded"
                                                        >{post.category}</span
                                                    >
                                                    <span
                                                        class="text-[10px] sm:text-xs text-gray-400"
                                                        >•</span
                                                    >
                                                    <span
                                                        class="text-[10px] sm:text-xs text-gray-500"
                                                        >{post.created_at}</span
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="flex items-center justify-between ml-3.5 sm:ml-0 sm:justify-end gap-2"
                                        >
                                            <div
                                                class="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500"
                                            >
                                                <svg
                                                    class="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                                <span>{post.views}</span>
                                            </div>
                                            <button
                                                aria-label="Edit post"
                                                on:click={() => editPost(post)}
                                                class="p-1.5 sm:p-1 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-50"
                                                title="Edit post"
                                            >
                                                <svg
                                                    class="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {:else if activeTab === "posts"}
                <!-- Blog Posts Management -->
                <div class="space-y-8">
                    <div
                        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        <div>
                            <h2
                                class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2"
                            >
                                Posts
                            </h2>
                            <p class="text-sm sm:text-base text-gray-600">
                                Create and manage your blog posts
                            </p>
                        </div>
                        <a
                            class="flex items-center justify-center gap-2 bg-accent text-white px-4 py-2.5 rounded-lg hover:bg-accent/90 transition-colors w-full sm:w-auto"
                            href="/admin/posts/new"
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
                            New Post
                        </a>
                    </div>

                    <div class="grid grid-cols-1 gap-6">
                        <!-- Posts List -->
                        <div class="bg-white rounded-xl border border-gray-200">
                            <div
                                class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200"
                            >
                                <h3
                                    class="text-base sm:text-lg font-semibold text-gray-900"
                                >
                                    All Posts ({posts.length})
                                </h3>
                            </div>
                            <div
                                class="px-4 sm:px-6 py-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
                            >
                                <input
                                    aria-label="Search posts"
                                    placeholder="Search posts..."
                                    class="w-full sm:flex-1 md:flex-none md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    bind:value={searchTerm}
                                />
                                <div class="flex gap-2 w-full sm:w-auto">
                                    <select
                                        aria-label="Filter by status"
                                        class="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                        bind:value={filterStatus}
                                    >
                                        <option value="all">All</option>
                                        <option value="draft">Draft</option>
                                        <option value="published"
                                            >Published</option
                                        >
                                    </select>
                                    <a
                                        class="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-accent text-white px-3 py-2 rounded-lg hover:bg-accent/90 transition-colors"
                                        href="/admin/posts/new"
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
                                        New Post
                                    </a>
                                </div>
                            </div>
                            <div class="max-h-96 overflow-y-auto">
                                {#each filteredPosts as post}
                                    <div
                                        class="p-3 sm:p-4 border-b border-gray-100 last:border-0"
                                    >
                                        <div
                                            class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                                        >
                                            <div class="flex-1">
                                                <h4
                                                    class="font-medium text-secondary text-sm sm:text-base line-clamp-1"
                                                >
                                                    {post.title}
                                                </h4>
                                                <p
                                                    class="text-xs sm:text-sm text-tertiary mt-1 line-clamp-2"
                                                >
                                                    {post.excerpt}
                                                </p>
                                                <div
                                                    class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2"
                                                >
                                                    <span
                                                        class="text-[10px] sm:text-xs bg-gray-100 px-2 py-1 rounded"
                                                        >{post.category}</span
                                                    >
                                                    <span
                                                        class="px-2 py-1 text-[10px] sm:text-xs rounded-full {post.status ===
                                                        'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'}"
                                                    >
                                                        {post.status}
                                                    </span>
                                                    {#if post.featured}
                                                        <span
                                                            class="text-[10px] sm:text-xs bg-accent/10 text-accent px-2 py-1 rounded"
                                                            >Featured</span
                                                        >
                                                    {/if}
                                                </div>
                                            </div>
                                            <div
                                                class="flex flex-col sm:flex-row gap-2 sm:gap-1 sm:ml-4 w-full sm:w-auto"
                                            >
                                                <button
                                                    aria-label={post.status ===
                                                    "published"
                                                        ? "Set as draft"
                                                        : "Publish post"}
                                                    on:click={() =>
                                                        togglePublish(post)}
                                                    class="px-3 py-2 text-xs rounded border w-full sm:w-auto {post.status ===
                                                    'published'
                                                        ? 'border-yellow-300 text-yellow-700'
                                                        : 'border-green-300 text-green-700'} hover:bg-gray-50"
                                                    title={post.status ===
                                                    "published"
                                                        ? "Set as draft"
                                                        : "Publish post"}
                                                    >{post.status ===
                                                    "published"
                                                        ? "Unpublish"
                                                        : "Publish"}</button
                                                >
                                                <button
                                                    aria-label={post.featured
                                                        ? "Unfeature post"
                                                        : "Feature post"}
                                                    on:click={() =>
                                                        toggleFeatured(post)}
                                                    class="px-3 py-2 text-xs rounded border w-full sm:w-auto {post.featured
                                                        ? 'border-red-300 text-red-700'
                                                        : 'border-blue-300 text-blue-700'} hover:bg-gray-50"
                                                    title={post.featured
                                                        ? "Unfeature"
                                                        : "Feature"}
                                                    >{post.featured
                                                        ? "Unfeature"
                                                        : "Feature"}</button
                                                >
                                                <button
                                                    aria-label="Edit post"
                                                    on:click={() =>
                                                        editPost(post)}
                                                    class="p-2.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                                                    title="Edit"
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
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                    <span
                                                        class="sm:hidden text-xs font-medium text-gray-600"
                                                        >Edit</span
                                                    >
                                                </button>
                                                <button
                                                    aria-label="Delete post"
                                                    on:click={() =>
                                                        confirmDelete(
                                                            post.post_id,
                                                        )}
                                                    class="p-2.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                                                    title="Delete"
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
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                    <span
                                                        class="sm:hidden text-xs font-medium text-gray-600"
                                                        >Delete</span
                                                    >
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {:else if activeTab === "users"}
                <!-- Users Management -->
                <div class="space-y-8">
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                            Users
                        </h2>
                        <p class="text-gray-600">
                            Manage user accounts and permissions
                        </p>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">
                                All Users
                            </h3>
                        </div>
                        <div class="p-8 sm:p-10 lg:p-12">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <svg
                                        class="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                        />
                                    </svg>
                                </div>
                                <h3
                                    class="text-lg font-medium text-gray-900 mb-2"
                                >
                                    User Management
                                </h3>
                                <p class="text-gray-500 mb-4">
                                    User management functionality coming soon
                                </p>
                                <p class="text-sm text-gray-400">
                                    This will include user roles, permissions,
                                    and account management.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            {:else if activeTab === "media"}
                <!-- Media Management -->
                <div class="space-y-8">
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                            Media Library
                        </h2>
                        <p class="text-gray-600">
                            Upload and manage your media files
                        </p>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">
                                Upload & Manage Media
                            </h3>
                        </div>
                        <div class="p-8 sm:p-10 lg:p-12">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <svg
                                        class="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3
                                    class="text-lg font-medium text-gray-900 mb-2"
                                >
                                    Media Library
                                </h3>
                                <p class="text-gray-500 mb-4">
                                    Media library functionality coming soon
                                </p>
                                <p class="text-sm text-gray-400">
                                    This will include image uploads, file
                                    management, and media organization.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            {:else if activeTab === "settings"}
                <!-- Settings -->
                <div class="space-y-8">
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                            Settings
                        </h2>
                        <p class="text-gray-600">
                            Configure your site preferences
                        </p>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">
                                Site Configuration
                            </h3>
                        </div>
                        <div class="p-8 sm:p-10 lg:p-12">
                            <div class="text-center">
                                <div
                                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <svg
                                        class="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <h3
                                    class="text-lg font-medium text-gray-900 mb-2"
                                >
                                    Settings
                                </h3>
                                <p class="text-gray-500 mb-4">
                                    Settings management coming soon
                                </p>
                                <p class="text-sm text-gray-400">
                                    This will include site configuration, SEO
                                    settings, and general preferences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </main>
    </div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div class="flex items-center gap-3 mb-4">
                <div
                    class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
                >
                    <svg
                        class="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">
                    Confirm Delete
                </h3>
            </div>
            <p class="text-gray-600 mb-6">
                Are you sure you want to delete this post? This action cannot be
                undone.
            </p>
            <div class="flex gap-3 justify-end">
                <button
                    on:click={() => (showDeleteModal = false)}
                    class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    on:click={deletePost}
                    class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    :global(.ql-toolbar) {
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }

    :global(.ql-container) {
        border-bottom: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
    }
</style>
