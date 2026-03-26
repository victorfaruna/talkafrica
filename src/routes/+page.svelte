<script lang="ts">
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
    import AfricansOnTheTable from "$lib/components/AfricansOnTheTable.svelte";

    import AfricanGiantOfWeek from "$lib/components/AfricanGiantOfWeek.svelte";
    import TrendingTicker from "$lib/components/TrendingTicker.svelte";
    import MovieRecommendations from "$lib/components/MovieRecommendations.svelte";
    import ImpactShowcase from "$lib/components/ImpactShowcase.svelte";

    import { onMount } from "svelte";

    export let data;
    
    // Use data provided by the server
    $: categoriesData = data.categories;
    
    let africansOnTheTableVideos: any[] = data.videos?.filter((v: any) => v.category === "africans-on-the-table") || [];
    
    onMount(() => {
        // Videos are already fetched on the server in the load function (line 32 of +page.server.ts)
        // If they are not filtered by category there, we can filter them here or just use them if they are correct.
        // The current load function fetches 5 latest videos.
    });
</script>

<div class="app-container w-full min-h-screen overflow-x-hidden flex flex-col">
    <Header />
    <Hero />
    <TrendingTicker posts={data.trendingPosts} />
    <Headlines featured={data.featuredPosts} />
    <Latest posts={data.latestPosts} trendingPosts={data.trendingPosts} />

    <PopularBlogs posts={data.posts} />

    <AfricanGiantOfWeek post={data.africanGiant} />

    <!-- Africans on the Table -->
    <AfricansOnTheTable
        posts={categoriesData["africans-on-the-table"]}
        videos={africansOnTheTableVideos}
    />

    <ImpactShowcase items={data.impactGalleryItems} />

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

    <!-- The Big Screen -->
    <MovieRecommendations recommendedMovies={data.recommendedMovies} />

    <Donate />
    <AboutFounder />

    <Contact />
    <Footer />
</div>
