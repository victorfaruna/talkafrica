<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    let title = $state("");
    let category = $state("");
    let excerpt = $state("");
    let image = $state("");
    let featured = $state(false);
    let status = $state("draft");
    let content = $state("");
    let editingPostId = $state<string | null>(null);

    let quillEditor: any = null;
    let editorContainer: HTMLElement;

    const categories = [
        "News",
        "Politics",
        "Business",
        "Technology",
        "Sports",
        "Entertainment",
        "Health",
    ];

    $effect(() => {
        if (!browser) return;
        (async () => {
            // Detect edit mode from query string
            const params = new URLSearchParams(location.search);
            const pid = params.get("post_id");
            if (pid) {
                editingPostId = pid;
            }
            const Quill = (await import("quill")).default;
            quillEditor = new Quill(editorContainer, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["blockquote", "code-block"],
                        ["link", "image"],
                        ["clean"],
                    ],
                },
            });

            quillEditor.on("text-change", () => {
                const html =
                    typeof quillEditor.getSemanticHTML === "function"
                        ? quillEditor.getSemanticHTML()
                        : quillEditor.root.innerHTML;
                content = html;
            });

            // If editing, load post and prefill
            if (editingPostId) {
                try {
                    const resp = await fetch("/api/posts");
                    const data = await resp.json();
                    if (data.success && Array.isArray(data.posts)) {
                        const found = data.posts.find(
                            (p: any) => p.post_id === editingPostId
                        );
                        if (found) {
                            title = found.title || "";
                            category = found.category || "";
                            excerpt = found.excerpt || "";
                            image = found.image || "";
                            featured = !!found.featured;
                            status = found.status || "draft";
                            content = found.content || "";
                            quillEditor.root.innerHTML = content;
                        }
                    }
                } catch (e) {
                    console.error("Failed to load post for editing", e);
                }
            }
        })();
    });

    async function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        const resp = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await resp.json();
        if (data.success) image = data.url;
    }

    async function save() {
        if (!title || !content) {
            alert("Title and content are required");
            return;
        }
        const method = editingPostId ? "PUT" : "POST";
        const payload: any = {
            title,
            content,
            excerpt,
            category,
            image,
            status,
            featured,
        };
        if (editingPostId) payload.post_id = editingPostId;
        const resp = await fetch("/api/posts", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await resp.json();
        if (data.success) {
            alert(editingPostId ? "Post updated" : "Post created");
            goto("/admin");
        } else {
            alert(data.message || "Failed to create post");
        }
    }

    function cancel() {
        goto("/admin");
    }
</script>

<svelte:head>
    <title>{editingPostId ? "Edit Post" : "New Post"} - Admin</title>
    <link
        href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
        rel="stylesheet"
    />
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-6">
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-2xl font-semibold text-gray-900">
                {editingPostId ? "Edit Post" : "Create New Post"}
            </h1>
            <button
                class="text-sm text-gray-600 hover:text-gray-900"
                onclick={cancel}>Back to Dashboard</button
            >
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
                <label
                    for="title"
                    class="block text-sm font-medium text-secondary mb-2"
                    >Title *</label
                >
                <input
                    id="title"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    bind:value={title}
                    required
                />
            </div>

            <div>
                <label
                    for="category"
                    class="block text-sm font-medium text-secondary mb-2"
                    >Category</label
                >
                <select
                    id="category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    bind:value={category}
                >
                    <option value="">Select category</option>
                    {#each categories as c}
                        <option value={c}>{c}</option>
                    {/each}
                </select>
            </div>

            <div>
                <label
                    for="excerpt"
                    class="block text-sm font-medium text-secondary mb-2"
                    >Excerpt</label
                >
                <textarea
                    id="excerpt"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    bind:value={excerpt}
                ></textarea>
            </div>

            <div>
                <label
                    for="image"
                    class="block text-sm font-medium text-secondary mb-2"
                    >Featured Image</label
                >
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onchange={handleImageUpload}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {#if image}
                    <img
                        src={image}
                        alt="Preview"
                        class="mt-2 w-32 h-20 object-cover rounded"
                    />
                {/if}
            </div>

            <div>
                <label
                    for="content"
                    class="block text-sm font-medium text-secondary mb-2"
                    >Content *</label
                >
                <div
                    id="content"
                    bind:this={editorContainer}
                    class="h-60 border border-gray-300 rounded-lg"
                ></div>
            </div>

            <div class="flex items-center gap-4">
                <label class="flex items-center">
                    <input
                        type="checkbox"
                        class="mr-2"
                        bind:checked={featured}
                    /> Featured Post
                </label>
                <select
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    bind:value={status}
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            <div class="flex gap-2">
                <button
                    class="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90"
                    onclick={save}
                    >{editingPostId ? "Update Post" : "Create Post"}</button
                >
                <button
                    class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    onclick={cancel}>Cancel</button
                >
            </div>
        </div>
    </div>
</div>

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
