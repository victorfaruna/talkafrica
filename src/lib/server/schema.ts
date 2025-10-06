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

export const postTable = pgTable("posts", {
    id: serial("id").primaryKey(),
    post_id: uuid("post_id")
        .default(sql`gen_random_uuid()`)
        .unique()
        .notNull(),
    title: varchar({ length: 255 }).notNull(),
    content: text("content").notNull(),
    excerpt: varchar({ length: 512 }),
    category: varchar({ length: 128 }),
    image: varchar({ length: 512 }),
    status: varchar({ length: 32 }).notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    views: integer("views").notNull().default(0),
    author: varchar({ length: 255 }).notNull().default("Admin"),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});
