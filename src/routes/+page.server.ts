import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { desc, eq, and } from "drizzle-orm";
import { postTable } from "$lib/server/schema";

export const load: PageServerLoad = async () => {
    const published = await db
        .select()
        .from(postTable)
        .where(
            and(eq(postTable.status, "published"), eq(postTable.deleted, false))
        )
        .orderBy(desc(postTable.created_at));

    const featured = published.filter((p) => p.featured);

    return {
        posts: published,
        featuredPosts: featured,
        latestPosts: published.slice(0, 6),
    };
};
