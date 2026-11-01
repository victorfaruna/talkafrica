import { getMovieReviews } from "$lib/server/movie-reviews";
import type { PageServerLoad } from "./$types";
import { pageNumber } from '$lib/server/pagination';

export const load: PageServerLoad = async ({ url }) => {
    const page = pageNumber(url);
    const search = (url.searchParams.get('search') ?? '').trim().slice(0, 200);
    try {
        const rows = await getMovieReviews(26, (page - 1) * 25, undefined, search);
        return { reviews: rows.slice(0, 25), search, pagination: { currentPage: page, hasPrevPage: page > 1, hasNextPage: rows.length > 25 } };
    } catch (err) {
        console.error("[AdminMovies] Failed to load movie reviews:", err);
        throw err;
    }
};
