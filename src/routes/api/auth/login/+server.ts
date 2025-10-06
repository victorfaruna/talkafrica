import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "../../../../lib/server/db";
import { adminTable } from "../../../../lib/server/schema";
import { and, eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return json(
                {
                    success: false,
                    message: "Username and password are required",
                },
                { status: 400 }
            );
        }

        const data = await db.query.adminTable.findFirst({
            where: and(
                eq(adminTable.username, username),
                eq(adminTable.password, password)
            ),
        });

        if (!data) {
            return json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // At this point, @supabase/ssr has set the auth cookies for us via cookies.set
        // Optionally return user info
        cookies.set("admin", data.admin_id, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return json({
            success: true,
            message: "Login successful",
            user: data,
        });
    } catch (error) {
        return json(
            {
                success: false,
                message: "Login failed",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
