import { db } from "$lib/server/db";
import { postTable, postCategoriesTable } from "$lib/server/schema";
import { eq, and, desc } from "drizzle-orm";
import type { RequestHandler } from "./$types";

const siteUrl = "https://talkafricang.com";

const staticPages = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    { url: "/about", changefreq: "monthly", priority: "0.8" },
    { url: "/movies", changefreq: "weekly", priority: "0.8" },
    { url: "/videos", changefreq: "weekly", priority: "0.7" },
    { url: "/donate", changefreq: "monthly", priority: "0.5" },
];

const categories = [
    "politics", "economy", "health", "technology",
    "culture", "sports", "entertainment", "african-giant",
    "africans-on-the-table"
];

export const GET: RequestHandler = async () => {
    let posts: { post_id: string; updated_at: Date | null; created_at: Date | null }[] = [];

    try {
        posts = await db
            .select({
                post_id: postTable.post_id,
                updated_at: postTable.updated_at,
                created_at: postTable.created_at,
            })
            .from(postTable)
            .where(and(eq(postTable.status, "published"), eq(postTable.deleted, false)))
            .orderBy(desc(postTable.created_at))
            .limit(1000);
    } catch (e) {
        console.error("Sitemap: failed to fetch posts", e);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
    .map(
        (p) => `  <url>
    <loc>${siteUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n")}
${categories
    .map(
        (cat) => `  <url>
    <loc>${siteUrl}/${cat}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n")}
${posts
    .map((post) => {
        const lastmod = (post.updated_at || post.created_at)
            ? new Date(post.updated_at ?? post.created_at!).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
        return `  <url>
    <loc>${siteUrl}/posts/${post.post_id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("\n")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "max-age=3600, s-maxage=3600",
        },
    });
};
