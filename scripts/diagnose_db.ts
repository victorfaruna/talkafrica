
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sessionsTable, postTable } from '../src/lib/server/schema';
import { count } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function diagnose() {
    console.log("Starting DB Diagnosis...");
    console.log(`Using DB URL: ${connectionString.replace(/:[^:]+@/, ':***@')}`); // Mask password

    try {
        console.log("Checking Posts table...");
        const posts = await db.select({ count: count() }).from(postTable);
        console.log("Posts count:", posts[0].count);

        console.log("Checking Sessions table...");
        const sessions = await db.select({ count: count() }).from(sessionsTable);
        console.log("Sessions count:", sessions[0].count);

        console.log("DB Diagnosis Complete. Everything looks fine.");
    } catch (error) {
        console.error("DB Diagnosis Failed:", error);
    }
    process.exit(0);
}

diagnose();
