import 'dotenv/config';
import postgres from 'postgres';

async function applyFix() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined');
        return;
    }

    const sql = postgres(connectionString);

    try {
        console.log('Creating categories table...');
        await sql`
            CREATE TABLE IF NOT EXISTS "categories" (
                "id" serial PRIMARY KEY NOT NULL,
                "category_id" uuid DEFAULT gen_random_uuid() NOT NULL,
                "name" varchar(128) NOT NULL,
                "slug" varchar(128) NOT NULL,
                "display_name" varchar(128) NOT NULL,
                "description" text,
                "parent_id" uuid,
                "icon" varchar(128),
                "color" varchar(7),
                "sort_order" integer DEFAULT 0 NOT NULL,
                "is_active" boolean DEFAULT true NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL,
                CONSTRAINT "categories_category_id_unique" UNIQUE("category_id"),
                CONSTRAINT "categories_slug_unique" UNIQUE("slug")
            );
        `;

        console.log('Creating post_categories table...');
        await sql`
            CREATE TABLE IF NOT EXISTS "post_categories" (
                "id" serial PRIMARY KEY NOT NULL,
                "post_id" uuid NOT NULL,
                "category_slug" varchar(128) NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL
            );
        `;

        console.log('Updating posts table...');
        // Check if category column exists
        const [catCol] = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='posts' AND column_name='category'
        `;
        if (!catCol) {
            await sql`ALTER TABLE "posts" ADD COLUMN "category" varchar(128)`;
        }

        // Check if category_id column exists
        const [catIdCol] = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='posts' AND column_name='category_id'
        `;
        if (catIdCol) {
            await sql`ALTER TABLE "posts" DROP COLUMN "category_id"`;
        }

        console.log('Database fix applied successfully!');
    } catch (error) {
        console.error('Error applying fix:', error);
    } finally {
        await sql.end();
    }
}

applyFix();
