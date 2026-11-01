import type { PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { desc, eq, and, sql, gte } from "drizzle-orm";
import { postTable, postCategoriesTable, adminTable } from "$lib/server/schema";
import { getVideos } from "$lib/server/videos";
import { getRecommendedMovies } from "$lib/server/movie-reviews";
import { cachedPublicData } from "$lib/server/public-data-cache";
import { publicPostCardFields } from "$lib/server/post-cards";
import { getImpactGalleryItems } from "$lib/server/impact-gallery";

const loadContent = (async () => {
    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false)
        );

        // Helper for category queries
        const getCategoryPosts = (categorySlug: string, limit = 6) => {
            return db.select(publicPostCardFields)
                .from(postTable)
                .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                .innerJoin(
                    postCategoriesTable,
                    eq(postTable.post_id, postCategoriesTable.post_id)
                )
                .where(and(baseWhere, eq(postCategoriesTable.category_slug, categorySlug)))
                .orderBy(desc(postTable.created_at))
                .limit(limit)
                .catch(err => {
                    console.error(`[PageLoad] Failed to load ${categorySlug}:`, err);
                    return [];
                });
        };

        // Fetch all primary content in parallel for maximum performance
        const [
            videos,
            featured,
            latest,
            popular,
            trending,
            recommendedMovies,
            impactGalleryItems,
            politicsPosts,
            economyPosts,
            healthPosts,
            techPosts,
            culturePosts,
            sportsPosts,
            entertainmentPosts,
            africanGiantSectionPosts,
            africansOnTheTablePosts
        ] = await Promise.all([
            // Videos
            getVideos(5).catch(err => {
                console.error("[PageLoad] Failed to load videos:", err);
                return [];
            }),

            // Featured
            db.select(publicPostCardFields)
                .from(postTable)
                .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                .where(and(baseWhere, eq(postTable.featured, true)))
                .orderBy(desc(postTable.created_at))
                .limit(4)
                .catch(err => {
                    console.error("[PageLoad] Failed to load featured:", err);
                    return [];
                }),

            // Latest
            db.select(publicPostCardFields)
                .from(postTable)
                .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                .where(baseWhere)
                .orderBy(desc(postTable.created_at))
                .limit(6)
                .catch(err => {
                    console.error("[PageLoad] Failed to load latest:", err);
                    return [];
                }),

            // Popular (last 30 days by views, then fallback to all-time top viewed)
            (async () => {
                try {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    const recent = await db.select(publicPostCardFields)
                .from(postTable)
                        .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                        .where(and(baseWhere, gte(postTable.created_at, thirtyDaysAgo)))
                        .orderBy(desc(postTable.views), desc(postTable.created_at))
                        .limit(8);

                    // If we have enough recent posts, return them
                    if (recent.length >= 4) return recent;

                    // Otherwise fall back to all-time top viewed posts
                    const allTime = await db.select(publicPostCardFields)
                .from(postTable)
                        .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                        .where(baseWhere)
                        .orderBy(desc(postTable.views), desc(postTable.created_at))
                        .limit(8);

                    return allTime;
                } catch (err) {
                    console.error("[PageLoad] Failed to load popular:", err);
                    return [];
                }
            })(),

            // Trending
            db.select(publicPostCardFields)
                .from(postTable)
                .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                .where(and(baseWhere, eq(postTable.isTrendingNews, true)))
                .orderBy(desc(postTable.created_at))
                .limit(10)
                .catch(err => {
                    console.error("[PageLoad] Failed to load trending:", err);
                    return [];
                }),

            // Movies
            getRecommendedMovies(10).catch(err => {
                console.error("[PageLoad] Failed to load movies:", err);
                return [];
            }),

            // Impact Gallery
            getImpactGalleryItems().catch(err => {
                console.error("[PageLoad] Failed to load impact gallery:", err);
                return [];
            }),


            // Sections
            getCategoryPosts("politics"),
            getCategoryPosts("economy"),
            getCategoryPosts("health"),
            getCategoryPosts("technology"),
            getCategoryPosts("culture"),
            getCategoryPosts("sport"),
            getCategoryPosts("entertainment"),
            getCategoryPosts("african-giant"),
            getCategoryPosts("africans-on-the-table"),
        ]);

        return {
            posts: popular,
            featuredPosts: featured,
            latestPosts: latest,
            trendingPosts: trending,
            africanGiant: africanGiantSectionPosts[0] || null,
            recommendedMovies,
            impactGalleryItems,
            videos,
            categories: {
                politics: politicsPosts,
                economy: economyPosts,
                health: healthPosts,
                technology: techPosts,
                culture: culturePosts,
                sports: sportsPosts,
                entertainment: entertainmentPosts,
                "african-giant": africanGiantSectionPosts,
                "africans-on-the-table": africansOnTheTablePosts
            }
        };

    } catch (err) {
        console.error("Critical error in PageLoad:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        if (errorMessage.includes("DATABASE_URL") || errorMessage.includes("connection")) {
            throw error(500, "Database connection failed. Please check infrastructure.");
        }
        throw error(500, `Load failed: ${errorMessage}`);
    }
}) satisfies PageServerLoad;

export const load = ((event?: { request?: Request }) => cachedPublicData("homepage", loadContent, event?.request)) satisfies PageServerLoad;
