
require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { pgTable, serial, text, varchar, boolean, integer, timestamp, uuid } = require('drizzle-orm/pg-core');
const { eq, and, desc, sql } = require('drizzle-orm');

// Minimal schema definition for reproduction
const adminTable = pgTable("admin", {
    id: serial("id").primaryKey(),
    admin_id: uuid("admin_id").default(sql`gen_random_uuid()`).unique().notNull(),
    username: varchar({ length: 255 }).unique().notNull(),
});

const postTable = pgTable("posts", {
    id: serial("id").primaryKey(),
    post_id: uuid("post_id").default(sql`gen_random_uuid()`).unique().notNull(),
    title: varchar({ length: 255 }).notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    category: varchar({ length: 128 }),
    image: varchar({ length: 512 }),
    status: varchar({ length: 32 }).notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    isTrendingNews: boolean("is_trending_news").notNull().default(false),
    deleted: boolean("deleted").notNull().default(false),
    views: integer("views").notNull().default(0),
    author: varchar({ length: 255 }).notNull().default("Admin"),
    author_id: uuid("author_id"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});

const postCategoriesTable = pgTable("post_categories", {
    id: serial("id").primaryKey(),
    post_id: uuid("post_id").notNull(),
    category_slug: varchar({ length: 128 }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
});

// Setup DB
const client = postgres(process.env.DATABASE_URL, { prepare: false });
const db = drizzle(client);

async function run() {
    console.log("Running Drizzle Query Test...");
    try {
        const baseWhere = and(
            eq(postTable.status, "published"),
            eq(postTable.deleted, false)
        );

        const africanGiantPosts = await db
            .select({
                id: postTable.id,
                post_id: postTable.post_id,
                title: postTable.title,
                // content: postTable.content, // Omit to keep log clean
                excerpt: postTable.excerpt,
                category: postTable.category,
                image: postTable.image,
                status: postTable.status,
                featured: postTable.featured,
                isTrendingNews: postTable.isTrendingNews,
                deleted: postTable.deleted,
                views: postTable.views,
                author: sql`coalesce(${adminTable.username}, ${postTable.author})`,
                created_at: postTable.created_at,
                updated_at: postTable.updated_at,
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

        console.log("Query SUCCESS!");
        console.log(africanGiantPosts);
    } catch (err) {
        console.error("Query FAILED with error:");
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
