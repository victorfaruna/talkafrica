import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq, and, or, ne, desc, asc, lt, gt, inArray, exists, sql } from "drizzle-orm";
import { postTable, postCategoriesTable, adminTable } from "$lib/server/schema";
import { postPath, slugifyPostTitle } from "$lib/post-url";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const cardFields = {
    post_id: postTable.post_id,
    title: postTable.title,
    excerpt: postTable.excerpt,
    image: postTable.image,
    category: postTable.category,
    author: sql<string>`coalesce(${adminTable.name}, ${postTable.author})`,
    created_at: postTable.created_at,
};

const cards = () => db.select(cardFields)
    .from(postTable)
    .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id));

const inMappedCategory = (slugs: string[]) => exists(
    db.select({ one: sql`1` })
        .from(postCategoriesTable)
        .where(and(
            eq(postCategoriesTable.post_id, postTable.post_id),
            inArray(postCategoriesTable.category_slug, slugs),
        )),
);

export const load: PageServerLoad = async ({ params }) => {
    try {
        const identifier = params.post_id;
        const isLegacyId = UUID_PATTERN.test(identifier);
        let resolvedPostId = identifier;
        const published = and(eq(postTable.status, "published"), eq(postTable.deleted, false));

        if (!isLegacyId) {
            const candidates = await db.select({ post_id: postTable.post_id, title: postTable.title })
                .from(postTable)
                .where(published)
                .orderBy(desc(postTable.created_at));
            const match = candidates.find(
                (candidate) => slugifyPostTitle(candidate.title) === identifier.toLowerCase(),
            );
            if (!match) throw error(404, "Post not found");
            resolvedPostId = match.post_id;
        }

        // Independent reads share a round trip instead of waiting on each other.
        const [postResults, categoryResults] = await Promise.all([
            db.select({
                ...cardFields,
                content: postTable.content,
                status: postTable.status,
                featured: postTable.featured,
                isTrendingNews: postTable.isTrendingNews,
                deleted: postTable.deleted,
                views: postTable.views,
                author_id: postTable.author_id,
                editor: postTable.editor,
                updated_at: postTable.updated_at,
            })
                .from(postTable)
                .leftJoin(adminTable, eq(postTable.author_id, adminTable.admin_id))
                .where(and(eq(postTable.post_id, resolvedPostId), published))
                .limit(1),
            db.select({ category_slug: postCategoriesTable.category_slug })
                .from(postCategoriesTable)
                .where(eq(postCategoriesTable.post_id, resolvedPostId))
                .catch(() => []),
        ]);

        const post = postResults[0];
        if (!post) throw error(404, "Post not found");
        if (isLegacyId) throw redirect(301, postPath(post));

        const categorySlugs = [...new Set(categoryResults.map((category) => category.category_slug))];
        if (post.category && !categorySlugs.includes(post.category)) categorySlugs.push(post.category);

        const otherPublished = and(published, ne(postTable.post_id, post.post_id));
        const relatedCategory = or(
            categorySlugs.length ? inMappedCategory(categorySlugs) : undefined,
            post.category ? eq(postTable.category, post.category) : undefined,
        ) ?? sql`false`;
        const tableCategory = inMappedCategory(["africans-on-the-table"]);
        const legacyTableCategory = eq(postTable.category, "africans-on-the-table");
        const giantCategory = inMappedCategory(["african-giant"]);

        // All bounded sidebar/navigation reads run together. EXISTS filters in
        // SQL, avoiding full category ID lists and subsequent fallback queries.
        const [related, previous, next, latestPosts, oldest, spotlight] = await Promise.all([
            cards().where(and(otherPublished, relatedCategory))
                .orderBy(desc(postTable.created_at)).limit(3),
            db.select({ post_id: postTable.post_id, title: postTable.title })
                .from(postTable)
                .where(and(otherPublished, lt(postTable.created_at, post.created_at)))
                .orderBy(desc(postTable.created_at)).limit(1).catch(() => []),
            db.select({ post_id: postTable.post_id, title: postTable.title })
                .from(postTable)
                .where(and(otherPublished, gt(postTable.created_at, post.created_at)))
                .orderBy(asc(postTable.created_at)).limit(1).catch(() => []),
            cards().where(otherPublished)
                .orderBy(desc(postTable.created_at)).limit(10),
            db.select({ post_id: postTable.post_id, title: postTable.title })
                .from(postTable).where(otherPublished)
                .orderBy(asc(postTable.created_at)).limit(1).catch(() => []),
            cards().where(and(otherPublished, or(tableCategory, legacyTableCategory, giantCategory)))
                .orderBy(
                    sql`case when ${tableCategory} then 0 when ${legacyTableCategory} then 1 else 2 end`,
                    desc(postTable.created_at),
                ).limit(1).catch(() => []),
        ]);

        let prevPost = previous[0] || null;
        let nextPost = next[0] || null;
        if (!nextPost && oldest[0] && oldest[0].post_id !== prevPost?.post_id) nextPost = oldest[0];
        const newest = latestPosts[0];
        if (!prevPost && newest && newest.post_id !== nextPost?.post_id) {
            prevPost = { post_id: newest.post_id, title: newest.title };
        }

        return {
            post: { ...post, categories: categorySlugs },
            relatedPosts: related.length ? related : latestPosts.slice(0, 3),
            prevPost,
            nextPost,
            latestPosts,
            africansOnTablePost: spotlight[0] || null,
        };
    } catch (err) {
        console.error("Error loading post:", err);
        if (err && typeof err === "object" && "status" in err) throw err;
        throw error(500, "Failed to load post");
    }
};
