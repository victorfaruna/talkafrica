
import { db } from "../src/lib/server/db";
import { postTable, postCategoriesTable, adminTable } from "../src/lib/server/schema";
import { eq, and, desc, sql } from "drizzle-orm";

async function testAfricanGiantQuery() {
    console.log("Starting African Giant query test...");

    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false)
        );

        const africanGiantPosts = await db
            .select({
                id: postTable.id,
                title: postTable.title,
                category_slug: postCategoriesTable.category_slug
            })
            .from(postTable)
            .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
            .innerJoin(
                postCategoriesTable,
                eq(postTable.post_id, postCategoriesTable.post_id)
            )
            .where(
                and(
                    baseWhere,
                    eq(postCategoriesTable.category_slug, "african-giant")
                )
            )
            .orderBy(desc(postTable.created_at))
            .limit(1);

        console.log("Query success!");
        console.log("Result:", africanGiantPosts);
    } catch (error) {
        console.error("Query FAILED:");
        console.error(error);
    }
    process.exit(0);
}

testAfricanGiantQuery();
