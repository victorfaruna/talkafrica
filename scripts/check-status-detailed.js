
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function listRecentTechPosts() {
    try {
        console.log('Fetching recent posts (including tech category)...');
        const posts = await sql`SELECT post_id, title, category, status, created_at FROM posts ORDER BY created_at DESC LIMIT 15`;
        console.log('ID | Category | Status | Created At | Title');
        console.log('---|----------|--------|------------|-------');
        posts.forEach(p => {
            console.log(`${p.post_id} | ${p.category} | ${p.status} | ${p.created_at} | ${p.title}`);
        });
    } catch (e) {
        console.error('Error fetching posts:', e);
    } finally {
        await sql.end();
    }
}
listRecentTechPosts();
