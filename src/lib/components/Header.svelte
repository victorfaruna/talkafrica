<script lang="ts">
    import { page } from "$app/state";
    const url = $derived(page.url.pathname);

    import {
        getNavigationCategories,
        getCategoryHierarchy,
        getSubcategories,
    } from "$lib/categories";

    const categories = getNavigationCategories();
    const categoryHierarchy = getCategoryHierarchy();

    let hoveredCategory = null;
    let mobileMenuOpen = $state(false);
    let expandedCategory = $state<string | null>(null);
    let searchModalOpen = $state(false);
    let searchQuery = $state("");
    let searchResults = $state([]);
    let isSearching = $state(false);

    function handleMouseEnter(categorySlug: string) {
        hoveredCategory = categorySlug;
    }

    function handleMouseLeave() {
        hoveredCategory = null;
    }

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function toggleCategory(categorySlug: string) {
        expandedCategory =
            expandedCategory === categorySlug ? null : categorySlug;
    }

    function toggleSearchModal() {
        searchModalOpen = !searchModalOpen;
        if (!searchModalOpen) {
            searchQuery = "";
            searchResults = [];
        }
    }

    async function performSearch() {
        if (searchQuery.trim().length < 2) {
            searchResults = [];
            return;
        }

        isSearching = true;
        try {
            const response = await fetch(
                `/api/posts?search=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();
            searchResults = data.posts || [];
        } catch (error) {
            console.error("Search error:", error);
            searchResults = [];
        } finally {
            isSearching = false;
        }
    }

    function handleSearchInput(event: Event) {
        const target = event.target as HTMLInputElement;
        searchQuery = target.value;

        // Debounce search
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(performSearch, 300);
    }
</script>

<header
    class="absolute top-0 right-0 left-0 z-[10] flex h-[100px] w-screen items-center justify-between gap-[1rem] bg-gradient-to-b from-secondary/60 to-transparent px-[var(--side-p)] text-primary"
>
    <div class="left part w-full">
        <button
            onclick={toggleSearchModal}
            class="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Search posts"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
            </svg>
        </button>
    </div>
    <div class="middle part flex w-full items-center justify-center gap-5">
        <ul class="lg:flex items-center gap-5 text-[12px] hidden">
            <li>
                <a
                    href="/"
                    class={`border-accent font-medium capitalize ${url.split("/")[1] === "" ? "border-b-2 pb-1" : ""} hh`}
                    >Home</a
                >
            </li>
            {#each categories as category}
                <li class="relative group">
                    <a
                        href={`/${category.slug}`}
                        class={`border-accent font-medium capitalize ${category.slug === url.split("/")[1] ? "border-b-2 pb-1" : ""} hh flex items-center gap-1`}
                        onmouseenter={() => handleMouseEnter(category.slug)}
                        onmouseleave={handleMouseLeave}
                    >
                        {category.display_name}
                        {#if categoryHierarchy.subcategories[category.slug] && categoryHierarchy.subcategories[category.slug].length > 0}
                            <svg
                                class="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        {/if}
                    </a>

                    <!-- Subcategories Dropdown -->
                    {#if categoryHierarchy.subcategories[category.slug] && categoryHierarchy.subcategories[category.slug].length > 0}
                        <div
                            class="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                            role="menu"
                            onmouseenter={() => handleMouseEnter(category.slug)}
                            onmouseleave={handleMouseLeave}
                        >
                            <div class="py-2">
                                {#each categoryHierarchy.subcategories[category.slug] as subcategory}
                                    <a
                                        href={`/${subcategory.slug}`}
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-accent transition-colors"
                                    >
                                        {subcategory.display_name}
                                    </a>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </li>
                {#if category.slug === "entertainment"}
                    <li>
                        <a
                            href="/about"
                            class={`border-accent font-medium capitalize ${url.split("/")[1] === "about" ? "border-b-2 pb-1" : ""} hh`}
                            >About Us</a
                        >
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
    <div class="right part flex w-full items-center justify-end gap-4">
        <!-- Mobile Menu Button -->
        <button
            onclick={toggleMobileMenu}
            class="lg:hidden text-white p-2"
            aria-label="Toggle mobile menu"
        >
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                {#if mobileMenuOpen}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                {:else}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                {/if}
            </svg>
        </button>
        <a
            aria-label="Facebook"
            href="https://www.facebook.com/share/1ENaqeVP7r/?mibextid=wwXIfr"
            target="_blank"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="1.5"
            >
                <path
                    d="M22 12C22 6.47717 17.5229 2.00002 12 2.00002C6.47715 2.00002 2 6.47717 2 12C2 16.9913 5.65686 21.1283 10.4375 21.8785V14.8906H7.89844V12H10.4375V9.7969C10.4375 7.29065 11.9304 5.90627 14.2146 5.90627C15.3087 5.90627 16.4531 6.10159 16.4531 6.10159V8.56252H15.1921C13.9499 8.56252 13.5625 9.33336 13.5625 10.1242V12H16.3359L15.8926 14.8906H13.5625V21.8785C18.3431 21.1283 22 16.9913 22 12Z"
                    stroke="white"
                    stroke-linejoin="round"
                />
            </svg>
        </a>
        <a
            aria-label="Instagram"
            href="https://www.instagram.com/talkafrica_ng?igsh=MWc2N2U0cW5wbmRlbw%3D%3D&utm_source=qr"
            target="_blank"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="1.5"
            >
                <path
                    d="M3.06168 7.24464C3.10845 6.22264 3.26847 5.56351 3.48488 5.00402L3.48779 4.99629C3.70224 4.42695 4.03819 3.91119 4.47225 3.48489L4.47834 3.47891L4.48432 3.47282C4.91097 3.0382 5.42692 2.70258 5.99576 2.4887L6.00557 2.48495C6.56379 2.26786 7.22163 2.10843 8.24448 2.06167M3.06168 7.24464C3.01251 8.33659 2.99998 8.67508 2.99998 11.5063C2.99998 14.3381 3.01182 14.6758 3.06165 15.768M3.06168 7.24464L3.06168 7.52008M3.48868 18.0168C3.70257 18.5856 4.03818 19.1015 4.4728 19.5282L4.47888 19.5342L4.48485 19.5402C4.91117 19.9743 5.42695 20.3103 5.9963 20.5247L6.00479 20.5279C6.56352 20.7446 7.22168 20.9041 8.24448 20.9509M3.48868 18.0168L3.48493 18.0069C3.26784 17.4487 3.10842 16.7909 3.06165 15.768M3.48868 18.0168L3.47586 17.9492M3.06165 15.768L3.0784 15.8562M3.06165 15.768L3.06165 15.4919M3.47586 17.9492L3.0784 15.8562M3.47586 17.9492C3.30706 17.5033 3.13323 16.881 3.0784 15.8562M3.47586 17.9492C3.48178 17.9649 3.4877 17.9803 3.4936 17.9955C3.70768 18.5726 4.04687 19.0952 4.4868 19.5256C4.9171 19.9655 5.43945 20.3046 6.01637 20.5187C6.47936 20.699 7.13174 20.8875 8.24432 20.9385C9.36711 20.9896 9.714 21 12.5062 21C15.2985 21 15.6457 20.9896 16.7685 20.9385C17.8824 20.8874 18.534 20.6979 18.9954 20.519C19.5726 20.305 20.0953 19.9657 20.5257 19.5256C20.9655 19.0953 21.3046 18.573 21.5187 17.9961C21.699 17.5331 21.8875 16.8808 21.9385 15.7682C21.9896 14.6454 22 14.2978 22 11.5063C22 8.71472 21.9895 8.36684 21.9384 7.24405C21.8871 6.12427 21.6959 5.47168 21.5161 5.00992C21.2811 4.40322 20.9831 3.94437 20.525 3.48627C20.0678 3.02999 19.6102 2.73179 19.003 2.49654C18.5396 2.31537 17.8866 2.12531 16.7685 2.07406C16.6712 2.06964 16.5798 2.06552 16.4921 2.06168M3.0784 15.8562C3.07685 15.8273 3.0754 15.7981 3.07405 15.7685C3.06962 15.6712 3.06549 15.5797 3.06165 15.4919M8.24448 2.06167C9.33669 2.01184 9.67506 2 12.5062 2C15.3374 2 15.6756 2.01252 16.7676 2.06168M8.24448 2.06167L8.52063 2.06167M16.7676 2.06168L16.4921 2.06168M16.7676 2.06168C17.7897 2.10844 18.449 2.26844 19.0085 2.48487L19.0162 2.48781C19.5856 2.70226 20.1013 3.03821 20.5276 3.47227L20.5335 3.4783L20.5396 3.48422C20.9737 3.91055 21.3096 4.42646 21.5239 4.99596L21.5276 5.00559C21.7446 5.56381 21.9041 6.22165 21.9508 7.2445M8.52063 2.06167L16.4921 2.06168M8.52063 2.06167C9.44549 2.02123 9.95667 2.01253 12.5062 2.01253C15.056 2.01253 15.5671 2.02124 16.4921 2.06168M8.52063 2.06167C8.43285 2.06551 8.34135 2.06964 8.24403 2.07406C7.13005 2.12512 6.47844 2.31464 6.01709 2.49358C5.43768 2.70837 4.91329 3.04936 4.48193 3.49186C4.02811 3.94756 3.73106 4.40422 3.49656 5.0094C3.31537 5.4728 3.12528 6.12614 3.07403 7.24434C3.06962 7.34135 3.06551 7.43257 3.06168 7.52008M21.9508 15.768C21.9041 16.7908 21.7446 17.449 21.5279 18.0077L21.5247 18.0162C21.3102 18.5856 20.9743 19.1013 20.5402 19.5276L20.5341 19.5336L20.5282 19.5397C20.1015 19.9743 19.5856 20.3099 19.0167 20.5238L19.0069 20.5276C18.4487 20.7447 17.7909 20.9041 16.768 20.9509M3.06165 15.4919C3.02121 14.567 3.01251 14.0558 3.01251 11.5063C3.01251 8.95591 3.02121 8.44544 3.06168 7.52008M3.06165 15.4919L3.06168 7.52008M10.8155 15.5881C11.3515 15.8101 11.9261 15.9244 12.5063 15.9244C13.678 15.9244 14.8018 15.4589 15.6304 14.6304C16.4589 13.8018 16.9244 12.678 16.9244 11.5063C16.9244 10.3345 16.4589 9.21072 15.6304 8.38215C14.8018 7.55359 13.678 7.0881 12.5063 7.0881C11.926 7.0881 11.3515 7.20238 10.8155 7.42442C10.2795 7.64645 9.7924 7.97189 9.38214 8.38215C8.97188 8.79242 8.64644 9.27947 8.4244 9.81551C8.20237 10.3515 8.08809 10.9261 8.08809 11.5063C8.08809 12.0865 8.20237 12.661 8.4244 13.197C8.64644 13.7331 8.97188 14.2201 9.38214 14.6304C9.7924 15.0406 10.2795 15.3661 10.8155 15.5881ZM9.3723 8.37231C10.2035 7.54113 11.3308 7.07418 12.5063 7.07418C13.6817 7.07418 14.809 7.54113 15.6402 8.37231C16.4714 9.20349 16.9383 10.3308 16.9383 11.5063C16.9383 12.6817 16.4714 13.809 15.6402 14.6402C14.809 15.4714 13.6817 15.9383 12.5063 15.9383C11.3308 15.9383 10.2035 15.4714 9.3723 14.6402C8.54112 13.809 8.07417 12.6817 8.07417 11.5063C8.07417 10.3308 8.54112 9.20349 9.3723 8.37231ZM19.434 6.04229C19.434 6.37873 19.3004 6.70139 19.0625 6.93929C18.8246 7.17719 18.5019 7.31084 18.1655 7.31084C17.829 7.31084 17.5064 7.17719 17.2685 6.93929C17.0306 6.70139 16.8969 6.37873 16.8969 6.04229C16.8969 5.70585 17.0306 5.38319 17.2685 5.1453C17.5064 4.9074 17.829 4.77375 18.1655 4.77375C18.5019 4.77375 18.8246 4.9074 19.0625 5.1453C19.3004 5.38319 19.434 5.70585 19.434 6.04229Z"
                    stroke="white"
                    stroke-linejoin="round"
                />
            </svg>
        </a>
        <a
            href="https://youtube.com/@talkafricang?si=yXdrZeI_Cm3s7DEh"
            target="_blank"
            aria-label="YouTube"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="1.5"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.5949 4.45999C21.5421 4.71353 22.2865 5.45785 22.54 6.40501C22.9982 8.12001 23 11.7004 23 11.7004C23 11.7004 23 15.2807 22.54 16.9957C22.2865 17.9429 21.5421 18.6872 20.5949 18.9407C18.88 19.4007 12 19.4007 12 19.4007C12 19.4007 5.12001 19.4007 3.405 18.9407C2.45785 18.6872 1.71353 17.9429 1.45999 16.9957C1 15.2807 1 11.7004 1 11.7004C1 11.7004 1 8.12001 1.45999 6.40501C1.71353 5.45785 2.45785 4.71353 3.405 4.45999C5.12001 4 12 4 12 4C12 4 18.88 4 20.5949 4.45999ZM15.5134 11.7007L9.79788 15.0003V8.40101L15.5134 11.7007Z"
                    stroke="white"
                    stroke-linejoin="round"
                />
            </svg>
        </a>
    </div>
</header>

<!-- Mobile Menu -->
{#if mobileMenuOpen}
    <div class="fixed inset-0 z-40 lg:hidden">
        <!-- Backdrop with blur effect -->
        <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onclick={toggleMobileMenu}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Enter" && toggleMobileMenu()}
        ></div>

        <!-- Menu Panel with slide-in animation -->
        <div
            class="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-transform duration-300 ease-out"
            class:translate-x-0={mobileMenuOpen}
            class:translate-x-full={!mobileMenuOpen}
        >
            <!-- Header with logo and close button -->
            <div
                class="flex items-center justify-between p-6 border-b border-gray-200 bg-white"
            >
                <div class="flex items-center space-x-3">
                    <div
                        class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center"
                    >
                        <img
                            src="/images/logo.webp"
                            alt="Talk Africa"
                            class="size-10 inline-block object-fit"
                        />
                    </div>
                    <h2 class="text-xl font-bold text-gray-900">TalkAfrica</h2>
                </div>
                <button
                    onclick={toggleMobileMenu}
                    class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close mobile menu"
                >
                    <svg
                        class="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto">
                <div class="p-6">
                    <ul class="space-y-1">
                        <li>
                            <a
                                href="/"
                                class={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${url.split("/")[1] === "" ? "bg-accent text-white shadow-lg" : "text-gray-700 hover:bg-gray-100 hover:text-accent"}`}
                                onclick={toggleMobileMenu}
                            >
                                <svg
                                    class="w-5 h-5 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                Home
                            </a>
                        </li>
                        {#each categories as category}
                            <li>
                                <div class="space-y-1">
                                    <button
                                        onclick={() =>
                                            toggleCategory(category.slug)}
                                        class={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${category.slug === url.split("/")[1] ? "bg-accent text-white shadow-lg" : "text-gray-700 hover:bg-gray-100 hover:text-accent"}`}
                                    >
                                        <div class="flex items-center">
                                            <svg
                                                class="w-5 h-5 mr-3"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                />
                                            </svg>
                                            <span>{category.display_name}</span>
                                        </div>
                                        {#if categoryHierarchy.subcategories[category.slug] && categoryHierarchy.subcategories[category.slug].length > 0}
                                            <svg
                                                class="w-5 h-5 transition-transform duration-200 {expandedCategory ===
                                                category.slug
                                                    ? 'rotate-180'
                                                    : ''}"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        {/if}
                                    </button>

                                    <!-- Subcategories with smooth animation -->
                                    {#if expandedCategory === category.slug && categoryHierarchy.subcategories[category.slug] && categoryHierarchy.subcategories[category.slug].length > 0}
                                        <div
                                            class="ml-8 space-y-1 overflow-hidden transition-all duration-300"
                                        >
                                            {#each categoryHierarchy.subcategories[category.slug] as subcategory}
                                                <a
                                                    href={`/${subcategory.slug}`}
                                                    class="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-accent transition-all duration-200 rounded-lg"
                                                    onclick={toggleMobileMenu}
                                                >
                                                    <div
                                                        class="w-2 h-2 bg-gray-300 rounded-full mr-3"
                                                    ></div>
                                                    {subcategory.display_name}
                                                </a>
                                            {/each}
                                        </div>
                                    {/if}
                                </div>
                            </li>
                            {#if category.slug === "entertainment"}
                                <li>
                                    <a
                                        href="/about"
                                        class={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${url.split("/")[1] === "about" ? "bg-accent text-white shadow-lg" : "text-gray-700 hover:bg-gray-100 hover:text-accent"}`}
                                        onclick={toggleMobileMenu}
                                    >
                                        <svg
                                            class="w-5 h-5 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        About Us
                                    </a>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </div>

                <!-- Social Links Section -->
                <div class="px-6 pb-6">
                    <div
                        class="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-6"
                    >
                        <h3
                            class="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                        >
                            <svg
                                class="w-5 h-5 mr-2 text-accent"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                            Follow Us
                        </h3>
                        <div class="flex gap-4">
                            <a
                                aria-label="Facebook"
                                href="https://www.facebook.com/share/1ENaqeVP7r/?mibextid=wwXIfr"
                                target="_blank"
                                class="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M22 12C22 6.47717 17.5229 2.00002 12 2.00002C6.47715 2.00002 2 6.47717 2 12C2 16.9913 5.65686 21.1283 10.4375 21.8785V14.8906H7.89844V12H10.4375V9.7969C10.4375 7.29065 11.9304 5.90627 14.2146 5.90627C15.3087 5.90627 16.4531 6.10159 16.4531 6.10159V8.56252H15.1921C13.9499 8.56252 13.5625 9.33336 13.5625 10.1242V12H16.3359L15.8926 14.8906H13.5625V21.8785C18.3431 21.1283 22 16.9913 22 12Z"
                                    />
                                </svg>
                            </a>
                            <a
                                aria-label="Instagram"
                                href="https://www.instagram.com/talkafrica_ng?igsh=MWc2N2U0cW5wbmRlbw%3D%3D&utm_source=qr"
                                target="_blank"
                                class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-110"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                    />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/@talkafricang?si=yXdrZeI_Cm3s7DEh"
                                target="_blank"
                                aria-label="YouTube"
                                class="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 hover:scale-110"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    </div>
{/if}

<!-- Search Modal -->
{#if searchModalOpen}
    <div class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onclick={toggleSearchModal}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Escape" && toggleSearchModal()}
        ></div>

        <!-- Search Modal -->
        <div class="fixed inset-x-4 top-20 max-w-2xl mx-auto">
            <div
                class="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
            >
                <!-- Search Input -->
                <div class="p-6 border-b border-gray-200">
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                        >
                            <svg
                                class="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            bind:value={searchQuery}
                            oninput={handleSearchInput}
                            class="w-full pl-12 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent placeholder-gray-500"
                            autofocus
                        />
                        {#if searchQuery}
                            <button
                                onclick={() => (searchQuery = "")}
                                class="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                                <svg
                                    class="w-5 h-5 text-gray-400 hover:text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        {/if}
                    </div>
                </div>

                <!-- Search Results -->
                <div class="max-h-96 overflow-y-auto">
                    {#if isSearching}
                        <div class="p-8 text-center">
                            <div
                                class="inline-flex items-center space-x-2 text-gray-500"
                            >
                                <svg
                                    class="animate-spin w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                                <span>Searching...</span>
                            </div>
                        </div>
                    {:else if searchQuery.length >= 2 && searchResults.length === 0}
                        <div class="p-8 text-center text-gray-500">
                            <svg
                                class="w-12 h-12 mx-auto mb-4 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <p class="text-lg font-medium">No posts found</p>
                            <p class="text-sm">Try different keywords</p>
                        </div>
                    {:else if searchResults.length > 0}
                        <div class="divide-y divide-gray-100">
                            {#each searchResults as post}
                                <a
                                    href="/posts/{post.id}"
                                    onclick={toggleSearchModal}
                                    class="block p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div class="flex items-start space-x-3">
                                        {#if post.featured_image}
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                            />
                                        {:else}
                                            <div
                                                class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
                                            >
                                                <svg
                                                    class="w-8 h-8 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        {/if}
                                        <div class="flex-1 min-w-0">
                                            <h3
                                                class="text-sm font-semibold text-gray-900 line-clamp-2"
                                            >
                                                {post.title}
                                            </h3>
                                            <p
                                                class="text-xs text-gray-500 mt-1 line-clamp-2"
                                            >
                                                {post.excerpt ||
                                                    post.content?.substring(
                                                        0,
                                                        100
                                                    ) + "..."}
                                            </p>
                                            <div
                                                class="flex items-center mt-2 space-x-2"
                                            >
                                                <span
                                                    class="text-xs text-gray-400"
                                                >
                                                    {new Date(
                                                        post.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                                {#if post.category}
                                                    <span
                                                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent"
                                                    >
                                                        {post.category
                                                            .display_name}
                                                    </span>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <div class="p-8 text-center text-gray-500">
                            <svg
                                class="w-12 h-12 mx-auto mb-4 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                            <p class="text-lg font-medium">Search for posts</p>
                            <p class="text-sm">
                                Type at least 2 characters to start searching
                            </p>
                        </div>
                    {/if}
                </div>

                <!-- Footer -->
                <div class="p-4 border-t border-gray-200 bg-gray-50/50">
                    <div
                        class="flex items-center justify-between text-xs text-gray-500"
                    >
                        <span
                            >Press <kbd class="px-1 py-0.5 bg-gray-200 rounded"
                                >Esc</kbd
                            > to close</span
                        >
                        <span
                            >{searchResults.length} result{searchResults.length !==
                            1
                                ? "s"
                                : ""}</span
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
