import { db } from "../src/lib/server/db";
import { employeeOfTheMonthTable } from "../src/lib/server/schema";
import { desc } from "drizzle-orm";
import "dotenv/config";

async function check() {
    try {
        const employees = await db.select().from(employeeOfTheMonthTable).orderBy(desc(employeeOfTheMonthTable.created_at));
        console.log("Employees found:", employees.length);
        if (employees.length > 0) {
            console.log("Latest Employee:", JSON.stringify(employees[0], null, 2));
        } else {
            console.log("No employees found in the database.");
        }
    } catch (e) {
        console.error("Error checking employee:", e);
    }
}

check();
