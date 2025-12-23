<script>
    export let category = "politics";
    export let categoryName = "Politics";
    export let posts = [];
    export let color = "#16a34a";
    export let special = false;

    // Mark first post as trending (optional, purely visual logic here as per design)
    // In a real scenario, we might want to check if the post is actually trending,
    // but the design request implies the first card gets the badge.
    // We can also allow a prop or check post.isTrendingNews if strictly needed,
    // but for "Top Stories" usually the first one is the "Headliner".
</script>

<section class="category-section" class:african-giant-section={special}>
    <div class="section-header">
        <h2>
            Top Stories in <span
                class="category-name"
                style="color: {special ? '' : color}">{categoryName}</span
            >
        </h2>
        <a
            href="/{category}"
            class="view-all-btn"
            style="background: {special ? '' : color}"
        >
            View All
        </a>
    </div>

    <div class="posts-grid">
        {#if posts && posts.length > 0}
            {#each posts.slice(0, 3) as post, index}
                <article class="post-card">
                    <a
                        href="/posts/{post.slug || post.post_id}"
                        class="card-link"
                    >
                        <div class="image-wrapper">
                            <img
                                src={post.image || "/images/placeholder.jpg"}
                                alt={post.title}
                                loading="lazy"
                            />
                            {#if index === 0}
                                <span
                                    class="trending-badge"
                                    style="background: {special
                                        ? ''
                                        : '#2c2c2c'}">Trending</span
                                >
                            {/if}
                        </div>

                        <div class="card-content">
                            <h3 class="post-title">{post.title}</h3>
                            <p class="post-excerpt">{post.excerpt || ""}</p>
                            <span
                                class="read-more"
                                style="color: {special ? '' : color}"
                                >Read More →</span
                            >
                        </div>
                    </a>
                </article>
            {/each}
        {:else}
            <p class="text-gray-500 col-span-full text-center py-10">
                No stories found in {categoryName}.
            </p>
        {/if}
    </div>
</section>

<style>
    .category-section {
        padding: 60px 20px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        padding-bottom: 16px;
        border-bottom: 2px solid #e0e0e0;
    }

    .section-header h2 {
        font-size: 32px;
        font-weight: 700;
        color: #2c2c2c;
    }

    /* Fallback color, overridden by inline style */
    .category-name {
        color: #16a34a;
    }

    .view-all-btn {
        color: white;
        padding: 12px 28px;
        border-radius: 24px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s;
    }

    .view-all-btn:hover {
        filter: brightness(0.9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .posts-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    .post-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s;
        height: 100%; /* Ensure cards are same height */
        display: flex;
        flex-direction: column;
    }

    .post-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-link {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        padding-top: 60%; /* 5:3 aspect ratio */
        overflow: hidden;
        background-color: #f3f4f6;
    }

    .image-wrapper img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .trending-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
    }

    .card-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .post-title {
        font-size: 18px;
        font-weight: 700;
        color: #2c2c2c;
        margin-bottom: 12px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .post-excerpt {
        font-size: 14px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex-grow: 1;
    }

    .read-more {
        font-weight: 600;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background-color: transparent;
        border: none;
        padding: 0;
        margin-top: auto; /* Push to bottom */
    }

    .post-card:hover .read-more {
        gap: 8px;
    }

    /* Special styling for African Giant */
    :global(.african-giant-section) {
        background: linear-gradient(135deg, #fff9e6, #ffffff);
        padding: 60px 20px; /* Add horizontal padding to inner content */
        border-radius: 12px;
        margin-top: 40px;
        margin-bottom: 40px;
    }

    :global(.african-giant-section .category-name) {
        background: linear-gradient(135deg, #ffd700, #fdb022);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: #ffd700 !important; /* Fallback */
    }

    :global(.african-giant-section .view-all-btn) {
        background: linear-gradient(135deg, #ffd700, #fdb022) !important;
        color: #000 !important; /* Better contrast on gold */
    }

    :global(.african-giant-section .trending-badge) {
        background: linear-gradient(135deg, #ffd700, #fdb022) !important;
        color: #000 !important;
    }

    /* Tablet */
    @media (max-width: 1024px) {
        .posts-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .section-header h2 {
            font-size: 28px;
        }
    }

    /* Mobile */
    @media (max-width: 768px) {
        .category-section {
            padding: 40px 16px;
            width: 100%;
        }

        .posts-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
        }

        .section-header h2 {
            font-size: 24px;
        }

        .view-all-btn {
            width: 100%;
            text-align: center;
        }
    }
</style>
