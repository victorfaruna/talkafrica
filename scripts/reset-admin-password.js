
import postgres from 'postgres';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

async function resetPassword() {

    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is missing.");
        return;
    }

    const username = process.argv[2] || "admin";
    const password = process.argv[3] || "admin"; // Default password

    console.log(`Resetting password for user: ${username}`);

    const sql = postgres(process.env.DATABASE_URL);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Find user first
        const users = await sql`SELECT * FROM admin WHERE username = ${username}`;

        if (users.length === 0) {
            console.log(`User '${username}' not found. Creating...`);
            // Create user if not exists (minimal fields)
            await sql`
                INSERT INTO admin (email, username, password, name, admin_id)
                VALUES (${username + '@example.com'}, ${username}, ${hashedPassword}, 'Admin User', gen_random_uuid())
            `;
            console.log("User created.");
        } else {
            // Update existing
            await sql`
                UPDATE admin
                SET password = ${hashedPassword}, updated_at = NOW()
                WHERE username = ${username}
            `;
            console.log("Password updated.");
        }

        console.log(`SUCCESS: Password for '${username}' set to '${password}'`);

    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await sql.end();
    }
}

resetPassword();
