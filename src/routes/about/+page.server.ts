import { db } from "$lib/server/db";
import { employeeOfTheMonthTable } from "$lib/server/schema";
import { desc } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { cachedPublicData } from "$lib/server/public-data-cache";

const loadContent: PageServerLoad = async () => {
    try {
        const employee = await db
            .select()
            .from(employeeOfTheMonthTable)
            .orderBy(desc(employeeOfTheMonthTable.created_at))
            .limit(1);

        return {
            employeeOfTheMonth: employee[0] || null,
            title: "About Us | TalkAfrica",
            description: "Learn about TalkAfrica — a visionary platform committed to showcasing African creativity, preserving cultural heritage, and reshaping Africa's narrative through authentic storytelling."
        };
    } catch (error) {
        console.error("Error loading employee of the month for about page:", error);
        return {
            employeeOfTheMonth: null
        };
    }
};

export const load: PageServerLoad = (event) => cachedPublicData('about', () => loadContent(event), event.request);
