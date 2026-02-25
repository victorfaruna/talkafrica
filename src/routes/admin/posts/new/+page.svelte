<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import RichTextEditor from "$lib/components/RichTextEditor.svelte";

    // Get admin data from layout using Svelte 5 runes
    const { data }: { data: any } = $props();

    let title = $state("");
    let category = $state(""); // Keep for backward compatibility if needed
    let selectedCategories = $state<string[]>([]);
    let excerpt = $state("");
    let image = $state("");
    let featured = $state(false);
    let isTrendingNews = $state(false);
    let status = $state("draft");
    let editor = $state(""); // Optional editor
    let content = $state("");
    let editingPostId = $state<string | null>(null);
    let uploadStatus = $state<"idle" | "uploading" | "success" | "error">(
        "idle",
    );
    let uploadMessage = $state("");
    let isSaving = $state(false);

    const editors = ["Ipinyomi korede Precious", "Omojola Oreoluwa Favour"];

    import { getPostCategories } from "$lib/categories";

    const availableCategories = getPostCategories();

    // Excerpt Validation
    const MIN_WORDS = 50;
    const MAX_WORDS = 150;

    let wordCount = $derived(
        excerpt
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0).length,
    );
    let isExcerptValid = $derived(
        wordCount >= MIN_WORDS && wordCount <= MAX_WORDS,
    );
    let wordsNeeded = $derived(Math.max(0, MIN_WORDS - wordCount));
    let wordsOver = $derived(Math.max(0, wordCount - MAX_WORDS));

    $effect(() => {
        if (!browser) return;
        (async () => {
            // Detect edit mode from query string
            const params = new URLSearchParams(location.search);
            const pid = params.get("post_id");
            if (pid) {
                editingPostId = pid;
            }

            // If editing, load post and prefill
            if (editingPostId) {
                try {
                    // Optimized: Fetch only the specific post by ID instead of all posts
                    const resp = await fetch(
                        `/api/posts?post_id=${editingPostId}`,
                    );
                    const data = await resp.json();
                    if (
                        data.success &&
                        Array.isArray(data.posts) &&
                        data.posts.length > 0
                    ) {
                        const found = data.posts[0]; // Backend returns array with single post
                        title = found.title || "";
                        category = found.category || "";
                        // Load categories array if available, otherwise use single category
                        selectedCategories = found.categories
                            ? [...found.categories]
                            : found.category
                              ? [found.category]
                              : [];
                        excerpt = found.excerpt || "";
                        image = found.image || "";
                        featured = !!found.featured;
                        isTrendingNews = !!found.isTrendingNews;
                        status = found.status || "draft";
                        editor = found.editor || "";
                        content = found.content || "";
                        // Editor will bind to content automatically
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

    function toggleCategory(catSlug: string) {
        const index = selectedCategories.indexOf(catSlug);
        if (index > -1) {
            selectedCategories = selectedCategories.filter(
                (c) => c !== catSlug,
            );
        } else {
            selectedCategories = [...selectedCategories, catSlug];
        }
    }

    function isCategorySelected(catSlug: string): boolean {
        return selectedCategories.includes(catSlug);
    }

    async function save() {
        if (!title || !content) {
            alert("Title and content are required");
            return;
        }

        if (wordCount < MIN_WORDS) {
            alert(
                `Excerpt must be at least ${MIN_WORDS} words. You have ${wordCount} words.`,
            );
            return;
        }
        if (wordCount > MAX_WORDS) {
            alert(
                `Excerpt must be no more than ${MAX_WORDS} words. You have ${wordCount} words.`,
            );
            return;
        }

        isSaving = true;
        try {
            const method = editingPostId ? "PUT" : "POST";
            const payload: any = {
                title,
                content,
                excerpt,
                categories: selectedCategories, // Send categories array
                image,
                status,
                featured,
                isTrendingNews,
                editor: editor || null, // Optional editor field

                author: data?.admin?.username || "Admin", // Use logged-in admin's username
                author_id: data?.admin?.admin_id, // Pass admin_id for dynamic linking
            };
            if (editingPostId) payload.post_id = editingPostId;
            const resp = await fetch("/api/posts", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await resp.json(); // Fixed: renamed from 'data' to 'result' to avoid shadowing
            if (result.success) {
                goto("/admin");
            } else {
                alert(
                    result.message +
                        (result.error ? ": " + result.error : "") ||
                        "Failed to create/update post",
                );
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("An error occurred while saving");
        } finally {
            isSaving = false;
        }
    }

    function cancel() {
        goto("/admin");
    }

    function handleEditorChange(event: CustomEvent<string>) {
        content = event.detail;
    }
</script>

<svelte:head>
    <title>{editingPostId ? "Edit Post" : "New Post"} - Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto p-3 sm:p-6">
        <div
            class="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
            <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">
                {editingPostId ? "Edit Post" : "Create New Post"}
            </h1>
            <button
                class="text-sm text-gray-600 hover:text-gray-900 text-left sm:text-center"
                onclick={cancel}>Back to Dashboard</button
            >
        </div>

        <div
            class="bg-white rounded-xl border border-gray-200 p-4 sm:p-8 space-y-6 sm:space-y-8 shadow-sm"
        >
            <!-- Title Section -->
            <div>
                <label
                    for="title"
                    class="block text-sm font-semibold text-gray-700 mb-2"
                    >Title *</label
                >
                <input
                    id="title"
                    class="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    placeholder="Enter a catchy title..."
                    bind:value={title}
                    required
                />
            </div>

            <!-- Editor Section -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2"
                    >Content *</label
                >
                <!-- New Rich Text Editor -->
                <RichTextEditor
                    bind:content
                    on:change={handleEditorChange}
                    placeholder="Write your story here..."
                />
            </div>

            <!-- Categories and Editor Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Categories -->
                <div>
                    <label
                        class="block text-sm font-semibold text-gray-700 mb-2"
                        >Categories</label
                    >
                    <div
                        class="w-full min-h-[3rem] px-3 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-accent/50 bg-white"
                    >
                        {#if selectedCategories.length === 0}
                            <p class="text-gray-400 text-sm italic">
                                Select categories below...
                            </p>
                        {:else}
                            <div class="flex flex-wrap gap-2 mb-3">
                                {#each selectedCategories as catSlug}
                                    {@const cat = availableCategories.find(
                                        (c) => c.slug === catSlug,
                                    )}
                                    {@const displayName =
                                        cat?.display_name || catSlug}
                                    {@const isGiant =
                                        catSlug === "african-giant"}
                                    <span
                                        class="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/10"
                                    >
                                        {#if isGiant}👑{/if}
                                        {displayName}
                                        <button
                                            type="button"
                                            onclick={() =>
                                                toggleCategory(catSlug)}
                                            class="hover:bg-accent/20 rounded-full p-0.5 text-accent/70 hover:text-accent transition-colors"
                                            aria-label="Remove category"
                                        >
                                            <svg
                                                class="w-3.5 h-3.5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd"
                                                ></path>
                                            </svg>
                                        </button>
                                    </span>
                                {/each}
                            </div>
                        {/if}

                        <div
                            class="border-t border-dashed border-gray-200 my-2"
                        ></div>

                        <div class="flex flex-wrap gap-2 mt-2">
                            {#each availableCategories as cat}
                                {@const isSelected = isCategorySelected(
                                    cat.slug,
                                )}
                                {@const isGiant = cat.slug === "african-giant"}
                                {#if !isSelected}
                                    <button
                                        type="button"
                                        onclick={() => toggleCategory(cat.slug)}
                                        class="px-3 py-1 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-600 hover:bg-white hover:border-accent hover:text-accent hover:shadow-sm transition-all"
                                    >
                                        {#if isGiant}👑{/if} + {cat.display_name}
                                    </button>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Featured Image -->
                <div>
                    <label
                        for="image"
                        class="block text-sm font-semibold text-gray-700 mb-2"
                        >Featured Image</label
                    >
                    <div
                        class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer relative"
                    >
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onchange={handleImageUpload}
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {#if image}
                            <div class="relative z-20 pointer-events-none">
                                <img
                                    src={image}
                                    alt="Preview"
                                    class="h-40 mx-auto object-cover rounded-lg shadow-sm"
                                />
                                <p
                                    class="text-xs text-green-600 mt-2 font-medium"
                                >
                                    Click to change image
                                </p>
                            </div>
                        {:else}
                            <div class="pointer-events-none">
                                <svg
                                    class="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <p class="mt-1 text-sm text-gray-600">
                                    Drag & drop or click to upload
                                </p>
                            </div>
                        {/if}
                    </div>

                    <!-- Upload Status -->
                    {#if uploadStatus !== "idle"}
                        <div
                            class="mt-2 text-sm flex items-center justify-center gap-2 {uploadStatus ===
                            'error'
                                ? 'text-red-600'
                                : 'text-blue-600'}"
                        >
                            {#if uploadStatus === "uploading"}
                                <div
                                    class="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"
                                ></div>
                            {/if}
                            {uploadMessage}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Excerpt -->
            <!-- Excerpt -->
            <div class="space-y-4">
                <div class="flex items-start justify-between">
                    <div>
                        <label
                            for="excerpt"
                            class="block text-sm font-semibold text-gray-700"
                            >Excerpt / Description *</label
                        >
                        <p class="text-xs text-gray-500 mt-1">
                            Brief summary that appears in previews
                        </p>
                    </div>

                    <span
                        class={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            wordCount === 0
                                ? "bg-gray-100 text-gray-500"
                                : isExcerptValid
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-50 text-red-600"
                        }`}
                    >
                        {wordCount} / {MIN_WORDS}-{MAX_WORDS} words
                    </span>
                </div>

                <textarea
                    id="excerpt"
                    rows="5"
                    class={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-sm leading-relaxed ${
                        wordCount > 0 && !isExcerptValid
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : isExcerptValid
                              ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                              : "border-gray-300 focus:ring-accent/50"
                    }`}
                    placeholder={`Write a compelling 2-3 sentence summary of your article. This appears in post previews, search results, and social media shares. (Minimum ${MIN_WORDS} words)`}
                    bind:value={excerpt}
                    required
                ></textarea>

                <div class="min-h-[20px]">
                    {#if wordCount === 0}
                        <p class="text-xs text-gray-500">
                            💡 Start writing your excerpt...
                        </p>
                    {:else if wordsNeeded > 0}
                        <p class="text-xs text-red-600 font-medium">
                            ⚠️ Add {wordsNeeded} more word{wordsNeeded !== 1
                                ? "s"
                                : ""} (minimum {MIN_WORDS})
                        </p>
                    {:else if wordsOver > 0}
                        <p class="text-xs text-red-600 font-medium">
                            ⚠️ Too long! Remove {wordsOver} word{wordsOver !== 1
                                ? "s"
                                : ""} (maximum {MAX_WORDS})
                        </p>
                    {:else}
                        <p
                            class="text-xs text-green-600 font-medium flex items-center gap-1"
                        >
                            <svg
                                class="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 13l4 4L19 7"
                                ></path></svg
                            >
                            Perfect length!
                        </p>
                    {/if}
                </div>

                {#if excerpt}
                    <div
                        class="mt-4 p-4 bg-gray-50 border-l-4 border-yellow-400 rounded-r-lg"
                    >
                        <h4
                            class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                        >
                            Preview
                        </h4>
                        <p
                            class="text-sm text-gray-800 leading-relaxed line-clamp-3 italic"
                        >
                            {excerpt}
                        </p>
                    </div>
                {/if}
            </div>

            <div class="pt-6 border-t border-gray-100 flex flex-col gap-6">
                <!-- Editor Dropdown (Moved here for visibility) -->
                <div>
                    <label
                        for="editor"
                        class="block text-sm font-semibold text-gray-700 mb-2"
                        >Editor (Optional) <span
                            class="text-[10px] text-gray-400 font-normal"
                            >v1.1</span
                        ></label
                    >
                    <select
                        id="editor"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all bg-white text-gray-700"
                        bind:value={editor}
                    >
                        <option value="">None</option>
                        {#each editors as ed}
                            <option value={ed}>{ed}</option>
                        {/each}
                    </select>
                </div>

                <div
                    class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
                >
                    <label class="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            class="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                            bind:checked={featured}
                        />
                        <span
                            class="ml-2 text-sm sm:text-base text-gray-700 font-medium group-hover:text-gray-900"
                            >Featured Post</span
                        >
                    </label>
                    <label class="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            class="w-5 h-5 text-accent rounded border-gray-300 focus:ring-accent"
                            bind:checked={isTrendingNews}
                        />
                        <span
                            class="ml-2 text-sm sm:text-base text-gray-700 font-medium group-hover:text-gray-900"
                            >Show in Trending News</span
                        >
                    </label>
                    <div class="flex items-center gap-2">
                        <span
                            class="text-sm sm:text-base text-gray-700 font-medium"
                            >Status:</span
                        >
                        <select
                            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                            bind:value={status}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                        class="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
                        onclick={cancel}>Cancel</button
                    >
                    <button
                        class="px-6 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md w-full sm:w-auto"
                        onclick={save}
                        disabled={isSaving}
                    >
                        {#if isSaving}
                            <div
                                class="animate-spin h-4 w-4 border-2 border-white/30 border-b-white rounded-full"
                            ></div>
                            Saving...
                        {:else}
                            {editingPostId ? "Update Post" : "Publish Post"}
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
