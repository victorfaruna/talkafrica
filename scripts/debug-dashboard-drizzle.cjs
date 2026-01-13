
require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { pgTable, serial, integer, date, timestamp } = require('drizzle-orm/pg-core');
const { eq, sql } = require('drizzle-orm');

// Schema definition for reproduction
const dailyStatsTable = pgTable("daily_stats", {
    id: serial("id").primaryKey(),
    date: date("date").notNull().unique(),
    views: integer("views").notNull().default(0),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Setup DB - same config as app (without prepare: false now)
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function run() {
    console.log("Running Drizzle Dashboard Query Test...");
    try {
        console.log("Testing daily stats query...");

        // Exact query from +page.server.ts
        const [dailyStats] = await db.select({ views: dailyStatsTable.views })
            .from(dailyStatsTable)
            .where(eq(dailyStatsTable.date, sql`CURRENT_DATE`));

        console.log("Daily Stats Result:", dailyStats);

        console.log("Query SUCCESS!");
    } catch (err) {
        console.error("Query FAILED with error:");
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
