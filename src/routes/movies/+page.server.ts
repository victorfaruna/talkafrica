import { getPublishedMovieReviews } from "$lib/server/movie-reviews";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        const reviews = await getPublishedMovieReviews(50);
        return { 
            reviews,
            categoryName: "The Big Screen",
            description: "Discover the best African movies with expert reviews and recommendations from TalkAfrica. Nollywood, African cinema, and more."
        };
    } catch (err) {
        console.error("Error loading movie reviews:", err);
        return { reviews: [] };
    }
};
