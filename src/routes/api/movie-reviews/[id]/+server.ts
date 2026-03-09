import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
    getMovieReviewById,
    updateMovieReview,
    deleteMovieReview,
} from "$lib/server/movie-reviews";

export const GET: RequestHandler = async ({ params }) => {
    const review = await getMovieReviewById(params.id);
    if (!review) {
        return json({ error: "Not found" }, { status: 404 });
    }
    return json(review);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const result = await updateMovieReview(params.id, data);
    if (!result.length) {
        return json({ error: "Not found" }, { status: 404 });
    }
    return json(result[0]);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const session = locals.session;
    if (!session) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await deleteMovieReview(params.id);
    if (!result.length) {
        return json({ error: "Not found" }, { status: 404 });
    }
    return json({ success: true });
};
