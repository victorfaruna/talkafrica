import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { DATABASE_URL } from "$env/static/private";
import postgres from "postgres";

if (!DATABASE_URL) {
    throw new Error(
        "DATABASE_URL environment variable is not set. Please create a .env file with your database connection string."
    );
}

// Enhanced connection configuration optimized for remote Supabase database
const client = postgres(DATABASE_URL, {
    // Connection pool settings
    max: 10, // Maximum number of connections in the pool
    idle_timeout: 30, // Close idle connections after 30 seconds
    max_lifetime: 60 * 30, // Max connection lifetime: 30 minutes
    connect_timeout: 30, // Increased to 30 seconds for remote connection

    // Prevent prepared statement caching issues
    prepare: false,

    // Handle connection errors gracefully
    onnotice: () => { }, // Suppress notices

    // Transform undefined to null (common issue)
    transform: {
        undefined: null
    }
});

export const db = drizzle(client, { schema });
