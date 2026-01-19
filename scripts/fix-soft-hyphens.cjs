const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { posts } = require('../src/lib/server/schema.ts');
require('dotenv').config();

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

async function checkAndFix() {
    try {
        console.log('Checking for soft hyphens...\n');

        // Get all posts
        const result = await client`SELECT post_id, title, content FROM posts`;

        let foundCount = 0;
        let fixedCount = 0;

        for (const post of result) {
            // Check for soft hyphens
            if (post.content.includes('\u00AD') || post.content.includes('&shy;')) {
                foundCount++;
                console.log(`✗ Found in: "${post.title}"`);

                // Remove soft hyphens
                const cleanContent = post.content
                    .replace(/\u00AD/g, '')
                    .replace(/&shy;/g, '');

                // Update the post
                await client`
                    UPDATE posts 
                    SET content = ${cleanContent}
                    WHERE post_id = ${post.post_id}
                `;

                fixedCount++;
                console.log(`  ✓ Fixed\n`);
            }
        }

        console.log(`\nResults:`);
        console.log(`Total posts: ${result.length}`);
        console.log(`Posts with soft hyphens: ${foundCount}`);
        console.log(`Posts fixed: ${fixedCount}`);

        if (fixedCount > 0) {
            console.log(`\n✓ Done! Hard refresh your browser (Ctrl+Shift+R) to see changes.`);
        } else {
            console.log(`\n✓ No soft hyphens found.`);
            console.log(`Try a hard refresh: Ctrl+Shift+R`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkAndFix();
