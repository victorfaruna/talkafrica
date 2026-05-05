import "dotenv/config";
import postgres from "postgres";

async function fix() {
    const sql = postgres(process.env.DATABASE_URL as string);
    console.log("Updating columns in employee_of_the_month...");
    try {
        await sql`
            ALTER TABLE employee_of_the_month 
            DROP COLUMN IF EXISTS social_links,
            ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
            ADD COLUMN IF NOT EXISTS twitter_url TEXT,
            ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
        `;
        console.log("Columns updated successfully!");
    } catch (error) {
        console.error("Failed to update columns:", error);
    }
    await sql.end();
}

fix();
