import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq, and, ne, desc, inArray } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";

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

    // Fetch categories for this post
    const postCategories = await db
        .select({ category_slug: postCategoriesTable.category_slug })
        .from(postCategoriesTable)
        .where(eq(postCategoriesTable.post_id, post_id));

    const categorySlugs = postCategories.map((pc) => pc.category_slug);
    // Include legacy category if exists and not already in array
    if (post.category && !categorySlugs.includes(post.category)) {
        categorySlugs.push(post.category);
    }

    // Fetch related posts (same categories, excluding current post)
    let relatedPosts = [];
    if (categorySlugs.length > 0) {
        // Get post IDs that share at least one category with this post
        const relatedPostIds = await db
            .select({ post_id: postCategoriesTable.post_id })
            .from(postCategoriesTable)
            .where(
                and(
                    inArray(postCategoriesTable.category_slug, categorySlugs),
                    ne(postCategoriesTable.post_id, post_id)
                )
            );

        const relatedPostIdSet = new Set(relatedPostIds.map((p) => p.post_id));

        // Also check legacy category field
        if (post.category) {
            const legacyRelated = await db
                .select({ post_id: postTable.post_id })
                .from(postTable)
                .where(
                    and(
                        eq(postTable.category, post.category),
                        ne(postTable.post_id, post_id),
                        eq(postTable.status, "published")
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
};
