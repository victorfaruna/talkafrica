import { json } from "@sveltejs/kit";
import { getVideoById, updateVideo, deleteVideo } from "$lib/server/videos";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
    try {
        const video = await getVideoById(params.id);
        if (!video) {
            return json({ error: "Video not found" }, { status: 404 });
        }
        return json({ video });
    } catch (error) {
        console.error("Error fetching video:", error);
        return json({ error: "Failed to fetch video" }, { status: 500 });
    }
};

export const PUT: RequestHandler = async ({ params, request }) => {
    try {
        const data = await request.json();
        const video = await updateVideo(params.id, data);
        if (!video.length) {
            return json({ error: "Video not found" }, { status: 404 });
        }
        return json({ video: video[0] });
    } catch (error) {
        console.error("Error updating video:", error);
        return json({ error: "Failed to update video" }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const result = await deleteVideo(params.id);
        if (!result.length) {
            return json({ error: "Video not found" }, { status: 404 });
        }
        return json({ success: true });
    } catch (error) {
        console.error("Error deleting video:", error);
        return json({ error: "Failed to delete video" }, { status: 500 });
    }
};
