<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    export let data;

    let selectedIds: Set<string> = new Set();
    let selectAll = false;
    let actionMessage = "";
    let actionType: "success" | "error" = "success";
    let showMessage = false;

    $: filteredComments = data.comments || [];

    function toggleSelectAll() {
        if (selectAll) {
            selectedIds = new Set(filteredComments.map((c) => c.comment_id));
        } else {
            selectedIds = new Set();
        }
    }

    function toggleSelect(id: string) {
        if (selectedIds.has(id)) {
            selectedIds.delete(id);
        } else {
            selectedIds.add(id);
        }
        selectedIds = selectedIds;
        selectAll = selectedIds.size === filteredComments.length;
    }

    async function updateCommentStatus(
        commentId: string,
        status: "approved" | "rejected",
    ) {
        try {
            const response = await fetch(`/api/comment/${commentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const result = await response.json();

            if (result.success) {
                showActionMessage(`Comment ${status}`, "success");
                window.location.reload();
            } else {
                showActionMessage(result.message || "Action failed", "error");
            }
        } catch (error) {
            showActionMessage("Failed to update comment", "error");
        }
    }

    async function deleteComment(commentId: string) {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await fetch(`/api/comment/${commentId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                showActionMessage("Comment deleted", "success");
                window.location.reload();
            } else {
                showActionMessage(result.message || "Delete failed", "error");
            }
        } catch (error) {
            showActionMessage("Failed to delete comment", "error");
        }
    }

    async function bulkAction(action: "approve" | "reject" | "delete") {
        if (selectedIds.size === 0) {
            showActionMessage("No comments selected", "error");
            return;
        }

        if (
            action === "delete" &&
            !confirm(`Delete ${selectedIds.size} comments?`)
        )
            return;

        try {
            const response = await fetch("/api/comments/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ids: Array.from(selectedIds),
                    action,
                }),
            });

            const result = await response.json();

            if (result.success) {
                showActionMessage(
                    `${result.count} comments ${action}d`,
                    "success",
                );
                selectedIds = new Set();
                selectAll = false;
                window.location.reload();
            } else {
                showActionMessage(
                    result.message || "Bulk action failed",
                    "error",
                );
            }
        } catch (error) {
            showActionMessage("Bulk action failed", "error");
        }
    }

    function showActionMessage(message: string, type: "success" | "error") {
        actionMessage = message;
        actionType = type;
        showMessage = true;
        setTimeout(() => {
            showMessage = false;
        }, 3000);
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    function changeFilter(status: string) {
        const url = new URL(window.location.href);
        url.searchParams.set("status", status);
        goto(url.toString());
    }

    function handleSearch(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const search = formData.get("search") as string;

        const url = new URL(window.location.href);
        if (search) {
            url.searchParams.set("search", search);
        } else {
            url.searchParams.delete("search");
        }
        goto(url.toString());
    }
</script>

<svelte:head>
    <title>Comment Moderation - Admin</title>
</svelte:head>

<div class="p-4 md:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6 md:mb-8">
        <a
            href="/admin"
            class="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium mb-3 transition-colors group"
        >
            <svg
                class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg
            >
            Back to Dashboard
        </a>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 font-clash">
            Comment Moderation
        </h1>
        <p class="text-gray-600 mt-1">Review and manage user comments</p>
    </div>

    <!-- Action Messages -->
    {#if showMessage}
        <div
            class="mb-6 p-4 rounded-xl border flex items-center gap-3 animate-slide-in {actionType ===
            'success'
                ? 'bg-green-50 text-green-800 border-green-200'
                : 'bg-red-50 text-red-800 border-red-200'}"
        >
            <span class="text-xl">{actionType === "success" ? "✓" : "⚠"}</span>
            <p class="font-medium">{actionMessage}</p>
        </div>
    {/if}

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        <button
            on:click={() => changeFilter("pending")}
            class="stat-card {data.currentStatus === 'pending' ? 'active' : ''}"
        >
            <div class="flex justify-between items-start">
                <div>
                    <div class="stat-label">Pending Review</div>
                    <div class="stat-value text-orange-600">
                        {data.stats.pending}
                    </div>
                </div>
                <div class="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><circle cx="12" cy="12" r="10"></circle><polyline
                            points="12 6 12 12 16 14"
                        ></polyline></svg
                    >
                </div>
            </div>
        </button>
        <button
            on:click={() => changeFilter("approved")}
            class="stat-card {data.currentStatus === 'approved'
                ? 'active'
                : ''}"
        >
            <div class="flex justify-between items-start">
                <div>
                    <div class="stat-label">Approved</div>
                    <div class="stat-value text-green-600">
                        {data.stats.approved}
                    </div>
                </div>
                <div class="p-2 bg-green-100 rounded-lg text-green-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><polyline points="20 6 9 17 4 12"></polyline></svg
                    >
                </div>
            </div>
        </button>
        <button
            on:click={() => changeFilter("rejected")}
            class="stat-card {data.currentStatus === 'rejected'
                ? 'active'
                : ''}"
        >
            <div class="flex justify-between items-start">
                <div>
                    <div class="stat-label">Rejected</div>
                    <div class="stat-value text-red-600">
                        {data.stats.rejected}
                    </div>
                </div>
                <div class="p-2 bg-red-100 rounded-lg text-red-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><circle cx="12" cy="12" r="10"></circle><line
                            x1="15"
                            y1="9"
                            x2="9"
                            y2="15"
                        ></line><line x1="9" y1="9" x2="15" y2="15"></line></svg
                    >
                </div>
            </div>
        </button>
    </div>

    <!-- Controls Bar -->
    <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 sticky top-4 z-10"
    >
        <div
            class="flex flex-col md:flex-row gap-4 justify-between items-center"
        >
            <form
                on:submit|preventDefault={handleSearch}
                class="relative w-full md:w-96"
            >
                <input
                    type="text"
                    name="search"
                    placeholder="Search comments, users..."
                    value={data.currentSearch}
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
                <svg
                    class="absolute left-3 top-3 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><circle cx="11" cy="11" r="8"></circle><line
                        x1="21"
                        y1="21"
                        x2="16.65"
                        y2="16.65"
                    ></line></svg
                >
            </form>

            <div class="flex items-center gap-3 w-full md:w-auto">
                <select
                    on:change={(e) => changeFilter(e.currentTarget.value)}
                    value={data.currentStatus}
                    class="w-full md:w-auto px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange-500 outline-none bg-white cursor-pointer hover:bg-gray-50"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                {#if selectedIds.size > 0}
                    <div
                        class="flex items-center gap-2 animate-fade-in ml-auto md:ml-0"
                    >
                        <span
                            class="hidden md:inline text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded"
                            >{selectedIds.size} selected</span
                        >
                        <div class="flex gap-1">
                            <button
                                on:click={() => bulkAction("approve")}
                                class="btn-icon bg-green-100 text-green-700 hover:bg-green-200"
                                title="Approve Selected"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    ><polyline points="20 6 9 17 4 12"
                                    ></polyline></svg
                                >
                            </button>
                            <button
                                on:click={() => bulkAction("reject")}
                                class="btn-icon bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                title="Reject Selected"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    ><circle cx="12" cy="12" r="10"
                                    ></circle><line
                                        x1="4.93"
                                        y1="4.93"
                                        x2="19.07"
                                        y2="19.07"
                                    ></line></svg
                                >
                            </button>
                            <button
                                on:click={() => bulkAction("delete")}
                                class="btn-icon bg-red-100 text-red-700 hover:bg-red-200"
                                title="Delete Selected"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    ><polyline points="3 6 5 6 21 6"
                                    ></polyline><path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                    ></path></svg
                                >
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Comments List -->
    <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
        <div
            class="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50"
        >
            <label class="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    bind:checked={selectAll}
                    on:change={toggleSelectAll}
                    class="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <span
                    class="font-medium text-gray-700 text-sm uppercase tracking-wide"
                    >Select All</span
                >
            </label>
        </div>

        {#if filteredComments.length === 0}
            <div
                class="p-12 text-center text-gray-500 flex flex-col items-center gap-3"
            >
                <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path
                            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        ></path></svg
                    >
                </div>
                <p>No comments found matching your filters.</p>
            </div>
        {:else}
            <div class="divide-y divide-gray-100">
                {#each filteredComments as comment}
                    <div
                        class="p-4 md:p-6 hover:bg-orange-50/30 transition-colors group {selectedIds.has(
                            comment.comment_id,
                        )
                            ? 'bg-orange-50/50'
                            : ''}"
                    >
                        <div class="flex items-start gap-4">
                            <input
                                type="checkbox"
                                checked={selectedIds.has(comment.comment_id)}
                                on:change={() =>
                                    toggleSelect(comment.comment_id)}
                                class="mt-1.5 w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer flex-shrink-0"
                            />

                            <div class="flex-1 min-w-0">
                                <div
                                    class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-sm"
                                        >
                                            {comment.userName?.[0]?.toUpperCase() ||
                                                "A"}
                                        </div>
                                        <div>
                                            <span
                                                class="font-semibold text-gray-900 block md:inline"
                                                >{comment.userName ||
                                                    "Anonymous"}</span
                                            >
                                            <span class="text-sm text-gray-500"
                                                >{comment.userEmail}</span
                                            >
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-xs font-medium px-2.5 py-1 rounded-full {comment.status ===
                                            'approved'
                                                ? 'bg-green-100 text-green-700'
                                                : comment.status === 'pending'
                                                  ? 'bg-orange-100 text-orange-700'
                                                  : 'bg-red-100 text-red-700'}"
                                        >
                                            {comment.status}
                                        </span>
                                        <span
                                            class="text-xs text-gray-400 hidden md:inline"
                                            >{formatDate(
                                                comment.created_at,
                                            )}</span
                                        >
                                    </div>
                                </div>

                                <p
                                    class="text-gray-800 mb-3 text-base leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 font-serif"
                                >
                                    "{comment.content}"
                                </p>

                                <div
                                    class="flex flex-wrap items-center gap-4 text-sm"
                                >
                                    <span
                                        class="text-xs text-gray-400 md:hidden"
                                        >{formatDate(comment.created_at)}</span
                                    >

                                    <div
                                        class="flex items-center gap-1 text-gray-500"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            ><path
                                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                            ></path><polyline
                                                points="14 2 14 8 20 8"
                                            ></polyline><line
                                                x1="16"
                                                y1="13"
                                                x2="8"
                                                y2="13"
                                            ></line><line
                                                x1="16"
                                                y1="17"
                                                x2="8"
                                                y2="17"
                                            ></line><polyline
                                                points="10 9 9 9 8 9"
                                            ></polyline></svg
                                        >
                                        <a
                                            href="/posts/{comment.post_id}"
                                            class="hover:text-orange-600 hover:underline truncate max-w-[150px] md:max-w-xs transition-colors"
                                            target="_blank"
                                        >
                                            {comment.postTitle}
                                        </a>
                                    </div>

                                    <div
                                        class="flex items-center gap-2 ml-auto opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        {#if comment.status !== "approved"}
                                            <button
                                                on:click={() =>
                                                    updateCommentStatus(
                                                        comment.comment_id,
                                                        "approved",
                                                    )}
                                                class="btn-sm btn-approve"
                                            >
                                                Approve
                                            </button>
                                        {/if}
                                        {#if comment.status !== "rejected"}
                                            <button
                                                on:click={() =>
                                                    updateCommentStatus(
                                                        comment.comment_id,
                                                        "rejected",
                                                    )}
                                                class="btn-sm btn-reject"
                                            >
                                                Reject
                                            </button>
                                        {/if}
                                        <button
                                            on:click={() =>
                                                deleteComment(
                                                    comment.comment_id,
                                                )}
                                            class="btn-sm btn-delete"
                                            title="Delete"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                ><polyline points="3 6 5 6 21 6"
                                                ></polyline><path
                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                ></path></svg
                                            >
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    /* Custom utility classes */
    .font-clash {
        font-family: "ClashGrotesk", sans-serif;
    }

    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        text-align: left;
        border: 2px solid transparent;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        border: 1px solid #f3f4f6;
    }
    .stat-card:hover {
        border-color: #f97316;
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.1);
    }
    .stat-card.active {
        border-color: #f97316;
        background: #fff7ed;
        position: relative;
    }
    .stat-card.active::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 4px;
        background: #f97316;
        border-radius: 2px 2px 0 0;
    }

    .stat-label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
        margin-bottom: 0.25rem;
    }
    .stat-value {
        font-size: 2rem;
        font-weight: 700;
        font-family: "ClashGrotesk", sans-serif;
        line-height: 1;
    }

    .btn-sm {
        padding: 0.375rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
    }
    .btn-approve {
        background: #dcfce7;
        color: #15803d;
    }
    .btn-approve:hover {
        background: #bbf7d0;
        border-color: #86efac;
    }

    .btn-reject {
        background: #ffedd5;
        color: #c2410c;
    }
    .btn-reject:hover {
        background: #fed7aa;
        border-color: #fdba74;
    }

    .btn-delete {
        background: #fee2e2;
        color: #b91c1c;
        padding: 0.375rem;
    }
    .btn-delete:hover {
        background: #fecaca;
        border-color: #fca5a5;
    }

    .btn-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        transition: all 0.2s;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-slide-in {
        animation: slideIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .animate-fade-in {
        animation: fadeIn 0.2s ease-out;
    }
</style>
