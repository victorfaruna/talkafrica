import 'dotenv/config';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = postgres(process.env.DATABASE_URL, {
    idle_timeout: 6000,
    connect_timeout: 10000
});

async function main() {
    console.log('Attempting to fix database schema manually...');

    try {
        console.log('Adding is_trending_news column...');
        await sql`
            ALTER TABLE "posts" 
            ADD COLUMN IF NOT EXISTS "is_trending_news" boolean DEFAULT false NOT NULL
        `;
        console.log('Successfully added is_trending_news column.');

        console.log('Adding deleted column...');
        await sql`
            ALTER TABLE "posts" 
            ADD COLUMN IF NOT EXISTS "deleted" boolean DEFAULT false NOT NULL
        `;
        console.log('Successfully added deleted column.');

    } catch (error) {
        console.error('Error fixing schema:', error);
    } finally {
        await sql.end();
        console.log('Connection closed.');
    }
}

main();
