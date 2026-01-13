
require('dotenv').config();
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("No DATABASE_URL found in .env");
    process.exit(1);
}

const sql = postgres(connectionString);

async function fixSchema() {
    console.log("Checking database schema...");

    try {
        // 1. Check if post_categories table exists
        const [result] = await sql`
            SELECT to_regclass('public.post_categories') as exists;
        `;

        if (!result || !result.exists) {
            console.log("Table 'post_categories' is MISSING. Creating it...");
            await sql`
                CREATE TABLE IF NOT EXISTS post_categories (
                    id SERIAL PRIMARY KEY,
                    post_id UUID NOT NULL,
                    category_slug VARCHAR(128) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            `;
            console.log("Table 'post_categories' created successfully.");
        } else {
            console.log("Table 'post_categories' already exists.");
        }

        // 2. Check if it has data?
        const count = await sql`SELECT count(*) FROM post_categories`;
        console.log(`Table 'post_categories' has ${count[0].count} rows.`);

        // 3. Check for African Giant category entry
        // We need to link posts to this category if they are not linked.
        // Identify African Giant posts from 'category' column in posts table (legacy)
        console.log("Backfilling post_categories for 'african-giant'...");

        // Find posts with category='african-giant' in posts table
        const posts = await sql`
            SELECT post_id FROM posts 
            WHERE category = 'african-giant' 
            OR category = 'African Giant'
        `;

        console.log(`Found ${posts.length} posts with legacy category 'African Giant'.`);

        for (const post of posts) {
            // Check if already in junction table
            const existing = await sql`
                SELECT id FROM post_categories 
                WHERE post_id = ${post.post_id} AND category_slug = 'african-giant'
            `;

            if (existing.length === 0) {
                console.log(`Linking post ${post.post_id} to 'african-giant'...`);
                await sql`
                    INSERT INTO post_categories (post_id, category_slug)
                    VALUES (${post.post_id}, 'african-giant')
                `;
            }
        }

        console.log("Schema fix and backfill complete.");

    } catch (err) {
        console.error("Error fixing schema:", err);
    } finally {
        await sql.end();
    }
}

fixSchema();
