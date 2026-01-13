import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db"; // Path changed to alias
import { adminTable } from "$lib/server/schema"; // Path changed to alias
import { and, eq, or } from "drizzle-orm";

import { supabase } from "$lib/server/supabase"; // Import shared instance
import bcrypt from "bcryptjs"; // Static import for bcryptjs

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { login, password, username } = await request.json(); // Support both new 'login' and old 'username' keys
        const credential = login || username;

        console.log(`[Login] Attempting login for: ${credential}`);

        if (!credential || !password) {
            return json(
                {
                    success: false,
                    message: "Email/Username and password are required",
                },
                { status: 400 }
            );
        }

        // 1. Local Database Auth (Primary)
        // Find admin by username OR email
        const adminData = await db.query.adminTable.findFirst({
            where: or(
                eq(adminTable.username, credential),
                eq(adminTable.email, credential)
            ),
        });

        if (!adminData || !adminData.password) {
            console.log("[Login] User not found or no password.");
            return json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Check if password is hashed (starts with $2)
        // If hashed, use bcrypt. If not, use plaintext comparison (legacy/migration)
        let passwordMatch = false;

        if (adminData.password.startsWith("$2")) {
            // Dynamic import removed, using static import
            passwordMatch = await bcrypt.compare(password, adminData.password);
        } else {
            // Fallback for existing plaintext passwords
            passwordMatch = (adminData.password === password);
        }

        if (!passwordMatch) {
            console.log("[Login] Password mismatch.");
            return json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // 2. Set Session Cookie using admin_id
        cookies.set("admin", adminData.admin_id, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        console.log("[Login] Success!");

        return json({
            success: true,
            message: "Login successful",
            user: {
                username: adminData.username,
                email: adminData.email,
            },
        });
    } catch (error) {
        console.error("[Login] Error:", error); // Detailed logging
        return json(
            {
                success: false,
                message: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`, // More specific error message
            },
            { status: 500 }
        );
    }
};
