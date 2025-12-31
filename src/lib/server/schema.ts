import { sql } from "drizzle-orm";
import {
    boolean,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const adminTable = pgTable("admin", {
    id: serial("id").primaryKey(),
    admin_id: uuid("admin_id")
        .default(sql`gen_random_uuid()`)
        .unique()
        .notNull(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    username: varchar({ length: 255 }).unique().notNull(),
    password: varchar({ length: 255 }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    user_id: uuid("user_id")
        .default(sql`gen_random_uuid()`)
        .unique()
        .notNull(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    username: varchar({ length: 255 }).unique().notNull(),
    role: varchar({ length: 50 }).notNull().default("user"),
    status: varchar({ length: 32 }).notNull().default("active"),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

export const commentsTable = pgTable("comments", {
    id: serial("id").primaryKey(),
    comment_id: uuid("comment_id")
        .default(sql`gen_random_uuid()`)
        .unique()
        .notNull(),
    post_id: uuid("post_id").notNull(),
    user_id: uuid("user_id").notNull(),
    content: text("content").notNull(),
    status: varchar({ length: 32 }).notNull().default("approved"),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

// Categories table for hierarchical category management
export const categoriesTable = pgTable("categories", {
    id: serial("id").primaryKey(),
    category_id: uuid("category_id")
        .default(sql`gen_random_uuid()`)
        .unique()
        .notNull(),
    name: varchar({ length: 128 }).notNull(),
    slug: varchar({ length: 128 }).notNull().unique(),
    display_name: varchar({ length: 128 }).notNull(),
    description: text("description"),
    parent_id: uuid("parent_id"), // For subcategories
    icon: varchar({ length: 128 }), // Icon class or path
    color: varchar({ length: 7 }), // Hex color code
    sort_order: integer("sort_order").notNull().default(0),
    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

export const postTable = pgTable("posts", {
    id: serial("id").primaryKey(),
    post_id: uuid("post_id")
        .default(sql`gen_random_uuid()`)
        .unique()
        .notNull(),
    title: varchar({ length: 255 }).notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    category: varchar({ length: 128 }), // Kept for backward compatibility, nullable
    image: varchar({ length: 512 }),
    status: varchar({ length: 32 }).notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    isTrendingNews: boolean("is_trending_news").notNull().default(false),
    deleted: boolean("deleted").notNull().default(false),
    views: integer("views").notNull().default(0),
    author: varchar({ length: 255 }).notNull().default("Admin"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});


// Junction table for many-to-many relationship between posts and categories
export const postCategoriesTable = pgTable("post_categories", {
    id: serial("id").primaryKey(),
    post_id: uuid("post_id").notNull(),
    category_slug: varchar({ length: 128 }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
    id: serial("id").primaryKey(),
    session_id: varchar({ length: 255 }).notNull().unique(),
    last_seen: timestamp("last_seen").notNull().defaultNow(),
    created_at: timestamp("created_at").notNull().defaultNow(),
});

export const videosTable = pgTable("videos", {
    id: serial("id").primaryKey(),
    video_id: uuid("video_id")
        .default(sql`gen_random_uuid()`)
        .unique()
        .notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text("description"),
    video_url: varchar({ length: 512 }).notNull(),
    thumbnail_url: varchar({ length: 512 }).notNull(),
    category: varchar({ length: 128 }).notNull(),
    author: varchar({ length: 255 }).notNull().default("Admin"),
    views: integer("views").notNull().default(0),
    duration: varchar({ length: 32 }), // e.g. "5:23"
    is_featured: boolean("is_featured").notNull().default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});
