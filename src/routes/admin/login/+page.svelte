<script lang="ts">
    import { goto } from "$app/navigation";
    import axios from "axios";

    let login = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    async function handleLogin() {
        if (!login || !password) {
            error = "Please fill in all fields";
            return;
        }

        loading = true;
        error = "";

        try {
            const response = await axios.post("/api/auth/login", {
                login,
                password,
            });
            const data = response.data;
            console.log(data);
            if (data.success == true) {
                goto("/admin");
            } else {
                error = data.message || "Login failed";
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                error = err.response.data.message;
            } else {
                error = "Login failed. Please try again.";
            }
            console.error("Login error details:", err);
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Admin Login - Talk Africa</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-8">
            <h1
                class="text-2xl font-clash-grotesk font-semibold text-secondary"
            >
                Admin Login
            </h1>
            <p class="text-tertiary mt-2">
                Sign in to access the admin dashboard
            </p>
        </div>

        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}
            class="space-y-6"
        >
            {#if error}
                <div
                    class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                >
                    {error}
                </div>
            {/if}

            <div>
                <label
                    for="login"
                    class="block text-sm font-medium text-secondary mb-2"
                    >Email or Username</label
                >
                <input
                    id="login"
                    type="text"
                    bind:value={login}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter your email or username"
                    disabled={loading}
                    required
                />
            </div>

            <div>
                <label
                    for="password"
                    class="block text-sm font-medium text-secondary mb-2"
                    >Password</label
                >
                <input
                    id="password"
                    type="password"
                    bind:value={password}
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter your password"
                    disabled={loading}
                    required
                />
            </div>

            <button
                type="submit"
                class="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>

        <div class="mt-6 text-center">
            <a href="/" class="text-sm text-tertiary hover:text-accent">
                ← Back to website
            </a>
        </div>

        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <p class="text-xs text-tertiary text-center">
                Please enter your assigned admin credentials.
            </p>
        </div>
    </div>
</div>
