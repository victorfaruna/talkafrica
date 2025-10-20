import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { categoriesTable } from "$lib/server/schema";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";

// GET /api/categories - Get all categories
export const GET: RequestHandler = async ({ url }) => {
    try {
        const includeInactive =
            url.searchParams.get("includeInactive") === "true";

        let query = db.select().from(categoriesTable);

        if (!includeInactive) {
            query = query.where(eq(categoriesTable.is_active, true));
        }

        const categories = await query.orderBy(categoriesTable.sort_order);

        return json({
            success: true,
            categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return json(
            {
                success: false,
                message: "Failed to fetch categories",
                error: error.message,
            },
            { status: 500 }
        );
    }
};

// POST /api/categories - Create new category
export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();

        const newCategory = await db
            .insert(categoriesTable)
            .values({
                name: data.name,
                slug: data.slug,
                display_name: data.display_name,
                description: data.description,
                parent_id: data.parent_id || null,
                icon: data.icon,
                color: data.color,
                sort_order: data.sort_order || 0,
                is_active: data.is_active !== false,
            })
            .returning();

        return json({
            success: true,
            category: newCategory[0],
        });
    } catch (error) {
        console.error("Error creating category:", error);
        return json(
            {
                success: false,
                message: "Failed to create category",
                error: error.message,
            },
            { status: 500 }
        );
    }
};

// PUT /api/categories - Update category
export const PUT: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const { category_id, ...updateData } = data;

        if (!category_id) {
            return json(
                {
                    success: false,
                    message: "Category ID is required",
                },
                { status: 400 }
            );
        }

        const updatedCategory = await db
            .update(categoriesTable)
            .set(updateData)
            .where(eq(categoriesTable.category_id, category_id))
            .returning();

        if (updatedCategory.length === 0) {
            return json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 }
            );
        }

        return json({
            success: true,
            category: updatedCategory[0],
        });
    } catch (error) {
        console.error("Error updating category:", error);
        return json(
            {
                success: false,
                message: "Failed to update category",
                error: error.message,
            },
            { status: 500 }
        );
    }
};

// DELETE /api/categories - Delete category
export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const { category_id } = data;

        if (!category_id) {
            return json(
                {
                    success: false,
                    message: "Category ID is required",
                },
                { status: 400 }
            );
        }

        // Check if category has subcategories
        const subcategories = await db
            .select()
            .from(categoriesTable)
            .where(eq(categoriesTable.parent_id, category_id));

        if (subcategories.length > 0) {
            return json(
                {
                    success: false,
                    message: "Cannot delete category with subcategories",
                },
                { status: 400 }
            );
        }

        const deletedCategory = await db
            .delete(categoriesTable)
            .where(eq(categoriesTable.category_id, category_id))
            .returning();

        if (deletedCategory.length === 0) {
            return json(
                {
                    success: false,
                    message: "Category not found",
                },
                { status: 404 }
            );
        }

        return json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        return json(
            {
                success: false,
                message: "Failed to delete category",
                error: error.message,
            },
            { status: 500 }
        );
    }
};
