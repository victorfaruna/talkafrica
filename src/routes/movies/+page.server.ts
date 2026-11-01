import { getPublishedMovieReviews } from "$lib/server/movie-reviews";
import type { PageServerLoad } from "./$types";
import { pageNumber } from '$lib/server/pagination';
import { cachedPublicData } from '$lib/server/public-data-cache';

const loadContent: PageServerLoad = async ({ url }) => {
    const page = pageNumber(url);
    try {
        const rows = await getPublishedMovieReviews(25, (page - 1) * 24);
        const reviews = rows.slice(0, 24);
        return { 
            reviews,
            pagination: { currentPage: page, hasPrevPage: page > 1, hasNextPage: rows.length > 24 },
            categoryName: "The Big Screen",
            description: "Discover the best African movies with expert reviews and recommendations from TalkAfrica. Nollywood, African cinema, and more."
        };
    } catch (err) {
        console.error("Error loading movie reviews:", err);
        throw err;
    }
};

export const load: PageServerLoad = (event) => cachedPublicData(`movies:${pageNumber(event.url)}`, () => loadContent(event), event.request);
