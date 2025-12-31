import { db } from './src/lib/server/db.js';
import { postTable } from './src/lib/server/schema.js';
import { eq } from 'drizzle-orm';

async function checkImageURLs() {
    try {
        const posts = await db
            .select({
                post_id: postTable.post_id,
                title: postTable.title,
                image: postTable.image,
                featured: postTable.featured
            })
            .from(postTable)
            .where(eq(postTable.status, 'published'))
            .limit(5);

        console.log('\n=== Image URLs in Database ===\n');
        posts.forEach(post => {
            console.log(`Title: ${post.title}`);
            console.log(`Image URL: ${post.image}`);
            console.log(`Featured: ${post.featured}`);
            console.log('---\n');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkImageURLs();
