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

    import AfricanGiantOfWeek from "$lib/components/AfricanGiantOfWeek.svelte";
    export let data;
</script>

<div class="app-container w-full min-h-screen overflow-x-hidden flex flex-col">
    <Header />
    <Hero />
    <Headlines featured={data.featuredPosts} />
    <Latest posts={data.latestPosts} trendingPosts={data.trendingPosts} />
    <PopularBlogs posts={data.posts} />
    <AfricanGiantOfWeek post={data.africanGiant} />
    <Donate />
    <AboutFounder />

    <Contact />
    <Footer />
</div>
