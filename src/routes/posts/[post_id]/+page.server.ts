import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, and, ne, desc, inArray, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, dailyStatsTable, adminTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ params, cookies }) => {
    try {
        const { post_id } = params;
        const [post] = await db
            .select({
                post_id: postTable.post_id,
                title: postTable.title,
                content: postTable.content,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                // Dynamic author fetch
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
            .where(
                and(eq(postTable.post_id, post_id), eq(postTable.deleted, false))
            );


        if (!post || post.status !== "published") {
            throw error(404, "Post not found");
        }

        // Increment views (Unique per user/post/day check)
        const viewedCookie = cookies.get('viewed_posts') || '';
        const viewedPostIds = viewedCookie.split(',');

        // If this specific post hasn't been viewed by this user yet
        if (!viewedPostIds.includes(post_id)) {
            try {
                console.log(`Debug: Incrementing unique views for post ${post_id}`);

                // 1. Increment total post views
                await db
                    .update(postTable)
                    .set({ views: sql`${postTable.views} + 1` })
                    .where(eq(postTable.post_id, post_id));

                // 2. Increment daily stats
                await db
                    .insert(dailyStatsTable)
                    .values({
                        date: sql`CURRENT_DATE`,
                        views: 1,
                    })
                    .onConflictDoUpdate({
                        target: dailyStatsTable.date,
                        set: { views: sql`${dailyStatsTable.views} + 1` },
                    });

                // Update cookie list
                viewedPostIds.push(post_id);
                // Keep cookie size reasonable (last 50 posts)
                if (viewedPostIds.length > 50) viewedPostIds.shift();

                cookies.set('viewed_posts', viewedPostIds.join(','), {
                    path: '/',
                    httpOnly: true,
                    maxAge: 60 * 60 * 24, // 1 day
                    sameSite: 'lax'
                });
            } catch (e) {
                console.error("Failed to increment views:", e);
            }
        } else {
            console.log("Debug: Skipping view increment (already viewed this post)");
        }

        // Fetch categories for this post
        let categorySlugs: string[] = [];
        try {
            const postCategories = await db
                .select({ category_slug: postCategoriesTable.category_slug })
                .from(postCategoriesTable)
                .where(eq(postCategoriesTable.post_id, post_id));

            categorySlugs = postCategories.map((pc) => pc.category_slug);
        } catch (err) {
            // If post_categories table doesn't exist or query fails, 
            // fall back to legacy category field
            console.warn("Failed to fetch post categories, falling back to legacy category field:", err);
        }

        // Include legacy category if exists and not already in array
        if (post.category && !categorySlugs.includes(post.category)) {
            categorySlugs.push(post.category);
        }

        // Fetch related posts (same categories, excluding current post)
        let relatedPosts: any[] = [];
        if (categorySlugs.length > 0) {
            const relatedPostIdSet = new Set<string>();

            // Try to get related posts from post_categories table
            try {
                const relatedPostIds = await db
                    .select({ post_id: postCategoriesTable.post_id })
                    .from(postCategoriesTable)
                    .innerJoin(
                        postTable,
                        eq(postCategoriesTable.post_id, postTable.post_id)
                    )
                    .where(
                        and(
                            inArray(postCategoriesTable.category_slug, categorySlugs),
                            ne(postCategoriesTable.post_id, post_id),
                            eq(postTable.status, "published"),
                            eq(postTable.deleted, false)
                        )
                    );

                relatedPostIds.forEach((p) => relatedPostIdSet.add(p.post_id));
            } catch (err) {
                // If post_categories table doesn't exist, skip this query
                console.warn("Failed to fetch related posts from post_categories, using legacy category field:", err);
            }

            // Also check legacy category field
            if (post.category) {
                const legacyRelated = await db
                    .select({ post_id: postTable.post_id })
                    .from(postTable)
                    .where(
                        and(
                            eq(postTable.category, post.category),
                            ne(postTable.post_id, post_id),
                            eq(postTable.status, "published"),
                            eq(postTable.deleted, false)
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
