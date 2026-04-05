
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function checkTechPush() {
    try {
        console.log('--- Recent Tech Category Posts ---');
        const techPosts = await sql`
            SELECT post_id, title, status, created_at 
            FROM posts 
            WHERE category = 'tech' 
            ORDER BY created_at DESC 
            LIMIT 10
        `;
        console.log('ID | Status | Created At | Title');
        console.log('---|--------|------------|-------');
        techPosts.forEach(p => {
            console.log(`${p.post_id} | ${p.status} | ${p.created_at} | ${p.title}`);
        });

        console.log('\n--- Overall Latest 5 Posts ---');
        const latestPosts = await sql`
            SELECT post_id, title, category, status, created_at 
            FROM posts 
            ORDER BY created_at DESC 
            LIMIT 5
        `;
        latestPosts.forEach(p => {
            console.log(`${p.post_id} | ${p.category} | ${p.status} | ${p.created_at} | ${p.title}`);
        });
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await sql.end();
    }
}
checkTechPush();
