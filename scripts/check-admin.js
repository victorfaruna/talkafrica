import "dotenv/config";
import postgres from "postgres";

async function checkAdmin() {
    console.log("Checking admin table...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL, { max: 1 });

    try {
        const admins = await sql`SELECT * FROM admin`;

        if (admins.length === 0) {
            console.log("No admin users found.");
        } else {
            console.log("Admin users found:", admins.map(a => ({
                username: a.username,
                // Don't log full password, just existence
                hasPassword: !!a.password
            })));
        }
        process.exit(0);
    } catch (error) {
        console.error("Query failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

checkAdmin();
