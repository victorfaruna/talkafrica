CREATE TABLE "post_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" uuid NOT NULL,
	"category_slug" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "category" varchar(128);--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "category_id";