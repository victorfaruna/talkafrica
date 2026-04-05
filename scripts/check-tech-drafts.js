
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function checkTechDrafts() {
    try {
        console.log('--- Recent Tech Drafts ---');
        const techDrafts = await sql`
            SELECT post_id, title, status, created_at 
            FROM posts 
            WHERE category = 'tech' 
            ORDER BY created_at DESC 
            LIMIT 10
        `;
        if (techDrafts.length === 0) {
            console.log('No tech posts found.');
        } else {
            console.log('ID | Status | Created At | Title');
            console.log('---|--------|------------|-------');
            techDrafts.forEach(p => {
                console.log(`${p.post_id} | ${p.status} | ${p.created_at} | ${p.title}`);
            });
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await sql.end();
    }
}
checkTechDrafts();
