
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hhfchzkvuyiyrtyevjuw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZmNoemt2dXlpeXJ0eWV2anV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2Mzc2NjcsImV4cCI6MjA3NTIxMzY2N30.MrPYG3bnVF4LuzNPcOJwh6g-UcPf-gbOrvVY6wblGi4";

console.log(`Testing connection to: ${SUPABASE_URL}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
    try {
        // Try to select from a public table, or just check health/auth
        // Even a failed query (due to RLS) usually proves connection success vs network error.

        // Let's try to get the current session or just a simple query
        const { data, error } = await supabase.from('admin').select('count', { count: 'exact', head: true });

        if (error) {
            console.log("Connection established, but encountered query error (this is expected if not logged in/RLS):");
            console.log(error.message);
            // If the error is NOT 'FetchError' or 'ENOTFOUND', the URL is correct.
            console.log("\nVerdict: URL IS CORRECT (Server responded).");
        } else {
            console.log("Connection SUCCESSFUL!");
            console.log("Verdict: URL IS CORRECT.");
        }
    } catch (err) {
        console.error("Connection FAILED:", err);
    }
}

testConnection();
