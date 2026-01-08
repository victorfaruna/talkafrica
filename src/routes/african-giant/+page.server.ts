import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq, desc, and, or, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, adminTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ url, depends }) => {
    const categorySlug = "african-giant";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 12;
    const offset = (page - 1) * limit;

    depends(`category:${categorySlug}`);
    depends(`posts:${categorySlug}:${page}`);

    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false)
        );

        console.log('=== Fetching African Giant posts ===');

        // Try fetching posts using BOTH methods: post_categories table AND legacy category field
        // First, try the post_categories approach
        const postsFromCategories = await db
            .select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                // Dynamically fetch author from admin table, fallback to static author field
                author: sql<string>`coalesce(${adminTable.username}, ${postTable.author})`,
                views: postTable.views,
                created_at: postTable.created_at,

                featured: postTable.featured,
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .innerJoin(
                postCategoriesTable,
                eq(postTable.post_id, postCategoriesTable.post_id)
            )
            .where(
                and(
                    baseWhere,
                    eq(postCategoriesTable.category_slug, categorySlug)
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(limit)
            .offset(offset);

        console.log(`Found ${postsFromCategories.length} posts from post_categories table`);

        // Also try the legacy category field approach
        const postsFromLegacy = await db
            .select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.username}, ${postTable.author})`,
                views: postTable.views,
                created_at: postTable.created_at,

                featured: postTable.featured,
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(
                and(
                    baseWhere,
                    eq(postTable.category, categorySlug)
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(limit)
            .offset(offset);

        console.log(`Found ${postsFromLegacy.length} posts from legacy category field`);

        // Combine and deduplicate posts by post_id
        const allPostsMap = new Map();
        [...postsFromCategories, ...postsFromLegacy].forEach(post => {
            if (!allPostsMap.has(post.post_id)) {
                allPostsMap.set(post.post_id, post);
            }
        });

        const posts = Array.from(allPostsMap.values())
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit);

        console.log(`Total unique posts after deduplication: ${posts.length}`);

        if (posts.length > 0) {
            console.log('Post titles:', posts.map(p => p.title));
        } else {
            console.log('WARNING: No African Giant posts found!');
        }

        // Get total count
        const totalFromCategories = await db
            .select({ post_id: postTable.post_id })
            .from(postTable)
            .innerJoin(
                postCategoriesTable,
                eq(postTable.post_id, postCategoriesTable.post_id)
            )
            .where(
                and(
                    baseWhere,
                    eq(postCategoriesTable.category_slug, categorySlug)
                )
            );

        const totalFromLegacy = await db
            .select({ post_id: postTable.post_id })
            .from(postTable)
            .where(
                and(
                    baseWhere,
                    eq(postTable.category, categorySlug)
                )
            );

        const totalMap = new Map();
        [...totalFromCategories, ...totalFromLegacy].forEach(p => totalMap.set(p.post_id, true));
        const totalCount = totalMap.size;
        const totalPages = Math.ceil(totalCount / limit);

        console.log(`Total count: ${totalCount}, Total pages: ${totalPages}`);

        return {
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                totalPosts: totalCount,
            },
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
            },
        };
    }
};
