import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/server/schema';
import { CATEGORY_DEFINITIONS } from './src/lib/categories';

async function seedCategories() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined');
        return;
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema });

    try {
        console.log("🌱 Starting category seeding...");

        // Clear existing categories
        await db.delete(schema.categoriesTable);
        console.log("🗑️  Cleared existing categories");

        const slugToId = new Map<string, string>();

        // 1. Insert main categories (no parent_id)
        const mainCategories = CATEGORY_DEFINITIONS.filter(c => !c.parent_id);

        for (const category of mainCategories) {
            const [inserted] = await db.insert(schema.categoriesTable).values({
                name: category.name,
                slug: category.slug,
                display_name: category.display_name,
                description: category.description,
                parent_id: null,
                icon: category.icon,
                color: category.color,
                sort_order: category.sort_order,
                is_active: category.is_active,
            }).returning({ category_id: schema.categoriesTable.category_id });

            slugToId.set(category.slug, inserted.category_id);
            console.log(`Inserted main category: ${category.slug} -> ${inserted.category_id}`);
        }

        // 2. Insert subcategories
        const subCategories = CATEGORY_DEFINITIONS.filter(c => c.parent_id);

        for (const category of subCategories) {
            const parentUuid = slugToId.get(category.parent_id!);
            if (!parentUuid) {
                console.warn(`⚠️ Parent category '${category.parent_id}' not found for '${category.slug}'. Skipping.`);
                continue;
            }

            await db.insert(schema.categoriesTable).values({
                name: category.name,
                slug: category.slug,
                display_name: category.display_name,
                description: category.description,
                parent_id: parentUuid,
                icon: category.icon,
                color: category.color,
                sort_order: category.sort_order,
                is_active: category.is_active,
            });
            console.log(`Inserted subcategory: ${category.slug}`);
        }

        console.log(
            `✅ Successfully seeded categories`
        );
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
    } finally {
        await client.end();
    }
}

seedCategories();
