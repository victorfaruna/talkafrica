// Quick diagnostic to check African Giant posts
import { db } from '../src/lib/server/db.ts';
import { postTable, postCategoriesTable } from '../src/lib/server/schema.ts';
import { eq } from 'drizzle-orm';

console.log('=== Checking African Giant Posts ===\n');

// Check post_categories table
const categories = await db
    .select()
    .from(postCategoriesTable)
    .where(eq(postCategoriesTable.category_slug, 'african-giant'));

console.log(`Found ${categories.length} posts in post_categories with african-giant slug:`);
categories.forEach(cat => console.log(`  - Post ID: ${cat.post_id}`));

// Check postTable for legacy category field
const legacyPosts = await db
    .select({ post_id: postTable.post_id, category: postTable.category, title: postTable.title })
    .from(postTable)
    .where(eq(postTable.category, 'african-giant'));

console.log(`\nFound ${legacyPosts.length} posts in postTable with african-giant category:`);
legacyPosts.forEach(post => console.log(`  - ${post.post_id}: ${post.title}`));

// Check if there are posts with similar categories
const allCategories = await db
    .selectDistinct({ category: postTable.category })
    .from(postTable);

console.log('\nAll unique categories in postTable:');
allCategories.forEach(c => console.log(`  - "${c.category}"`));

process.exit(0);
