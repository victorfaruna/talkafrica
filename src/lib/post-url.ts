export type PostLinkSource = {
    title?: string | null;
    post_id?: string | null;
};

/** Convert an article title into the canonical, URL-safe article identifier. */
export function slugifyPostTitle(title: string | null | undefined): string {
    const slug = (title ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[’']/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 180)
        .replace(/-+$/g, "");

    return slug || "article";
}

export function postPath(post: PostLinkSource): string {
    const slug = slugifyPostTitle(post.title);
    return `/posts/${slug === "article" && post.post_id ? post.post_id : slug}`;
}
