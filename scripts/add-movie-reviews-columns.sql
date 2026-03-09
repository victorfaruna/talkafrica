-- Run this in your Supabase SQL editor to add missing columns to movie_reviews table
-- These columns exist in the Drizzle schema but may be missing from the actual database

-- Create the movie_reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS "movie_reviews" (
    "id" serial PRIMARY KEY NOT NULL,
    "review_id" uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    "title" varchar(255) NOT NULL,
    "slug" varchar(255) UNIQUE NOT NULL,
    "genre" varchar(255),
    "director" varchar(255),
    "cast" text,
    "release_date" date,
    "runtime" varchar(64),
    "rating" real DEFAULT 0 NOT NULL,
    "poster_url" varchar(512) NOT NULL,
    "backdrop_url" varchar(512),
    "trailer_url" varchar(512),
    "content" text NOT NULL,
    "status" varchar(32) DEFAULT 'draft' NOT NULL,
    "is_recommended" boolean DEFAULT false NOT NULL,
    "views" integer DEFAULT 0 NOT NULL,
    "author" varchar(255) DEFAULT 'Admin' NOT NULL,
    "author_id" uuid,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- If the table already exists, add only the missing columns (run each separately if needed)
ALTER TABLE "movie_reviews" ADD COLUMN IF NOT EXISTS "is_recommended" boolean DEFAULT false NOT NULL;
ALTER TABLE "movie_reviews" ADD COLUMN IF NOT EXISTS "backdrop_url" varchar(512);
ALTER TABLE "movie_reviews" ADD COLUMN IF NOT EXISTS "trailer_url" varchar(512);
ALTER TABLE "movie_reviews" ADD COLUMN IF NOT EXISTS "views" integer DEFAULT 0 NOT NULL;
ALTER TABLE "movie_reviews" ADD COLUMN IF NOT EXISTS "author_id" uuid;
