import { getMovieReviewById } from "$lib/server/movie-reviews";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const review = await getMovieReviewById(params.id);

    if (!review) {
        throw error(404, "Movie Recommendation not found");
    }

    return { review };
};
