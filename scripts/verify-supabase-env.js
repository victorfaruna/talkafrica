import "dotenv/config";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

console.log("Checking environment variables...");
console.log(`SUPABASE_URL exists: ${!!url}`);
console.log(`SUPABASE_URL length: ${url ? url.length : 0}`);
console.log(`SUPABASE_ANON_KEY exists: ${!!key}`);
console.log(`SUPABASE_ANON_KEY length: ${key ? key.length : 0}`);

if (!url || !key) {
    console.log("Missing variables!");
    // Check for common variations
    console.log(`PUBLIC_SUPABASE_URL exists: ${!!process.env.PUBLIC_SUPABASE_URL}`);
    console.log(`PUBLIC_SUPABASE_ANON_KEY exists: ${!!process.env.PUBLIC_SUPABASE_ANON_KEY}`);
    console.log(`VITE_SUPABASE_URL exists: ${!!process.env.VITE_SUPABASE_URL}`);
    console.log(`VITE_SUPABASE_ANON_KEY exists: ${!!process.env.VITE_SUPABASE_ANON_KEY}`);
}
