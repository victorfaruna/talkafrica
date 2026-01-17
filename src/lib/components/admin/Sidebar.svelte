<script lang="ts">
    import { page } from "$app/stores";

    export let activeTab = "";

    // Helper to determine if a link is active based on URL or prop
    function isActive(path: string, tabName: string) {
        if (activeTab === tabName) return true;
        if (
            tabName === "videos" &&
            $page.url.pathname.startsWith("/admin/videos")
        )
            return true;
        return false;
    }
</script>

<aside
    class="bg-white border-b border-gray-200 lg:border-b-0 lg:border-r lg:w-64 w-full lg:sticky lg:top-0 lg:self-start lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto"
>
    <nav class="p-3 lg:p-4">
        <ul
            class="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:space-y-1 lg:gap-0"
        >
            <li>
                <a
                    href="/admin"
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin',
                        'dashboard',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <span>Dashboard</span>
                </a>
            </li>
            <li>
                <!-- We use query param or just rely on the dashboard to handle the 'posts' view default -->
                <!-- But for now, let's assume the dashboard handles clicks if we are on it, or we link back to it -->
                <button
                    on:click={() => (window.location.href = "/admin?tab=posts")}
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin',
                        'posts',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    <span>Posts</span>
                </button>
            </li>

            <!-- NEW VIDEOS TAB -->
            <li>
                <a
                    href="/admin/videos"
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin/videos',
                        'videos',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    <span>Videos</span>
                </a>
            </li>

            <!-- COMMENTS TAB -->
            <li>
                <a
                    href="/admin/comments"
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin/comments',
                        'comments',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                    </svg>
                    <span>Comments</span>
                </a>
            </li>

            <!-- NEWSLETTER TAB -->
            <li>
                <button
                    on:click={() =>
                        (window.location.href = "/admin?tab=newsletter")}
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin',
                        'newsletter',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    <span>Newsletter</span>
                </button>
            </li>

            <li>
                <button
                    on:click={() => (window.location.href = "/admin?tab=users")}
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin',
                        'users',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                    </svg>
                    <span>Users</span>
                </button>
            </li>
            <li>
                <button
                    on:click={() => (window.location.href = "/admin?tab=media")}
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin',
                        'media',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
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
                    <span>Media</span>
                </button>
            </li>
            <li class="col-span-2 lg:col-span-1">
                <button
                    on:click={() =>
                        (window.location.href = "/admin?tab=settings")}
                    class="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-3 lg:py-2 text-xs sm:text-sm rounded-lg transition-all w-full {isActive(
                        '/admin',
                        'settings',
                    )
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'}"
                >
                    <svg
                        class="w-4 h-4 lg:w-5 lg:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span>Settings</span>
                </button>
            </li>
        </ul>
    </nav>
</aside>
