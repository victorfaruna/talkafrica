import { getMovieReviewBySlug, movieCardFields } from "$lib/server/movie-reviews";
import { error } from "@sveltejs/kit";
import { and, eq, ne } from "drizzle-orm";
import { db } from "$lib/server/db";
import { movieReviewsTable } from "$lib/server/schema";
import type { PageServerLoad } from "./$types";
import { cachedPublicData } from "$lib/server/public-data-cache";

const loadContent: PageServerLoad = async ({ params }) => {
    try {
        const [review, relatedReviews] = await Promise.all([
            getMovieReviewBySlug(params.slug),
            db.select(movieCardFields)
                .from(movieReviewsTable)
                .where(
                    and(
                        eq(movieReviewsTable.status, "published"),
                        eq(movieReviewsTable.is_recommended, true),
                        ne(movieReviewsTable.slug, params.slug)
                    )
                )
                .limit(6)
                .catch(err => {
                    console.error("Error fetching related movie reviews:", err);
                    return [];
                })
        ]);

        if (!review || review.status !== "published") {
            throw error(404, "Movie review not found");
        }

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

export const load: PageServerLoad = (event) => cachedPublicData(
    `movie:${event.params.slug}`, () => loadContent(event), event.request,
);
