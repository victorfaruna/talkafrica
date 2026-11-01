import { db } from '$lib/server/db';
import { adminTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Handle } from '@sveltejs/kit';
import { cachePublicResponse } from '$lib/server/public-cache';
import { changesPublicContent } from '$lib/server/public-data-cache';
import { invalidatePublicContent } from '$lib/server/invalidate-public-content';

export const handle: Handle = async ({ event, resolve }) => {
    const path = event.url.pathname;

    // Keep public page responses cookie-free; /api/track records actual visits.
    const publicRead = ['GET', 'HEAD'].includes(event.request.method) &&
        (/^\/api\/(search|our-impact|article-media)(\/|$)/.test(path));
    const needsAdmin = !publicRead && (path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/'));
    const adminId = needsAdmin ? event.cookies.get('admin') : undefined;
    if (adminId) {
        try {
            const admin = await db
                .select({
                    id: adminTable.id, admin_id: adminTable.admin_id,
                    email: adminTable.email, username: adminTable.username,
                    name: adminTable.name, role: adminTable.role,
                })
                .from(adminTable)
                .where(eq(adminTable.admin_id, adminId))
                .limit(1);

            if (admin.length > 0) {
                event.locals.session = {
                    id: admin[0].id,
                    admin_id: admin[0].admin_id,
                    email: admin[0].email,
                    username: admin[0].username,
                    name: admin[0].name,
                    role: admin[0].role === 'super_admin' ? 'super_admin' : 'admin'
                };
            }
        } catch (error) {
            console.error('Failed to fetch admin in hook:', error);
        }
    }

    const response = await resolve(event);
    // Invalidate even after a failed write: a multi-step mutation may have
    // partially succeeded. Never let an in-flight read repopulate old content.
    if (event.locals.session && changesPublicContent(path, event.request.method)) await invalidatePublicContent();
    cachePublicResponse(event.route.id, event.request, response);
    return response;
};
