CREATE TABLE "movie_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
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
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movie_reviews_review_id_unique" UNIQUE("review_id"),
	CONSTRAINT "movie_reviews_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "daily_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_stats_date_unique" UNIQUE("date")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "is_trending_news" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author_id" uuid;
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "editor" varchar(255);
