
import Parser from 'rss-parser';
const parser = new Parser();

const RSS_FEEDS = [
    'https://techpoint.africa/feed/',
    'https://techcabal.com/feed/',
    'https://technext24.com/feed/',
    'https://www.naijatechguide.com/feed',
    'https://www.techinafrica.com/feed/',
    'https://www.itnewsafrica.com/feed/'
];

async function testFeeds() {
    for (const feedUrl of RSS_FEEDS) {
        try {
            console.log(`Testing ${feedUrl}...`);
            const start = Date.now();
            const feed = await parser.parseURL(feedUrl);
            const duration = Date.now() - start;
            console.log(`✅ Success: ${feed.title} (${duration}ms)`);
        } catch (err) {
            console.error(`❌ Failed: ${feedUrl}. Error: ${err.message}`);
        }
    }
}

testFeeds();
