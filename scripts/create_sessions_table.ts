
import 'dotenv/config';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) { console.error("No DATABASE_URL"); process.exit(1); }

const sql = postgres(connectionString);

async function main() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS "sessions" (
                "id" serial PRIMARY KEY,
                "session_id" varchar(255) NOT NULL UNIQUE,
                "last_seen" timestamp DEFAULT now() NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL
            );
        `;
        console.log("Sessions table ready.");
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
main();
