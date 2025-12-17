
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/server/schema';
import { eq } from 'drizzle-orm';

async function checkAdmin() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined');
        return;
    }

    const client = postgres(connectionString);
    const db = drizzle(client, { schema });

    try {
        const adminUser = await db.select().from(schema.adminTable).where(eq(schema.adminTable.username, 'admin'));

        if (adminUser.length > 0) {
            console.log('Admin user exists.');
            // Check if password matches (warning: plain text check based on logic seen in +server.ts)
            if (adminUser[0].password === 'admin') {
                console.log('Password is correct.');
            } else {
                console.log('Password does NOT match. Updating...');
                await db.update(schema.adminTable)
                    .set({ password: 'admin' })
                    .where(eq(schema.adminTable.username, 'admin'));
                console.log('Password updated to "admin".');
            }
        } else {
            console.log('Admin user does not exist. Creating...');
            await db.insert(schema.adminTable).values({
                name: 'Admin User',
                email: 'admin@talkafrica.com',
                username: 'admin',
                password: 'admin', // Plain text based on +server.ts
            });
            console.log('Admin user created.');
        }

    } catch (error) {
        console.error('Error checking admin:', error);
    } finally {
        await client.end();
    }
}

checkAdmin();
