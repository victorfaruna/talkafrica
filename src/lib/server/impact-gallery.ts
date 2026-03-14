import { db } from "$lib/server/db";
import { impactGalleryTable } from "$lib/server/schema";
import { asc, desc, eq } from "drizzle-orm";

export interface ImpactGalleryItem {
    id?: string;
    image_url: string;
    caption: string;
    tag?: string | null;
    display_order?: number | null;
    created_at?: Date | string | null;
}

export async function getImpactGalleryItems(): Promise<ImpactGalleryItem[]> {
    try {
        const items = await db
            .select()
            .from(impactGalleryTable)
            .orderBy(asc(impactGalleryTable.display_order), desc(impactGalleryTable.created_at));

        return items as ImpactGalleryItem[];
    } catch (error) {
        console.error("Error fetching impact gallery:", error);
        throw error;
    }
}

export async function createImpactGalleryItem(
    item: Omit<ImpactGalleryItem, "id" | "created_at">
): Promise<ImpactGalleryItem> {
    try {
        console.log("[ImpactGallery] Attempting to create item via Drizzle:", item);

        const result = await db
            .insert(impactGalleryTable)
            .values({
                image_url: item.image_url,
                caption: item.caption,
                tag: item.tag,
                display_order: item.display_order ?? 0
            })
            .returning();

        if (!result || result.length === 0) {
            throw new Error("Failed to create impact gallery item: No data returned");
        }

        return result[0] as ImpactGalleryItem;
    } catch (error) {
        console.error("Error creating impact gallery item:", error);
        throw error;
    }
}

export async function deleteImpactGalleryItem(id: string): Promise<boolean> {
    try {
        await db
            .delete(impactGalleryTable)
            .where(eq(impactGalleryTable.id, id));

        return true;
    } catch (error) {
        console.error("Error deleting impact gallery item:", error);
        throw error;
    }
}

export async function updateDisplayOrder(updates: { id: string, display_order: number }[]): Promise<boolean> {
    try {
        // We can do this in a loop or optimized transaction if needed
        for (const update of updates) {
            await db
                .update(impactGalleryTable)
                .set({ display_order: update.display_order })
                .where(eq(impactGalleryTable.id, update.id));
        }
        return true;
    } catch (error) {
        console.error("Error updating display order:", error);
        throw error;
    }
}
