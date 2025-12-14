import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, and, ne, desc, inArray } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const { post_id } = params;
        const [post] = await db
            .select()
            .from(postTable)
            .where(
                and(eq(postTable.post_id, post_id), eq(postTable.deleted, false))
            );

        if (!post || post.status !== "published") {
            throw error(404, "Post not found");
        }

        // Fetch categories for this post
        let categorySlugs: string[] = [];
        try {
            const postCategories = await db
                .select({ category_slug: postCategoriesTable.category_slug })
                .from(postCategoriesTable)
                .where(eq(postCategoriesTable.post_id, post_id));
            
            categorySlugs = postCategories.map((pc) => pc.category_slug);
        } catch (err) {
            // If post_categories table doesn't exist or query fails, 
            // fall back to legacy category field
            console.warn("Failed to fetch post categories, falling back to legacy category field:", err);
        }
        
        // Include legacy category if exists and not already in array
        if (post.category && !categorySlugs.includes(post.category)) {
            categorySlugs.push(post.category);
        }

        // Fetch related posts (same categories, excluding current post)
        let relatedPosts = [];
        if (categorySlugs.length > 0) {
            const relatedPostIdSet = new Set<string>();
            
            // Try to get related posts from post_categories table
            try {
                const relatedPostIds = await db
                    .select({ post_id: postCategoriesTable.post_id })
                    .from(postCategoriesTable)
                    .innerJoin(
                        postTable,
                        eq(postCategoriesTable.post_id, postTable.post_id)
                    )
                    .where(
                        and(
                            inArray(postCategoriesTable.category_slug, categorySlugs),
                            ne(postCategoriesTable.post_id, post_id),
                            eq(postTable.status, "published"),
                            eq(postTable.deleted, false)
                        )
                    );
                
                relatedPostIds.forEach((p) => relatedPostIdSet.add(p.post_id));
            } catch (err) {
                // If post_categories table doesn't exist, skip this query
                console.warn("Failed to fetch related posts from post_categories, using legacy category field:", err);
            }

            // Also check legacy category field
            if (post.category) {
                const legacyRelated = await db
                    .select({ post_id: postTable.post_id })
                    .from(postTable)
                    .where(
                        and(
                            eq(postTable.category, post.category),
                            ne(postTable.post_id, post_id),
                            eq(postTable.status, "published"),
                            eq(postTable.deleted, false)
                        )
                    );
                legacyRelated.forEach((p) => relatedPostIdSet.add(p.post_id));
            }

            if (relatedPostIdSet.size > 0) {
                relatedPosts = await db
                    .select({
                        post_id: postTable.post_id,
                        title: postTable.title,
                        excerpt: postTable.excerpt,
                        image: postTable.image,
                        category: postTable.category,
                        created_at: postTable.created_at,
                    })
                    .from(postTable)
                    .where(
                        and(
                            inArray(
                                postTable.post_id,
                                Array.from(relatedPostIdSet)
                            ),
                            ne(postTable.post_id, post_id),
                            eq(postTable.status, "published"),
                            eq(postTable.deleted, false)
                        )
                    )
                    .orderBy(desc(postTable.created_at))
                    .limit(3);
            }
        }

        // If no related posts in same categories, get latest posts
        if (relatedPosts.length === 0) {
            relatedPosts = await db
                .select({
                    post_id: postTable.post_id,
                    title: postTable.title,
                    excerpt: postTable.excerpt,
                    image: postTable.image,
                    category: postTable.category,
                    created_at: postTable.created_at,
                })
                .from(postTable)
                .where(
                    and(
                        ne(postTable.post_id, post_id),
                        eq(postTable.status, "published"),
                        eq(postTable.deleted, false)
                    )
                )
                .orderBy(desc(postTable.created_at))
                .limit(3);
        }

        return {
            post: {
                ...post,
                categories: categorySlugs,
            },
            relatedPosts,
        };
    } catch (err) {
        console.error("Error loading post:", err);
        
        // If it's already a SvelteKit error, re-throw it
        if (err && typeof err === "object" && "status" in err) {
            throw err;
        }
        
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        
        // If it's a database connection error, provide a helpful message
        if (errorMessage.includes("DATABASE_URL") || errorMessage.includes("connection") || errorMessage.includes("ECONNREFUSED")) {
            throw error(500, "Database connection failed. Please check your DATABASE_URL environment variable.");
        }
        
        throw error(500, `Failed to load post: ${errorMessage}`);
    }
};
