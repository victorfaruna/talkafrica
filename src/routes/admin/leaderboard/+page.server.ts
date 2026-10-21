import { db } from '$lib/server/db';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { requireSuperAdmin } from '$lib/server/admin-auth';

export const load: PageServerLoad = async ({ url, locals }) => {
    requireSuperAdmin(locals);
    const period = url.searchParams.get('period') === 'all' ? 'all' : 'month';
    const result = period === 'month'
        ? await db.execute(sql`
            SELECT a.admin_id, a.name, a.email, stats.posts, stats.total_views,
                CASE WHEN stats.posts = 0 THEN 0 ELSE ROUND(stats.total_views::numeric / stats.posts) END::int AS avg_views,
                stats.comments
            FROM admin a
            CROSS JOIN LATERAL (
                SELECT
                    (SELECT COUNT(*)::int FROM posts p WHERE p.author_id = a.admin_id AND p.deleted = false AND p.created_at >= date_trunc('month', CURRENT_DATE)) AS posts,
                    (
                        SELECT COALESCE(SUM(p.views), 0)::int
                        FROM posts p
                        WHERE p.author_id = a.admin_id
                          AND p.deleted = false
                          AND p.created_at >= date_trunc('month', CURRENT_DATE)
                    ) + (
                        SELECT COALESCE(SUM(pds.views), 0)::int
                        FROM post_daily_stats pds
                        JOIN posts p ON p.post_id = pds.post_id
                        WHERE p.author_id = a.admin_id
                          AND p.deleted = false
                          AND p.created_at < date_trunc('month', CURRENT_DATE)
                          AND pds.date >= date_trunc('month', CURRENT_DATE)
                    ) AS total_views,
                    (SELECT COUNT(*)::int FROM comments c JOIN posts p ON p.post_id = c.post_id WHERE p.author_id = a.admin_id AND c.created_at >= date_trunc('month', CURRENT_DATE)) AS comments
            ) stats
            ORDER BY total_views DESC, posts DESC`)
        : await db.execute(sql`
            SELECT a.admin_id, a.name, a.email, stats.posts, stats.total_views,
                CASE WHEN stats.posts = 0 THEN 0 ELSE ROUND(stats.total_views::numeric / stats.posts) END::int AS avg_views,
                stats.comments
            FROM admin a
            CROSS JOIN LATERAL (
                SELECT
                    (SELECT COUNT(*)::int FROM posts p WHERE p.author_id = a.admin_id AND p.deleted = false) AS posts,
                    (SELECT COALESCE(SUM(p.views), 0)::int FROM posts p WHERE p.author_id = a.admin_id AND p.deleted = false) AS total_views,
                    (SELECT COUNT(*)::int FROM comments c JOIN posts p ON p.post_id = c.post_id WHERE p.author_id = a.admin_id) AS comments
            ) stats
            ORDER BY total_views DESC, posts DESC`);
    return { period, writers: Array.from(result) };
};
