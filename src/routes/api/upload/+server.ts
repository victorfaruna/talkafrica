import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Image file signatures (magic numbers) for validation
const IMAGE_SIGNATURES = {
    jpeg: [0xff, 0xd8, 0xff],
    png: [0x89, 0x50, 0x4e, 0x47],
    gif: [0x47, 0x49, 0x46],
    webp: [0x52, 0x49, 0x46, 0x46], // RIFF header for WebP
    bmp: [0x42, 0x4d],
    tiff: [0x49, 0x49, 0x2a, 0x00], // Little-endian TIFF
    tiff_be: [0x4d, 0x4d, 0x00, 0x2a], // Big-endian TIFF
    ico: [0x00, 0x00, 0x01, 0x00],
    svg: [0x3c, 0x3f, 0x78, 0x6d, 0x6c], // XML declaration
};

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
    "image/svg+xml",
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "bmp",
    "tiff",
    "tif",
    "ico",
    "svg",
];

// Function to validate file signature (magic numbers)
function validateFileSignature(buffer: Buffer): {
    isValid: boolean;
    detectedType?: string;
} {
    const firstBytes = Array.from(buffer.slice(0, 10));

    // Check JPEG
    if (
        firstBytes
            .slice(0, 3)
            .every((byte, index) => byte === IMAGE_SIGNATURES.jpeg[index])
    ) {
        return { isValid: true, detectedType: "jpeg" };
    }

    // Check PNG
    if (
        firstBytes
            .slice(0, 4)
            .every((byte, index) => byte === IMAGE_SIGNATURES.png[index])
    ) {
        return { isValid: true, detectedType: "png" };
    }

    // Check GIF
    if (
        firstBytes
            .slice(0, 3)
            .every((byte, index) => byte === IMAGE_SIGNATURES.gif[index])
    ) {
        return { isValid: true, detectedType: "gif" };
    }

    // Check WebP (RIFF header)
    if (
        firstBytes
            .slice(0, 4)
            .every((byte, index) => byte === IMAGE_SIGNATURES.webp[index])
    ) {
        // Additional check for WebP: bytes 8-11 should be "WEBP"
        const webpCheck = buffer.slice(8, 12).toString();
        if (webpCheck === "WEBP") {
            return { isValid: true, detectedType: "webp" };
        }
    }

    // Check BMP
    if (
        firstBytes
            .slice(0, 2)
            .every((byte, index) => byte === IMAGE_SIGNATURES.bmp[index])
    ) {
        return { isValid: true, detectedType: "bmp" };
    }

    // Check TIFF (little-endian)
    if (
        firstBytes
            .slice(0, 4)
            .every((byte, index) => byte === IMAGE_SIGNATURES.tiff[index])
    ) {
        return { isValid: true, detectedType: "tiff" };
    }

    // Check TIFF (big-endian)
    if (
        firstBytes
            .slice(0, 4)
            .every((byte, index) => byte === IMAGE_SIGNATURES.tiff_be[index])
    ) {
        return { isValid: true, detectedType: "tiff" };
    }

    // Check ICO
    if (
        firstBytes
            .slice(0, 4)
            .every((byte, index) => byte === IMAGE_SIGNATURES.ico[index])
    ) {
        return { isValid: true, detectedType: "ico" };
    }

    // Check SVG (XML declaration)
    if (
        firstBytes
            .slice(0, 5)
            .every((byte, index) => byte === IMAGE_SIGNATURES.svg[index])
    ) {
        // Additional check: look for SVG tag in the first 1KB
        const svgContent = buffer.slice(0, 1024).toString().toLowerCase();
        if (
            svgContent.includes("<svg") ||
            svgContent.includes("<!doctype svg")
        ) {
            return { isValid: true, detectedType: "svg" };
        }
    }

    return { isValid: false };
}

// Function to get file extension from filename
function getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "";
}

// Function to validate file extension
function validateFileExtension(filename: string): boolean {
    const extension = getFileExtension(filename);
    return ALLOWED_EXTENSIONS.includes(extension);
}

// Function to ensure upload directory exists
async function ensureUploadDirectory(): Promise<void> {
    const uploadDir = join(process.cwd(), "static", "images", "uploads");
    if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
    }
}

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

        // Validate file size (10MB limit - increased for better support)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return json(
                {
                    success: false,
                    message: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB.`,
                },
                { status: 400 }
            );
        }

        // Validate file extension
        if (!validateFileExtension(file.name)) {
            return json(
                {
                    success: false,
                    message: `Invalid file extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return json(
                {
                    success: false,
                    message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // Convert file to buffer for signature validation
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Validate file signature (magic numbers)
        const signatureValidation = validateFileSignature(buffer);
        if (!signatureValidation.isValid) {
            return json(
                {
                    success: false,
                    message:
                        "Invalid image file. File content does not match the declared type.",
                },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        await ensureUploadDirectory();

        // Generate unique filename with proper extension
        const timestamp = Date.now();
        const originalExtension = getFileExtension(file.name);
        const detectedType = signatureValidation.detectedType;

        // Use detected type for extension if available, otherwise use original
        const finalExtension =
            detectedType === "jpeg" ? "jpg" : detectedType || originalExtension;
        const filename = `${timestamp}.${finalExtension}`;

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
            detectedType: detectedType,
            fileSize: file.size,
        });
    } catch (error) {
        console.error("Upload error:", error);

        // More specific error handling
        let errorMessage = "Failed to upload file";
        if (error instanceof Error) {
            if (error.message.includes("ENOENT")) {
                errorMessage = "Upload directory not found";
            } else if (error.message.includes("EACCES")) {
                errorMessage = "Permission denied when writing file";
            } else if (error.message.includes("ENOSPC")) {
                errorMessage = "Insufficient disk space";
            } else {
                errorMessage = error.message;
            }
        }

        return json(
            {
                success: false,
                message: errorMessage,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
};
