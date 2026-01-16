
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function findPostContent() {
    try {
        const posts = await sql`
            SELECT content 
            FROM posts 
            WHERE id = 89
        `;

        if (posts.length > 0) {
            console.log('--- HTML CONTENT START ---');
            const content = posts[0].content;
            for (let i = 0; i < content.length; i += 1000) {
                console.log(content.substring(i, i + 1000));
            }
            console.log('--- HTML CONTENT END ---');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
findPostContent();
