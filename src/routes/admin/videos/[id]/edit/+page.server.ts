import { getVideoById } from "$lib/server/videos";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { canManageOwner } from "$lib/server/admin-auth";

export const load: PageServerLoad = async ({ params, locals }) => {
    const video = await getVideoById(params.id);
    if (!video) throw error(404, "Video not found");
    const session = locals.session!;
    if (!canManageOwner(session.role, session.admin_id, video.author_id)) throw error(403, "You can only edit your own videos");
    return { video };
};
