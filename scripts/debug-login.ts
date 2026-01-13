import { drizzle } from "drizzle-orm/postgres-js";
import { adminTable } from "../src/lib/server/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import 'dotenv/config';

// Mock DB setup locally
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL missing");

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function testLogin(credential, password) {
    console.log(`Testing login for: ${credential} with password: ${password}`);

    try {
        const adminData = await db.select().from(adminTable).where(
            or(
                eq(adminTable.username, credential),
                eq(adminTable.email, credential)
            )
        ).limit(1).then(rows => rows[0]);

        if (!adminData) {
            console.error("❌ User not found in DB.");
            return;
        }

        console.log("Found user:", adminData.username, "| Stored Password:", adminData.password);

        let passwordMatch = false;
        if (adminData.password.startsWith("$2")) {
            console.log("Password is hashed. Comparing...");
            passwordMatch = await bcrypt.compare(password, adminData.password);
        } else {
            console.log("Password is plain text. Comparing...");
            passwordMatch = (adminData.password === password);
        }

        if (passwordMatch) {
            console.log("✅ Login SUCCESS!");
        } else {
            console.error("❌ Password mismatch!");
        }

    } catch (e) {
        console.error("Error during test:", e);
    }
}

// Test with the credentials I told the user to use
testLogin("admin", "admin");
