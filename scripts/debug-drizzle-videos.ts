
import { drizzle } from "drizzle-orm/postgres-js";
import { videosTable } from "../src/lib/server/schema"; // Relative path from scripts/
import { desc } from "drizzle-orm";
import postgres from "postgres";
import "dotenv/config";

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("No DATABASE_URL found in .env");
        process.exit(1);
    }

    console.log("Initializing Drizzle with Postgres-JS...");

    // Mimic the exact config from db.ts
    const client = postgres(connectionString, {
        prepare: false,
    });

    const db = drizzle(client);

    console.log("Running Drizzle Query: select().from(videosTable).limit(5)...");
    try {
        const result = await db
            .select()
            .from(videosTable)
            .orderBy(desc(videosTable.created_at))
            .limit(5);

        console.log("Query SUCCESS!");
        console.log("Rows returned:", result.length);
        if (result.length > 0) {
            console.log("Sample Row:", result[0]);
        }
    } catch (e: any) {
        console.error("Query FAILED!");
        console.error("Error Message:", e.message);
        console.error("Full Error:", e);
    }

    await client.end();
}

main();
