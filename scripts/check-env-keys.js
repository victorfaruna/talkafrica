import "dotenv/config";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");

console.log(`Checking .env at: ${envPath}`);

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const lines = content.split("\n");
    console.log(`File has ${lines.length} lines.`);

    console.log("Keys found:");
    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
            const parts = trimmed.split("=");
            const key = parts[0].trim();
            if (key) {
                console.log(`${idx + 1}: ${key}`);
            }
        } else if (trimmed.startsWith("#")) {
            // console.log(`${idx + 1}: [COMMENT]`);
        }
    });

    // Also check what dotenv parsed
    console.log("\nDotenv parsed keys:");
    console.log(Object.keys(process.env).filter(k =>
        k.includes("SUPABASE") || k.includes("DB") || k.includes("DATABASE")
    ));

} else {
    console.log(".env file not found by fs!");
}
