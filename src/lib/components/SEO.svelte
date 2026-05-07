<script lang="ts">
    import { page } from "$app/state";
    import { getOptimizedImageUrl } from "$lib/utils/image";

    interface Props {
        title?: string;
        description?: string;
        image?: string;
        type?: "website" | "article" | "profile" | "video.movie";
        author?: string;
        publishedDate?: string | Date;
        updatedDate?: string | Date;
        canonical?: string;
        keywords?: string[];
        // For Article/Review Schema
        schemaType?: "Article" | "Review" | "WebSite";
        rating?: number;
        publisherName?: string;
        publisherLogo?: string;
    }

    let {
        title: propsTitle,
        description: propsDescription,
        image: propsImage,
        type: propsType = "website",
        author: propsAuthor = "TalkAfrica",
        publishedDate,
        updatedDate,
        canonical,
        keywords = ["Africa", "News", "Culture", "Lifestyle", "TalkAfrica"],
        schemaType = "WebSite",
        rating,
        publisherName = "Talk Africa",
        publisherLogo = "/images/logo.webp",
    }: Props = $props();

    const siteUrl = "https://talkafricang.com";

    // Derived values with fallbacks from page.data
    const title = $derived(
        propsTitle ||
            page.data.post?.title ||
            (page.data.review?.title
                ? `${page.data.review.title} - Movie Review | Talk Africa`
                : "") ||
            (page.data.categoryName
                ? `${page.data.categoryName} - Talk Africa`
                : "") ||
            "TalkAfrica - African News & Lifestyle",
    );

    const description = $derived(
        propsDescription ||
            page.data.post?.excerpt ||
            (page.data.review?.title
                ? `Read Talk Africa's review of ${page.data.review.title}.`
                : "") ||
            "Your premier destination for African news, culture, and innovation.",
    );

    const image = $derived(
        propsImage ||
            page.data.post?.image ||
            page.data.review?.backdrop_url ||
            page.data.review?.poster_url ||
            "/images/logo.webp",
    );

    const author = $derived(
        propsAuthor || page.data.post?.author || page.data.review?.author || "TalkAfrica"
    );

    const type = $derived(
        page.data.review ? "video.movie" : (page.data.post ? "article" : propsType)
    );

    const schema = $derived(
        page.data.review ? "Review" : schemaType
    );

    const currentRating = $derived(
        rating || page.data.review?.rating
    );

    const currentUrl = $derived(canonical || `${siteUrl}${page.url.pathname}`);
    const ogImage = $derived.by(() => {
        if (!image) return `${siteUrl}/images/logo.webp`;
        
        if (image.startsWith("http")) {
            return getOptimizedImageUrl(image, { width: 1200, height: 630 });
        }
        
        // Ensure leading slash for relative paths
        const imagePath = image.startsWith("/") ? image : `/${image}`;
        return `${siteUrl}${imagePath}`;
    });

    // JSON-LD Structured Data
    const jsonLd = $derived.by(() => {
        const base = {
            "@context": "https://schema.org",
            "@type": schema,
            url: currentUrl,
            name: title,
            description: description,
        };

        if (schema === "Article") {
            return {
                ...base,
                headline: title,
                image: [ogImage],
                datePublished: publishedDate
                    ? new Date(publishedDate).toISOString()
                    : undefined,
                dateModified: updatedDate
                    ? new Date(updatedDate).toISOString()
                    : publishedDate
                      ? new Date(publishedDate).toISOString()
                      : undefined,
                author: {
                    "@type": "Person",
                    name: author,
                },
                publisher: {
                    "@type": "Organization",
                    name: publisherName,
                    logo: {
                        "@type": "ImageObject",
                        url: `${siteUrl}${publisherLogo}`,
                    },
                },
            };
        }

        if (schema === "Review") {
            return {
                ...base,
                itemReviewed: {
                    "@type": "Movie",
                    name: title.replace(" - Movie Review | Talk Africa", ""),
                },
                author: {
                    "@type": "Person",
                    name: author,
                },
                reviewRating: {
                    "@type": "Rating",
                    ratingValue: currentRating,
                    bestRating: "5",
                },
            };
        }

        return base;
    });
</script>

<svelte:head>
    <!-- Standard Meta Tags -->
    <title>{title}</title>
    <meta name="description" content={description} />
    {#if keywords.length > 0}
        <meta name="keywords" content={keywords.join(", ")} />
    {/if}
    <link rel="canonical" href={currentUrl} />

    <!-- OpenGraph Tags -->
    <meta property="og:site_name" content={publisherName} />
    <meta property="og:url" content={currentUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content={type} />
    <meta property="og:locale" content="en_NG" />

    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@talkafricang" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- Structured Data -->
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>
