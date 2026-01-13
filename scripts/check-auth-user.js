
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hhfchzkvuyiyrtyevjuw.supabase.co";
// Using SERVICE_ROLE key to query users
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZmNoemt2dXlpeXJ0eWV2anV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTYzNzY2NywiZXhwIjoyMDc1MjEzNjY3fQ.hGxqKS6ZfFSmSS-4fr3HqgkVHB75bPnAQ8KoflKnR3E";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkUser() {
    console.log("Checking for admin@talkafrica.ng in Supabase Auth...");

    // listUsers approach
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("Error listing users:", error);
        return;
    }

    const adminUser = users.find(u => u.email === 'admin@talkafrica.ng');

    if (adminUser) {
        console.log("FOUND Supabase User: admin@talkafrica.ng");
        console.log("ID:", adminUser.id);
        console.log("Confirmed At:", adminUser.confirmed_at);
    } else {
        console.log("NOT FOUND: admin@talkafrica.ng does NOT exist in Supabase Auth.");
        console.log("Available users:");
        users.forEach(u => console.log(` - ${u.email}`));
    }
}

checkUser();
