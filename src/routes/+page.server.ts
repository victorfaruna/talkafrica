import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { desc, eq } from "drizzle-orm";
import { postTable } from "$lib/server/schema";

export const load: PageServerLoad = async () => {
    const published = await db
        .select()
        .from(postTable)
        .where(eq(postTable.status, "published"))
        .orderBy(desc(postTable.created_at));

    const featured = published.filter((p) => p.featured);

    return {
        posts: published,
        featuredPosts: featured,
        latestPosts: published.slice(0, 6),
    };
};
