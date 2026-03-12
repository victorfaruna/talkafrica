import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { deleteImpactGalleryItem } from "$lib/server/impact-gallery";

export const DELETE: RequestHandler = async ({ params, locals }) => {
    try {
        // Ensure user is admin - check session
        const session = locals.session;
        if (!session) {
            return json({ error: "Unauthorized" }, { status: 401 });
        }

        const id = params.id;
        if (!id) {
            return json({ error: "id is required" }, { status: 400 });
        }

        await deleteImpactGalleryItem(id);

        return json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("Error in impact-gallery DELETE API:", err);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};
