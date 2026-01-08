import 'dotenv/config';
import postgres from 'postgres';

async function backfillAuthors() {
    console.log("Starting backfill of author_id...");

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL not found in env");
        process.exit(1);
    }
    const sql = postgres(dbUrl);

    try {
        // 1. Fetch all admins
        const admins = await sql`SELECT admin_id, username FROM admin`;
        console.log(`Found ${admins.length} admins.`);

        // 2. For each admin, update posts where author matches username
        for (const admin of admins) {
            console.log(`Processing admin: ${admin.username} (${admin.admin_id})`);

            // Note: Postgres.js returns array of rows.
            const result = await sql`
                UPDATE posts 
                SET author_id = ${admin.admin_id} 
                WHERE author = ${admin.username}
                RETURNING title
            `;

            console.log(`Updated ${result.length} posts for ${admin.username}.`);
        }

    } catch (error) {
        console.error("Error during backfill:", error);
    } finally {
        await sql.end();
    }

    console.log("Backfill complete.");
    process.exit(0);
}

backfillAuthors();
