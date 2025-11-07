import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "$lib/server/db";
import { postTable, postCategoriesTable } from "$lib/server/schema";

// GET - Fetch posts with optional filters
export const GET: RequestHandler = async ({ url }) => {
    try {
        const status = url.searchParams.get("status");
        const category = url.searchParams.get("category");
        const featured = url.searchParams.get("featured");
        const includeDeleted =
            url.searchParams.get("includeDeleted") === "true";

        let results = await db
            .select()
            .from(postTable)
            .where(includeDeleted ? undefined : eq(postTable.deleted, false))
            .orderBy(desc(postTable.created_at));

        // Filter by status and featured
        const filtered = results.filter((p) => {
            if (status && p.status !== status) return false;
            if (featured === "true" && !p.featured) return false;
            return true;
        });

        // If category filter is provided, filter by junction table
        let finalPosts = filtered;
        if (category) {
            const postIdsWithCategory = await db
                .select({ post_id: postCategoriesTable.post_id })
                .from(postCategoriesTable)
                .where(eq(postCategoriesTable.category_slug, category));

            const postIdSet = new Set(
                postIdsWithCategory.map((p) => p.post_id)
            );
            finalPosts = filtered.filter((p) => postIdSet.has(p.post_id));
        }

        // Fetch all categories for all posts in one query (optimized)
        const postIds = finalPosts.map((p) => p.post_id);
        let postCategoriesMap = new Map<string, string[]>();

        if (postIds.length > 0) {
            const allPostCategories = await db
                .select({
                    post_id: postCategoriesTable.post_id,
                    category_slug: postCategoriesTable.category_slug,
                })
                .from(postCategoriesTable)
                .where(inArray(postCategoriesTable.post_id, postIds));

            // Group categories by post_id
            for (const pc of allPostCategories) {
                if (!postCategoriesMap.has(pc.post_id)) {
                    postCategoriesMap.set(pc.post_id, []);
                }
                postCategoriesMap.get(pc.post_id)!.push(pc.category_slug);
            }
        }

        // Add categories to each post
        const postsWithCategories = finalPosts.map((post) => ({
            ...post,
            categories: postCategoriesMap.get(post.post_id) || [],
        }));

        return json({
            success: true,
            posts: postsWithCategories,
            total: postsWithCategories.length,
        });
    } catch (error) {
        return json(
            {
                success: false,
                message: "Failed to fetch posts",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};

// POST - Create new post
export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const {
            title,
            content,
            excerpt,
            category,
            categories,
            image,
            status,
            featured,
        } = body;

        if (!title || !content) {
            return json(
                { success: false, message: "Title and content are required" },
                { status: 400 }
            );
        }

        // Support both old single category and new categories array
        const categoryArray = categories || (category ? [category] : []);

        const [created] = await db
            .insert(postTable)
            .values({
                title,
                content,
                excerpt,
                category: categoryArray[0] || null, // Keep for backward compatibility
                image,
                status: status ?? "draft",
                featured: Boolean(featured),
            })
            .returning();

        // Insert categories into junction table
        if (categoryArray.length > 0) {
            await db.insert(postCategoriesTable).values(
                categoryArray.map((catSlug: string) => ({
                    post_id: created.post_id,
                    category_slug: catSlug,
                }))
            );
        }

        // Fetch categories for response
        const postCategories = await db
            .select({ category_slug: postCategoriesTable.category_slug })
            .from(postCategoriesTable)
            .where(eq(postCategoriesTable.post_id, created.post_id));

        return json({
            success: true,
            message: "Post created successfully",
            post: {
                ...created,
                categories: postCategories.map((pc) => pc.category_slug),
            },
        });
    } catch (error) {
        return json(
            {
                success: false,
                message: "Failed to create post",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};

// PUT - Update existing post by post_id
export const PUT: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { post_id, categories, category, ...update } = body;

        if (!post_id) {
            return json(
                { success: false, message: "post_id is required" },
                { status: 400 }
            );
        }

        // Handle categories update if provided
        if (categories !== undefined || category !== undefined) {
            // Delete existing category associations
            await db
                .delete(postCategoriesTable)
                .where(eq(postCategoriesTable.post_id, post_id));

            // Insert new categories
            const categoryArray = categories || (category ? [category] : []);
            if (categoryArray.length > 0) {
                await db.insert(postCategoriesTable).values(
                    categoryArray.map((catSlug: string) => ({
                        post_id,
                        category_slug: catSlug,
                    }))
                );
            }

            // Update the legacy category field for backward compatibility
            update.category = categoryArray[0] || null;
        }

        const [updated] = await db
            .update(postTable)
            .set({ ...update, updated_at: new Date() })
            .where(eq(postTable.post_id, post_id))
            .returning();

        if (!updated) {
            return json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        // Fetch categories for response
        const postCategories = await db
            .select({ category_slug: postCategoriesTable.category_slug })
            .from(postCategoriesTable)
            .where(eq(postCategoriesTable.post_id, post_id));

        return json({
            success: true,
            message: "Post updated successfully",
            post: {
                ...updated,
                categories: postCategories.map((pc) => pc.category_slug),
            },
        });
    } catch (error) {
        return json(
            {
                success: false,
                message: "Failed to update post",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};

// DELETE - Soft delete post by post_id (set deleted=true)
export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { post_id } = await request.json();
        if (!post_id) {
            return json(
                { success: false, message: "post_id is required" },
                { status: 400 }
            );
        }

        const [updated] = await db
            .update(postTable)
            .set({ deleted: true, updated_at: new Date() })
            .where(eq(postTable.post_id, post_id))
            .returning({ post_id: postTable.post_id });

        if (!updated) {
            return json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        // Optionally delete category associations (or keep them for history)
        // Uncomment if you want to delete associations on soft delete:
        // await db.delete(postCategoriesTable).where(eq(postCategoriesTable.post_id, post_id));

        return json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        return json(
            {
                success: false,
                message: "Failed to delete post",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
