<script lang="ts">
    export let posts: any[] = [];

    $: heroPost = posts[0];
    $: supportingPosts = posts.slice(1, 5); // Take next 4 posts

    function formatDate(dateString: string) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }
</script>

<div class="trending-container">
    <div class="section-header">
        <h3 class="section-title">Trending News</h3>
        <div class="pulse-dot"></div>
    </div>

    {#if posts.length === 0}
        <div class="empty-state">No trending stories yet.</div>
    {:else}
        <div class="trending-grid">
            <!-- Hero Card (Rank #1) -->
            {#if heroPost}
                <a
                    href="/posts/{heroPost.post_id || heroPost.id || '#'}"
                    class="hero-card group"
                >
                    <div class="hero-image-wrapper">
                        <img
                            src={heroPost.image || "/images/placeholder.webp"}
                            alt={heroPost.title}
                            loading="lazy"
                        />
                        <div class="hero-overlay"></div>
                        <div class="rank-badge hero-rank">1</div>
                        <div class="hero-content">
                            {#if heroPost.category}
                                <span class="category-tag"
                                    >{heroPost.category}</span
                                >
                            {/if}
                            <h4 class="hero-title group-hover:underline">
                                {heroPost.title}
                            </h4>
                            <div class="meta-info">
                                <span>{formatDate(heroPost.created_at)}</span>
                                {#if heroPost.views}
                                    <span class="meta-separator">•</span>
                                    <span>{heroPost.views} views</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                </a>
            {/if}

            <!-- Compact List (Rank #2-5) -->
            <div class="supporting-list">
                {#each supportingPosts as post, index}
                    <a
                        href="/posts/{post.post_id || post.id || '#'}"
                        class="compact-card group"
                    >
                        <div class="rank-badge compact-rank">{index + 2}</div>
                        <div class="compact-content">
                            <h5 class="compact-title group-hover:text-accent">
                                {post.title}
                            </h5>
                            <div class="meta-info compact-meta">
                                {#if post.category}
                                    <span class="category-label"
                                        >{post.category}</span
                                    >
                                {/if}
                                <span class="date"
                                    >{formatDate(post.created_at)}</span
                                >
                            </div>
                        </div>
                        <div class="compact-thumbnail">
                            <img
                                src={post.image || "/images/placeholder.webp"}
                                alt={post.title}
                                loading="lazy"
                            />
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    /* Container & Header */
    .trending-container {
        background: white;
        padding: 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        height: 100%;
        min-height: 500px;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #f3f4f6;
        padding-bottom: 1rem;
    }

    .section-title {
        font-family: "ClashGrotesk", sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.01em;
    }

    .pulse-dot {
        width: 8px;
        height: 8px;
        background-color: #ef4444;
        border-radius: 50%;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
        }
        70% {
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
        }
    }

    /* Hero Card */
    .hero-card {
        display: block;
        position: relative;
        border-radius: 0.75rem;
        overflow: hidden;
        margin-bottom: 1.5rem;
        aspect-ratio: 16/10;
    }

    .hero-image-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .hero-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .hero-card:hover img {
        transform: scale(1.05);
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.1) 100%
        );
    }

    .hero-content {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1.25rem;
        width: 100%;
        z-index: 2;
    }

    .hero-title {
        color: white;
        font-weight: 700;
        font-size: 1.125rem;
        line-height: 1.4;
        margin-bottom: 0.5rem;
        font-family: "ClashGrotesk", sans-serif;
        /* Line clamp */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .category-tag {
        display: inline-block;
        background: var(--color-accent);
        color: white;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .meta-info {
        display: flex;
        align-items: center;
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.75rem;
    }

    .meta-separator {
        margin: 0 0.5rem;
    }

    /* Supporting List */
    .supporting-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .compact-card {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 0.75rem;
        border-radius: 0.5rem;
        transition: background-color 0.2s ease;
    }

    .compact-card:hover {
        background-color: #f9fafb;
    }

    .rank-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-family: "ClashGrotesk", sans-serif;
    }

    .hero-rank {
        position: absolute;
        top: 1rem;
        left: 1rem;
        width: 2rem;
        height: 2rem;
        background: white;
        color: #111827;
        border-radius: 50%;
        z-index: 2;
    }

    .compact-rank {
        color: #9ca3af;
        font-size: 1.5rem;
        line-height: 1;
        min-width: 1.5rem;
        margin-top: -0.2rem; /* Visual alignment */
    }

    .compact-content {
        flex: 1;
    }

    .compact-title {
        font-weight: 600;
        font-size: 0.95rem;
        color: #1f2937;
        line-height: 1.4;
        margin-bottom: 0.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: color 0.2s;
    }

    .compact-meta {
        color: #6b7280;
    }

    .compact-thumbnail {
        width: 80px;
        height: 60px;
        border-radius: 0.375rem;
        overflow: hidden;
        flex-shrink: 0;
    }

    .compact-thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .category-label {
        font-size: 0.7rem;
        color: var(--color-accent);
        font-weight: 600;
        text-transform: uppercase;
        margin-right: 0.5rem;
    }

    /* Mobile Responsive */
    @media (max-width: 640px) {
        .trending-container {
            padding: 1rem;
            min-height: auto;
        }

        .hero-title {
            font-size: 1rem;
        }

        .compact-card {
            padding: 0.5rem 0;
        }
    }
</style>
