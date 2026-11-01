import { json } from "@sveltejs/kit";
import { getVideos, createVideo } from "$lib/server/videos";
import type { RequestHandler } from "./$types";
import { listRange } from '$lib/server/pagination';
import { cachedPublicData } from '$lib/server/public-data-cache';

export const GET: RequestHandler = async ({ url, request }) => {
    const { limit, offset } = listRange(url, 10);
    const category = url.searchParams.get("category") || undefined;

    try {
        const videos = await cachedPublicData(`videos:${category ?? ''}:${limit}:${offset}`, () => getVideos(limit, offset, category), request);
        return json({ videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return json({ error: "Failed to fetch videos" }, { status: 500 });
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
        const video = await createVideo({ ...data, author_id: session.admin_id, author: session.name });
        return json({ video: video[0] }, { status: 201 });
    } catch (error) {
        console.error("Error creating video:", error);
        return json({ error: "Failed to create video" }, { status: 500 });
    }
};
