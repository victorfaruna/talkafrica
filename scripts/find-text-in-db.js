
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function findPost() {
    try {
        const posts = await sql`
            SELECT id, title, content 
            FROM posts 
            WHERE content ILIKE '%Africans on the Table is a focused initiative%'
        `;

        if (posts.length > 0) {
            console.log('Found in DB! Post ID:', posts[0].id);
            console.log('--- Content Start ---');
            console.log(posts[0].content.substring(0, 500));
            console.log('--- Content End ---');
        } else {
            console.log('Not found in DB posts.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
findPost();
