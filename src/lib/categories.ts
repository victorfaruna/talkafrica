/**
 * Centralized category management system
 * This file contains the single source of truth for all categories and subcategories
 */

export interface Category {
    id: string;
    name: string;
    slug: string;
    display_name: string;
    description?: string;
    parent_id?: string;
    icon?: string;
    color?: string;
    sort_order: number;
    is_active: boolean;
    subcategories?: Category[];
}

export interface CategoryHierarchy {
    main_categories: Category[];
    subcategories: { [parentId: string]: Category[] };
}

// Centralized category definitions
export const CATEGORY_DEFINITIONS: Omit<Category, "id">[] = [
    // News Section
    {
        name: "news",
        slug: "news",
        display_name: "Latest News",
        description: "Breaking news and current events from across Africa",
        icon: "newspaper",
        color: "#3B82F6",
        sort_order: 1,
        is_active: true,
    },
    {
        name: "politics",
        slug: "politics",
        display_name: "Politics",
        description: "Political news and analysis",
        parent_id: "news",
        icon: "government",
        color: "#EF4444",
        sort_order: 1,
        is_active: true,
    },
    {
        name: "economy",
        slug: "economy",
        display_name: "Economy",
        description: "Economic news and financial updates",
        parent_id: "news",
        icon: "chart-line",
        color: "#10B981",
        sort_order: 2,
        is_active: true,
    },
    {
        name: "health",
        slug: "health",
        display_name: "Health",
        description: "Health news and medical updates",
        parent_id: "news",
        icon: "heart",
        color: "#F59E0B",
        sort_order: 3,
        is_active: true,
    },
    {
        name: "technology",
        slug: "technology",
        display_name: "Technology",
        description: "Tech news and innovation",
        parent_id: "news",
        icon: "laptop",
        color: "#8B5CF6",
        sort_order: 4,
        is_active: true,
    },

    // Culture Section
    {
        name: "culture",
        slug: "culture",
        display_name: "Culture",
        description: "African culture, traditions, and heritage",
        icon: "palette",
        color: "#F97316",
        sort_order: 2,
        is_active: true,
    },
    {
        name: "arts",
        slug: "arts",
        display_name: "Arts",
        description: "Visual arts, literature, and creative expression",
        parent_id: "culture",
        icon: "paint-brush",
        color: "#EC4899",
        sort_order: 1,
        is_active: true,
    },
    {
        name: "african-history",
        slug: "african-history",
        display_name: "African History",
        description: "Historical stories and heritage",
        parent_id: "culture",
        icon: "book-open",
        color: "#6B7280",
        sort_order: 2,
        is_active: true,
    },
    {
        name: "animated-folktales",
        slug: "animated-folktales",
        display_name: "Animated Folktales",
        description: "Animated stories and tales",
        parent_id: "culture",
        icon: "video",
        color: "#F59E0B",
        sort_order: 3,
        is_active: true,
    },
    {
        name: "historical-sites",
        slug: "historical-sites",
        display_name: "Historical Sites",
        description: "Famous landmarks and historical locations",
        parent_id: "culture",
        icon: "landmark",
        color: "#059669",
        sort_order: 4,
        is_active: true,
    },
    {
        name: "fun-facts",
        slug: "fun-facts",
        display_name: "Fun Facts About Africa",
        description: "Interesting and surprising facts",
        parent_id: "culture",
        icon: "lightbulb",
        color: "#8B5CF6",
        sort_order: 5,
        is_active: true,
    },

    // Sports Section
    {
        name: "sport",
        slug: "sport",
        display_name: "Sports",
        description: "Sports news and updates",
        icon: "football",
        color: "#22C55E",
        sort_order: 3,
        is_active: true,
    },
    {
        name: "basketball",
        slug: "basketball",
        display_name: "Basketball",
        description: "Basketball news and updates",
        parent_id: "sport",
        icon: "basketball",
        color: "#F97316",
        sort_order: 1,
        is_active: true,
    },
    {
        name: "athletics",
        slug: "athletics",
        display_name: "Athletics",
        description: "Track and field events",
        parent_id: "sport",
        icon: "running",
        color: "#3B82F6",
        sort_order: 2,
        is_active: true,
    },
    {
        name: "tennis",
        slug: "tennis",
        display_name: "Tennis",
        description: "Tennis news and updates",
        parent_id: "sport",
        icon: "tennis-ball",
        color: "#10B981",
        sort_order: 3,
        is_active: true,
    },
    {
        name: "olympics",
        slug: "olympics",
        display_name: "Olympics",
        description: "Olympic games and events",
        parent_id: "sport",
        icon: "trophy",
        color: "#F59E0B",
        sort_order: 4,
        is_active: true,
    },

    // Entertainment Section
    {
        name: "entertainment",
        slug: "entertainment",
        display_name: "Entertainment",
        description: "Entertainment news and updates",
        icon: "star",
        color: "#EC4899",
        sort_order: 4,
        is_active: true,
    },
    {
        name: "music",
        slug: "music",
        display_name: "Music",
        description: "Music news, reviews, and artist updates",
        parent_id: "entertainment",
        icon: "music",
        color: "#8B5CF6",
        sort_order: 1,
        is_active: true,
    },
    {
        name: "celebrity-gossip",
        slug: "celebrity-gossip",
        display_name: "Celebrity Gossip",
        description: "Celebrity news and gossip",
        parent_id: "entertainment",
        icon: "users",
        color: "#F59E0B",
        sort_order: 2,
        is_active: true,
    },
    {
        name: "travel",
        slug: "travel",
        display_name: "Travel",
        description: "Travel guides and destination features",
        parent_id: "entertainment",
        icon: "plane",
        color: "#3B82F6",
        sort_order: 3,
        is_active: true,
    },
    {
        name: "lifestyle",
        slug: "lifestyle",
        display_name: "Lifestyle",
        description: "Lifestyle tips and features",
        parent_id: "entertainment",
        icon: "home",
        color: "#10B981",
        sort_order: 4,
        is_active: true,
    },
];

/**
 * Get all main categories (categories without parent_id)
 */
export function getMainCategories(): Omit<Category, "id">[] {
    return CATEGORY_DEFINITIONS.filter((cat) => !cat.parent_id).sort(
        (a, b) => a.sort_order - b.sort_order
    );
}

/**
 * Get all subcategories for a specific parent category
 */
export function getSubcategories(parentSlug: string): Omit<Category, "id">[] {
    return CATEGORY_DEFINITIONS.filter(
        (cat) => cat.parent_id === parentSlug
    ).sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(
    slug: string
): Omit<Category, "id"> | undefined {
    return CATEGORY_DEFINITIONS.find((cat) => cat.slug === slug);
}

/**
 * Get all categories in a hierarchical structure
 */
export function getCategoryHierarchy(): CategoryHierarchy {
    const mainCategories = getMainCategories();
    const subcategories: { [parentId: string]: Omit<Category, "id">[] } = {};

    // Group subcategories by parent
    CATEGORY_DEFINITIONS.filter((cat) => cat.parent_id).forEach((cat) => {
        if (!subcategories[cat.parent_id!]) {
            subcategories[cat.parent_id!] = [];
        }
        subcategories[cat.parent_id!].push(cat);
    });

    // Sort subcategories within each parent
    Object.keys(subcategories).forEach((parentId) => {
        subcategories[parentId].sort((a, b) => a.sort_order - b.sort_order);
    });

    return {
        main_categories: mainCategories,
        subcategories,
    };
}

/**
 * Get all categories as a flat list
 */
export function getAllCategories(): Omit<Category, "id">[] {
    return [...CATEGORY_DEFINITIONS].sort(
        (a, b) => a.sort_order - b.sort_order
    );
}

/**
 * Get categories for navigation (main categories only)
 */
export function getNavigationCategories(): Omit<Category, "id">[] {
    return getMainCategories();
}

/**
 * Get categories for post creation (all categories)
 */
export function getPostCategories(): Omit<Category, "id">[] {
    return getAllCategories();
}

/**
 * Check if a category exists
 */
export function categoryExists(slug: string): boolean {
    return CATEGORY_DEFINITIONS.some((cat) => cat.slug === slug);
}

/**
 * Get category display name by slug
 */
export function getCategoryDisplayName(slug: string): string {
    const category = getCategoryBySlug(slug);
    return category?.display_name || slug;
}

/**
 * Get category color by slug
 */
export function getCategoryColor(slug: string): string {
    const category = getCategoryBySlug(slug);
    return category?.color || "#6B7280";
}

/**
 * Get category icon by slug
 */
export function getCategoryIcon(slug: string): string {
    const category = getCategoryBySlug(slug);
    return category?.icon || "folder";
}
