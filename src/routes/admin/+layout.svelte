<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let { children, data } = $props();

    async function logout() {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            goto("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
</script>

{#if data.isLoginPage}
    <!-- Render login page without authentication wrapper -->
    {@render children?.()}
{:else if data.isAuthenticated}
    <!-- Render authenticated admin pages -->
    {@render children?.()}
{:else}
    <!-- Show access denied for unauthenticated users on non-login pages -->
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="text-center">
            <h1
                class="text-2xl font-clash-grotesk font-bold text-secondary mb-4"
            >
                Access Denied
            </h1>
            <p class="text-tertiary mb-6">
                You need to be logged in to access the admin area.
            </p>
            <a
                href="/admin/login"
                class="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90"
            >
                Go to Login
            </a>
        </div>
    </div>
{/if}
