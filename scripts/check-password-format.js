import "dotenv/config";
import postgres from "postgres";

async function checkPasswordFormat() {
    console.log("Checking password format...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL, { max: 1 });

    try {
        // Fetch one user's password (excluding the one I just reset)
        const [user] = await sql`
            SELECT username, password 
            FROM admin 
            WHERE username != 'admin' 
            LIMIT 1
        `;

        if (user) {
            console.log(`User: ${user.username}`);
            console.log(`Password Sample: ${user.password.substring(0, 10)}...`);
            console.log(`Password Length: ${user.password.length}`);

            if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
                console.log("Looks like a BFS/Bcrypt hash.");
            } else {
                console.log("Doesn't look like a standard Bcrypt hash.");
            }
        } else {
            console.log("No other admin users found.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Query failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

checkPasswordFormat();
