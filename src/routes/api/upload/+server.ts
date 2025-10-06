import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { writeFile } from "fs/promises";
import { join } from "path";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return json(
                {
                    success: false,
                    message: "No file provided",
                },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            return json(
                {
                    success: false,
                    message: "Invalid file type. Only images are allowed.",
                },
                { status: 400 }
            );
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return json(
                {
                    success: false,
                    message: "File too large. Maximum size is 5MB.",
                },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split(".").pop();
        const filename = `${timestamp}.${extension}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Save file to static/images/uploads directory
        const uploadPath = join(
            process.cwd(),
            "static",
            "images",
            "uploads",
            filename
        );
        await writeFile(uploadPath, buffer);

        // Return the public URL
        const publicUrl = `/images/uploads/${filename}`;

        return json({
            success: true,
            message: "File uploaded successfully",
            url: publicUrl,
            filename: filename,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return json(
            {
                success: false,
                message: "Failed to upload file",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
