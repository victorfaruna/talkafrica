<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { browser } from "$app/environment";
    import "quill/dist/quill.snow.css";

    export let content = "";
    export let placeholder = "Start writing your story...";

    let editorElement: HTMLElement;
    let quill: any;
    let wordCount = 0;
    let charCount = 0;
    let isFullscreen = false;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        if (!browser) return;

        const Quill = (await import("quill")).default;
        // Import BlotFormatter for image resizing
        const BlotFormatter = (await import("quill-blot-formatter")).default;
        Quill.register("modules/blotFormatter", BlotFormatter);

        // Define premium toolbar options
        const toolbarOptions = [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            ["bold", "italic", "underline", "strike"], // toggled buttons
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            ["clean"], // remove formatting button
        ];

        quill = new Quill(editorElement, {
            theme: "snow",
            placeholder,
            modules: {
                blotFormatter: {},
                toolbar: toolbarOptions,
                history: {
                    delay: 2000,
                    maxStack: 500,
                    userOnly: true,
                },
            },
        });

        // Set initial content
        if (content) {
            quill.root.innerHTML = content;
            updateCounts();
        }

        // Event listeners
        quill.on("text-change", () => {
            const html = quill.getSemanticHTML();
            content = html;
            updateCounts();
            dispatch("change", html);
            dispatch("autosave", html); // Trigger for auto-save logic
        });

        updateCounts();
    });

    function updateCounts() {
        const text = quill.getText();
        charCount = text.length - 1; // Quill adds a newline
        wordCount =
            text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
    }

    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
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

    <div class="editor-wrapper">
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
    }

    /* Customizing Quill Toolbar */
    :global(.ql-toolbar) {
        border: none !important;
        border-bottom: 1px solid #e2e8f0 !important;
        background-color: #f8fafc;
        padding: 0.75rem !important;
    }

    :global(.ql-container) {
        border: none !important;
        font-family: "Poppins", sans-serif; /* Match site font */
        font-size: 1rem;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    :global(.ql-editor) {
        padding: 1.5rem 2rem !important;
        min-height: 400px;
        color: #334155;
        line-height: 1.75;
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
