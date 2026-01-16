
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function listRecentPosts() {
    try {
        console.log('Fetching recent posts...');
        const posts = await sql`SELECT id, title FROM posts ORDER BY created_at DESC LIMIT 10`;
        posts.forEach(p => console.log(`${p.id}: ${p.title}`));
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
listRecentPosts();
