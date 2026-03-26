import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, and, ne, desc, inArray, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, dailyStatsTable, adminTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ params, cookies }) => {
    try {
        const { post_id } = params;
        
        // 1. Fetch main post and categories in parallel
        const [postResults, categoryResults] = await Promise.all([
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                content: postTable.content,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.username}, ${postTable.author})`,
                status: postTable.status,
                featured: postTable.featured,
                isTrendingNews: postTable.isTrendingNews,
                deleted: postTable.deleted,
                views: postTable.views,
                author_id: postTable.author_id,
                editor: postTable.editor,
                created_at: postTable.created_at,
                updated_at: postTable.updated_at,
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(and(eq(postTable.post_id, post_id), eq(postTable.deleted, false))),

            db.select({ category_slug: postCategoriesTable.category_slug })
            .from(postCategoriesTable)
            .where(eq(postCategoriesTable.post_id, post_id))
            .catch(() => []) // Fallback for missing table/error
        ]);

        const post = postResults[0];
        let categorySlugs = categoryResults.map(c => c.category_slug);


        if (!post || post.status !== "published") {
            throw error(404, "Post not found");
        }

        // Increment views (Unique per user/post/day check) - Non-blocking
        const viewedCookie = cookies.get('viewed_posts') || '';
        const viewedPostIds = viewedCookie.split(',');

        if (!viewedPostIds.includes(post_id)) {
            // Fire and forget view incrementing
            (async () => {
                try {
                    await Promise.all([
                        db.update(postTable)
                            .set({ views: sql`${postTable.views} + 1` })
                            .where(eq(postTable.post_id, post_id)),
                        db.insert(dailyStatsTable)
                            .values({ date: sql`CURRENT_DATE`, views: 1 })
                            .onConflictDoUpdate({
                                target: dailyStatsTable.date,
                                set: { views: sql`${dailyStatsTable.views} + 1` },
                            })
                    ]);
                } catch (e) {
                    console.error("Delayed view increment failed:", e);
                }
            })();

            // Update cookie list
            viewedPostIds.push(post_id);
            if (viewedPostIds.length > 50) viewedPostIds.shift();
            cookies.set('viewed_posts', viewedPostIds.join(','), {
                path: '/',
                httpOnly: true,
                maxAge: 60 * 60 * 24, // 1 day
                sameSite: 'lax'
            });
        }

        // Include legacy category if exists and not already in array
        if (post.category && !categorySlugs.includes(post.category)) {
            categorySlugs.push(post.category);
        }

        // 2. Fetch related and latest posts in parallel
        const [relatedByCategories, legacyRelated, fallbackLatest] = await Promise.all([
            // Category-based related
            categorySlugs.length > 0 ? db.select({ post_id: postCategoriesTable.post_id })
                .from(postCategoriesTable)
                .innerJoin(postTable, eq(postCategoriesTable.post_id, postTable.post_id))
                .where(and(
                    inArray(postCategoriesTable.category_slug, categorySlugs),
                    ne(postCategoriesTable.post_id, post_id),
                    eq(postTable.status, "published"),
                    eq(postTable.deleted, false)
                )).catch(() => []) : Promise.resolve([]),
            
            // Legacy related
            post.category ? db.select({ post_id: postTable.post_id })
                .from(postTable)
                .where(and(
                    eq(postTable.category, post.category),
                    ne(postTable.post_id, post_id),
                    eq(postTable.status, "published"),
                    eq(postTable.deleted, false)
                )).catch(() => []) : Promise.resolve([]),

            // Fallback latest
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .where(and(
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(3)
        ]);

        const relatedIdSet = new Set<string>();
        relatedByCategories.forEach(p => relatedIdSet.add(p.post_id));
        legacyRelated.forEach(p => relatedIdSet.add(p.post_id));

        let relatedPosts = [];
        if (relatedIdSet.size > 0) {
            relatedPosts = await db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .where(and(
                inArray(postTable.post_id, Array.from(relatedIdSet)),
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(3);
        }

        if (relatedPosts.length === 0) {
            relatedPosts = fallbackLatest;
        }

        return {
            post: { ...post, categories: categorySlugs },
            relatedPosts,
        };
    } catch (err) {
        console.error("Error loading post:", err);

        // If it's already a SvelteKit error, re-throw it
        if (err && typeof err === "object" && "status" in err) {
            throw err;
        }

        const errorMessage = err instanceof Error ? err.message : "Unknown error";

        // If it's a database connection error, provide a helpful message
        if (errorMessage.includes("DATABASE_URL") || errorMessage.includes("connection") || errorMessage.includes("ECONNREFUSED")) {
            throw error(500, "Database connection failed. Please check your DATABASE_URL environment variable.");
        }

        throw error(500, `Failed to load post: ${errorMessage}`);
    }
};
