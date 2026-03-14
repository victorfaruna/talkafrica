import { createImpactGalleryItem } from "./src/lib/server/impact-gallery";
import * as dotenv from 'dotenv';
dotenv.config();

async function testInsert() {
    console.log("Testing insert...");
    try {
        const result = await createImpactGalleryItem({
            image_url: "https://example.com/test.jpg",
            caption: "Test caption",
            tag: "Test",
            display_order: 99
        });
        console.log("Success:", result);
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testInsert();
