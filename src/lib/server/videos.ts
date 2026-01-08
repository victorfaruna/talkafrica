import { db } from "./db";
import { videosTable } from "./schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getVideos(limit = 10, offset = 0, category?: string) {
    let query = db
        .select()
        .from(videosTable)
        .orderBy(desc(videosTable.created_at))
        .limit(limit)
        .offset(offset);

    if (category) {
        query = query.where(eq(videosTable.category, category));
    }

    return await query;
}

export async function getVideoById(id: string) {
    const result = await db
        .select()
        .from(videosTable)
        .where(eq(videosTable.video_id, id));
    return result[0];
}

export async function createVideo(data: {
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    category: string;
    author: string;
    duration?: string;
    is_featured?: boolean;
}) {
    return await db.insert(videosTable).values(data).returning();
}

export async function updateVideo(
    id: string,
    data: Partial<{
        title: string;
        description: string;
        video_url: string;
        thumbnail_url: string;
        category: string;
        author: string;
        duration: string;
        is_featured: boolean;
    }>
) {
    return await db
        .update(videosTable)
        .set({ ...data, updated_at: new Date() })
        .where(eq(videosTable.video_id, id))
        .returning();
}

export async function deleteVideo(id: string) {
    return await db
        .delete(videosTable)
        .where(eq(videosTable.video_id, id))
        .returning();
}

export async function incrementVideoViews(id: string) {
    return await db
        .update(videosTable)
        .set({ views: sql`${videosTable.views} + 1` })
        .where(eq(videosTable.video_id, id))
        .returning();
}

export async function getFeaturedVideo() {
    const result = await db
        .select()
        .from(videosTable)
        .where(eq(videosTable.is_featured, true))
        .limit(1);
    return result[0];
}
