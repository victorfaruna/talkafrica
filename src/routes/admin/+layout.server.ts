import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from "../../lib/server/db";
import { adminTable } from "../../lib/server/schema";
import { eq } from "drizzle-orm";

const getAdmin = async (adminId: string) => {
    try {
        const data = await db
            .select()
            .from(adminTable)
            .where(eq(adminTable.admin_id, adminId as string))
            .limit(1);

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error("Error loading admin:", error);
        return null;
    }
};

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const adminId = cookies.get("admin");
    const data = await getAdmin(adminId as string);

    const isAuthenticated = !!data; // data is now unique item or null
    const isLoginPage = url.pathname === "/admin/login";

    if (!isAuthenticated && !isLoginPage) {
        throw redirect(302, "/admin/login");
    }

    if (isAuthenticated && isLoginPage) {
        throw redirect(302, "/admin");
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
            }
            : undefined,
        authError: null,
    };
};
