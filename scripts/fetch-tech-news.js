
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

// Configuration
const RSS_FEEDS = [
    'https://techpoint.africa/feed/',
    'https://techcabal.com/feed/',
    'https://technext24.com/feed/',
    'https://www.naijatechguide.com/feed',
    'https://www.techinafrica.com/feed/',
    'https://www.itnewsafrica.com/feed/'
];
const MAX_DAILY_POSTS = 4;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!GEMINI_API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const sql = postgres(DATABASE_URL);
const parser = new Parser();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function rewriteContent(originalContent, title) {
    try {
        console.log("Generating content with models/gemini-2.5-flash-lite...");
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" });
        const prompt = `
            You are an expert tech journalist for 'TalkAfrica'. 
            Rewrite the following tech news article to be a comprehensive, deep-dive blog post.
            
            Original Title: ${title}
            Original Content (Snippet): ${originalContent.substring(0, 3000)}...

            Instructions:
            1. Write a catchy, professional headline (no clickbait).
            2. Write a DETAILED, long-form article (Minimum 600 words).
            3. Structure:
               - Introduction (Hook the reader).
               - Detailed Body (Use <h2> for subheadings).
               - Context/Analysis (Why this matters).
               - Conclusion.
               - "Key Takeaways" bullet points.
            4. Tone: Authoritative, informative, and engaging.
            5. Do NOT output markdown code blocks (like \`\`\`html), just the raw HTML string.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().replace(/```html/g, '').replace(/```/g, '');
    } catch (error) {
        console.error("AI Generation Error:", error.message);
        return null;
    }
}

async function fetchAndProcess() {
    console.log("📡 Fetching latest news from all sources...");
    let allItems = [];

    // 1. Gather all items first
    for (const feedUrl of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(feedUrl);
            const item = feed.items[0]; // Get only the very latest from each feed
            if (item && item.title && (item.content || item.contentSnippet)) {
                allItems.push({
                    ...item,
                    sourceName: feed.title || "External Source"
                });
            }
        } catch (err) {
            console.error(`Failed to fetch ${feedUrl}:`, err.message);
        }
    }

    // 2. Sort by date (newest first) to prioritize breaking news
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // 3. Take only the top 4
    const selectedItems = allItems.slice(0, MAX_DAILY_POSTS);
    console.log(`🎯 Selected top ${selectedItems.length} stories for processing.`);

    // 4. Process
    for (const item of selectedItems) {
        console.log(`\nProcessing: ${item.title}`);

        // Basic check if post exists (optional but good practice)
        // const existing = await sql`SELECT post_id FROM posts WHERE title = ${item.title} LIMIT 1`;
        // if (existing.length > 0) { console.log("Skipping duplicate..."); continue; }

        const generatedContent = await rewriteContent(item.content || item.contentSnippet || "", item.title);

        if (generatedContent) {
            await sql`
                INSERT INTO posts (
                    post_id, 
                    title, 
                    content, 
                    excerpt, 
                    category, 
                    status, 
                    image, 
                    author, 
                    created_at
                ) VALUES (
                    ${randomUUID()},
                    ${item.title}, 
                    ${generatedContent},
                    ${"Latest tech update from " + item.sourceName},
                    'tech',
                    'draft', 
                    ${"/images/placeholder.webp"}, 
                    'Ajayi Korede',
                    NOW()
                )
            `;
            console.log(`✅ Posted (Draft): ${item.title}`);
        } else {
            console.log(`⚠️ Skipped (AI failure)`);
        }
    }
    console.log("\nDone!");
}

fetchAndProcess().finally(() => sql.end());
