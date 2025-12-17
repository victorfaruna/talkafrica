
async function updatePost() {
    const postId = 'daf68c61-c8cb-4b69-8457-2b2c37c9d1d2';
    try {
        const response = await fetch('http://localhost:5173/api/posts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                post_id: postId,
                title: 'Updated Test Post',
                content: 'Updated content.',
                categories: ['tech', 'news']
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

updatePost();
