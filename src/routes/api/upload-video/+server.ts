import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { cloudinary } from "$lib/server/cloudinary";

// Allowed MIME types for video
const ALLOWED_MIME_TYPES = [
    "video/mp4",
    "video/webm",
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
];

async function uploadToCloudinary(
    file: File,
    filename: string
): Promise<{ url: string; publicId: string; duration?: number }> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64Data}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "talkafrica/videos",
            public_id: filename.split(".")[0],
            resource_type: "video",
            chunk_size: 6000000,
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration
        };
    } catch (error) {
        throw new Error(
            `Failed to upload to Cloudinary: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file size (500MB limit)
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            return json(
                { success: false, message: "File too large. Maximum size is 500MB." },
                { status: 400 }
            );
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return json(
                { success: false, message: "Invalid file type. Allowed: MP4, WebM, MOV, AVI" },
                { status: 400 }
            );
        }

        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}.${extension}`;

        const { url, publicId, duration } = await uploadToCloudinary(file, filename);

        return json({
            success: true,
            url,
            publicId,
            duration,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return json(
            { success: false, message: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
};
