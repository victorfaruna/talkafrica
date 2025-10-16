import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "$env/static/private";

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        "Missing Supabase environment variables. Please check your .env file."
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
