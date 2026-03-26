// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";
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
        error(404, "Category not found");
    }

    try {
        // 1. Fetch post IDs from both current and legacy systems in parallel
        const [categoryResults, legacyResults] = await Promise.all([
            db.select({ post_id: postCategoriesTable.post_id })
                .from(postCategoriesTable)
                .where(eq(postCategoriesTable.category_slug, categoryParam))
                .catch(() => []), 
            db.select({ post_id: postTable.post_id })
                .from(postTable)
                .where(and(eq(postTable.category, categoryParam), eq(postTable.status, "published")))
                .catch(() => [])
        ]);

        const postIdSet = new Set<string>();
        categoryResults.forEach((p) => postIdSet.add(p.post_id));
        legacyResults.forEach((p) => postIdSet.add(p.post_id));
        const postIdsArray = Array.from(postIdSet);

        if (postIdsArray.length === 0) {
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

        // 2. Fetch all category content in parallel
        const [posts, totalCount, featuredPosts, trendingPosts] = await Promise.all([
            // Main posts list
            db.select({
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
            .where(and(
                inArray(postTable.post_id, postIdsArray),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.featured), desc(postTable.created_at))
            .limit(limit)
            .offset(offset),

            // Pagination count
            db.select({ count: postTable.id })
            .from(postTable)
            .where(and(
                inArray(postTable.post_id, postIdsArray),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            )),

            // Hero featured posts
            db.select({
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
            .where(and(
                inArray(postTable.post_id, postIdsArray),
                eq(postTable.status, "published"),
                eq(postTable.featured, true),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(3),

            // Trending sidebar
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                image: postTable.image,
                views: postTable.views,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .where(and(
                inArray(postTable.post_id, postIdsArray),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.views))
            .limit(5)
        ]);

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
