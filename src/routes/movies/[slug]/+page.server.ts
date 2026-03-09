import { getMovieReviewBySlug, incrementMovieViews, getRecommendedMovies } from "$lib/server/movie-reviews";
import { error } from "@sveltejs/kit";
import { and, eq, ne } from "drizzle-orm";
import { db } from "$lib/server/db";
import { movieReviewsTable } from "$lib/server/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const review = await getMovieReviewBySlug(params.slug);
        if (!review || review.status !== "published") {
            throw error(404, "Movie review not found");
        }

        // Fetch other recommendations
        let relatedReviews = [];
        try {
            relatedReviews = await db
                .select()
                .from(movieReviewsTable)
                .where(
                    and(
                        eq(movieReviewsTable.status, "published"),
                        eq(movieReviewsTable.is_recommended, true),
                        ne(movieReviewsTable.slug, params.slug)
                    )
                )
                .limit(6);
        } catch (relatedErr) {
            console.error("Error fetching related movie reviews:", relatedErr);
        }

        // Increment view count (fire and forget)
        incrementMovieViews(params.slug).catch(() => { });

        return {
            review,
            relatedReviews
        };
    } catch (err) {
        if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
            throw err;
        }
        console.error("Error loading movie review detail:", err);
        throw error(500, "Internal server error while loading movie review");
    }
};
