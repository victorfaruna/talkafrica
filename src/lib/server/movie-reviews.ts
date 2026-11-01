import { db } from "./db";
import { movieReviewsTable } from "./schema";
import { desc, eq, sql, and, ilike } from "drizzle-orm";
import { getTableColumns } from 'drizzle-orm';
import { publicArticleContent } from './article-media';
import { storeInlineImages } from './store-inline-images';
import { lazyArticleImages } from '$lib/utils/article-html';

export const movieCardFields = {
    review_id: movieReviewsTable.review_id,
    title: movieReviewsTable.title,
    slug: movieReviewsTable.slug,
    genre: movieReviewsTable.genre,
    director: movieReviewsTable.director,
    release_date: movieReviewsTable.release_date,
    rating: movieReviewsTable.rating,
    poster_url: movieReviewsTable.poster_url,
    is_recommended: movieReviewsTable.is_recommended
};

export async function getMovieReviews(limit = 10, offset = 0, status?: string, search?: string) {
    let query = db
        .select({ ...movieCardFields, status: movieReviewsTable.status, views: movieReviewsTable.views, created_at: movieReviewsTable.created_at })
        .from(movieReviewsTable)
        .orderBy(desc(movieReviewsTable.created_at))
        .limit(limit)
        .offset(offset)
        .$dynamic();

    query = query.where(and(
        status ? eq(movieReviewsTable.status, status) : undefined,
        search ? ilike(movieReviewsTable.title, `%${search.replace(/[\\%_]/g, '\\$&')}%`) : undefined,
    ));

    return await query;
}

export async function getPublishedMovieReviews(limit = 10, offset = 0) {
    return await db
        .select(movieCardFields)
        .from(movieReviewsTable)
        .where(eq(movieReviewsTable.status, "published"))
        .orderBy(desc(movieReviewsTable.created_at))
        .limit(limit)
        .offset(offset);
}

export async function getRecommendedMovies(limit = 6) {
    return await db
        .select(movieCardFields)
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
        .where(eq(movieReviewsTable.review_id, id)).limit(1);
    return result[0];
}

export async function getMovieReviewBySlug(slug: string) {
    const result = await db
        .select({ ...getTableColumns(movieReviewsTable), content: publicArticleContent(movieReviewsTable.content, movieReviewsTable.review_id, 'movies') })
        .from(movieReviewsTable)
        .where(and(eq(movieReviewsTable.slug, slug), eq(movieReviewsTable.status, 'published'))).limit(1);
    return result[0] ? { ...result[0], content: lazyArticleImages(result[0].content) } : undefined;
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
    return await db.insert(movieReviewsTable).values({ ...data, content: await storeInlineImages(data.content) }).returning({ review_id: movieReviewsTable.review_id, slug: movieReviewsTable.slug });
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
    if (typeof data.content === 'string') data = { ...data, content: await storeInlineImages(data.content) };
    return await db
        .update(movieReviewsTable)
        .set({ ...data, updated_at: new Date() })
        .where(eq(movieReviewsTable.review_id, id))
        .returning({ review_id: movieReviewsTable.review_id, slug: movieReviewsTable.slug });
}

export async function deleteMovieReview(id: string) {
    return await db
        .delete(movieReviewsTable)
        .where(eq(movieReviewsTable.review_id, id))
        .returning({ review_id: movieReviewsTable.review_id });
}

export async function incrementMovieViews(slug: string) {
    return await db
        .update(movieReviewsTable)
        .set({ views: sql`${movieReviewsTable.views} + 1` })
        .where(eq(movieReviewsTable.slug, slug));
}
