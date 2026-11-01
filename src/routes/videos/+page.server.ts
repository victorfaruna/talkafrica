import { getVideos } from "$lib/server/videos";
import type { PageServerLoad } from "./$types";
import { pageNumber } from '$lib/server/pagination';
import { cachedPublicData } from '$lib/server/public-data-cache';

const loadContent: PageServerLoad = async ({ url }) => {
    const page = pageNumber(url);
    const rows = await getVideos(21, (page - 1) * 20);
    const videos = rows.slice(0, 20);
    return {
        videos,
        pagination: { currentPage: page, hasPrevPage: page > 1, hasNextPage: rows.length > 20 },
        title: "Videos | TalkAfrica",
        description: "Watch the latest videos on African news, innovation, and culture. Stay connected with TalkAfrica's visual storytelling."
    };
};

export const load: PageServerLoad = (event) => cachedPublicData(`videos-page:${pageNumber(event.url)}`, () => loadContent(event), event.request);
