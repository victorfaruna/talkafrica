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
        title = "TalkAfrica - African News & Lifestyle",
        description = "Your premier destination for African news, culture, and innovation.",
        image = "/images/og-default.webp",
        type = "website",
        author = "TalkAfrica",
        publishedDate,
        updatedDate,
        canonical,
        keywords = ["Africa", "News", "Culture", "Lifestyle", "TalkAfrica"],
        schemaType = "WebSite",
        rating,
        publisherName = "Talk Africa",
        publisherLogo = "/images/logo.webp",
    }: Props = $props();

    const siteUrl = "https://talkafrica.com"; // Adjust to actual domain
    const currentUrl = $derived(canonical || `${siteUrl}${page.url.pathname}`);
    const ogImage = $derived(
        image?.startsWith("http")
            ? getOptimizedImageUrl(image, { width: 1200, height: 630 })
            : `${siteUrl}${image}`,
    );

    // JSON-LD Structured Data
    const jsonLd = $derived.by(() => {
        const base = {
            "@context": "https://schema.org",
            "@type": schemaType,
            url: currentUrl,
            name: title,
            description: description,
        };

        if (schemaType === "Article") {
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
                author: [
                    {
                        "@type": "Person",
                        name: author,
                        url: siteUrl,
                    },
                ],
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

        if (schemaType === "Review") {
            return {
                ...base,
                reviewRating: {
                    "@type": "Rating",
                    ratingValue: rating || 5,
                    bestRating: "5",
                },
                author: {
                    "@type": "Person",
                    name: author,
                },
                publisher: {
                    "@type": "Organization",
                    name: publisherName,
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
    <meta property="og:type" content={type} />

    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- Structured Data -->
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>
