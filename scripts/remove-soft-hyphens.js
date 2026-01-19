import { db } from '../src/lib/server/db.ts';
import { posts } from '../src/lib/server/schema.ts';
import { eq } from 'drizzle-orm';

async function removeSoftHyphens() {
    try {
        console.log('Removing soft hyphens from all articles...\n');

        const allPosts = await db.select().from(posts);

        let updatedCount = 0;

        for (const post of allPosts) {
            // Check if content has soft hyphens
            const hasSoftHyphen = post.content.includes('\u00AD') || post.content.includes('&shy;');

            if (hasSoftHyphen) {
                // Remove both Unicode soft hyphens and HTML entities
                const cleanedContent = post.content
                    .replace(/\u00AD/g, '')  // Remove Unicode soft hyphens
                    .replace(/&shy;/g, '');   // Remove HTML entity soft hyphens

                // Update the post
                await db.update(posts)
                    .set({ content: cleanedContent })
                    .where(eq(posts.post_id, post.post_id));

                const beforeCount = (post.content.match(/\u00AD|&shy;/g) || []).length;
                console.log(`✓ Updated: "${post.title}"`);
                console.log(`  Removed ${beforeCount} soft hyphens\n`);

                updatedCount++;
            }
        }

        console.log(`\nSummary:`);
        console.log(`Total posts checked: ${allPosts.length}`);
        console.log(`Posts updated: ${updatedCount}`);

        if (updatedCount > 0) {
            console.log(`\n✓ Done! Refresh your browser to see the changes.`);
            console.log(`  Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)`);
        } else {
            console.log(`\n✓ No soft hyphens found to remove.`);
        }

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

removeSoftHyphens();
