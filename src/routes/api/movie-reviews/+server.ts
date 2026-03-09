import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
    getMovieReviews,
    createMovieReview,
} from "$lib/server/movie-reviews";

export const GET: RequestHandler = async ({ url }) => {
    try {
        const limit = parseInt(url.searchParams.get("limit") ?? "10");
        const offset = parseInt(url.searchParams.get("offset") ?? "0");
        const status = url.searchParams.get("status") ?? undefined;

        const reviews = await getMovieReviews(limit, offset, status);
        return json(reviews);
    } catch (err) {
        console.error("Error in movie-reviews GET API:", err);
        return json({ error: "Internal server error", reviews: [] }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        // Ensure user is admin - check session
        const session = locals.session;
        if (!session) {
            return json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // Validate required fields
        if (!data.title || !data.content || !data.poster_url) {
            return json(
                { error: "title, content, and poster_url are required" },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
        }

        const result = await createMovieReview({
            ...data,
            rating: data.rating ?? 0,
            author: session.name ?? "Admin",
            author_id: session.admin_id,
        });

        return json(result[0], { status: 201 });
    } catch (err) {
        console.error("Error in movie-reviews POST API:", err);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};
