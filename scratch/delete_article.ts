import dotenv from "dotenv";
import postgres from "postgres";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
    console.log("Cloudinary configured successfully.");
} else {
    console.warn("Cloudinary env vars missing!");
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL is not defined in environment");
    process.exit(1);
}

const sql = postgres(connectionString);

function getCloudinaryPublicId(url: string): string | null {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
        // Example: https://res.cloudinary.com/dwy462zvh/image/upload/v1738760086/talkafrica/y6sly8iynohryi5t8qef.png
        // Extract: talkafrica/y6sly8iynohryi5t8qef
        const uploadIndex = url.indexOf("/upload/");
        if (uploadIndex === -1) return null;
        let pathAfterUpload = url.substring(uploadIndex + "/upload/".length);
        // Remove version string like v1738760086/
        if (pathAfterUpload.match(/^v\d+\//)) {
            pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");
        }
        // Remove file extension
        const dotIndex = pathAfterUpload.lastIndexOf(".");
        if (dotIndex !== -1) {
            pathAfterUpload = pathAfterUpload.substring(0, dotIndex);
        }
        return pathAfterUpload;
    } catch (e) {
        console.error("Error parsing Cloudinary URL:", url, e);
        return null;
    }
}

async function deleteArticle() {
    const postId = "1ffe16d3-7e82-4156-904e-b61df01958a9";
    console.log(`\n=== DELETING ARTICLE: ${postId} ===\n`);

    try {
        const posts = await sql`SELECT * FROM posts WHERE post_id = ${postId}`;
        if (posts.length === 0) {
            console.log("Post not found in database.");
            return;
        }

        const post = posts[0];
        console.log(`Target Article Title: "${post.title}"`);

        // Collect all image URLs
        const imageUrls: string[] = [];
        if (post.image) {
            imageUrls.push(post.image);
        }

        // Find images in content
        if (post.content) {
            const imgRegex = /(https?:\/\/[^\s"'>]+\.(?:png|jpg|jpeg|gif|webp|svg))/gi;
            let match;
            while ((match = imgRegex.exec(post.content)) !== null) {
                if (!imageUrls.includes(match[1])) {
                    imageUrls.push(match[1]);
                }
            }
        }

        console.log("Found Image URLs to clean up:", imageUrls);

        // Delete images from Cloudinary
        for (const url of imageUrls) {
            const publicId = getCloudinaryPublicId(url);
            if (publicId) {
                console.log(`Deleting Cloudinary image with public ID: ${publicId}`);
                try {
                    const result = await cloudinary.uploader.destroy(publicId);
                    console.log(`Cloudinary destroy result for ${publicId}:`, result);
                } catch (cErr) {
                    console.error(`Failed to delete Cloudinary image ${publicId}:`, cErr);
                }
            } else {
                console.log(`URL is not a Cloudinary image or public ID couldn't be parsed: ${url}`);
            }
        }

        // Delete from post_categories
        const deletedCats = await sql`DELETE FROM post_categories WHERE post_id = ${postId} RETURNING *`;
        console.log(`Deleted ${deletedCats.length} record(s) from post_categories.`);

        // Delete from comments
        const deletedComments = await sql`DELETE FROM comments WHERE post_id = ${postId} RETURNING *`;
        console.log(`Deleted ${deletedComments.length} comment(s) from comments.`);

        // Delete from posts table
        const deletedPost = await sql`DELETE FROM posts WHERE post_id = ${postId} RETURNING *`;
        console.log(`Deleted ${deletedPost.length} post record(s) from database.`);

        console.log("\n=== DELETION COMPLETE ===");

        // Double check
        const verifyPost = await sql`SELECT * FROM posts WHERE post_id = ${postId}`;
        console.log("Verification search (should be empty):", verifyPost);

    } catch (err) {
        console.error("Error during deletion execution:", err);
    } finally {
        await sql.end();
    }
}

deleteArticle();
