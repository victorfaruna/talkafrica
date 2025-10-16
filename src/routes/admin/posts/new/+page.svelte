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
    let uploadStatus = $state<"idle" | "uploading" | "success" | "error">(
        "idle"
    );
    let uploadMessage = $state("");

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

    // Client-side file validation
    function validateFile(file: File): { isValid: boolean; message: string } {
        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return {
                isValid: false,
                message: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`,
            };
        }

        // Check file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/bmp",
            "image/tiff",
            "image/x-icon",
            "image/svg+xml",
        ];
        if (!allowedTypes.includes(file.type)) {
            return {
                isValid: false,
                message: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
            };
        }

        // Check file extension
        const allowedExtensions = [
            "jpg",
            "jpeg",
            "png",
            "webp",
            "gif",
            "bmp",
            "tiff",
            "tif",
            "ico",
            "svg",
        ];
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
            return {
                isValid: false,
                message: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(", ")}`,
            };
        }

        return { isValid: true, message: "" };
    }

    async function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (!file) {
            uploadStatus = "idle";
            uploadMessage = "";
            return;
        }

        // Reset upload status
        uploadStatus = "uploading";
        uploadMessage = "Validating file...";

        // Client-side validation
        const validation = validateFile(file);
        if (!validation.isValid) {
            uploadStatus = "error";
            uploadMessage = validation.message;
            return;
        }

        try {
            uploadMessage = "Uploading file...";
            const formData = new FormData();
            formData.append("file", file);

            const resp = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await resp.json();

            if (data.success) {
                image = data.url;
                uploadStatus = "success";
                uploadMessage = `File uploaded successfully (${data.detectedType || "unknown type"}, ${Math.round(data.fileSize / 1024)}KB)`;
            } else {
                uploadStatus = "error";
                uploadMessage = data.message || "Upload failed";
            }
        } catch (error) {
            uploadStatus = "error";
            uploadMessage = "Network error during upload";
            console.error("Upload error:", error);
        }
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
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/x-icon,image/svg+xml"
                    onchange={handleImageUpload}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />

                <!-- Upload Status Display -->
                {#if uploadStatus !== "idle"}
                    <div
                        class="mt-2 p-3 rounded-lg {uploadStatus === 'uploading'
                            ? 'bg-blue-50 border border-blue-200'
                            : uploadStatus === 'success'
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'}"
                    >
                        <div class="flex items-center">
                            {#if uploadStatus === "uploading"}
                                <div
                                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
                                ></div>
                            {:else if uploadStatus === "success"}
                                <svg
                                    class="w-4 h-4 text-green-600 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            {:else if uploadStatus === "error"}
                                <svg
                                    class="w-4 h-4 text-red-600 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            {/if}
                            <span
                                class="text-sm {uploadStatus === 'uploading'
                                    ? 'text-blue-700'
                                    : uploadStatus === 'success'
                                      ? 'text-green-700'
                                      : 'text-red-700'}"
                            >
                                {uploadMessage}
                            </span>
                        </div>
                    </div>
                {/if}

                {#if image}
                    <div class="mt-2">
                        <img
                            src={image}
                            alt="Preview"
                            class="w-32 h-20 object-cover rounded border"
                        />
                        <p class="text-xs text-gray-500 mt-1">Current image</p>
                    </div>
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
