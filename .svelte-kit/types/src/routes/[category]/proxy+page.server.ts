// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq, desc, and } from "drizzle-orm";
import { postTable } from "$lib/server/schema";
import { categoryExists, getCategoryDisplayName } from "$lib/categories";

export const load = async ({ params, url, depends }: Parameters<PageServerLoad>[0]) => {
    const categoryParam = params.category?.toLowerCase();
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 12;
    const offset = (page - 1) * limit;

    // Invalidate cache when category changes
    depends(`category:${categoryParam}`);
    depends(`posts:${categoryParam}:${page}`);

    // Validate category using the centralized category system
    if (!categoryParam || !categoryExists(categoryParam)) {
        return {
            status: 404,
            error: new Error("Category not found"),
        } as any;
    }

    try {
        // Fetch posts for this category
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
                featured: postTable.featured,
            })
            .from(postTable)
            .where(
                and(
                    eq(postTable.category, categoryParam),
                    eq(postTable.status, "published")
                )
            )
            .orderBy(desc(postTable.featured), desc(postTable.created_at))
            .limit(limit)
            .offset(offset);

        // Get total count for pagination
        const totalCount = await db
            .select({ count: postTable.id })
            .from(postTable)
            .where(
                and(
                    eq(postTable.category, categoryParam),
                    eq(postTable.status, "published")
                )
            );

        // Get featured posts for hero section
        const featuredPosts = await db
            .select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: postTable.author,
                views: postTable.views,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .where(
                and(
                    eq(postTable.category, categoryParam),
                    eq(postTable.status, "published"),
                    eq(postTable.featured, true)
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(3);

        // Get trending posts (most viewed in this category)
        const trendingPosts = await db
            .select({
                post_id: postTable.post_id,
                title: postTable.title,
                image: postTable.image,
                views: postTable.views,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .where(
                and(
                    eq(postTable.category, categoryParam),
                    eq(postTable.status, "published")
                )
            )
            .orderBy(desc(postTable.views))
            .limit(5);

        return {
            category: categoryParam,
            categoryName: getCategoryDisplayName(categoryParam),
            posts,
            featuredPosts,
            trendingPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount.length / limit),
                hasNextPage: page < Math.ceil(totalCount.length / limit),
                hasPrevPage: page > 1,
                totalPosts: totalCount.length,
            },
            notFound: false,
        };
    } catch (error) {
        console.error("Error loading category page:", error);
        return {
            category: categoryParam,
            categoryName: getCategoryDisplayName(categoryParam),
            posts: [],
            featuredPosts: [],
            trendingPosts: [],
            pagination: {
                currentPage: 1,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false,
                totalPosts: 0,
            },
            notFound: false,
        };
    }
};
