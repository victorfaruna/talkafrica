// Native fetch is available in Node.js 18+

async function createPost() {
    try {
        const response = await fetch('http://localhost:5173/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'Test Post',
                content: 'This is a test post content.',
                excerpt: 'Test excerpt',
                categories: ['tech'], // Assuming 'tech' is a valid category
                status: 'draft',
                featured: false
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

createPost();
