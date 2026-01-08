import { db } from "../src/lib/server/db";
import { sql } from "drizzle-orm";

async function checkSchema() {
    console.log("Checking posts table columns...");
    try {
        const result = await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'posts';
        `);
        console.log("Columns found:", result.map(r => r.column_name));

        const hasAuthorId = result.some(r => r.column_name === 'author_id');
        const hasTrending = result.some(r => r.column_name === 'is_trending_news');

        console.log(`Has author_id: ${hasAuthorId}`);
        console.log(`Has is_trending_news: ${hasTrending}`);

    } catch (e) {
        console.error("Error checking schema:", e);
    }
    process.exit(0);
}

checkSchema();
