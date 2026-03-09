import { json } from "@sveltejs/kit";
import { getVideos, createVideo } from "$lib/server/videos";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
    const limit = Number(url.searchParams.get("limit")) || 10;
    const offset = Number(url.searchParams.get("offset")) || 0;
    const category = url.searchParams.get("category") || undefined;

    try {
        const videos = await getVideos(limit, offset, category);
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
        const video = await createVideo(data);
        return json({ video: video[0] }, { status: 201 });
    } catch (error) {
        console.error("Error creating video:", error);
        return json({ error: "Failed to create video" }, { status: 500 });
    }
};
