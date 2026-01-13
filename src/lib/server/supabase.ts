import { createClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/private";

console.log("DEBUG: Loading Supabase Client");
console.log("DEBUG: Available Env Keys:", Object.keys(env));
console.log("DEBUG: SUPABASE_URL present:", !!env.SUPABASE_URL);
console.log("DEBUG: SUPABASE_ANON_KEY present:", !!env.SUPABASE_ANON_KEY);

const SUPABASE_URL = env.SUPABASE_URL || process.env.SUPABASE_URL; // Fallback to process.env
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("CRITICAL ERROR: Supabase environment variables missing!");
    throw new Error(
        `Missing Supabase environment variables. Keys found: ${Object.keys(env).filter(k => k.includes('SUPABASE'))}`
    );
}

// Clean the anon key - remove any duplication
const cleanAnonKey = SUPABASE_ANON_KEY.includes(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
)
    ? SUPABASE_ANON_KEY.split("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")[0] +
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    SUPABASE_ANON_KEY.split("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
        .slice(1)
        .join("")
    : SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, cleanAnonKey);
