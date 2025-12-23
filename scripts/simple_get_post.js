import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("No DATABASE_URL");
    process.exit(1);
}
const sql = postgres(connectionString);

async function main() {
    const posts = await sql`SELECT post_id FROM posts WHERE status = 'published' AND deleted = false LIMIT 1`;
    console.log("Post ID:", posts[0]?.post_id);
    process.exit(0);
}

main();
