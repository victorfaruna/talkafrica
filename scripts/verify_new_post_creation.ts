import 'dotenv/config';
import postgres from 'postgres';
import { randomUUID } from 'node:crypto';

async function verifyNewPostCreation() {
    console.log("Starting verification for NEW POST creation...");

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL not found");
        process.exit(1);
    }
    const sql = postgres(dbUrl);

    try {
        // 1. Get an admin
        const [admin] = await sql`SELECT admin_id, username FROM admin LIMIT 1`;
        if (!admin) {
            console.error("No admin found!");
            process.exit(1);
        }
        console.log(`Using admin: ${admin.username} (${admin.admin_id})`);

        // 2. Create a NEW post with author_id linked to this admin
        const newPostId = randomUUID();
        const postTitle = `Verification Post ${Date.now()}`;
        console.log(`Creating new post: ${postTitle}`);

        // Simulate what the API does: insert author_id and legacy author string
        await sql`
            INSERT INTO posts (
                post_id, title, content, author, author_id, status, created_at, updated_at
            ) VALUES (
                ${newPostId}, ${postTitle}, 'Content for verification', ${admin.username}, ${admin.admin_id}, 'published', NOW(), NOW()
            )
        `;

        // 3. Verify fetching logic
        console.log("Verifying fetch logic for new post...");
        const posts = await sql`
            SELECT p.title, COALESCE(a.username, p.author) as display_author
            FROM posts p
            LEFT JOIN admin a ON p.author_id = a.admin_id
            WHERE p.post_id = ${newPostId}
        `;

        if (posts.length === 0) {
            console.error("Failed to fetch the newly created post!");
        } else {
            console.log(`Fetched Post: "${posts[0].title}", Display Author: "${posts[0].display_author}"`);
            if (posts[0].display_author === admin.username) {
                console.log("SUCCESS: New post correctly linked to admin.");
            } else {
                console.error("FAILURE: New post author mismatch.");
            }
        }

        // 4. Verify DYNAMIC update
        const originalUsername = admin.username;
        const tempUsername = "DynamicUser_" + Date.now();
        console.log(`\nChanging admin username to: ${tempUsername}`);

        await sql`UPDATE admin SET username = ${tempUsername} WHERE admin_id = ${admin.admin_id}`;

        const updatedPosts = await sql`
            SELECT p.title, COALESCE(a.username, p.author) as display_author
            FROM posts p
            LEFT JOIN admin a ON p.author_id = a.admin_id
            WHERE p.post_id = ${newPostId}
        `;

        if (updatedPosts.length > 0) {
            console.log(`Fetched Post (After Update): "${updatedPosts[0].title}", Display Author: "${updatedPosts[0].display_author}"`);
            if (updatedPosts[0].display_author === tempUsername) {
                console.log("SUCCESS: Post author updated dynamically!");
            } else {
                console.error("FAILURE: Post author did NOT update dynamically.");
            }
        }

        // 5. Cleanup
        console.log("\nCleaning up...");
        await sql`DELETE FROM posts WHERE post_id = ${newPostId}`;
        await sql`UPDATE admin SET username = ${originalUsername} WHERE admin_id = ${admin.admin_id}`;
        console.log("Cleanup complete.");

    } catch (error) {
        console.error("Error during verification:", error);
    } finally {
        await sql.end();
    }
}

verifyNewPostCreation();
