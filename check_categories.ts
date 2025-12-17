import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/server/schema';

async function checkCategories() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined');
        return;
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema });

    try {
        const categories = await db.select().from(schema.categoriesTable);
        console.log('Categories count:', categories.length);
        if (categories.length > 0) {
            console.log('First 5 categories:', categories.slice(0, 5));
        } else {
            console.log('Categories table is EMPTY!');
        }
    } catch (error) {
        console.error('Query failed:', error);
    } finally {
        await client.end();
    }
}

checkCategories();
