
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

async function check() {
    console.log("Checking most recent post...");
    const posts = await sql`SELECT title, author, status FROM posts ORDER BY created_at DESC LIMIT 1`;

    if (posts.length > 0) {
        console.log("✅ LATEST POST FOUND:");
        console.log(`Title:  ${posts[0].title}`);
        console.log(`Author: ${posts[0].author}`);
        console.log(`Status: ${posts[0].status}`);

        if (posts[0].author === 'Ajayi Korede') {
            console.log("\nMATCH CONFIRMED: Author is exactly 'Ajayi Korede'");
        } else {
            console.log("\nMISMATCH: Author is NOT 'Ajayi Korede'");
        }
    } else {
        console.log("No posts found.");
    }
    await sql.end();
}

check();
