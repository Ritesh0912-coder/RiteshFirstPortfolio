// Test ISRO News Fetching
const Parser = require('rss-parser');

const ISRO_NEWS_RSS = "https://news.google.com/rss/search?q=ISRO+space+satellite+launch&hl=en-IN&gl=IN&ceid=IN:en";

async function testISRONews() {
    console.log("Testing ISRO News Fetching...\n");

    try {
        const parser = new Parser({
            customFields: {
                item: [
                    ['media:content', 'mediaContent'],
                    ['media:thumbnail', 'mediaThumbnail'],
                ]
            }
        });

        const feed = await parser.parseURL(ISRO_NEWS_RSS);

        console.log(`✅ Successfully fetched ${feed.items.length} ISRO news articles\n`);

        // Display first 15 articles
        const articles = feed.items.slice(0, 15);

        articles.forEach((item, index) => {
            console.log(`${index + 1}. ${item.title}`);
            console.log(`   Source: ${item.link}`);
            console.log(`   Date: ${item.isoDate || 'N/A'}`);
            console.log(`   Summary: ${(item.contentSnippet || '').substring(0, 100)}...`);
            console.log('');
        });

        console.log(`\n✅ Test completed! Found ${articles.length} ISRO articles`);

    } catch (error) {
        console.error("❌ Error fetching ISRO news:", error);
    }
}

testISRONews();
