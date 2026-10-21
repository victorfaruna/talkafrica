import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";
import {
    categoryExists,
    getCategoryDisplayName,
    getSubcategories,
} from "$lib/categories";

export const load: PageServerLoad = async ({ params, url, depends }) => {
    const categoryParam = params.category?.toLowerCase();
    
    // Safety check: if this route somehow matched a static page, redirect to it
    const reserved = ['terms', 'privacy', 'contact', 'about', 'movies', 'videos', 'donate'];
    if (categoryParam && reserved.includes(categoryParam)) {
        throw redirect(301, `/${categoryParam}`);
    }

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

    const childCategories = getSubcategories(categoryParam);
    const includedCategorySlugs = [
        categoryParam,
        ...childCategories.map((category) => category.slug),
    ];

    try {
        // 1. Fetch post IDs from both current and legacy systems in parallel
        const [categoryResults, legacyResults] = await Promise.all([
            db.select({ post_id: postCategoriesTable.post_id })
                .from(postCategoriesTable)
                .where(inArray(postCategoriesTable.category_slug, includedCategorySlugs))
                .catch(() => []), 
            db.select({ post_id: postTable.post_id })
                .from(postTable)
                .where(and(inArray(postTable.category, includedCategorySlugs), eq(postTable.status, "published")))
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
                subcategoryGroups: childCategories.map((category) => ({
                    ...category,
                    posts: [],
                })),
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
                excerpt: postTable.excerpt,
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

        const subcategoryGroups = await Promise.all(
            childCategories.map(async (subcategory) => {
                const [mappedIds, legacyIds] = await Promise.all([
                    db.select({ post_id: postCategoriesTable.post_id })
                        .from(postCategoriesTable)
                        .where(eq(postCategoriesTable.category_slug, subcategory.slug))
                        .catch(() => []),
                    db.select({ post_id: postTable.post_id })
                        .from(postTable)
                        .where(and(
                            eq(postTable.category, subcategory.slug),
                            eq(postTable.status, "published"),
                            eq(postTable.deleted, false),
                        ))
                        .catch(() => []),
                ]);

                const ids = Array.from(new Set([
                    ...mappedIds.map((post) => post.post_id),
                    ...legacyIds.map((post) => post.post_id),
                ]));

                if (ids.length === 0) {
                    return { ...subcategory, posts: [] };
                }

                const categoryPosts = await db.select({
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
                        inArray(postTable.post_id, ids),
                        eq(postTable.status, "published"),
                        eq(postTable.deleted, false),
                    ))
                    .orderBy(desc(postTable.created_at))
                    .limit(4)
                    .catch(() => []);

                return { ...subcategory, posts: categoryPosts };
            }),
        );

        return {
            category: categoryParam,
            categoryName: getCategoryDisplayName(categoryParam),
            posts,
            featuredPosts,
            trendingPosts,
            subcategoryGroups,
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
            subcategoryGroups: childCategories.map((category) => ({
                ...category,
                posts: [],
            })),
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
