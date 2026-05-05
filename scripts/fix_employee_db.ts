import "dotenv/config";
import postgres from "postgres";

async function fix() {
    const sql = postgres(process.env.DATABASE_URL as string);
    console.log("Adding columns to employee_of_the_month...");
    try {
        await sql`
            ALTER TABLE employee_of_the_month 
            ADD COLUMN IF NOT EXISTS impact_quote TEXT,
            ADD COLUMN IF NOT EXISTS contribution TEXT;
        `;
        console.log("Columns added successfully!");
    } catch (error) {
        console.error("Failed to add columns:", error);
    }
    await sql.end();
}

fix();
