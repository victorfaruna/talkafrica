
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { adminTable } from '../src/lib/server/schema';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function listAdmins() {
    try {
        console.log('Fetching admin users...');
        const admins = await db.select({
            username: adminTable.username,
            email: adminTable.email
        }).from(adminTable);

        if (admins.length === 0) {
            console.log('No admin users found.');
        } else {
            console.log('\n--- Admin Users ---');
            admins.forEach(admin => {
                console.log(`Username: ${admin.username} | Email: ${admin.email}`);
            });
            console.log('-------------------\n');
        }
    } catch (error) {
        console.error('Error fetching admins:', error);
    } finally {
        await client.end();
    }
}

listAdmins();
