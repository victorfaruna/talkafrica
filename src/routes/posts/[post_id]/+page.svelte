<script lang="ts">
    export let data: {
        post: {
            title: string;
            content: string;
            excerpt?: string | null;
            image?: string | null;
            category?: string | null;
            created_at?: string | Date;
            author?: string | null;
        };
    };
    const { post } = data;
</script>

<svelte:head>
    <title>{post.title} - Talk Africa</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-4xl px-[var(--side-p)] py-8">
        <a href="/" class="text-sm text-accent">← Back to Home</a>
        <h1 class="mt-2 text-3xl font-semibold text-gray-900">{post.title}</h1>
        <div class="mt-2 text-sm text-gray-500 flex items-center gap-2">
            {#if post.category}
                <span class="px-2 py-1 rounded bg-gray-100"
                    >{post.category}</span
                >
            {/if}
            {#if post.author}
                <span>by {post.author}</span>
            {/if}
            {#if post.created_at}
                <span
                    >• {new Date(
                        post.created_at as any
                    ).toLocaleDateString()}</span
                >
            {/if}
        </div>
        {#if post.image}
            <img
                src={post.image}
                alt={post.title}
                class="mt-6 w-full rounded-xl object-cover"
            />
        {/if}
        <article class="prose prose-sm lg:prose lg:max-w-none mt-6">
            {@html post.content}
        </article>
    </div>
</div>
