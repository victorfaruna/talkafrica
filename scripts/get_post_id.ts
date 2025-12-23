import { db } from "../src/lib/server/db";
import { postTable } from "../src/lib/server/schema";
import { eq } from "drizzle-orm";

async function getPost() {
    const post = await db.query.postTable.findFirst({
        where: eq(postTable.status, "published")
    });
    console.log("Valid Post ID:", post?.post_id);
}

getPost();
