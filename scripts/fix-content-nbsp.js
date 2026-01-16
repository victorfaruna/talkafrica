
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

async function fixContent() {
    try {
        console.log('Starting content fix...');

        // 1. Replace &nbsp; entity
        const result1 = await sql`
            UPDATE posts 
            SET content = REPLACE(content, '&nbsp;', ' ')
            WHERE content LIKE '%&nbsp;%'
        `;
        console.log(`Updated ${result1.count} posts (replaced &nbsp; entity).`);

        // 2. Replace Unicode NBSP (\u00A0)
        // Note: In Postgres literal string, we might need to be careful.
        // JS strings passed to postgres template should handle unicode correctly.
        const result2 = await sql`
            UPDATE posts 
            SET content = REPLACE(content, '\u00A0', ' ')
            WHERE content LIKE '%\u00A0%'
        `;
        console.log(`Updated ${result2.count} posts (replaced Unicode NBSP).`);

        console.log('Done.');
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}
fixContent();
