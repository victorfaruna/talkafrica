
require('dotenv').config();
const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("No DATABASE_URL found in .env");
    process.exit(1);
}

const sql = postgres(connectionString, {
    idle_timeout: 20,
    connect_timeout: 30,
    max_lifetime: 60 * 30,
});

async function createImpactGalleryTable() {
    console.log("Creating impact_gallery table...");

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS impact_gallery (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                image_url TEXT NOT NULL,
                caption TEXT NOT NULL,
                tag VARCHAR(50),
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log("Table 'impact_gallery' created or already exists.");

        // Check if it's empty to seed
        const items = await sql`SELECT count(*) FROM impact_gallery`;
        if (parseInt(items[0].count) === 0) {
            console.log("Seeding initial authentic items...");
            const initialItems = [
                {
                    image_url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1200",
                    caption: "Celebrating the vibrant spirit of African marketplaces.",
                    tag: "Culture",
                    display_order: 1
                },
                {
                    image_url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200",
                    caption: "Telling stories that span from rural villages to tech hubs.",
                    tag: "Impact",
                    display_order: 2
                },
                {
                    image_url: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
                    caption: "Capturing the heartbeat of African cinematic innovation.",
                    tag: "Big Screen",
                    display_order: 3
                },
                {
                    image_url: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=1200",
                    caption: "Behind the lens: Authentic narratives from across the Sahel.",
                    tag: "Editorial",
                    display_order: 4
                },
                {
                    image_url: "https://images.unsplash.com/photo-1549413240-52f207908975?auto=format&fit=crop&q=80&w=1200",
                    caption: "Empowering African voices in the global tech conversation.",
                    tag: "Tech",
                    display_order: 5
                },
                {
                    image_url: "https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?auto=format&fit=crop&q=80&w=1200",
                    caption: "Community first: Bridging gaps through honest storytelling.",
                    tag: "Community",
                    display_order: 6
                }
            ];

            for (const item of initialItems) {
                await sql`
                    INSERT INTO impact_gallery (image_url, caption, tag, display_order)
                    VALUES (${item.image_url}, ${item.caption}, ${item.tag}, ${item.display_order})
                `;
            }
            console.log("Seeding complete.");
        } else {
            console.log("Table already has data, skipping seed.");
        }

    } catch (err) {
        console.error("Error creating impact_gallery table:", err);
    } finally {
        await sql.end();
    }
}

createImpactGalleryTable();
