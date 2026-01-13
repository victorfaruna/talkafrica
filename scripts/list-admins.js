
console.log('Script started...');
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = postgres(connectionString);

async function listAdmins() {
    try {
        console.log('Fetching admin users...');
        const admins = await sql`SELECT username, email FROM admin`;

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
        await sql.end();
    }
}

listAdmins();
