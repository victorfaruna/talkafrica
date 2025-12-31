import "dotenv/config";
import postgres from "postgres";

async function checkColumns() {
    console.log("Checking posts table columns...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL, { max: 1 });

    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'posts'
        `;

        console.log("Columns found:", columns.map(c => `${c.column_name} (${c.data_type})`));
        process.exit(0);
    } catch (error) {
        console.error("Query failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

checkColumns();
