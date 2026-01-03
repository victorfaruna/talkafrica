import 'dotenv/config';

// Function to fetch search results
async function testSearch(query) {
    const url = `http://localhost:5173/api/posts?search=${encodeURIComponent(query)}`;
    console.log(`Testing search for: "${query}"`);
    console.log(`URL: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success) {
            console.log(`✅ Success! Found ${data.posts.length} results.`);
            data.posts.forEach(post => {
                console.log(`- [${post.post_id}] ${post.title}`);
            });
        } else {
            console.error("❌ API returned success: false");
            console.error(data);
        }
    } catch (error) {
        console.error("❌ Fetch failed:", error.message);
        console.log("Note: Make sure the dev server is running on localhost:5173");
    }
}

// Run test
testSearch("African");
