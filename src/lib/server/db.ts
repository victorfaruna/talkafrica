import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { DATABASE_URL } from "$env/static/private";
import postgres from "postgres";

if (!DATABASE_URL) {
    throw new Error(
        "DATABASE_URL environment variable is not set. Please create a .env file with your database connection string."
    );
}

// const client = postgres(DATABASE_URL, { ssl: 'require', port: 5432 });
const client = postgres(DATABASE_URL, {
    idle_timeout: 6000,
    prepare: false
});
export const db = drizzle(client, { schema });
