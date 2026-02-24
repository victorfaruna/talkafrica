import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function listTopViews() {
    try {
        console.log('Fetching top 5 views...');
        const posts = await sql`SELECT post_id, title, views FROM post ORDER BY views DESC LIMIT 5`;
        posts.forEach(p => console.log(`${p.post_id} | ${p.views} views | ${p.title}`));
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
listTopViews();
