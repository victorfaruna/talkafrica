import { getVideos } from "$lib/server/videos";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const videos = await getVideos(50, 0); // initial fetch
    return {
        videos
    };
};
