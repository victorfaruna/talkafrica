import type { PageServerLoad } from "./$types";

import { getImpactGalleryItems } from "$lib/server/impact-gallery";

export const load: PageServerLoad = async () => {
    try {
        const items = await getImpactGalleryItems();
        return {
            items
        };
    } catch (error) {
        console.error("Error loading impact items:", error);
        return {
            items: [],
            error: "Failed to load impact gallery items"
        };
    }
};
