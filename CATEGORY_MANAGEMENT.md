# Category Management System

This document describes the centralized category management system implemented for the TalkAfrica webapp.

## Overview

The category management system provides a single source of truth for all categories and subcategories used throughout the application. This ensures consistency across:

- Post upload forms
- Category pages
- Header navigation
- Footer links
- Database storage

## Architecture

### 1. Centralized Category Definitions (`src/lib/categories.ts`)

The main category definitions are stored in `src/lib/categories.ts` with the following structure:

```typescript
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
```

### 2. Database Schema (`src/lib/server/schema.ts`)

The database schema includes:

- `categoriesTable`: Stores category definitions
- `postTable`: Updated to reference categories via `category_id`

### 3. API Endpoints (`src/routes/api/categories/+server.ts`)

RESTful API for category management:

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories` - Update category
- `DELETE /api/categories` - Delete category

## Category Structure

The system supports hierarchical categories with the following main sections:

### News

- Latest News
- Politics
- Economy
- Health
- Technology

### Culture

- Arts
- African History
- Animated Folktales
- Historical Sites
- Fun Facts About Africa

### Sports

- Sports
- Basketball
- Athletics
- Tennis
- Olympics

### Entertainment

- Music
- Celebrity Gossip
- Travel
- Lifestyle

## Usage

### In Components

```typescript
import {
    getMainCategories,
    getSubcategories,
    getCategoryDisplayName,
    getCategoryHierarchy,
} from "$lib/categories";

// Get main categories for navigation
const mainCategories = getMainCategories();

// Get subcategories for a specific parent
const subcategories = getSubcategories("news");

// Get display name for a category slug
const displayName = getCategoryDisplayName("politics");

// Get hierarchical structure
const { main_categories, subcategories } = getCategoryHierarchy();
```

### In Forms

```typescript
import { getPostCategories } from "$lib/categories";

const categories = getPostCategories();
```

## Database Setup

### 1. Run Database Migration

The schema changes need to be applied to your database. Run your database migration tool to create the `categories` table.

### 2. Seed Categories

```bash
# Run the seeding script
npx tsx src/lib/seed-categories.ts
```

## Benefits

1. **Consistency**: Single source of truth for all category data
2. **Maintainability**: Easy to add, remove, or modify categories
3. **Type Safety**: Full TypeScript support
4. **Flexibility**: Supports hierarchical categories with unlimited nesting
5. **Performance**: Centralized definitions reduce database queries
6. **Scalability**: Easy to extend with new features like icons, colors, etc.

## Adding New Categories

To add a new category:

1. Add the category definition to `CATEGORY_DEFINITIONS` in `src/lib/categories.ts`
2. Run the seeding script to update the database
3. The category will automatically appear in all components

Example:

```typescript
{
    name: 'business',
    slug: 'business',
    display_name: 'Business',
    description: 'Business news and analysis',
    parent_id: 'news', // Optional: makes it a subcategory
    icon: 'briefcase',
    color: '#10B981',
    sort_order: 5,
    is_active: true,
}
```

## Migration from Old System

The system is designed to be backward compatible. Existing posts will continue to work, but new posts should use the new category system.

### Steps to Migrate:

1. Update your database schema
2. Run the category seeding script
3. Update existing posts to use the new category system (optional)
4. Test all components to ensure they work correctly

## API Usage

### Get All Categories

```javascript
const response = await fetch("/api/categories");
const data = await response.json();
console.log(data.categories);
```

### Create New Category

```javascript
const response = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: "science",
        slug: "science",
        display_name: "Science",
        description: "Scientific news and discoveries",
        icon: "flask",
        color: "#8B5CF6",
        sort_order: 6,
        is_active: true,
    }),
});
```

### Update Category

```javascript
const response = await fetch("/api/categories", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        category_id: "uuid-here",
        display_name: "Updated Name",
        color: "#FF0000",
    }),
});
```

## Troubleshooting

### Common Issues

1. **Categories not appearing**: Ensure the seeding script has been run
2. **Type errors**: Make sure all imports are correct
3. **Database errors**: Check that the schema has been applied correctly

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=categories
```

## Future Enhancements

Potential improvements to the category system:

1. **Category Images**: Support for category-specific images
2. **Category SEO**: Meta descriptions and keywords
3. **Category Analytics**: Track category performance
4. **Dynamic Ordering**: Admin interface for reordering categories
5. **Category Templates**: Predefined category sets for different content types
6. **Multi-language Support**: Categories in multiple languages
7. **Category Permissions**: Role-based category access
8. **Category Archiving**: Soft delete with archive functionality

## Support

For issues or questions about the category management system, please refer to the main project documentation or create an issue in the project repository.
