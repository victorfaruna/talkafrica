import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "../../../lib/server/db";
import { commentsTable } from "../../../lib/server/schema";
import { count } from "drizzle-orm";

export const GET: RequestHandler = async () => {
    try {
        // Get total comment count
        const commentCountResult = await db
            .select({ count: count() })
            .from(commentsTable);
        const totalComments = commentCountResult[0]?.count || 0;

        // Get all comments for detailed view
        const comments = await db.query.commentsTable.findMany({
            orderBy: (commentsTable, { desc }) => [
                desc(commentsTable.created_at),
            ],
        });

        return json({
            success: true,
            totalComments,
            comments,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return json(
            {
                success: false,
                message: "Failed to fetch comments",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
