
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = postgres(connectionString);

async function checkLatestPost() {
    try {
        const posts = await sql`
            SELECT title, content, created_at 
            FROM posts 
            ORDER BY created_at DESC 
            LIMIT 1
        `;

        if (posts.length > 0) {
            const p = posts[0];
            console.log('--- Latest Post ---');
            console.log('Title:', p.title);
            console.log('Content Snippet (first 500 chars):');
            console.log(p.content.substring(0, 500));
            console.log('\n--- End of Snippet ---');
        } else {
            console.log('No posts found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}

checkLatestPost();
