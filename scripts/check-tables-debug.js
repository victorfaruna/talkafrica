
import postgres from 'postgres';
import 'dotenv/config';

async function listTables() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is missing.");
        return;
    }

    const sql = postgres(process.env.DATABASE_URL);

    try {
        console.log("Connected to DB. Listing tables...");
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `;

        if (tables.length === 0) {
            console.log("No tables found in public schema.");
        } else {
            console.log("Tables found:");
            tables.forEach(t => console.log(` - ${t.table_name}`));
        }
    } catch (err) {
        console.error("Error listing tables:", err);
    } finally {
        await sql.end();
    }
}

listTables();
