import { supabase } from "$lib/server/supabase";

export interface ImpactGalleryItem {
    id?: string;
    image_url: string;
    caption: string;
    tag?: string;
    display_order?: number;
    created_at?: string;
}

export async function getImpactGalleryItems(): Promise<ImpactGalleryItem[]> {
    const { data, error } = await supabase
        .from("impact_gallery")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching impact gallery:", error);
        throw error;
    }

    return data || [];
}

export async function createImpactGalleryItem(
    item: Omit<ImpactGalleryItem, "id" | "created_at">
): Promise<ImpactGalleryItem> {
    const { data, error } = await supabase
        .from("impact_gallery")
        .insert([item])
        .select();

    if (error) {
        console.error("Error creating impact gallery item:", error);
        throw error;
    }

    if (!data || data.length === 0) {
        throw new Error("Failed to create impact gallery item: No data returned");
    }

    return data[0];
}

export async function deleteImpactGalleryItem(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("impact_gallery")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting impact gallery item:", error);
        throw error;
    }

    return true;
}

export async function updateDisplayOrder(updates: { id: string, display_order: number }[]): Promise<boolean> {
    // Supabase JS doesn't have a bulk update by default, so we do it in a loop
    for (const update of updates) {
        const { error } = await supabase
            .from("impact_gallery")
            .update({ display_order: update.display_order })
            .eq("id", update.id);

        if (error) {
            console.error("Error updating display order:", error);
            throw error;
        }
    }
    return true;
}
