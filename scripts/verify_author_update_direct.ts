import 'dotenv/config';
import postgres from 'postgres';

async function verifyDynamicAuthor() {
    console.log("Starting verification...");

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL not found");
        process.exit(1);
    }
    const sql = postgres(dbUrl);

    try {
        // 1. Get an admin and their posts
        const [admin] = await sql`SELECT admin_id, username FROM admin LIMIT 1`;
        if (!admin) {
            console.error("No admin found!");
            process.exit(1);
        }
        console.log(`Testing with admin: ${admin.username} (${admin.admin_id})`);

        // 2. Change their username temporarily
        const originalUsername = admin.username;
        const tempUsername = "TestUpdatedUser_" + Date.now();
        console.log(`Changing username to: ${tempUsername}`);

        await sql`UPDATE admin SET username = ${tempUsername} WHERE admin_id = ${admin.admin_id}`;

        // 3. Verify DB state (app logic simulation)
        // Check if we can fetch a post authored by this admin and see the NEW username
        // We simulate the JOIN query used in the app
        const posts = await sql`
            SELECT p.title, COALESCE(a.username, p.author) as display_author
            FROM posts p
            LEFT JOIN admin a ON p.author_id = a.admin_id
            WHERE p.author_id = ${admin.admin_id}
            LIMIT 1
        `;

        if (posts.length > 0) {
            console.log(`Post: "${posts[0].title}", Display Author: "${posts[0].display_author}"`);
            if (posts[0].display_author === tempUsername) {
                console.log("SUCCESS: Dynamic author update verified!");
            } else {
                console.log("FAILURE: Display author does not match new username.");
            }
        } else {
            console.log("No posts found for this admin to verify.");
        }

        // 4. Revert
        console.log(`Reverting username to: ${originalUsername}`);
        await sql`UPDATE admin SET username = ${originalUsername} WHERE admin_id = ${admin.admin_id}`;

    } catch (error) {
        console.error("Error during verification:", error);
    } finally {
        await sql.end();
    }
    process.exit(0);
}

verifyDynamicAuthor();
