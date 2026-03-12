import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
    getImpactGalleryItems,
    createImpactGalleryItem,
    updateDisplayOrder
} from "$lib/server/impact-gallery";

export const GET: RequestHandler = async () => {
    try {
        const items = await getImpactGalleryItems();
        return json(items);
    } catch (err) {
        console.error("Error in impact-gallery GET API:", err);
        return json({ error: "Internal server error", items: [] }, { status: 500 });
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

        if (Array.isArray(data) && data[0] && "display_order" in data[0]) {
            // It's a bulk update for display_order
            await updateDisplayOrder(data);
            return json({ success: true }, { status: 200 });
        }

        // Validate required fields for creation
        if (!data.image_url || !data.caption) {
            return json(
                { error: "image_url and caption are required" },
                { status: 400 }
            );
        }

        const result = await createImpactGalleryItem({
            image_url: data.image_url,
            caption: data.caption,
            tag: data.tag || null,
            display_order: data.display_order || 0
        });

        return json(result, { status: 201 });
    } catch (err) {
        console.error("Error in impact-gallery POST API:", err);
        return json({ error: "Internal server error" }, { status: 500 });
    }
};
