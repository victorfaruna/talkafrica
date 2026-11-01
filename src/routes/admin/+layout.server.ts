import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
    const data = locals.session;

    const isAuthenticated = !!data; // data is now unique item or null
    const isLoginPage = url.pathname === "/admin/login";

    if (!isAuthenticated && !isLoginPage) {
        throw redirect(302, "/admin/login");
    }

    if (isAuthenticated && isLoginPage) {
        throw redirect(302, "/admin");
    }

    const role = data?.role === "super_admin" ? "super_admin" : "admin";
    const restrictedPaths = [
        "/admin/movies",
        "/admin/impact",
        "/admin/employee-of-the-month",
        "/admin/leaderboard",
        "/admin/categories",
        "/admin/debug",
    ];
    const restrictedTabs = ["users", "settings", "newsletter"];
    if (
        isAuthenticated &&
        role !== "super_admin" &&
        (restrictedPaths.some((path) => url.pathname.startsWith(path)) ||
            restrictedTabs.includes(url.searchParams.get("tab") || ""))
    ) {
        throw redirect(303, "/admin?access=denied");
    }

    return {
        isAuthenticated,
        isLoginPage,
        admin: data
            ? {
                id: data.id,
                email: data.email,
                username: data.username,
                admin_id: data.admin_id,
                name: data.name,
                role,
            }
            : undefined,
        authError: null,
    };
};
