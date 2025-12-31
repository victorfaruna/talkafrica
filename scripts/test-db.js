import "dotenv/config";
import postgres from "postgres";

async function testConnection() {
    console.log("Testing database connection...");
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    try {
        const sql = postgres(process.env.DATABASE_URL, { max: 1 });
        const result = await sql`SELECT 1 as result`;
        console.log("Connection successful:", result);
        await sql.end();
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

testConnection();
