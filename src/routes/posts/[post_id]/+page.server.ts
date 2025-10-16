import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq, and, ne, desc } from "drizzle-orm";
import { postTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ params }) => {
    const { post_id } = params;
    const [post] = await db
        .select()
        .from(postTable)
        .where(eq(postTable.post_id, post_id));

    if (!post || post.status !== "published") {
        return {
            status: 404,
            error: new Error("Post not found"),
        } as any;
    }

    // Fetch related posts (same category, excluding current post)
    let relatedPosts = [];
    if (post.category) {
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
                    eq(postTable.category, post.category),
                    ne(postTable.post_id, post_id),
                    eq(postTable.status, "published")
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(3);
    }

    // If no related posts in same category, get latest posts
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
                    eq(postTable.status, "published")
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(3);
    }

    return { post, relatedPosts };
};
