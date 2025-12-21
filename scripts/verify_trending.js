
import postgres from 'postgres';
import 'dotenv/config';

async function verify() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 1 });

    try {
        console.log("Creating test trending post...");
        const title = "Verification Test Post " + Date.now();
        // Insert a post with is_trending_news = true
        // Note: Using raw SQL to verify usage
        const [post] = await sql`
            INSERT INTO posts (
                title, content, status, "is_trending_news", deleted, featured
            ) VALUES (
                ${title}, 'Test content', 'published', true, false, false
            )
            RETURNING post_id, title, "is_trending_news"
        `;

        console.log(`Created post: ${post.title} (ID: ${post.post_id})`);

        // Query for trending posts
        console.log("Querying for trending posts...");
        const trending = await sql`
            SELECT * FROM posts 
            WHERE status = 'published' 
            AND deleted = false 
            AND "is_trending_news" = true
            ORDER BY created_at DESC
            LIMIT 5
        `;

        const found = trending.find(p => p.post_id === post.post_id);

        if (found) {
            console.log("SUCCESS: Created post found in trending query!");
        } else {
            console.error("FAILURE: Created post NOT found in trending query.");
            console.log("Found posts:", trending.map(p => p.title));
        }

        // Clean up
        console.log("Cleaning up...");
        await sql`DELETE FROM posts WHERE post_id = ${post.post_id}`;
        console.log("Cleanup complete.");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await sql.end();
    }
}

verify();
