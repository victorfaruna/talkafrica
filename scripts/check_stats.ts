import { db } from "../src/lib/server/db";
import { usersTable, postTable } from "../src/lib/server/schema";
import { count, sum } from "drizzle-orm";

async function checkStats() {
    try {
        const userCount = await db.select({ count: count() }).from(usersTable);
        const viewCount = await db.select({ totalViews: sum(postTable.views) }).from(postTable);
        const postCount = await db.select({ count: count() }).from(postTable);

        console.log("DB User Count:", userCount);
        console.log("DB View Count:", viewCount);
        console.log("DB Post Count:", postCount);
    } catch (e) {
        console.error(e);
    }
}

checkStats();
