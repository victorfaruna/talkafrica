import { json } from "@sveltejs/kit";
import { seedCategories } from "$lib/seed-categories";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async () => {
    try {
        console.log("🌱 Starting category seeding...");
        const result = await seedCategories();

        if (result.success) {
            return json({
                success: true,
                message: `Successfully seeded ${result.count} categories`,
                count: result.count,
            });
        } else {
            return json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        return json(
            {
                success: false,
                error: (error as any).message,
            },
            { status: 500 }
        );
    }
};
