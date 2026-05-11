
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getPost() {
    const { data, error } = await supabase
        .from("posts")
        .select("post_id, title, image");

    if (error) {
        console.error(error);
        return;
    }

    const post = data.find(p => p.post_id.startsWith("b71a0"));
    console.log(JSON.stringify(post, null, 2));
}

getPost();
