import 'dotenv/config';
import postgres from 'postgres';

async function fixSchema() {
    console.log("Adding author_id column to posts table...");

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL not found in env");
        process.exit(1);
    }

    const sql = postgres(dbUrl);

    try {
        // Check if column exists again just to be safe
        const result = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'posts' AND column_name = 'author_id';
        `;

        if (result.length > 0) {
            console.log("Column author_id already exists.");
        } else {
            console.log("Column missing. Adding...");
            await sql`ALTER TABLE posts ADD COLUMN author_id UUID;`;
            console.log("Column author_id added successfully.");
        }
    } catch (e) {
        console.error("Error modifying schema:", e);
    } finally {
        await sql.end();
    }
    process.exit(0);
}

fixSchema();
