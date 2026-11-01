import { sql, type SQLWrapper } from 'drizzle-orm';

// Raster data URIs only. Leave other embeds, external URLs and editor HTML intact.
export const INLINE_IMAGE_PATTERN = 'data:image/(?:png|jpe?g|gif|webp|avif|bmp|x-icon);base64,[A-Za-z0-9+/=]+';

/** Replace embedded bytes inside Postgres, before they cross the network. */
export function publicArticleContent(content: SQLWrapper, id: SQLWrapper, kind: 'posts' | 'movies') {
    return sql<string>`case when ${content} ~ ${INLINE_IMAGE_PATTERN} then (
        select string_agg(parts.part || coalesce(
            '/api/article-media/' || ${kind} || '/' || ${id}::text || '/' || md5(images.match[1]), ''
        ), '' order by parts.ordinality)
        from regexp_split_to_table(${content}, ${INLINE_IMAGE_PATTERN}) with ordinality as parts(part, ordinality)
        left join regexp_matches(${content}, ${`(${INLINE_IMAGE_PATTERN})`}, 'g') with ordinality as images(match, ordinality)
        using (ordinality)
    ) else ${content} end`;
}
