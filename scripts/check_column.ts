import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const client = postgres(process.env.DATABASE_URL!, {
    idle_timeout: 6000,
    prepare: false
});

async function checkColumn() {
    try {
        // Check if is_trending_news column exists
        const result = await client`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'posts' 
            AND column_name = 'is_trending_news'
        `;

        console.log('Column check result:', result);

        if (result.length === 0) {
            console.log('\n❌ Column "is_trending_news" does NOT exist in posts table');
            console.log('\n🔧 Running migration to add the column...\n');

            await client`
                ALTER TABLE posts 
                ADD COLUMN IF NOT EXISTS is_trending_news BOOLEAN NOT NULL DEFAULT false
            `;

            console.log('✅ Column added successfully!');
        } else {
            console.log('\n✅ Column "is_trending_news" exists');
            console.log('Data type:', result[0].data_type);
        }

        // List all columns in posts table
        const allColumns = await client`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'posts'
            ORDER BY ordinal_position
        `;

        console.log('\n📋 All columns in posts table:');
        allColumns.forEach(col => console.log('  -', col.column_name));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkColumn();
