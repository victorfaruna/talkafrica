
require('dotenv').config();
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("No DATABASE_URL found in .env");
    process.exit(1);
}

const sql = postgres(connectionString);

async function fixDailyStats() {
    console.log("Checking daily_stats table...");

    try {
        // 1. Check if table exists
        const [result] = await sql`
            SELECT to_regclass('public.daily_stats') as exists;
        `;

        if (!result || !result.exists) {
            console.log("Table 'daily_stats' is MISSING. Creating it...");
            await sql`
                CREATE TABLE IF NOT EXISTS daily_stats (
                    id SERIAL PRIMARY KEY,
                    date DATE NOT NULL UNIQUE,
                    views INTEGER NOT NULL DEFAULT 0,
                    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            `;
            console.log("Table 'daily_stats' created successfully.");
        } else {
            console.log("Table 'daily_stats' already exists.");
        }

        // 2. Test the query causing issues
        console.log("Testing query with CURRENT_DATE...");
        const dailyStats = await sql`
            SELECT views FROM daily_stats WHERE date = CURRENT_DATE
        `;
        console.log("Query success! Result:", dailyStats);

    } catch (err) {
        console.error("Error fixing/testing daily_stats:", err);
    } finally {
        await sql.end();
    }
}

fixDailyStats();
