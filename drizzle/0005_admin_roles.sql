ALTER TABLE "admin" ADD COLUMN IF NOT EXISTS "role" varchar(32) DEFAULT 'admin' NOT NULL;
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "author_id" uuid;
CREATE TABLE IF NOT EXISTS "post_daily_stats" (
    "id" serial PRIMARY KEY NOT NULL,
    "post_id" uuid NOT NULL,
    "date" date NOT NULL,
    "views" integer DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "post_daily_stats_post_date_unique" ON "post_daily_stats" ("post_id", "date");
ALTER TABLE "employee_of_the_month" ADD COLUMN IF NOT EXISTS "selected_admin_id" uuid;
ALTER TABLE "employee_of_the_month" ADD COLUMN IF NOT EXISTS "selected_by" uuid;
ALTER TABLE "employee_of_the_month" ADD COLUMN IF NOT EXISTS "selected_at" timestamp;
UPDATE "videos" v SET "author_id" = a."admin_id" FROM "admin" a WHERE v."author_id" IS NULL AND lower(v."author") = lower(a."name");
UPDATE "posts" p SET "author_id" = a."admin_id" FROM "admin" a WHERE p."author_id" IS NULL AND lower(p."author") = lower(a."name");

-- Keep the role assignment exact: these two accounts are super admins and
-- every other administrator remains a regular admin.
UPDATE "admin" SET "role" = 'admin';
UPDATE "admin" SET "role" = 'super_admin'
WHERE lower("email") IN ('admin@talkafrica.ng', 'koredemartins37@gmail.com');
