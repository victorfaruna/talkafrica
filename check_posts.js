
async function checkPosts() {
    try {
        const response = await fetch('http://localhost:5173/api/posts', {
            method: 'GET',
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (data.success) {
            console.log(`Found ${data.posts.length} posts.`);
            if (data.posts.length > 0) {
                console.log('Most recent post:', data.posts[0].title);
            }
        } else {
            console.error('Failed to list posts:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

checkPosts();
