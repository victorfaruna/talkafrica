import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "../../../lib/server/db";
import { usersTable } from "../../../lib/server/schema";
import { count } from "drizzle-orm";

export const GET: RequestHandler = async () => {
    try {
        // Get total user count
        const userCountResult = await db
            .select({ count: count() })
            .from(usersTable);
        const totalUsers = userCountResult[0]?.count || 0;

        // Get all users for detailed view
        const users = await db.query.usersTable.findMany({
            orderBy: (usersTable, { desc }) => [desc(usersTable.created_at)],
        });

        return json({
            success: true,
            totalUsers,
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return json(
            {
                success: false,
                message: "Failed to fetch users",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
