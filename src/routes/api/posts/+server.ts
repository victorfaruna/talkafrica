import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { and, desc, eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import { postTable } from "$lib/server/schema";

// GET - Fetch posts with optional filters
export const GET: RequestHandler = async ({ url }) => {
    try {
        const status = url.searchParams.get("status");
        const category = url.searchParams.get("category");
        const featured = url.searchParams.get("featured");

        const results = await db
            .select()
            .from(postTable)
            .orderBy(desc(postTable.created_at));

        const filtered = results.filter((p) => {
            if (status && p.status !== status) return false;
            if (category && p.category !== category) return false;
            if (featured === "true" && !p.featured) return false;
            return true;
        });

        return json({ success: true, posts: filtered, total: filtered.length });
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
        const { title, content, excerpt, category, image, status, featured } =
            body;

        if (!title || !content) {
            return json(
                { success: false, message: "Title and content are required" },
                { status: 400 }
            );
        }

        const [created] = await db
            .insert(postTable)
            .values({
                title,
                content,
                excerpt,
                category,
                image,
                status: status ?? "draft",
                featured: Boolean(featured),
            })
            .returning();

        return json({
            success: true,
            message: "Post created successfully",
            post: created,
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
        const { post_id, ...update } = body;

        if (!post_id) {
            return json(
                { success: false, message: "post_id is required" },
                { status: 400 }
            );
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

        return json({
            success: true,
            message: "Post updated successfully",
            post: updated,
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

// DELETE - Delete post by post_id
export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { post_id } = await request.json();
        if (!post_id) {
            return json(
                { success: false, message: "post_id is required" },
                { status: 400 }
            );
        }

        const [deleted] = await db
            .delete(postTable)
            .where(eq(postTable.post_id, post_id))
            .returning({ post_id: postTable.post_id });

        if (!deleted) {
            return json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

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
