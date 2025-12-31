import { getVideos } from "$lib/server/videos";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const videos = await getVideos(20); // List 20 recent videos
    return {
        videos
    };
};
