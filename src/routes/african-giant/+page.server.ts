import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq, desc, and, inArray, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, adminTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ url, depends }) => {
    const categorySlug = "african-giant";
    const requestedPage = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = 12;

    depends(`category:${categorySlug}`);
    depends(`posts:${categorySlug}:${page}`);

    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false),
        );

        // Resolve every unique African Giant post before applying pagination.
        // This prevents duplicates from the modern and legacy category systems
        // from creating sparse or apparently empty final pages.
        const [mappedPosts, legacyPosts] = await Promise.all([
            db.select({ post_id: postTable.post_id })
                .from(postTable)
                .innerJoin(
                    postCategoriesTable,
                    eq(postTable.post_id, postCategoriesTable.post_id),
                )
                .where(and(
                    baseWhere,
                    eq(postCategoriesTable.category_slug, categorySlug),
                ))
                .catch(() => []),
            db.select({ post_id: postTable.post_id })
                .from(postTable)
                .where(and(baseWhere, eq(postTable.category, categorySlug)))
                .catch(() => []),
        ]);

        const uniquePostIds = Array.from(new Set([
            ...mappedPosts.map((post) => post.post_id),
            ...legacyPosts.map((post) => post.post_id),
        ]));

        const totalPosts = uniquePostIds.length;
        const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
        const currentPage = Math.min(page, totalPages);
        const offset = (currentPage - 1) * limit;

        if (totalPosts === 0) {
            return {
                posts: [],
                categoryName: "African Giant of the Week",
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                    totalPosts: 0,
                },
            };
        }

        const posts = await db.select({
            post_id: postTable.post_id,
            title: postTable.title,
            excerpt: postTable.excerpt,
            image: postTable.image,
            category: postTable.category,
            author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
            views: postTable.views,
            created_at: postTable.created_at,
            featured: postTable.featured,
        })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(and(baseWhere, inArray(postTable.post_id, uniquePostIds)))
            .orderBy(desc(postTable.created_at))
            .limit(limit)
            .offset(offset);

        return {
            posts,
            categoryName: "African Giant of the Week",
            pagination: {
                currentPage,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1,
                totalPosts,
            },
        };
    } catch (error) {
        console.error("Error loading African Giant posts:", error);
        return {
            posts: [],
            categoryName: "African Giant of the Week",
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
