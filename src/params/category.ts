// Manually listing valid categories to avoid import issues in the matcher
const VALID_CATEGORIES = new Set([
    "news", "politics", "economy", "health", "technology", "african-giant", "africans-on-the-table",
    "culture", "arts", "african-history", "animated-folktales", "historical-sites", "fun-facts",
    "sport", "basketball", "athletics", "tennis", "olympics",
    "entertainment", "music", "celebrity-gossip", "travel", "lifestyle", "movie-reviews"
]);

const RESERVED_ROUTES = new Set([
    'terms', 'privacy', 'contact', 'about', 'movies', 'videos', 'donate', 'posts', 'admin', 'api'
]);

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
    const slug = param.toLowerCase();
    
    // It must NOT be a reserved route AND it MUST be in our valid categories list
    return !RESERVED_ROUTES.has(slug) && VALID_CATEGORIES.has(slug);
}
