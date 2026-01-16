
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function checkNbsp() {
    try {
        const posts = await sql`
            SELECT id, title 
            FROM posts 
            WHERE content LIKE '%&nbsp;%'
        `;

        console.log(`Found ${posts.length} posts with "&nbsp;" entity.`);
        if (posts.length > 0) {
            console.log('Sample affected posts:');
            posts.slice(0, 5).forEach(p => console.log(`- ${p.title} (ID: ${p.id})`));
        }

        const postsUnicode = await sql`
            SELECT id, title 
            FROM posts 
            WHERE content LIKE '%\u00A0%'
        `;
        console.log(`Found ${postsUnicode.length} posts with \\u00A0 (NBSP char).`);

    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
checkNbsp();
