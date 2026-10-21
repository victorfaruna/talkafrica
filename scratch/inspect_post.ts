import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL is not defined in environment");
    process.exit(1);
}

const sql = postgres(connectionString);

async function inspectPost() {
    const postId = "1ffe16d3-7e82-4156-904e-b61df01958a9";
    console.log(`Inspecting post_id: ${postId}`);

    try {
        const posts = await sql`
            SELECT * FROM posts WHERE post_id = ${postId} OR post_id::text LIKE ${'1ffe16d3%'}
        `;

        if (posts.length === 0) {
            console.log("No post found with that ID directly. Searching all posts for partial match...");
            const allPosts = await sql`SELECT post_id, title, image, created_at FROM posts WHERE post_id::text LIKE ${'%1ffe16d3%'}`;
            console.log("Matches:", allPosts);
            return;
        }

        const post = posts[0];
        console.log("=== POST FOUND ===");
        console.log("ID:", post.id);
        console.log("post_id:", post.post_id);
        console.log("Title:", post.title);
        console.log("Featured Image:", post.image);
        console.log("Status:", post.status);
        console.log("Deleted:", post.deleted);
        console.log("Created At:", post.created_at);
        console.log("Content length:", post.content ? post.content.length : 0);
        console.log("Content snippet:", post.content ? post.content.substring(0, 300) : "");

        // Find all image URLs in content
        const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
        const matches = [];
        let match;
        if (post.content) {
            while ((match = imgRegex.exec(post.content)) !== null) {
                matches.push(match[1]);
            }
        }
        console.log("Images in content:", matches);

        // Check comments
        const comments = await sql`SELECT * FROM comments WHERE post_id = ${post.post_id}`;
        console.log(`Comments found: ${comments.length}`);

        // Check post_categories
        const postCats = await sql`SELECT * FROM post_categories WHERE post_id = ${post.post_id}`;
        console.log(`Post categories found: ${postCats.length}`);

    } catch (err) {
        console.error("Error inspecting post:", err);
    } finally {
        await sql.end();
    }
}

inspectPost();
