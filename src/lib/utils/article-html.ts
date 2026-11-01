export function lazyArticleImages(html: string) {
    return html.replace(/<img\b[^>]*>/gi, (tag) => {
        if (!/\bloading\s*=/i.test(tag)) tag = tag.replace(/^<img/i, '<img loading="lazy"');
        if (!/\bdecoding\s*=/i.test(tag)) tag = tag.replace(/^<img/i, '<img decoding="async"');
        return tag;
    });
}
