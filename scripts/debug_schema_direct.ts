import 'dotenv/config';
import postgres from 'postgres';

async function checkSchema() {
    console.log("Checking posts table columns...");

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL not found in env");
        process.exit(1);
    }

    const sql = postgres(dbUrl);

    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'posts';
        `;
        console.log("Columns found:", result.map(r => r.column_name));

        const hasAuthorId = result.some(r => r.column_name === 'author_id');
        const hasTrending = result.some(r => r.column_name === 'is_trending_news');

        console.log(`Has author_id: ${hasAuthorId}`);
        console.log(`Has is_trending_news: ${hasTrending}`);

    } catch (e) {
        console.error("Error checking schema:", e);
    } finally {
        await sql.end();
    }
    process.exit(0);
}

checkSchema();
