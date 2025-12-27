import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { and, desc, eq, inArray, like, or } from "drizzle-orm";
import { db } from "$lib/server/db";
import { postTable, postCategoriesTable } from "$lib/server/schema";

// GET - Fetch posts with optional filters
export const GET: RequestHandler = async ({ url }) => {
    try {
        const status = url.searchParams.get("status");
        const category = url.searchParams.get("category");
        const featured = url.searchParams.get("featured");
        const search = url.searchParams.get("search");
        const limitParam = url.searchParams.get("limit");
        const limit = limitParam ? parseInt(limitParam) : undefined;
        const includeDeleted = url.searchParams.get("includeDeleted") === "true";

        let query = db
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
                isTrendingNews: postTable.isTrendingNews, // Ensure this is selected
                deleted: postTable.deleted,
                views: postTable.views,
                author: postTable.author,
                created_at: postTable.created_at,
                updated_at: postTable.updated_at,
            })
            .from(postTable)
            .$dynamic(); // Enable dynamic query building

        const filters = [];

        if (!includeDeleted) {
            filters.push(eq(postTable.deleted, false));
        }

        if (status) {
            filters.push(eq(postTable.status, status));
        }

        if (featured === "true") {
            filters.push(eq(postTable.featured, true));
        }

        // Add search filter if search parameter is present
        if (search && search.trim().length > 0) {
            const searchTerm = `%${search.trim()}%`;
            filters.push(
                or(
                    like(postTable.title, searchTerm),
                    like(postTable.content, searchTerm),
                    like(postTable.excerpt, searchTerm)
                )
            );
        }

        // Join with categories table if category filter is present
        if (category) {
            query = query.innerJoin(
                postCategoriesTable,
                eq(postTable.post_id, postCategoriesTable.post_id)
            );
            filters.push(eq(postCategoriesTable.category_slug, category));
        }

        if (filters.length > 0) {
            query = query.where(and(...filters));
        }

        query = query.orderBy(desc(postTable.created_at));

        if (limit) {
            query = query.limit(limit);
        }

        const results = await query;

        // Fetch all categories for the result posts to fully populate the response
        const postIds = results.map((p) => p.post_id);
        let postCategoriesMap = new Map<string, string[]>();

        if (postIds.length > 0) {
            const allPostCategories = await db
                .select({
                    post_id: postCategoriesTable.post_id,
                    category_slug: postCategoriesTable.category_slug,
                })
                .from(postCategoriesTable)
                .where(inArray(postCategoriesTable.post_id, postIds));

            for (const pc of allPostCategories) {
                if (!postCategoriesMap.has(pc.post_id)) {
                    postCategoriesMap.set(pc.post_id, []);
                }
                postCategoriesMap.get(pc.post_id)!.push(pc.category_slug);
            }
        }

        const postsWithCategories = results.map((post) => ({
            ...post,
            categories: postCategoriesMap.get(post.post_id) || [],
        }));

        return json({
            success: true,
            posts: postsWithCategories,
            total: postsWithCategories.length,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
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
export const POST: RequestHandler = async ({ request, cookies }) => {
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
            isTrendingNews, // Extract new field
            author, // Get author from request body
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
                isTrendingNews: Boolean(isTrendingNews), // Save to DB
                author: author || "Admin", // Use provided author or default to "Admin"
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
