import type { PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { desc, eq, and, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, adminTable } from "$lib/server/schema";
import { getVideos } from "$lib/server/videos";
import { getRecommendedMovies } from "$lib/server/movie-reviews";
import { getImpactGalleryItems } from "$lib/server/impact-gallery";

export const load: PageServerLoad = async ({ setHeaders }) => {
    // Cache the homepage for 60 seconds to speed up "Back to Home" navigation
    setHeaders({
        "Cache-Control": "public, max-age=60, s-maxage=60",
    });

    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false)
        );

        // Helper for category queries
        const getCategoryPosts = (categorySlug: string, limit = 3) => {
            return db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                image: postTable.image,
                category: postTable.category,
                created_at: postTable.created_at,
                slug: postTable.post_id,
            })
                .from(postTable)
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
            africanGiantOfTheWeek,
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
                .where(and(baseWhere, eq(postTable.featured, true)))
                .orderBy(desc(postTable.created_at))
                .limit(4)
                .catch(err => {
                    console.error("[PageLoad] Failed to load featured:", err);
                    return [];
                }),

            // Latest
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
                .where(baseWhere)
                .orderBy(desc(postTable.created_at))
                .limit(6)
                .catch(err => {
                    console.error("[PageLoad] Failed to load latest:", err);
                    return [];
                }),

            // Popular
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
                .where(baseWhere)
                .orderBy(desc(postTable.views))
                .limit(8)
                .catch(err => {
                    console.error("[PageLoad] Failed to load popular:", err);
                    return [];
                }),

            // Trending
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
                .where(and(baseWhere, eq(postTable.isTrendingNews, true)))
                .orderBy(desc(postTable.created_at))
                .limit(5)
                .catch(err => {
                    console.error("[PageLoad] Failed to load trending:", err);
                    return [];
                }),

            // African Giant of the Week
            db.select({
                id: postTable.id,
                post_id: postTable.post_id,
                title: postTable.title,
                content: postTable.content,
                excerpt: postTable.excerpt,
                category: postTable.category,
                image: postTable.image,
                status: postTable.status,
                featured: postTable.featured,
                isTrendingNews: postTable.isTrendingNews,
                deleted: postTable.deleted,
                views: postTable.views,
                author: sql<string>`coalesce(${adminTable.username}, ${postTable.author})`,
                editor: postTable.editor,
                created_at: postTable.created_at,
                updated_at: postTable.updated_at,
            })
                .from(postTable)
                .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                .innerJoin(
                    postCategoriesTable,
                    eq(postTable.post_id, postCategoriesTable.post_id)
                )
                .where(and(baseWhere, eq(postCategoriesTable.category_slug, "african-giant")))
                .orderBy(desc(postTable.created_at))
                .limit(1)
                .catch(err => {
                    console.error("[PageLoad] Failed to load african giant of the week:", err);
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
            getCategoryPosts("sports"),
            getCategoryPosts("entertainment"),
            getCategoryPosts("african-giant"),
            getCategoryPosts("africans-on-the-table"),
        ]);

        return {
            posts: popular,
            featuredPosts: featured,
            latestPosts: latest,
            trendingPosts: trending,
            africanGiant: africanGiantOfTheWeek[0] || null,
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
};
