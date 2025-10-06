import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { postTable } from "$lib/server/schema";

export const load: PageServerLoad = async ({ params }) => {
    const { post_id } = params;
    const [post] = await db
        .select()
        .from(postTable)
        .where(eq(postTable.post_id, post_id));

    if (!post || post.status !== "published") {
        return {
            status: 404,
            error: new Error("Post not found"),
        } as any;
    }

    return { post };
};
