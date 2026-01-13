
require('dotenv').config();
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("No DATABASE_URL found in .env");
    process.exit(1);
}

const sql = postgres(connectionString);

async function checkAllTables() {
    console.log("Checking other potential missing tables...");

    try {
        // 1. Check/Create sessions table
        const [sessionsExists] = await sql`SELECT to_regclass('public.sessions') as exists;`;
        if (!sessionsExists || !sessionsExists.exists) {
            console.log("Table 'sessions' is MISSING. Creating it...");
            await sql`
                CREATE TABLE IF NOT EXISTS sessions (
                    id SERIAL PRIMARY KEY,
                    session_id VARCHAR(255) NOT NULL UNIQUE,
                    last_seen TIMESTAMP NOT NULL DEFAULT NOW(),
                    created_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            `;
            console.log("Table 'sessions' created.");
        } else {
            console.log("Table 'sessions' exists.");
        }

        // 2. Check/Create comments table
        const [commentsExists] = await sql`SELECT to_regclass('public.comments') as exists;`;
        if (!commentsExists || !commentsExists.exists) {
            console.log("Table 'comments' is MISSING. Creating it...");
            await sql`
                CREATE TABLE IF NOT EXISTS comments (
                    id SERIAL PRIMARY KEY,
                    comment_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
                    post_id UUID NOT NULL,
                    user_id UUID NOT NULL,
                    content TEXT NOT NULL,
                    status VARCHAR(32) NOT NULL DEFAULT 'approved',
                    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
                );
            `;
            console.log("Table 'comments' created.");
        } else {
            console.log("Table 'comments' exists.");
        }

    } catch (err) {
        console.error("Error creating tables:", err);
    } finally {
        await sql.end();
    }
}

checkAllTables();
