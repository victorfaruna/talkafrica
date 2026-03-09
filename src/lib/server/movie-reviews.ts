import { db } from "./db";
import { movieReviewsTable } from "./schema";
import { desc, eq, sql, and } from "drizzle-orm";

export async function getMovieReviews(limit = 10, offset = 0, status?: string) {
    let query = db
        .select()
        .from(movieReviewsTable)
        .orderBy(desc(movieReviewsTable.created_at))
        .limit(limit)
        .offset(offset);

    if (status) {
        query = query.where(eq(movieReviewsTable.status, status));
    }

    return await query;
}

export async function getPublishedMovieReviews(limit = 10, offset = 0) {
    return await db
        .select()
        .from(movieReviewsTable)
        .where(eq(movieReviewsTable.status, "published"))
        .orderBy(desc(movieReviewsTable.created_at))
        .limit(limit)
        .offset(offset);
}

export async function getRecommendedMovies(limit = 6) {
    return await db
        .select()
        .from(movieReviewsTable)
        .where(
            and(
                eq(movieReviewsTable.status, "published"),
                eq(movieReviewsTable.is_recommended, true)
            )
        )
        .orderBy(desc(movieReviewsTable.created_at))
        .limit(limit);
}

export async function getMovieReviewById(id: string) {
    const result = await db
        .select()
        .from(movieReviewsTable)
        .where(eq(movieReviewsTable.review_id, id));
    return result[0];
}

export async function getMovieReviewBySlug(slug: string) {
    const result = await db
        .select()
        .from(movieReviewsTable)
        .where(eq(movieReviewsTable.slug, slug));
    return result[0];
}

export async function createMovieReview(data: {
    title: string;
    slug: string;
    genre?: string;
    director?: string;
    cast?: string;
    release_date?: string;
    runtime?: string;
    rating: number;
    poster_url: string;
    backdrop_url?: string;
    trailer_url?: string;
    content: string;
    status?: string;
    is_recommended?: boolean;
    author: string;
    author_id?: string;
}) {
    return await db.insert(movieReviewsTable).values(data).returning();
}

export async function updateMovieReview(
    id: string,
    data: Partial<{
        title: string;
        slug: string;
        genre: string;
        director: string;
        cast: string;
        release_date: string;
        runtime: string;
        rating: number;
        poster_url: string;
        backdrop_url: string;
        trailer_url: string;
        content: string;
        status: string;
        is_recommended: boolean;
    }>
) {
    return await db
        .update(movieReviewsTable)
        .set({ ...data, updated_at: new Date() })
        .where(eq(movieReviewsTable.review_id, id))
        .returning();
}

export async function deleteMovieReview(id: string) {
    return await db
        .delete(movieReviewsTable)
        .where(eq(movieReviewsTable.review_id, id))
        .returning();
}

export async function incrementMovieViews(slug: string) {
    return await db
        .update(movieReviewsTable)
        .set({ views: sql`${movieReviewsTable.views} + 1` })
        .where(eq(movieReviewsTable.slug, slug));
}
