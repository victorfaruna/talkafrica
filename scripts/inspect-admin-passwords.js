import "dotenv/config";
import postgres from "postgres";

async function inspectAdmins() {
    console.log("Inspecting admin passwords...");

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL, { max: 1 });

    try {
        const admins = await sql`SELECT username, email, password FROM admin`;

        if (admins.length === 0) {
            console.log("No admin users found.");
        } else {
            console.log("Admin users found:");
            admins.forEach(a => {
                let pwdDisplay = "NULL";
                if (a.password) {
                    if (a.password === "supabase-auth-user") {
                        pwdDisplay = "[supabase-auth-user]";
                    } else if (a.password.startsWith("$")) {
                        pwdDisplay = `[HASHED] ${a.password.substring(0, 10)}...`;
                    } else {
                        pwdDisplay = `[PLAINTEXT] ${a.password.substring(0, 5)}...`;
                    }
                }
                console.log(`User: ${a.username}, Email: ${a.email}, Pwd: ${pwdDisplay}`);
            });
        }
        process.exit(0);
    } catch (error) {
        console.error("Query failed:", error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

inspectAdmins();
