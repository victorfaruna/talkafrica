import { db } from "../src/lib/server/db";
import { postTable, adminTable } from "../src/lib/server/schema";
import { eq, isNull } from "drizzle-orm";

async function backfillAuthors() {
    console.log("Starting backfill of author_id...");

    try {
        // 1. Fetch all admins
        const admins = await db.select().from(adminTable);
        console.log(`Found ${admins.length} admins.`);

        // 2. For each admin, update posts where author matches username
        for (const admin of admins) {
            console.log(`Processing admin: ${admin.username} (${admin.admin_id})`);

            const result = await db
                .update(postTable)
                .set({ author_id: admin.admin_id })
                .where(eq(postTable.author, admin.username))
                .returning({ id: postTable.title });

            console.log(`Updated ${result.length} posts for ${admin.username}.`);
        }

        // 3. Fallback: If author doesn't match a username, maybe try "Admin" -> first admin?
        // Let's see how many posts are still null
        const orphanPosts = await db
            .select({ id: postTable.id, title: postTable.title, author: postTable.author })
            .from(postTable)
            .where(isNull(postTable.author_id));

        console.log(`Found ${orphanPosts.length} posts still without author_id.`);
        if (orphanPosts.length > 0) {
            console.log("Orphan posts:", orphanPosts.map(p => `${p.title} (${p.author})`));
        }

    } catch (error) {
        console.error("Error during backfill:", error);
    }

    console.log("Backfill complete.");
    process.exit(0);
}

backfillAuthors();
