import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { desc, eq, and } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";

export const load: PageServerLoad = async () => {
    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false)
        );

        // Execute queries sequentially to avoid connection pool exhaustion

        // Featured posts
        const featured = await db
            .select()
            .from(postTable)
            .where(and(baseWhere, eq(postTable.featured, true)))
            .orderBy(desc(postTable.created_at))
            .limit(4);

        // Latest posts
        const latest = await db
            .select()
            .from(postTable)
            .where(baseWhere)
            .orderBy(desc(postTable.created_at))
            .limit(6);

        // Popular posts (sorted by views)
        const popular = await db
            .select()
            .from(postTable)
            .where(baseWhere)
            .orderBy(desc(postTable.views))
            .limit(8);

        // Trending posts
        const trending = await db
            .select()
            .from(postTable)
            .where(and(
                eq(postTable.status, "published"),
                eq(postTable.deleted, false),
                eq(postTable.isTrendingNews, true)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(5);

        // African Giant of the Week
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
                    baseWhere,
                    eq(postCategoriesTable.category_slug, "african-giant")
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(1);

        // Calculate Stats


        const africanGiant = africanGiantPosts[0] || null;

        return {
            posts: popular, // Pass popular posts to the 'posts' prop used by PopularBlogs
            featuredPosts: featured,
            latestPosts: latest,
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
