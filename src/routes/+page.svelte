<script>
    import Header from "$lib/components/Header.svelte";
    import Headlines from "$lib/components/Headlines.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import Latest from "$lib/components/Latest.svelte";
    import PopularBlogs from "$lib/components/PopularBlogs.svelte";
    import Donate from "$lib/components/Donate.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Contact from "$lib/components/Contact.svelte";
    import AboutFounder from "$lib/components/AboutFounder.svelte";
    import CategorySection from "$lib/components/CategorySection.svelte";

    import AfricanGiantOfWeek from "$lib/components/AfricanGiantOfWeek.svelte";
    import TrendingTicker from "$lib/components/TrendingTicker.svelte";
    import PopularVideos from "$lib/components/PopularVideos.svelte";
    import { onMount } from "svelte";

    export let data;

    let categoriesData = {
        politics: [],
        economy: [],
        health: [],
        technology: [],
        culture: [],
        sports: [],
        entertainment: [],
        "african-giant": [],
    };

    onMount(async () => {
        const categories = [
            "politics",
            "economy",
            "health",
            "technology",
            "culture",
            "sports",
            "entertainment",
            "african-giant",
        ];

        // Fetch in parallel for better performance
        const results = await Promise.allSettled(
            categories.map((cat) =>
                fetch(
                    `/api/posts?category=${cat}&limit=3&status=published`,
                ).then((res) => res.json()),
            ),
        );

        results.forEach((result, index) => {
            if (result.status === "fulfilled" && result.value.success) {
                categoriesData[categories[index]] = result.value.posts;
            }
        });
    });
</script>

<div class="app-container w-full min-h-screen overflow-x-hidden flex flex-col">
    <Header />
    <Hero />
    <TrendingTicker posts={data.trendingPosts} />
    <Headlines featured={data.featuredPosts} />
    <Latest posts={data.latestPosts} trendingPosts={data.trendingPosts} />

    <PopularBlogs posts={data.posts} />
    <PopularVideos videos={data.videos} />

    <AfricanGiantOfWeek post={data.africanGiant} />

    <!-- Politics -->
    <CategorySection
        category="politics"
        categoryName="Politics"
        posts={categoriesData.politics}
        color="var(--color-accent)"
    />

    <!-- Economy -->
    <CategorySection
        category="economy"
        categoryName="Economy"
        posts={categoriesData.economy}
        color="var(--color-accent)"
    />

    <!-- African Giant (Top Stories) -->
    <CategorySection
        category="african-giant"
        categoryName="African Giant"
        posts={categoriesData["african-giant"]}
        color="#FFD700"
        special={true}
    />

    <!-- Health -->
    <CategorySection
        category="health"
        categoryName="Health"
        posts={categoriesData.health}
        color="var(--color-accent)"
    />

    <!-- Technology -->
    <CategorySection
        category="technology"
        categoryName="Technology"
        posts={categoriesData.technology}
        color="var(--color-accent)"
    />

    <!-- Culture -->
    <CategorySection
        category="culture"
        categoryName="Culture"
        posts={categoriesData.culture}
        color="var(--color-accent)"
    />

    <!-- Sports -->
    <CategorySection
        category="sports"
        categoryName="Sports"
        posts={categoriesData.sports}
        color="var(--color-accent)"
    />

    <!-- Entertainment -->
    <CategorySection
        category="entertainment"
        categoryName="Entertainment"
        posts={categoriesData.entertainment}
        color="var(--color-accent)"
    />

    <Donate />
    <AboutFounder />

    <Contact />
    <Footer />
</div>
