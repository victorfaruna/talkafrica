import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
}

const sql = postgres(connectionString);

async function addEditorColumn() {
    try {
        console.log('Checking if editor column already exists...');
        const existing = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'posts' AND column_name = 'editor'
        `;
        if (existing.length > 0) {
            console.log('✅ Editor column already exists! No migration needed.');
        } else {
            console.log('Adding editor column to posts table...');
            await sql`ALTER TABLE posts ADD COLUMN editor varchar(255)`;
            console.log('✅ Editor column added successfully!');
        }
    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await sql.end();
    }
}

addEditorColumn();
