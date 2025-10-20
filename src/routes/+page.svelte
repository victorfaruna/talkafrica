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
    import Team from "$lib/components/Team.svelte";
    export let data;
</script>

<div class="app-container w-full min-h-screen overflow-x-hidden flex flex-col">
    <Header />
    <Hero />
    <Headlines
        posts={data.featuredPosts.length
            ? data.featuredPosts
            : data.latestPosts}
    />
    <Latest posts={data.latestPosts} />
    <PopularBlogs posts={data.posts} />
    <Donate />
    <AboutFounder />
    <Team />
    <Contact />
    <Footer />
</div>
