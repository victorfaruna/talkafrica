
import postgres from 'postgres';
import 'dotenv/config';

async function testVideos() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is missing.");
        return;
    }

    const sql = postgres(process.env.DATABASE_URL);

    try {
        console.log("1. Testing standard select: SELECT * FROM videos LIMIT 1");
        const res1 = await sql`SELECT * FROM videos LIMIT 1`;
        console.log("Standard select success! Rows:", res1.length);
        if (res1.length > 0) console.log("Sample:", res1[0]);

    } catch (err) {
        console.error("Standard select FAILED:", err.message);
    }

    // Test known columns if * fails or to be sure
    try {
        console.log("\n2. Testing explicit column select: SELECT video_id, title FROM videos LIMIT 1");
        const res2 = await sql`SELECT video_id, title FROM videos LIMIT 1`;
        console.log("Explicit select success! Rows:", res2.length);
    } catch (err) {
        console.error("Explicit select FAILED:", err.message);
    }

    await sql.end();
}

testVideos();
