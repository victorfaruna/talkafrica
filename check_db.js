import 'dotenv/config';
import postgres from 'postgres';

async function checkConnection() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is not defined in environment');
        return;
    }

    console.log('Testing connection to:', connectionString.replace(/:[^:@]*@/, ':****@'));

    try {
        const sql = postgres(connectionString, { max: 1 });
        // List user tables (public schema)
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

        console.log('Tables found:', tables.map(t => t.table_name));
        await sql.end();
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

checkConnection();
