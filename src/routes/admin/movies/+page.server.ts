import { getMovieReviews } from "$lib/server/movie-reviews";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        const reviews = await getMovieReviews(100, 0);
        return { reviews };
    } catch (err) {
        console.error("[AdminMovies] Failed to load movie reviews:", err);
        return { reviews: [], error: "Failed to load movie reviews. The database may be missing required columns." };
    }
};
