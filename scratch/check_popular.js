import 'dotenv/config';
import postgres from 'postgres';

async function main() {
    const url = process.env.DATABASE_URL.replace('aws-1-', 'aws-0-');
    const sql = postgres(url, { max: 1 });
    const topPosts = await sql`
        SELECT post_id, title, views, created_at, status, deleted 
        FROM posts 
        WHERE status = 'published' AND deleted = false
        ORDER BY views DESC 
        LIMIT 10
    `;
    console.log('Top posts by views:');
    console.table(topPosts);

    const recentPosts = await sql`
        SELECT post_id, title, views, created_at, status, deleted 
        FROM posts 
        WHERE status = 'published' AND deleted = false
        ORDER BY created_at DESC 
        LIMIT 10
    `;
    console.log('Recent published posts:');
    console.table(recentPosts);

    await sql.end();
}

main().catch(console.error);
