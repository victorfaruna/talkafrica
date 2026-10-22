import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, and, ne, desc, asc, lt, gt, inArray, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, dailyStatsTable, postDailyStatsTable, adminTable } from "$lib/server/schema";
import { postPath, slugifyPostTitle } from "$lib/post-url";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ params, cookies }) => {
    try {
        const identifier = params.post_id;

        const isLegacyId = UUID_PATTERN.test(identifier);
        let resolvedPostId = identifier;

        if (!isLegacyId) {
            const candidates = await db.select({
                post_id: postTable.post_id,
                title: postTable.title,
            })
                .from(postTable)
                .where(and(eq(postTable.status, "published"), eq(postTable.deleted, false)))
                .orderBy(desc(postTable.created_at));

            const match = candidates.find(
                (candidate) => slugifyPostTitle(candidate.title) === identifier.toLowerCase(),
            );

            if (!match) throw error(404, "Post not found");
            resolvedPostId = match.post_id;
        }

        const postResults = await db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                content: postTable.content,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
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
            .where(and(
                eq(postTable.post_id, resolvedPostId),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false),
            ));

        const post = postResults[0];

        if (!post) {
            throw error(404, "Post not found");
        }

        if (isLegacyId) {
            throw redirect(301, postPath(post));
        }

        const post_id = post.post_id;
        const categoryResults = await db.select({ category_slug: postCategoriesTable.category_slug })
            .from(postCategoriesTable)
            .where(eq(postCategoriesTable.post_id, post_id))
            .catch(() => []);
        let categorySlugs = categoryResults.map(c => c.category_slug);

        // Increment views (unique per user/post/day via cookie)
        const viewedCookie = cookies.get('viewed_posts') || '';
        const viewedPostIds = viewedCookie.split(',').filter(Boolean);

        if (!viewedPostIds.includes(post_id)) {
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
                        }),
                    db.insert(postDailyStatsTable)
                        .values({ post_id, date: sql`CURRENT_DATE`, views: 1 })
                        .onConflictDoUpdate({
                            target: [postDailyStatsTable.post_id, postDailyStatsTable.date],
                            set: { views: sql`${postDailyStatsTable.views} + 1` },
                        })
                ]);
            } catch (e) {
                console.error("[PostLoad] View increment failed:", e);
            }

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

        // 2. Fetch related candidates, fallback latest, adjacent posts, and latest sidebar posts in parallel
        const [
            relatedByCategories,
            legacyRelated,
            fallbackLatest,
            prevPostResult,
            nextPostResult,
            latestPosts,
            africansOnTableCatPosts,
            africansOnTableLegacyPosts
        ] = await Promise.all([
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
                author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(and(
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(3),

            // Previous post (chronologically older)
            post.created_at ? db.select({
                post_id: postTable.post_id,
                title: postTable.title,
            })
            .from(postTable)
            .where(and(
                lt(postTable.created_at, new Date(post.created_at)),
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(1)
            .catch(() => []) : Promise.resolve([]),

            // Next post (chronologically newer)
            post.created_at ? db.select({
                post_id: postTable.post_id,
                title: postTable.title,
            })
            .from(postTable)
            .where(and(
                gt(postTable.created_at, new Date(post.created_at)),
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(asc(postTable.created_at))
            .limit(1)
            .catch(() => []) : Promise.resolve([]),

            // Latest news for sidebar (10 items)
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(and(
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(10)
            .catch(() => []),

            // Africans on the Table spotlight post (via postCategoriesTable)
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .innerJoin(postCategoriesTable, eq(postTable.post_id, postCategoriesTable.post_id))
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(and(
                eq(postCategoriesTable.category_slug, "africans-on-the-table"),
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(1)
            .catch(() => []),

            // Africans on the Table spotlight post (via legacy postTable.category)
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(and(
                eq(postTable.category, "africans-on-the-table"),
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(1)
            .catch(() => [])
        ]);

        let africansOnTablePost = africansOnTableCatPosts[0] || africansOnTableLegacyPosts[0] || null;

        // If no post found under africans-on-the-table, check african-giant category as fallback
        if (!africansOnTablePost) {
            const fallbackGiant = await db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .innerJoin(postCategoriesTable, eq(postTable.post_id, postCategoriesTable.post_id))
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .where(and(
                eq(postCategoriesTable.category_slug, "african-giant"),
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(1)
            .catch(() => []);

            africansOnTablePost = fallbackGiant[0] || null;
        }

        const relatedIdSet = new Set<string>();
        relatedByCategories.forEach(p => relatedIdSet.add(p.post_id));
        legacyRelated.forEach(p => relatedIdSet.add(p.post_id));

        let relatedPosts: any[] = [];
        if (relatedIdSet.size > 0) {
            relatedPosts = await db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                excerpt: postTable.excerpt,
                image: postTable.image,
                category: postTable.category,
                author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
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

        let prevPost = prevPostResult[0] || null;
        let nextPost = nextPostResult[0] || null;

        // If at the newest post and no newer post exists, wrap around to oldest post
        if (!nextPost) {
            const oldestPost = await db.select({
                post_id: postTable.post_id,
                title: postTable.title,
            })
            .from(postTable)
            .where(and(
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(asc(postTable.created_at))
            .limit(1)
            .catch(() => []);

            if (oldestPost.length > 0 && oldestPost[0].post_id !== post_id && (!prevPost || prevPost.post_id !== oldestPost[0].post_id)) {
                nextPost = oldestPost[0];
            }
        }

        // If at the oldest post and no older post exists, wrap around to newest post
        if (!prevPost) {
            const newestPost = await db.select({
                post_id: postTable.post_id,
                title: postTable.title,
            })
            .from(postTable)
            .where(and(
                ne(postTable.post_id, post_id),
                eq(postTable.status, "published"),
                eq(postTable.deleted, false)
            ))
            .orderBy(desc(postTable.created_at))
            .limit(1)
            .catch(() => []);

            if (newestPost.length > 0 && newestPost[0].post_id !== post_id && (!nextPost || nextPost.post_id !== newestPost[0].post_id)) {
                prevPost = newestPost[0];
            }
        }

        return {
            post: { ...post, categories: categorySlugs },
            relatedPosts,
            prevPost,
            nextPost,
            latestPosts: latestPosts || [],
            africansOnTablePost,
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
