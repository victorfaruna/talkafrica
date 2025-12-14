import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { desc, eq, and } from "drizzle-orm";
import { postTable } from "$lib/server/schema";

export const load: PageServerLoad = async () => {
    try {
        const published = await db
            .select()
            .from(postTable)
            .where(
                and(eq(postTable.status, "published"), eq(postTable.deleted, false))
            )
            .orderBy(desc(postTable.created_at));

        const featured = published.filter((p) => p.featured);

        // Get trending posts (most viewed, excluding featured posts)
        const trending = await db
            .select()
            .from(postTable)
            .where(
                and(
                    eq(postTable.status, "published"),
                    eq(postTable.deleted, false)
                )
            )
            .orderBy(desc(postTable.views), desc(postTable.created_at))
            .limit(5);

        return {
            posts: published,
            featuredPosts: featured,
            latestPosts: published.slice(0, 6),
            trendingPosts: trending,
        };
    } catch (err) {
        console.error("Error loading posts:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        
        // Provide a helpful error message
        if (errorMessage.includes("DATABASE_URL") || errorMessage.includes("connection") || errorMessage.includes("ECONNREFUSED")) {
            throw error(500, "Database connection failed. Please check your DATABASE_URL environment variable.");
        }
        
        throw error(500, `Failed to load posts: ${errorMessage}`);
    }
};
