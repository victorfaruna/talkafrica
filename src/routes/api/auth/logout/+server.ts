import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies }) => {
    try {
        // Clear admin auth cookie set during login
        cookies.set("admin", "", {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
        });

        return json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        return json(
            {
                success: false,
                message: "Logout failed",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
