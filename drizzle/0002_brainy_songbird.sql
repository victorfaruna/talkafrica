ALTER TABLE "posts" ALTER COLUMN "excerpt" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_trending_news" boolean DEFAULT false NOT NULL;