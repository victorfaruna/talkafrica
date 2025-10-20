/**
 * Database seeding script for categories
 * This script populates the categories table with the centralized category definitions
 */

import { db } from "./server/db";
import { categoriesTable } from "./server/schema";
import { CATEGORY_DEFINITIONS } from "./categories";

export async function seedCategories() {
    try {
        console.log("🌱 Starting category seeding...");

        // Clear existing categories
        await db.delete(categoriesTable);
        console.log("🗑️  Cleared existing categories");

        // Insert new categories
        for (const category of CATEGORY_DEFINITIONS) {
            await db.insert(categoriesTable).values({
                name: category.name,
                slug: category.slug,
                display_name: category.display_name,
                description: category.description,
                parent_id: category.parent_id,
                icon: category.icon,
                color: category.color,
                sort_order: category.sort_order,
                is_active: category.is_active,
            });
        }

        console.log(
            `✅ Successfully seeded ${CATEGORY_DEFINITIONS.length} categories`
        );
        return { success: true, count: CATEGORY_DEFINITIONS.length };
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
        return { success: false, error: error.message };
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedCategories()
        .then((result) => {
            if (result.success) {
                console.log("🎉 Category seeding completed successfully!");
                process.exit(0);
            } else {
                console.error("💥 Category seeding failed:", result.error);
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error("💥 Unexpected error:", error);
            process.exit(1);
        });
}
