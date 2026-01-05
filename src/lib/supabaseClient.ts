import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";

// Validate environment variables
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Missing Supabase public environment variables.");
}

export const supabase = createClient(
    PUBLIC_SUPABASE_URL || "",
    PUBLIC_SUPABASE_ANON_KEY || ""
);
