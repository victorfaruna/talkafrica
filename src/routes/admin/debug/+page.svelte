<script lang="ts">
    export let data;
</script>

<div class="p-6 max-w-4xl mx-auto">
    <div class="mb-8">
        <h1 class="text-3xl font-bold font-clash text-gray-900">
            System Status Checks
        </h1>
        <div class="flex items-center gap-2 mt-2 text-gray-500">
            <a href="/admin" class="hover:text-orange-600 transition-colors"
                >&larr; Back to Dashboard</a
            >
            <span>•</span>
            <p>Verify your production environment configuration</p>
        </div>
    </div>

    <div class="space-y-6">
        <!-- Google Sheets Check -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                    class="w-6 h-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                Google Sheets Integration
            </h2>
            <div class="grid gap-4">
                <div
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                    <span class="font-medium text-gray-700"
                        >Service Account Email</span
                    >
                    {#if data.check.google.email}
                        <span
                            class="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                        >
                            ✅ Set ({data.check.envPreview.email})
                        </span>
                    {:else}
                        <span
                            class="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"
                            >❌ Missing</span
                        >
                    {/if}
                </div>
                <div
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                    <span class="font-medium text-gray-700">Private Key</span>
                    {#if data.check.google.key}
                        <span
                            class="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"
                        >
                            ✅ Set (Length: {data.check.google.keyLength})
                        </span>
                    {:else}
                        <span
                            class="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"
                            >❌ Missing</span
                        >
                    {/if}
                </div>
                <div
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                    <span class="font-medium text-gray-700">Sheet ID</span>
                    {#if data.check.google.sheetId}
                        <span
                            class="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"
                        >
                            ✅ Set ({data.check.envPreview.sheetId})
                        </span>
                    {:else}
                        <span
                            class="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"
                            >❌ Missing</span
                        >
                    {/if}
                </div>
            </div>
            {#if !data.check.google.email || !data.check.google.key || !data.check.google.sheetId}
                <div
                    class="mt-4 p-4 bg-orange-50 text-orange-800 rounded-lg text-sm"
                >
                    ⚠️ <strong>Action Required:</strong> Please go to your Vercel
                    Dashboard > Settings > Environment Variables and add the missing
                    keys shown above.
                </div>
            {/if}
        </div>

        <!-- Database Check -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                    class="w-6 h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                </svg>
                Database Connection
            </h2>
            <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
                <span class="font-medium text-gray-700">Status</span>
                {#if data.check.db === "connected"}
                    <span
                        class="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"
                        >✅ Connected</span
                    >
                {:else}
                    <span
                        class="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"
                        >❌ {data.check.db}</span
                    >
                {/if}
            </div>
        </div>

        <!-- Gemini AI Check -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                    class="w-6 h-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
                Gemini AI API
            </h2>
            <div
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
                <span class="font-medium text-gray-700">API Key</span>
                {#if data.check.gemini.apiKey}
                    <span
                        class="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium"
                        >✅ Set</span
                    >
                {:else}
                    <span
                        class="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium"
                        >❌ Missing</span
                    >
                {/if}
            </div>
        </div>
    </div>
</div>
