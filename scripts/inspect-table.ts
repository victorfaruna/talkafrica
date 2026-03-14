
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

console.log("DEBUG: SUPABASE_URL:", SUPABASE_URL);
if (SUPABASE_ANON_KEY) {
    console.log("DEBUG: SUPABASE_ANON_KEY starts with:", SUPABASE_ANON_KEY.substring(0, 10));
    console.log("DEBUG: SUPABASE_ANON_KEY ends with:", SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 10));
    console.log("DEBUG: SUPABASE_ANON_KEY length:", SUPABASE_ANON_KEY.length);
}

const cleanAnonKey = SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.includes(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
)
    ? SUPABASE_ANON_KEY.split("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")[0] +
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    SUPABASE_ANON_KEY.split("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
        .slice(1)
        .join("")
    : SUPABASE_ANON_KEY;

console.log("DEBUG: Clean Key length:", cleanAnonKey?.length);

import { createClient } from "@supabase/supabase-js";

if (!SUPABASE_URL || !cleanAnonKey) {
    console.error("Supabase env vars missing or invalid");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, cleanAnonKey);

async function inspect() {
    console.log("Inspecting impact_gallery table...");
    try {
        const { data, error } = await supabase
            .from("impact_gallery")
            .select("*")
            .limit(1);

        if (error) {
            console.error("Supabase Error:", error);
            return;
        }

        if (data && data.length > 0) {
            console.log("Success! Sample Data:", data[0]);
        } else {
            console.log("Success! Table exists but is empty.");
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

inspect();
