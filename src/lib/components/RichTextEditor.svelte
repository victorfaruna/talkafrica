<script lang="ts">
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import { browser } from "$app/environment";
    import "quill/dist/quill.snow.css";
    import "@enzedonline/quill-blot-formatter2/dist/css/quill-blot-formatter2.css";
    import "quill-table-better/dist/quill-table-better.css";

    export let content = "";
    export let placeholder = "Start writing your story...";

    let editorElement: HTMLElement;
    let quill: any;
    let wordCount = 0;
    let charCount = 0;
    let isFullscreen = false;
    let isUploading = false;
    let uploadProgress = "";
    let touchResize: {
        image: HTMLImageElement;
        widthOwner: HTMLElement;
        startX: number;
        startWidth: number;
        direction: number;
    } | null = null;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        if (!browser) return;

        const Quill = (await import("quill")).default;
        // Quill 2-native image/video formatting: responsive sizing, alignment,
        // touch resizing, captions, alt text and image links.
        let BlotFormatter2: any = null;
        let QuillTableBetter: any = null;
        try {
            BlotFormatter2 = (
                await import("@enzedonline/quill-blot-formatter2")
            ).default;
            BlotFormatter2.registerFormats(Quill);
            Quill.register("modules/blotFormatter2", BlotFormatter2, true);
        } catch (error) {
            console.warn("Image formatting tools could not be loaded", error);
        }

        try {
            QuillTableBetter = (await import("quill-table-better")).default;
            Quill.register("modules/table-better", QuillTableBetter, true);
        } catch (error) {
            console.warn("Table tools could not be loaded", error);
        }

        const Font = Quill.import("formats/font") as any;
        Font.whitelist = ["sans-serif", "serif", "monospace"];
        Quill.register(Font, true);

        // Define premium toolbar options
        const toolbarOptions = [
            [{ font: [] }, { header: [1, 2, 3, 4, false] }, { size: ["small", false, "large", "huge"] }],
            ["bold", "italic", "underline", "strike"],
            [{ script: "sub" }, { script: "super" }],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ indent: "-1" }, { indent: "+1" }, { direction: "rtl" }, { align: [] }],
            [{ color: [] }, { background: [] }],
            ["link", "image", "video", ...(QuillTableBetter ? ["table-better"] : [])],
            ["clean"],
        ];

        const modules: Record<string, any> = {
            toolbar: {
                container: toolbarOptions,
                handlers: { image: imageHandler },
            },
            history: {
                delay: 2000,
                maxStack: 500,
                userOnly: true,
            },
            clipboard: { matchVisual: false },
        };

        if (BlotFormatter2) {
            modules.blotFormatter2 = {
                align: {
                    allowAligning: true,
                    alignments: ["left", "center", "right"],
                },
                resize: {
                    allowResizing: true,
                    allowResizeModeChange: false,
                    useRelativeSize: false,
                    imageOversizeProtection: true,
                    minimumWidthPx: 80,
                },
                image: {
                    registerImageTitleBlot: true,
                    allowAltTitleEdit: true,
                    allowCompressor: true,
                    linkOptions: { allowLinkEdit: true },
                },
                video: { registerCustomVideoBlot: true },
            };
        }

        if (QuillTableBetter) {
            modules.table = false;
            modules["table-better"] = {
                language: "en_US",
                menus: ["column", "row", "merge", "table", "cell", "wrap", "copy", "delete"],
                toolbarTable: true,
            };
            modules.keyboard = { bindings: QuillTableBetter.keyboardBindings };
        }

        try {
            quill = new Quill(editorElement, {
                theme: "snow",
                placeholder,
                modules,
            });
        } catch (error) {
            // An optional extension must never leave authors without a place to type.
            console.error("Enhanced editor failed; loading the standard editor", error);
            editorElement.parentElement
                ?.querySelectorAll(":scope > .ql-toolbar")
                .forEach((toolbar) => toolbar.remove());
            editorElement.className = "";
            editorElement.innerHTML = "";

            const fallbackToolbar = toolbarOptions.map((group) =>
                Array.isArray(group)
                    ? group.filter((item) => item !== "table-better")
                    : group,
            );
            quill = new Quill(editorElement, {
                theme: "snow",
                placeholder,
                modules: {
                    toolbar: {
                        container: fallbackToolbar,
                        handlers: { image: imageHandler },
                    },
                    history: { delay: 2000, maxStack: 500, userOnly: true },
                },
            });
        }

        // Set initial content
        if (content) {
            quill.root.innerHTML = content;
            updateCounts();
        }

        // Event listeners
        quill.on("text-change", () => {
            let html = quill.getSemanticHTML();
            // CRITICAL: Strip soft hyphens to prevent mid-word breaks
            html = html.replace(/\u00AD/g, "").replace(/&shy;/g, "");
            content = html;
            updateCounts();
            dispatch("change", html);
            dispatch("autosave", html); // Trigger for auto-save logic
        });

        updateCounts();

        // Dedicated touch resizing for mobile browsers that do not reliably
        // translate finger movement into pointer events for formatter handles.
        const editorShell = editorElement.parentElement;
        editorShell?.addEventListener("touchstart", handleResizeTouchStart, {
            passive: false,
        });
        editorShell?.addEventListener("touchmove", handleResizeTouchMove, {
            passive: false,
        });
        editorShell?.addEventListener("touchend", handleResizeTouchEnd, {
            passive: false,
        });

    });

    onDestroy(() => {
        const editorShell = editorElement?.parentElement;
        editorShell?.removeEventListener("touchstart", handleResizeTouchStart);
        editorShell?.removeEventListener("touchmove", handleResizeTouchMove);
        editorShell?.removeEventListener("touchend", handleResizeTouchEnd);
    });

    function handleResizeTouchStart(event: TouchEvent) {
        const handle = (event.target as HTMLElement)?.closest(
            ".blot-formatter__resize-handle",
        ) as HTMLElement | null;
        if (!handle || event.touches.length !== 1 || !quill) return;

        const formatter = quill.getModule("blotFormatter2") as any;
        const target = formatter?.currentSpec?.getTargetElement?.() as
            | HTMLElement
            | undefined;
        const image = target?.tagName === "IMG"
            ? (target as HTMLImageElement)
            : (target?.querySelector("img") as HTMLImageElement | null);
        if (!image) return;

        const alignedWrapper = image.closest(
            '[class^="ql-image-align-"]',
        ) as HTMLElement | null;
        const widthOwner = alignedWrapper || image;

        const position = handle.dataset.position || "bottom-right";
        touchResize = {
            image,
            widthOwner,
            startX: event.touches[0].clientX,
            startWidth: widthOwner.getBoundingClientRect().width,
            direction: position.includes("left") ? -1 : 1,
        };
        event.preventDefault();
        event.stopPropagation();
    }

    function handleResizeTouchMove(event: TouchEvent) {
        if (!touchResize || event.touches.length !== 1) return;
        event.preventDefault();
        event.stopPropagation();

        const editorWidth = quill.root.getBoundingClientRect().width;
        const delta =
            (event.touches[0].clientX - touchResize.startX) *
            touchResize.direction;
        const width = Math.round(
            Math.max(80, Math.min(editorWidth, touchResize.startWidth + delta)),
        );
        touchResize.image.setAttribute("width", `${width}px`);
        touchResize.image.setAttribute("height", "auto");
        if (touchResize.widthOwner !== touchResize.image) {
            touchResize.widthOwner.style.setProperty(
                "--resize-width",
                `${width}px`,
            );
            touchResize.widthOwner.dataset.relativeSize = "false";
        }
        (quill.getModule("blotFormatter2") as any)?.update?.();
    }

    function handleResizeTouchEnd(event: TouchEvent) {
        if (!touchResize) return;
        event.preventDefault();
        event.stopPropagation();
        touchResize = null;
        quill.update("user");
        content = quill.getSemanticHTML();
        dispatch("change", content);
    }

    $: if (quill && content !== undefined) {
        // Safe check to update content if it changes externally (e.g. initial load)
        const currentContent = quill.getSemanticHTML();
        if (content !== currentContent) {
            // Only update if the content is truly different to avoid cursor jumps/loops
            // Use a more relaxed check for empty editor vs loaded content
            const isEditorEmpty = quill.getText().trim().length === 0;
            if (isEditorEmpty && content.length > 0) {
                quill.root.innerHTML = content;
                updateCounts();
            } else if (content !== currentContent) {
                // For other updates, we need to be careful.
                // If the user types, 'content' matches 'currentContent' because of the text-change handler.
                // This block is reached when 'content' changes from OUTSIDE (e.g. parent fetch).
                // However, small formatting differences can cause loops.
                // Given the specific bug (loading content on edit), checking for empty editor is the safest critical fix.
                // If we want full two-way binding support for external updates while editing:
                // quill.root.innerHTML = content;
                // But that resets selection.

                // Let's stick to the critical fix for "loading" which is the user complaint.
                // If the provided content is different and the editor is NOT empty, it might be a conflict.
                // But typically, the flow is: Mount -> Empty -> Fetch -> Content update.
                // So we just handle that case.

                quill.root.innerHTML = content;
                updateCounts();
            }
        }
    }

    function updateCounts() {
        const text = quill.getText();
        charCount = text.length - 1; // Quill adds a newline
        wordCount =
            text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
    }

    async function imageHandler() {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // Basic validation
            if (file.size > 10 * 1024 * 1024) {
                alert("File too large (max 10MB)");
                return;
            }

            try {
                isUploading = true;
                uploadProgress = "Uploading image...";
                dispatch("uploading", true);

                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (result.success) {
                    const range = quill.getSelection(true) || {
                        index: quill.getLength(),
                        length: 0,
                    };
                    quill.insertEmbed(range.index, "image", result.url);
                    const insertedImage = quill.root.querySelectorAll("img")[
                        quill.root.querySelectorAll("img").length - 1
                    ] as HTMLImageElement | undefined;
                    if (insertedImage) {
                        insertedImage.setAttribute("width", "100%");
                        insertedImage.setAttribute("height", "auto");
                        insertedImage.setAttribute("alt", file.name.replace(/\.[^.]+$/, ""));
                    }
                    quill.setSelection(range.index + 1);
                } else {
                    alert("Upload failed: " + result.message);
                }
            } catch (error) {
                console.error("Image upload error:", error);
                alert("An error occurred during image upload");
            } finally {
                isUploading = false;
                uploadProgress = "";
                dispatch("uploading", false);
            }
        };
    }

    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        const toolLabels: Record<string, string> = {
            bold: "Bold", italic: "Italic", underline: "Underline", strike: "Strikethrough",
            blockquote: "Quote", "code-block": "Code block", link: "Insert link",
            image: "Insert image", video: "Insert video", clean: "Clear formatting",
            list: "List", indent: "Indent", align: "Alignment", color: "Text color",
            background: "Highlight color", script: "Subscript or superscript",
            "table-better": "Insert table",
        };
        editorElement.parentElement?.querySelectorAll<HTMLElement>(".ql-toolbar button, .ql-toolbar select")
            .forEach((control) => {
                const toolClass = [...control.classList].find((name) => name.startsWith("ql-"));
                if (toolClass) control.title = toolLabels[toolClass.slice(3)] || "Formatting option";
            });
    }

    function undo() {
        quill?.history.undo();
    }

    function redo() {
        quill?.history.redo();
    }
</script>

<div class="rich-editor-container" class:fullscreen={isFullscreen}>
    {#if isFullscreen}
        <div class="fullscreen-header">
            <h2 class="text-lg font-bold text-gray-800">
                Distraction Free Mode
            </h2>
            <button class="close-fullscreen" on:click={toggleFullscreen}>
                Close
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
                    ><line x1="18" y1="6" x2="6" y2="18"></line><line
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                    ></line></svg
                    >
            </button>
        </div>
    {/if}

    <div class="document-actions" aria-label="Document actions">
        <button type="button" on:click={undo} title="Undo (Ctrl+Z)" aria-label="Undo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 7H5V3M5.5 7.5A8 8 0 1120 12" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button type="button" on:click={redo} title="Redo (Ctrl+Y)" aria-label="Redo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 7h4V3m-.5 4.5A8 8 0 104 12" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <span class="document-actions__divider"></span>
        <span class="document-actions__label">Document editor</span>
    </div>

    <div class="editor-wrapper relative">
        {#if isUploading}
            <div
                class="absolute inset-0 bg-white/60 z-[100] flex flex-col items-center justify-center backdrop-blur-sm transition-all"
                in:fade
            >
                <div
                    class="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"
                ></div>
                <p class="text-orange-600 font-bold animate-pulse">
                    {uploadProgress}
                </p>
            </div>
        {/if}
        <div bind:this={editorElement}></div>
    </div>

    <div class="editor-statusbar">
        <div class="stats">
            <span>{wordCount} words</span>
            <span class="separator">•</span>
            <span>{charCount} characters</span>
        </div>
        <button
            class="fullscreen-toggle"
            on:click={toggleFullscreen}
            title="Toggle Fullscreen"
        >
            {#if isFullscreen}
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
                    ><path d="M8 3v3a2 2 0 0 1-2 2H3"></path><path
                        d="M21 8h-3a2 2 0 0 1-2-2V3"
                    ></path><path d="M3 21h3a2 2 0 0 1 2-2v-3"></path><path
                        d="M16 21v-3a2 2 0 0 1 2-2h3"
                    ></path></svg
                >
            {:else}
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
                    ><path d="M15 3h6v6"></path><path d="M9 21H3v-6"
                    ></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"
                    ></path></svg
                >
            {/if}
        </button>
    </div>
</div>

<style>
    /* Wrapper Styles */
    .rich-editor-container {
        display: flex;
        flex-direction: column;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .rich-editor-container:focus-within {
        border-color: #f97316; /* Orange-500 */
        box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
    }

    /* Editor Area */
    .editor-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #eef1f5;
        padding: 0 1.25rem 1.25rem;
    }

    .document-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        min-height: 2.75rem;
        padding: 0.4rem 0.75rem;
        border-bottom: 1px solid #e2e8f0;
        background: #fff;
    }
    .document-actions button {
        display: grid;
        width: 2rem;
        height: 2rem;
        place-items: center;
        color: #475569;
        border-radius: 0.35rem;
    }
    .document-actions button:hover {
        color: #f7941d;
        background: #fff7ed;
    }
    .document-actions svg {
        width: 1.05rem;
        height: 1.05rem;
    }
    .document-actions__divider {
        width: 1px;
        height: 1.25rem;
        margin: 0 0.4rem;
        background: #e2e8f0;
    }
    .document-actions__label {
        color: #64748b;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
    }

    /* Customizing Quill Toolbar */
    :global(.ql-toolbar) {
        border: none !important;
        border-bottom: 1px solid #e2e8f0 !important;
        background-color: #f8fafc;
        padding: 0.75rem !important;
        position: sticky;
        top: 0;
        z-index: 20;
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
    }

    :global(.ql-toolbar .ql-formats) {
        display: inline-flex;
        align-items: center;
        gap: 0.15rem;
        margin-right: 0 !important;
        padding-right: 0.5rem;
        border-right: 1px solid #dbe2ea;
    }
    :global(.ql-toolbar .ql-formats:last-child) {
        padding-right: 0;
        border-right: 0;
    }
    :global(.ql-toolbar button) {
        width: 2rem !important;
        height: 2rem !important;
        border-radius: 0.35rem;
    }
    :global(.ql-toolbar button:hover),
    :global(.ql-toolbar button.ql-active) {
        background: #fff3d6;
    }
    :global(.ql-snow .ql-toolbar button:hover .ql-stroke),
    :global(.ql-snow .ql-toolbar button.ql-active .ql-stroke),
    :global(.ql-snow.ql-toolbar button:hover .ql-stroke),
    :global(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
        stroke: #f59e0b !important;
    }
    :global(.ql-snow .ql-toolbar button:hover .ql-fill),
    :global(.ql-snow .ql-toolbar button.ql-active .ql-fill),
    :global(.ql-snow.ql-toolbar button:hover .ql-fill),
    :global(.ql-snow.ql-toolbar button.ql-active .ql-fill) {
        fill: #f59e0b !important;
    }

    :global(.blot-formatter__overlay) {
        border: 2px solid #fdb022 !important;
        touch-action: none;
    }
    :global(.blot-formatter__resize-handle) {
        width: 14px !important;
        height: 14px !important;
        border: 2px solid #fdb022 !important;
        border-radius: 3px;
        background: #fff !important;
        opacity: 1 !important;
        touch-action: none;
    }

    :global(.ql-container) {
        border: none !important;
        font-family: "Poppins", sans-serif; /* Match site font */
        font-size: 1rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        width: min(100%, 920px);
        margin: 0 auto;
        background: white;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    }

    :global(.ql-editor) {
        padding: 1.5rem 2rem !important;
        min-height: 600px; /* Increased height */
        color: #334155;
        line-height: 1.75;
        font-size: 1.125rem;
        /* Match global article styles */
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
        word-break: normal !important;
        hyphens: none !important;
        -webkit-hyphens: none !important;
        -moz-hyphens: none !important;
        width: 100%;
        margin: 0 auto;
        background: #fff;
    }

    :global(.ql-editor::after) {
        content: "";
        display: table;
        clear: both;
    }

    :global(.ql-editor [class^="ql-image-align-"]) {
        display: flex;
        flex-wrap: wrap;
        width: var(--resize-width, 100%);
        max-width: 100%;
    }

    :global(.ql-editor [class^="ql-image-align-"] > img) {
        flex: 1 1 auto;
        width: 100%;
        height: auto;
        margin: 0 !important;
    }

    :global(.ql-editor .ql-image-align-left) {
        float: left;
        margin: 0.45rem 1.25rem 0.75rem 0;
    }

    :global(.ql-editor .ql-image-align-center) {
        float: none;
        margin: 1.25rem auto;
    }

    :global(.ql-editor .ql-image-align-right) {
        float: right;
        margin: 0.45rem 0 0.75rem 1.25rem;
    }

    :global(.ql-editor [class^="ql-image-align-"][data-title]::after) {
        content: attr(data-title);
        width: 100%;
        padding-top: 0.4rem;
        color: #64748b;
        font-size: 0.8rem;
        line-height: 1.4;
        text-align: inherit;
    }


    /* Mobile Optimizations */
    @media (max-width: 640px) {
        .editor-wrapper {
            padding: 0;
            background: white;
        }
        :global(.ql-toolbar) {
            padding: 0.5rem !important;
            position: static;
        }
        :global(.ql-editor) {
            padding: 1rem !important;
            font-size: 1rem;
            min-height: 400px;
        }
        :global(.ql-editor [class^="ql-image-align-"]) {
            float: none;
            width: 100% !important;
            margin: 1rem 0 !important;
        }
        :global(.blot-formatter__resize-handle) {
            width: 32px !important;
            height: 32px !important;
            border: 0 !important;
            border-radius: 50%;
            background: radial-gradient(circle, #fdb022 0 5px, #fff 6px 8px, transparent 9px) !important;
        }
    }

    @media (pointer: coarse) {
        :global(.blot-formatter__resize-handle) {
            width: 32px !important;
            height: 32px !important;
            border: 0 !important;
            border-radius: 50%;
            background: radial-gradient(circle, #fdb022 0 5px, #fff 6px 8px, transparent 9px) !important;
            touch-action: none !important;
        }
    }

    /* Typography inside Editor */
    :global(.ql-editor h1) {
        font-family: "ClashGrotesk", sans-serif;
        font-size: 2.5rem;
        margin-top: 1.5em;
        margin-bottom: 0.75em;
    }
    :global(.ql-editor h2) {
        font-family: "ClashGrotesk", sans-serif;
        font-size: 2rem;
        margin-top: 1.5em;
        margin-bottom: 0.75em;
    }
    :global(.ql-editor h3) {
        font-family: "ClashGrotesk", sans-serif;
        font-size: 1.5rem;
        margin-bottom: 0.5em;
    }
    :global(.ql-editor blockquote) {
        border-left: 4px solid #f97316;
        background-color: #fff7ed;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    /* Status Bar */
    .editor-statusbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: #f8fafc;
        border-top: 1px solid #e2e8f0;
        font-size: 0.75rem;
        color: #64748b;
    }

    .fullscreen-toggle {
        padding: 0.25rem;
        border-radius: 0.25rem;
        color: #64748b;
        cursor: pointer;
    }
    .fullscreen-toggle:hover {
        background-color: #e2e8f0;
        color: #0f172a;
    }
    .separator {
        margin: 0 0.5rem;
        opacity: 0.5;
    }

    /* Fullscreen Mode */
    .rich-editor-container.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        border-radius: 0;
        border: none;
    }

    .rich-editor-container.fullscreen :global(.ql-editor) {
        max-width: 900px;
        margin: 0 auto;
        padding-top: 3rem !important;
        height: 100%;
    }

    .fullscreen-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: white;
        border-bottom: 1px solid #e2e8f0;
    }

    .close-fullscreen {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background-color: #f1f5f9;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #475569;
        transition: all 0.2s;
    }
    .close-fullscreen:hover {
        background-color: #e2e8f0;
        color: #0f172a;
    }
</style>
