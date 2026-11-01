import type { PageServerLoad } from "./$types";

import { getImpactGalleryItems } from "$lib/server/impact-gallery";
import { pageNumber } from '$lib/server/pagination';

export const load: PageServerLoad = async ({ url }) => {
    const page = pageNumber(url);
    try {
        const rows = await getImpactGalleryItems(25, (page - 1) * 24);
        return {
            items: rows.slice(0, 24),
            pagination: { currentPage: page, hasPrevPage: page > 1, hasNextPage: rows.length > 24 },
        };
    } catch (error) {
        console.error("Error loading impact items:", error);
        throw error;
    }
};
