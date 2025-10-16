import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { supabase } from "$lib/supabase";

export const GET: RequestHandler = async () => {
    try {
        // Test basic connection
        const { data: buckets, error: bucketsError } =
            await supabase.storage.listBuckets();

        if (bucketsError) {
            return json(
                {
                    success: false,
                    message: "Failed to connect to Supabase Storage",
                    error: bucketsError.message,
                },
                { status: 500 }
            );
        }

        // Check if images bucket exists
        const imagesBucket = buckets.find((bucket) => bucket.name === "images");

        if (!imagesBucket) {
            return json({
                success: false,
                message: "Images bucket not found",
                buckets: buckets.map((b) => b.name),
                instructions:
                    "Please create an 'images' bucket in your Supabase dashboard",
            });
        }

        // Test upload permissions by trying to list files in the bucket
        const { data: files, error: filesError } = await supabase.storage
            .from("images")
            .list("", { limit: 1 });

        if (filesError) {
            return json({
                success: false,
                message: "Failed to access images bucket",
                error: filesError.message,
                rlsIssue:
                    filesError.message.includes("row-level security") ||
                    filesError.message.includes("RLS"),
                instructions: filesError.message.includes("row-level security")
                    ? "RLS policies need to be configured. See SUPABASE_RLS_FIX.md"
                    : "Check your Supabase configuration",
            });
        }

        return json({
            success: true,
            message: "Supabase Storage is working correctly",
            bucket: imagesBucket,
            filesCount: files?.length || 0,
            publicUrl: supabase.storage.from("images").getPublicUrl("test").data
                .publicUrl,
        });
    } catch (error) {
        console.error("Supabase test error:", error);
        return json(
            {
                success: false,
                message: "Unexpected error during Supabase test",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
