import { getPublishedMovieReviews } from "$lib/server/movie-reviews";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        const reviews = await getPublishedMovieReviews(50);
        return { reviews };
    } catch (err) {
        console.error("Error loading movie reviews:", err);
        return { reviews: [] };
    }
};
