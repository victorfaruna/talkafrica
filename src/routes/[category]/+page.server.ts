import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ params }) => {
    const categoryParam = params.category?.toLowerCase();

    return {
        category: categoryParam,
        posts: [],
        notFound: false,
    };
};
