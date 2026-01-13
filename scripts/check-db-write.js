
import postgres from 'postgres';
import 'dotenv/config';

async function testDbWrite() {
    console.log("Testing Database Write Access...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is missing.");
        return;
    }

    const sql = postgres(process.env.DATABASE_URL);

    try {
        // Try to update a harmless field or create a temp entry
        // We'll just update the 'last_seen' of the first admin found, or just select 1
        console.log("Attempting SELECT 1...");
        const res = await sql`SELECT 1 as val`;
        console.log("Read Success:", res);

        console.log("Attempting a dummy update (if admin exists)...");
        // We won't actually change anything meaningful, just setting updated_at to now
        const updateRes = await sql`
            UPDATE admin 
            SET updated_at = NOW() 
            WHERE id = (SELECT id FROM admin LIMIT 1)
            RETURNING id, username
        `;

        if (updateRes.length > 0) {
            console.log("Write Success. Updated admin:", updateRes[0]);
        } else {
            console.log("Write executed but no rows updated (maybe no admin found).");
        }

        console.log("VERDICT: DATABASE IS WORKING.");

    } catch (err) {
        console.error("DATABASE ERROR:", err);
        console.log("VERDICT: DATABASE IS BLOCKED/FAILING.");
    } finally {
        await sql.end();
    }
}

testDbWrite();
