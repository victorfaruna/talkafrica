import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ url, depends }) => {
    const categorySlug = "african-giant";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 12;
    const offset = (page - 1) * limit;

    depends(`category:${categorySlug}`);
    depends(`posts:${categorySlug}:${page}`);

    try {
        // Get post IDs for the category
        const postIdSet = new Set<string>();

        try {
            const postIdsWithCategory = await db
                .select({ post_id: postCategoriesTable.post_id })
                .from(postCategoriesTable)
                .where(eq(postCategoriesTable.category_slug, categorySlug));

            postIdsWithCategory.forEach((p) => postIdSet.add(p.post_id));
        } catch (err) {
            console.warn("Failed to fetch from post_categories:", err);
        }

        // Fallback/Legacy check
        const legacyPosts = await db
            .select({ post_id: postTable.post_id })
            .from(postTable)
            .where(
                and(
                    eq(postTable.category, categorySlug),
                    eq(postTable.status, "published")
                )
            );
        legacyPosts.forEach((p) => postIdSet.add(p.post_id));

        const postIdsArray = Array.from(postIdSet);

        if (postIdsArray.length === 0) {
            return {
                posts: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                    totalPosts: 0,
                }
            };
        }

        // Fetch posts
        const posts = await db
            .select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: postTable.author,
                views: postTable.views,
                created_at: postTable.created_at,
                slug: postTable.slug,
                featured: postTable.featured,
            })
            .from(postTable)
            .where(
                and(
                    inArray(postTable.post_id, postIdsArray),
                    eq(postTable.status, "published"),
                    eq(postTable.deleted, false)
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(limit)
            .offset(offset);

        // Count
        const totalCount = await db
            .select({ count: postTable.id })
            .from(postTable)
            .where(
                and(
                    inArray(postTable.post_id, postIdsArray),
                    eq(postTable.status, "published"),
                    eq(postTable.deleted, false)
                )
            );

        return {
            posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount.length / limit),
                hasNextPage: page < Math.ceil(totalCount.length / limit),
                hasPrevPage: page > 1,
                totalPosts: totalCount.length,
            }
        };

    } catch (error) {
        console.error("Error loading African Giant posts:", error);
        return {
            posts: [],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
                totalPosts: 0,
            }
        };
    }
};
