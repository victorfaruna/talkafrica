import { db } from '../src/lib/server/db.ts';
import { posts } from '../src/lib/server/schema.ts';

async function checkSoftHyphens() {
    try {
        console.log('Checking for soft hyphens in article content...\n');

        const allPosts = await db.select({
            post_id: posts.post_id,
            title: posts.title,
            content: posts.content
        }).from(posts);

        let totalWithHyphens = 0;

        for (const post of allPosts) {
            // Check for soft hyphens (Unicode character U+00AD or HTML entity &shy;)
            const hasSoftHyphen = post.content.includes('\u00AD');
            const hasShyEntity = post.content.includes('&shy;');

            if (hasSoftHyphen || hasShyEntity) {
                totalWithHyphens++;
                const shyCount = (post.content.match(/\u00AD/g) || []).length;
                const entityCount = (post.content.match(/&shy;/g) || []).length;

                console.log(`✗ "${post.title}"`);
                console.log(`  Post ID: ${post.post_id}`);
                console.log(`  Soft hyphens (\\u00AD): ${shyCount}`);
                console.log(`  HTML entities (&shy;): ${entityCount}`);
                console.log('');
            }
        }

        console.log(`\nSummary:`);
        console.log(`Total posts checked: ${allPosts.length}`);
        console.log(`Posts with soft hyphens: ${totalWithHyphens}`);

        if (totalWithHyphens > 0) {
            console.log(`\n⚠️  Soft hyphens found! Run 'node scripts/remove-soft-hyphens.js' to fix.`);
        } else {
            console.log(`\n✓ No soft hyphens found. The issue might be browser cache.`);
            console.log(`  Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)`);
        }

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
}

checkSoftHyphens();
