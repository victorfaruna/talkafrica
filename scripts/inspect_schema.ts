import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
    idle_timeout: 6000,
    connect_timeout: 10000
});

async function main() {
    console.log('Inspecting posts table columns...');

    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'posts';
        `;

        console.log('Columns found in posts table:');
        const columnList = columns.map(c => c.column_name);
        console.log(columnList);

        if (columnList.includes('is_trending_news')) {
            console.log('✅ is_trending_news exists');
        } else {
            console.log('❌ is_trending_news MISSING');
        }

        if (columnList.includes('deleted')) {
            console.log('✅ deleted exists');
        } else {
            console.log('❌ deleted MISSING');
        }

    } catch (error) {
        console.error('Error inspecting schema:', error);
    } finally {
        await sql.end();
    }
}

main();
