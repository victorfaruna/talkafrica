import "dotenv/config";
import postgres from "postgres";

async function seed() {
    const sql = postgres(process.env.DATABASE_URL as string);
    console.log("Seeding Employee of the Month...");
    try {
        await sql`
            INSERT INTO employee_of_the_month (name, role, photo_url, bio, impact_quote, contribution, email, social_links)
            VALUES (
                'Sarah Mensah', 
                'Lead Storyteller', 
                'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1000&auto=format&fit=crop', 
                'Sarah has been a driving force at TalkAfrica, consistently uncovering stories that challenge stereotypes and highlight the vibrant innovation across the continent. Her dedication to authentic narrative building has reached over 100k readers this month alone.',
                'Impact starts with a single story, but it resonates through a thousand voices.',
                'Through storytelling and dedicated research, Sarah has been instrumental in amplifying voices that redefine the African narrative on a global scale.',
                'sarah@talkafrica.com',
                'https://linkedin.com/in/sarah-mensah, https://twitter.com/sarah_talks'
            );
        `;
        console.log("Seeding complete!");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
    await sql.end();
}

seed();
