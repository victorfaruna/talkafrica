import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { desc, eq, and } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";

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
                    eq(postTable.deleted, false),
                    eq(postTable.isTrendingNews, true) // Filter by manual selection
                )
            )
            .orderBy(desc(postTable.views), desc(postTable.created_at))
            .limit(5);

        // Get African Giant of the Week
        const africanGiantPosts = await db
            .select({
                id: postTable.id,
                post_id: postTable.post_id,
                title: postTable.title,
                content: postTable.content,
                excerpt: postTable.excerpt,
                category: postTable.category,
                image: postTable.image,
                status: postTable.status,
                featured: postTable.featured,
                isTrendingNews: postTable.isTrendingNews,
                deleted: postTable.deleted,
                views: postTable.views,
                author: postTable.author,
                created_at: postTable.created_at,
                updated_at: postTable.updated_at,
            })
            .from(postTable)
            .innerJoin(
                postCategoriesTable,
                eq(postTable.post_id, postCategoriesTable.post_id)
            )
            .where(
                and(
                    eq(postTable.status, "published"),
                    eq(postTable.deleted, false),
                    eq(postCategoriesTable.category_slug, "african-giant")
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(1);

        const africanGiant = africanGiantPosts[0] || null;

        return {
            posts: published,
            featuredPosts: featured,
            latestPosts: published.slice(0, 6),
            trendingPosts: trending,
            africanGiant,
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
