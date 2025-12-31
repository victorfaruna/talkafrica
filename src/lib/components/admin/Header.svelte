<script lang="ts">
    import { goto } from "$app/navigation";

    async function logout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            goto("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
</script>

<header class="bg-white border-b border-gray-200">
    <div class="px-6 py-4">
        <div class="flex items-center justify-between">
            <a class="flex items-center gap-3" href="/">
                <div>
                    <img
                        src="/images/logo.webp"
                        alt="TalkAfrica Logo"
                        class="w-15 h-15 object-cover shadow-md"
                    />
                </div>
                <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
            </a>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    <div
                        class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <span>Admin</span>
                </div>
                <button
                    on:click={logout}
                    class="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    <span class="text-sm">Logout</span>
                </button>
            </div>
        </div>
    </div>
</header>
