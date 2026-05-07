<script>
    import { getCategoryHierarchy } from "$lib/categories";

    const { main_categories, subcategories } = getCategoryHierarchy();
    const footerCategories = main_categories.filter(
        (cat) => cat.slug !== "african-giant",
    );

    let email = "";
    let isSubmitting = false;

    async function handleSubmit() {
        if (!email.trim()) return;
        isSubmitting = true;

        try {
            const response = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) throw new Error("Failed to subscribe");

            email = "";
            alert("Successfully subscribed to newsletter!");
        } catch (error) {
            console.error("Newsletter error:", error);
            alert("Failed to subscribe. Please try again.");
        } finally {
            isSubmitting = false;
        }
    }
</script>

<footer class="bg-secondary/95 px-[var(--side-p)] py-12 md:py-16 text-primary">
    <div class="mx-auto max-w-7xl">
        <!-- Main Footer Content -->
        <div
            class="mb-8 md:mb-12 grid grid-cols-1 gap-8 md:gap-8 md:grid-cols-2 lg:grid-cols-5"
        >
            <!-- Brand Section -->
            <div class="lg:col-span-1">
                <h3
                    class="mb-4 font-clash-grotesk text-[1.75rem] md:text-[2rem] font-bold text-primary/90"
                >
                    <img
                        src="/images/logo.webp"
                        alt="Talk Africa Logo"
                        class="size-10 inline-block object-fit"
                    />
                    {" "}
                    TalkAfrica
                </h3>
                <p class="mb-6 text-sm leading-relaxed text-primary/70">
                    Your premier destination for African news, culture, and
                    innovation. Stay informed with the latest stories from
                    across the continent.
                </p>
                <!-- Social Media Icons - Enhanced for Mobile -->
                <div class="flex gap-5 md:gap-4">
                    <a
                        href="https://facebook.com/talkafrica"
                        class="text-primary/60 transition-all duration-300 hover:text-accent hover:scale-110"
                        aria-label="Facebook"
                    >
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="md:w-[20px] md:h-[20px]"
                        >
                            <path
                                d="M22 12C22 6.47717 17.5229 2.00002 12 2.00002C6.47715 2.00002 2 6.47717 2 12C2 16.9913 5.65686 21.1283 10.4375 21.8785V14.8906H7.89844V12H10.4375V9.7969C10.4375 7.29065 11.9304 5.90627 14.2146 5.90627C15.3087 5.90627 16.4531 6.10159 16.4531 6.10159V8.56252H15.1921C13.9499 8.56252 13.5625 9.33336 13.5625 10.1242V12H16.3359L15.8926 14.8906H13.5625V21.8785C18.3431 21.1283 22 16.9913 22 12Z"
                                fill="currentColor"
                            />
                        </svg>
                    </a>
                    <a
                        href="https://instagram.com/talkafrica"
                        class="text-primary/60 transition-all duration-300 hover:text-accent hover:scale-110"
                        aria-label="Instagram"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            class="md:w-[20px] md:h-[20px]"
                        >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a
                        href="https://youtube.com/talkafrica"
                        class="text-primary/60 transition-all duration-300 hover:text-accent hover:scale-110"
                        aria-label="YouTube"
                    >
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="md:w-[20px] md:h-[20px]"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M20.5949 4.45999C21.5421 4.71353 22.2865 5.45785 22.54 6.40501C22.9982 8.12001 23 11.7004 23 11.7004C23 11.7004 23 15.2807 22.54 16.9957C22.2865 17.9429 21.5421 18.6872 20.5949 18.9407C18.88 19.4007 12 19.4007 12 19.4007C12 19.4007 5.12001 19.4007 3.405 18.9407C2.45785 18.6872 1.71353 17.9429 1.45999 16.9957C1 15.2807 1 11.7004 1 11.7004C1 11.7004 1 8.12001 1.45999 6.40501C1.71353 5.45785 2.45785 4.71353 3.405 4.45999C5.12001 4 12 4 12 4C12 4 18.88 4 20.5949 4.45999ZM15.5134 11.7007L9.79788 15.0003V8.40101L15.5134 11.7007Z"
                                fill="currentColor"
                            />
                        </svg>
                    </a>
                    <a
                        href="https://twitter.com/talkafrica"
                        class="text-primary/60 transition-all duration-300 hover:text-accent hover:scale-110"
                        aria-label="Twitter"
                    >
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            class="md:w-[20px] md:h-[20px]"
                        >
                            <path
                                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                                fill="currentColor"
                            />
                        </svg>
                    </a>
                </div>
            </div>

            <!-- Dynamic Categories -->
            {#each footerCategories as category}
                <div
                    class="border-t border-tertiary/10 pt-6 md:border-0 md:pt-0"
                >
                    <h4
                        class="mb-4 font-clash-grotesk text-base md:text-lg font-semibold text-primary/90"
                    >
                        {category.display_name}
                    </h4>
                    <ul class="space-y-3.5 md:space-y-3">
                        <!-- Main category link -->
                        <li>
                            <a
                                href="/{category.slug}"
                                class="text-sm text-primary/70 transition-colors duration-300 hover:text-accent block py-0.5"
                                >{category.display_name}</a
                            >
                        </li>
                        <!-- Subcategories -->
                        {#if subcategories[category.slug]}
                            {#each subcategories[category.slug] as subcategory}
                                <li>
                                    <a
                                        href="/{subcategory.slug}"
                                        class="text-sm text-primary/70 transition-colors duration-300 hover:text-accent block py-0.5"
                                        >{subcategory.display_name}</a
                                    >
                                </li>
                            {/each}
                        {/if}
                    </ul>
                </div>
            {/each}
        </div>

        <!-- Newsletter Subscription - Simplified on Mobile -->
        <div class="mb-8 border-t border-tertiary/20 pt-6 md:pt-8">
            <div class="max-w-md">
                <h4
                    class="mb-2 font-clash-grotesk text-base md:text-lg font-semibold text-primary/90"
                >
                    Stay Updated
                </h4>
                <p class="mb-4 text-sm text-primary/70 leading-relaxed">
                    Get the latest African news delivered to your inbox.
                </p>
                <form
                    on:submit|preventDefault={handleSubmit}
                    class="flex flex-col gap-3 md:flex-row md:gap-2"
                >
                    <input
                        type="email"
                        bind:value={email}
                        placeholder="Enter your email"
                        required
                        disabled={isSubmitting}
                        class="flex-1 rounded-lg md:rounded-md border border-tertiary/20 bg-primary/10 px-4 py-3 md:py-2 text-sm text-primary placeholder-tertiary/60 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="cursor-pointer rounded-lg md:rounded-md border border-accent bg-transparent px-6 py-3 md:py-2 font-medium text-accent hover:bg-accent/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "..." : "Subscribe"}
                    </button>
                </form>
            </div>
        </div>

        <!-- Bottom Footer -->
        <div
            class="flex flex-col items-center justify-between gap-6 md:gap-4 border-t border-tertiary/20 pt-6 md:pt-8 md:flex-row"
        >
            <div
                class="flex flex-col items-center gap-4 text-sm text-primary/70 md:flex-row"
            >
                <p>&copy; {new Date().getFullYear()} TalkAfrica. All rights reserved.</p>
                <div class="flex gap-5 md:gap-6">
                    <a
                        href="/privacy"
                        class="transition-colors duration-300 hover:text-accent"
                        >Privacy Policy</a
                    >
                    <a
                        href="/terms"
                        class="transition-colors duration-300 hover:text-accent"
                        >Terms of Service</a
                    >
                    <a
                        href="/contact"
                        class="transition-colors duration-300 hover:text-accent"
                        >Contact Us</a
                    >
                </div>
            </div>
            <div class="text-sm text-primary/70">
                <p>Made with ❤️ for Africa</p>
            </div>
        </div>
    </div>
</footer>
