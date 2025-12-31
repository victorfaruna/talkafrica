<script lang="ts">
    export let post: any = null;
</script>

<section class="african-giant-section py-8 md:my-16">
    <div class="container mx-auto px-4 max-w-7xl">
        <h2
            class="text-center font-clash-grotesk text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-gray-900 flex items-center justify-center gap-2 md:gap-3"
        >
            <span class="text-xl md:text-3xl md:inline">👑</span> African Giant of
            the Week
        </h2>

        {#if post}
            <div
                class="giant-card max-w-5xl mx-auto grid md:grid-cols-2 gap-0 bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl border border-yellow-100"
            >
                <div class="relative h-56 md:h-auto md:min-h-[300px]">
                    <img
                        src={post.featured_image ||
                            post.image ||
                            "/images/placeholder.webp"}
                        alt={post.title}
                        class="absolute inset-0 w-full h-full object-cover"
                    />
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"
                    ></div>
                </div>

                <div class="content p-5 md:p-12 flex flex-col justify-center">
                    <div class="mb-3 md:mb-4">
                        <span
                            class="badge inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-sm"
                        >
                            African Giant
                        </span>
                    </div>

                    <h3
                        class="font-clash-grotesk text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight"
                    >
                        {post.title}
                    </h3>

                    <p
                        class="text-gray-600 text-sm md:text-lg leading-relaxed mb-5 md:mb-8 line-clamp-3 md:line-clamp-4"
                    >
                        {post.excerpt}
                    </p>

                    <a
                        href="/posts/{post.post_id}"
                        class="read-more inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all transform hover:-translate-y-1 hover:shadow-lg w-fit"
                    >
                        Read Full Story
                        <svg
                            class="w-4 h-4 md:w-5 md:h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path></svg
                        >
                    </a>
                </div>
            </div>
        {:else}
            <div
                class="text-center p-8 md:p-12 bg-yellow-50 rounded-xl border border-yellow-100 max-w-4xl mx-auto"
            >
                <p class="text-lg md:text-xl text-yellow-800 font-medium">
                    Coming Soon: Calling all Giants!
                </p>
                <p class="text-gray-600 mt-2 text-sm md:text-base">
                    No African Giant featured this week yet.
                </p>
            </div>
        {/if}

        <div class="text-center mt-6 md:mt-8">
            <a
                href="/african-giant"
                class="view-all inline-flex items-center text-yellow-600 hover:text-yellow-700 font-bold text-base md:text-lg hover:underline decoration-2 underline-offset-4 transition-all"
            >
                View All African Giants
                <svg
                    class="w-4 h-4 md:w-5 md:h-5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path></svg
                >
            </a>
        </div>
    </div>
</section>

<style>
    .african-giant-section {
        background: linear-gradient(135deg, #fffdf5, #ffffff);
    }

    .giant-card {
        box-shadow:
            0 20px 40px -5px rgba(253, 176, 34, 0.1),
            0 8px 16px -6px rgba(0, 0, 0, 0.05);
    }
</style>
