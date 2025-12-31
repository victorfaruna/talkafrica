import { getVideoById } from "$lib/server/videos";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const video = await getVideoById(params.id);
    if (!video) throw error(404, "Video not found");
    return { video };
};
