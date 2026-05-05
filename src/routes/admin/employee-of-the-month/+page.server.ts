import { db } from "$lib/server/db";
import { employeeOfTheMonthTable } from "$lib/server/schema";
import { cloudinary } from "$lib/server/cloudinary";
import { fail } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

export const load = async () => {
    try {
        const employee = await db
            .select()
            .from(employeeOfTheMonthTable)
            .orderBy(desc(employeeOfTheMonthTable.created_at))
            .limit(1);

        return {
            employee: employee[0] || null
        };
    } catch (error) {
        console.error("Error loading employee of the month:", error);
        return {
            employee: null,
            error: "Could not load data"
        };
    }
};

export const actions = {
    update: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const bio = formData.get("bio") as string;
        const impact_quote = formData.get("impact_quote") as string;
        const contribution = formData.get("contribution") as string;
        const email = formData.get("email") as string;
        const social_links = formData.get("social_links") as string;
        const photo = formData.get("photo") as File;

        let photo_url = formData.get("current_photo_url") as string;

        if (photo && photo.size > 0) {
            try {
                const buffer = Buffer.from(await photo.arrayBuffer());
                const base64 = `data:${photo.type};base64,${buffer.toString("base64")}`;
                const uploadResponse = await cloudinary.uploader.upload(base64, {
                    folder: "employee-of-the-month",
                });
                photo_url = uploadResponse.secure_url;
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                return fail(500, { message: "Failed to upload image" });
            }
        }

        try {
            const latest = await db
                .select()
                .from(employeeOfTheMonthTable)
                .orderBy(desc(employeeOfTheMonthTable.created_at))
                .limit(1);

            if (latest.length > 0) {
                await db
                    .update(employeeOfTheMonthTable)
                    .set({
                        name,
                        role,
                        bio,
                        impact_quote,
                        contribution,
                        email,
                        social_links,
                        photo_url,
                        updated_at: new Date(),
                    })
                    .where(eq(employeeOfTheMonthTable.id, latest[0].id));
            } else {
                await db.insert(employeeOfTheMonthTable).values({
                    name,
                    role,
                    bio,
                    impact_quote,
                    contribution,
                    email,
                    social_links,
                    photo_url,
                });
            }

            return { success: true };
        } catch (error) {
            console.error("Database error:", error);
            return fail(500, { message: "Failed to update employee" });
        }
    }
};
