import { categoryExists } from "$lib/categories";

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
    const reserved = ['terms', 'privacy', 'contact', 'about', 'movies', 'videos', 'donate', 'african-giant', 'posts', 'admin', 'api'];
    
    // It must NOT be a reserved route AND it MUST be a valid category
    return !reserved.includes(param.toLowerCase()) && categoryExists(param.toLowerCase());
}
