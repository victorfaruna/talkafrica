import { error } from "@sveltejs/kit";

export type AdminRole = "super_admin" | "admin";

export function requireAdmin(locals: App.Locals) {
    if (!locals.session) throw error(401, "Authentication required");
    return locals.session;
}

export function requireSuperAdmin(locals: App.Locals) {
    const session = requireAdmin(locals);
    if (session.role !== "super_admin") throw error(403, "Super admin access required");
    return session;
}

export function canManageOwner(role: AdminRole, currentAdminId: string, ownerId: string | null) {
    return role === "super_admin" || ownerId === currentAdminId;
}
