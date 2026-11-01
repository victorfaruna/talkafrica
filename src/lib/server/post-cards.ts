import { sql } from 'drizzle-orm';
import { postTable, adminTable } from './schema';

export const publicPostCardFields = {
    post_id: postTable.post_id,
    title: postTable.title,
    excerpt: postTable.excerpt,
    image: postTable.image,
    category: postTable.category,
    author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
    views: postTable.views,
    created_at: postTable.created_at,
};
