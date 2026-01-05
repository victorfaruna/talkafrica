// Test file to verify Supabase connection
// This can be removed after testing

import { supabase } from "./supabaseClient";

export async function testSupabaseConnection() {
    try {
        // Test basic connection
        const { data, error } = await supabase.storage.listBuckets();

        if (error) {
            console.error("Supabase connection failed:", error);
            return false;
        }

        console.log("Supabase connected successfully!");
        console.log("Available buckets:", data);

        // Check if images bucket exists
        const imagesBucket = data.find((bucket) => bucket.name === "images");
        if (imagesBucket) {
            console.log("✅ Images bucket found");
        } else {
            console.log(
                "❌ Images bucket not found. Please create it in Supabase dashboard."
            );
        }

        return true;
    } catch (error) {
        console.error("Supabase test failed:", error);
        return false;
    }
}

// Uncomment to test (remove after setup)
// testSupabaseConnection();
