import "dotenv/config";
import postgres from "postgres";

async function checkTables() {
    console.log("Checking database tables...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL, { max: 1 });

    try {
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

        console.log("Tables found:", tables.map(t => t.table_name));
        process.exit(0);
    } catch (error) {
        console.error("Query failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

checkTables();
