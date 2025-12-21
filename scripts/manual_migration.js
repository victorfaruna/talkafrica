
import postgres from 'postgres';
import 'dotenv/config';

async function migrate() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found");
        process.exit(1);
    }

    console.log("Connecting to database...");
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 1 });

    try {
        console.log("Adding is_trending_news column...");
        await sql`
            ALTER TABLE posts 
            ADD COLUMN IF NOT EXISTS "is_trending_news" boolean DEFAULT false NOT NULL;
        `;
        console.log("Migration successful!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await sql.end();
    }
}

migrate();
