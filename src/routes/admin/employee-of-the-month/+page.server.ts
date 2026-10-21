import { db } from "$lib/server/db";
import { adminTable, employeeOfTheMonthTable } from "$lib/server/schema";
import { cloudinary } from "$lib/server/cloudinary";
import { fail } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { requireSuperAdmin } from "$lib/server/admin-auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    requireSuperAdmin(locals);
    try {
        const [employee, suggestionResult] = await Promise.all([db
            .select()
            .from(employeeOfTheMonthTable)
            .orderBy(desc(employeeOfTheMonthTable.created_at))
            .limit(1), db.execute(sql`
                SELECT a.admin_id, a.name, a.email,
                    COUNT(DISTINCT p.post_id)::int AS posts,
                    COALESCE(SUM(pds.views), 0)::int AS views
                FROM admin a
                LEFT JOIN posts p ON p.author_id = a.admin_id AND p.deleted = false AND p.created_at >= date_trunc('month', CURRENT_DATE)
                LEFT JOIN post_daily_stats pds ON pds.post_id = p.post_id AND pds.date >= date_trunc('month', CURRENT_DATE)
                GROUP BY a.admin_id, a.name, a.email
                ORDER BY views DESC, posts DESC
                LIMIT 1
            `)]);

        return {
            employee: employee[0] || null,
            suggestion: Array.from(suggestionResult)[0] || null
        };
    } catch (error) {
        console.error("Error loading employee of the month:", error);
        return {
            employee: null,
            error: "Could not load data"
        };
    }
};

export const actions: Actions = {
    confirmSuggestion: async ({ locals }) => {
        const session = requireSuperAdmin(locals);
        const suggestionResult = await db.execute(sql`
            SELECT a.admin_id, a.name, a.email
            FROM admin a
            LEFT JOIN posts p ON p.author_id = a.admin_id AND p.deleted = false
            LEFT JOIN post_daily_stats pds ON pds.post_id = p.post_id AND pds.date >= date_trunc('month', CURRENT_DATE)
            GROUP BY a.admin_id, a.name, a.email
            ORDER BY COALESCE(SUM(pds.views), 0) DESC, COUNT(DISTINCT p.post_id) DESC
            LIMIT 1
        `);
        const suggestion = Array.from(suggestionResult)[0] as { admin_id: string; name: string; email: string } | undefined;
        const [latest] = await db.select().from(employeeOfTheMonthTable).orderBy(desc(employeeOfTheMonthTable.created_at)).limit(1);
        if (!suggestion || !latest) return fail(400, { message: "Create the employee profile first, then confirm the suggestion." });
        await db.update(employeeOfTheMonthTable).set({
            name: suggestion.name,
            email: suggestion.email,
            selected_admin_id: suggestion.admin_id,
            selected_by: session.admin_id,
            selected_at: new Date(),
            updated_at: new Date(),
        }).where(eq(employeeOfTheMonthTable.id, latest.id));
        return { success: true };
    },
    update: async ({ request, locals }) => {
        const session = requireSuperAdmin(locals);
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const bio = formData.get("bio") as string;
        const impact_quote = formData.get("impact_quote") as string;
        const contribution = formData.get("contribution") as string;
        const email = formData.get("email") as string;
        const linkedin_url = formData.get("linkedin_url") as string;
        const twitter_url = formData.get("twitter_url") as string;
        const whatsapp_number = formData.get("whatsapp_number") as string;
        const photo = formData.get("photo") as File;
        const [selectedAdmin] = email ? await db.select({ admin_id: adminTable.admin_id }).from(adminTable).where(eq(adminTable.email, email)).limit(1) : [];
        const selected_admin_id = selectedAdmin?.admin_id || null;

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
                        linkedin_url,
                        twitter_url,
                        whatsapp_number,
                        photo_url,
                        selected_admin_id,
                        selected_by: session.admin_id,
                        selected_at: new Date(),
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
                    linkedin_url,
                    twitter_url,
                    whatsapp_number,
                    photo_url,
                    selected_admin_id,
                    selected_by: session.admin_id,
                    selected_at: new Date(),
                });
            }

            return { success: true };
        } catch (error) {
            console.error("Database error:", error);
            return fail(500, { message: "Failed to update employee" });
        }
    }
};
