// @ts-nocheck
import type { PageServerLoad } from "./$types";

export const load = ({ params }: Parameters<PageServerLoad>[0]) => {
    const categoryParam = params.category?.toLowerCase();

    return {
        category: categoryParam,
        posts: [],
        notFound: false,
    };
};
