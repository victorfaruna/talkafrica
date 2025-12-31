import "dotenv/config";
import postgres from "postgres";
import fs from "fs";
import path from "path";

async function migrate() {
    console.log("Starting manual migration...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL, { max: 1 });
    const migrationFile = path.join(process.cwd(), "drizzle", "0003_lethal_dazzler.sql");

    try {
        const content = fs.readFileSync(migrationFile, "utf-8");
        const statements = content.split("--> statement-breakpoint");

        for (const statement of statements) {
            const query = statement.trim();
            if (query) {
                console.log("Executing:", query.substring(0, 50) + "...");
                try {
                    await sql.unsafe(query);
                    console.log("Success");
                } catch (e) {
                    if (e.code === '42P07') { // duplicate_table
                        console.log("Table already exists, skipping...");
                    } else {
                        throw e; // rethrow other errors
                    }
                }
            }
        }

        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

migrate();
