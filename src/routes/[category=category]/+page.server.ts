import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, desc, and, or, inArray, exists, sql, count } from "drizzle-orm";
import { postTable, postCategoriesTable } from "$lib/server/schema";
import { categoryExists, getCategoryDisplayName, getSubcategories } from "$lib/categories";
import { cachedPublicData } from "$lib/server/public-data-cache";
import { pageNumber } from "$lib/server/pagination";

const cardFields = {
    post_id: postTable.post_id,
    title: postTable.title,
    excerpt: postTable.excerpt,
    image: postTable.image,
    category: postTable.category,
    author: postTable.author,
    views: postTable.views,
    created_at: postTable.created_at,
    featured: postTable.featured,
};

// Match both category systems inside SQL; never download every matching ID.
const categoryFilter = (slugs: string[]) => and(
    eq(postTable.status, "published"),
    eq(postTable.deleted, false),
    or(
        inArray(postTable.category, slugs),
        exists(
            db.select({ one: sql`1` }).from(postCategoriesTable)
                .where(and(
                    eq(postCategoriesTable.post_id, postTable.post_id),
                    inArray(postCategoriesTable.category_slug, slugs),
                )),
        ),
    ),
);

const loadContent: PageServerLoad = async ({ params, url }) => {
    const categoryParam = params.category?.toLowerCase();
    const reserved = ["terms", "privacy", "contact", "about", "movies", "videos", "donate"];
    if (categoryParam && reserved.includes(categoryParam)) throw redirect(301, `/${categoryParam}`);
    if (!categoryParam || !categoryExists(categoryParam)) error(404, "Category not found");

    const page = pageNumber(url);
    const limit = 12;

    const children = getSubcategories(categoryParam);
    const matchingPosts = categoryFilter([categoryParam, ...children.map((child) => child.slug)]);

    try {
        // Main content, counts and child sections are independent: one wave.
        const [posts, totals, featuredPosts, trendingPosts, subcategoryGroups] = await Promise.all([
            db.select(cardFields).from(postTable).where(matchingPosts)
                .orderBy(desc(postTable.featured), desc(postTable.created_at))
                .limit(limit).offset((page - 1) * limit),
            db.select({ count: count() }).from(postTable).where(matchingPosts),
            db.select(cardFields).from(postTable)
                .where(and(matchingPosts, eq(postTable.featured, true)))
                .orderBy(desc(postTable.created_at)).limit(3),
            db.select(cardFields).from(postTable).where(matchingPosts)
                .orderBy(desc(postTable.views)).limit(5),
            Promise.all(children.map(async (subcategory) => ({
                ...subcategory,
                posts: await db.select(cardFields).from(postTable)
                    .where(categoryFilter([subcategory.slug]))
                    .orderBy(desc(postTable.created_at)).limit(4).catch(() => []),
            }))),
        ]);

        const totalPosts = totals[0]?.count ?? 0;
        const totalPages = Math.max(1, Math.ceil(totalPosts / limit));
        return {
            category: categoryParam,
            categoryName: getCategoryDisplayName(categoryParam),
            posts,
            featuredPosts,
            trendingPosts,
            subcategoryGroups,
            pagination: {
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                totalPosts,
            },
            notFound: false,
        };
    } catch (cause) {
        console.error("Error loading category page:", cause);
        return {
            category: categoryParam,
            categoryName: getCategoryDisplayName(categoryParam),
            posts: [],
            featuredPosts: [],
            trendingPosts: [],
            subcategoryGroups: children.map((subcategory) => ({ ...subcategory, posts: [] })),
            pagination: { currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false, totalPosts: 0 },
            notFound: false,
        };
    }
};

export const load: PageServerLoad = (event) => {
    event.depends(`category:${event.params.category?.toLowerCase()}`);
    event.depends(`posts:${event.params.category?.toLowerCase()}:${pageNumber(event.url)}`);
    return cachedPublicData(
        `category:${event.params.category}:${pageNumber(event.url)}`, () => loadContent(event), event.request,
    );
};
