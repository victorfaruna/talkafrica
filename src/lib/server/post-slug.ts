import { sql } from 'drizzle-orm';
import { postTable } from './schema';

// Mirrors slugifyPostTitle, including accents, punctuation, ampersands, the
// 180-character limit and the empty-title fallback. No schema migration needed.
// This still scans titles in Postgres; it returns only the matching row.
export const postSlug = sql<string>`coalesce(nullif(rtrim(left(trim(both '-' from
    regexp_replace(
        regexp_replace(replace(lower(regexp_replace(normalize(${postTable.title}, NFKD), ${'[\u0300-\u036f]'}, '', 'g')), '&', ' and '), ${"[\u2019']"}, '', 'g'),
        '[^a-z0-9]+', '-', 'g'
    )), 180), '-'), ''), 'article')`;
