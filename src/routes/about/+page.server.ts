import { db } from "$lib/server/db";
import { employeeOfTheMonthTable } from "$lib/server/schema";
import { desc } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        const employee = await db
            .select()
            .from(employeeOfTheMonthTable)
            .orderBy(desc(employeeOfTheMonthTable.created_at))
            .limit(1);

        return {
            employeeOfTheMonth: employee[0] || null
        };
    } catch (error) {
        console.error("Error loading employee of the month for about page:", error);
        return {
            employeeOfTheMonth: null
        };
    }
};
