import postgres from "postgres";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
}

const sql = postgres(process.env.DATABASE_URL, {
    connect_timeout: 15,
    idle_timeout: 5,
    max: 1,
});

try {
    await sql.begin(async (tx) => {
        await tx`ALTER TABLE "admin" ADD COLUMN IF NOT EXISTS "role" varchar(32) DEFAULT 'admin' NOT NULL`;
        await tx`ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "author_id" uuid`;
        await tx`CREATE TABLE IF NOT EXISTS "post_daily_stats" (
            "id" serial PRIMARY KEY NOT NULL,
            "post_id" uuid NOT NULL,
            "date" date NOT NULL,
            "views" integer DEFAULT 0 NOT NULL
        )`;
        await tx`CREATE UNIQUE INDEX IF NOT EXISTS "post_daily_stats_post_date_unique" ON "post_daily_stats" ("post_id", "date")`;
        await tx`ALTER TABLE "employee_of_the_month" ADD COLUMN IF NOT EXISTS "selected_admin_id" uuid`;
        await tx`ALTER TABLE "employee_of_the_month" ADD COLUMN IF NOT EXISTS "selected_by" uuid`;
        await tx`ALTER TABLE "employee_of_the_month" ADD COLUMN IF NOT EXISTS "selected_at" timestamp`;
        await tx`UPDATE "videos" v SET "author_id" = a."admin_id" FROM "admin" a WHERE v."author_id" IS NULL AND lower(v."author") = lower(a."name")`;
        await tx`UPDATE "posts" p SET "author_id" = a."admin_id" FROM "admin" a WHERE p."author_id" IS NULL AND lower(p."author") = lower(a."name")`;
        await tx`UPDATE "admin" SET "role" = 'admin'`;
        await tx`UPDATE "admin" SET "role" = 'super_admin' WHERE lower("email") IN ('admin@talkafrica.ng', 'koredemartins37@gmail.com')`;
    });

    const accounts = await sql`
        SELECT email, role
        FROM "admin"
        WHERE lower(email) IN ('admin@talkafrica.ng', 'koredemartins37@gmail.com')
        ORDER BY email
    `;
    const superAdminCount = await sql`SELECT count(*)::int AS count FROM "admin" WHERE role = 'super_admin'`;
    console.log(JSON.stringify({ accounts, totalSuperAdmins: superAdminCount[0].count }, null, 2));
} finally {
    await sql.end({ timeout: 5 });
}
