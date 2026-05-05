import "dotenv/config";
import postgres from "postgres";

async function createTable() {
    const sql = postgres(process.env.DATABASE_URL as string);
    console.log("Creating table...");
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS employee_of_the_month (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                photo_url VARCHAR(512) NOT NULL,
                bio TEXT NOT NULL,
                email VARCHAR(255),
                social_links TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `;
        console.log("Table created successfully!");
    } catch (error) {
        console.error("Failed to create table:", error);
    }
    await sql.end();
}

createTable();
