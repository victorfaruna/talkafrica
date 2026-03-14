import type { PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { desc, eq, and, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, adminTable } from "$lib/server/schema";
import { getVideos } from "$lib/server/videos";
import { getRecommendedMovies } from "$lib/server/movie-reviews";
import { getImpactGalleryItems } from "$lib/server/impact-gallery";

export const load: PageServerLoad = async () => {
    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false)
        );

        // Fetch all primary content in parallel for maximum performance
        const [
            videos,
            featured,
            latest,
            popular,
            trending,
            africanGiantPosts,
            recommendedMovies,
            impactGalleryItems,
            politicsPosts,
            economyPosts
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

            // African Giant
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
                    console.error("[PageLoad] Failed to load african giant:", err);
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

            // PRE-FETCH CRITICAL CATEGORIES (Politics)
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                image: postTable.image,
                category: postTable.category,
                created_at: postTable.created_at,
                slug: postTable.post_id,
            })
                .from(postTable)
                .where(and(baseWhere, eq(postTable.category, "politics")))
                .orderBy(desc(postTable.created_at))
                .limit(3)
                .catch(() => []),

            // PRE-FETCH CRITICAL CATEGORIES (Economy)
            db.select({
                post_id: postTable.post_id,
                title: postTable.title,
                image: postTable.image,
                category: postTable.category,
                created_at: postTable.created_at,
                slug: postTable.post_id,
            })
                .from(postTable)
                .where(and(baseWhere, eq(postTable.category, "economy")))
                .orderBy(desc(postTable.created_at))
                .limit(3)
                .catch(() => []),
        ]);

        return {
            posts: popular,
            featuredPosts: featured,
            latestPosts: latest,
            trendingPosts: trending,
            africanGiant: africanGiantPosts[0] || null,
            recommendedMovies,
            impactGalleryItems,
            serverPolitics: politicsPosts,
            serverEconomy: economyPosts,
            videos
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
