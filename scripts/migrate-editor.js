
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function run() {
    console.log('Checking for editor column...');
    const existing = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'editor'
    `;
    if (existing.length > 0) {
        console.log('Editor column already exists!');
    } else {
        await sql`ALTER TABLE posts ADD COLUMN editor varchar(255)`;
        console.log('Editor column added!');
    }
    await sql.end();
}

run().catch(e => { console.error(e); process.exit(1); });
