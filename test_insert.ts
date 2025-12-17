import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/server/schema';

async function testInsert() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined');
        return;
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema });

    console.log('Attempting to insert post...');

    try {
        const [created] = await db.insert(schema.postTable).values({
            title: 'Test Post Direct',
            content: 'Content',
            excerpt: 'Excerpt',
            status: 'draft',
            featured: false,
            author: 'Admin'
        }).returning();

        console.log('Insert successful:', created);
    } catch (error) {
        console.error('Insert failed:', error);
    } finally {
        await client.end();
    }
}

testInsert();
