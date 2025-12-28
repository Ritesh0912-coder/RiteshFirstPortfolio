// Manual News Sync Test - Triggers ISRO news fetch
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const Parser = require('rss-parser');

const db = new PrismaClient();

const ISRO_NEWS_RSS = "https://news.google.com/rss/search?q=ISRO+space+satellite+launch&hl=en-IN&gl=IN&ceid=IN:en";

async function syncISRONews() {
    console.log("🚀 Starting ISRO News Sync...\n");

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
        console.log(`✅ Fetched ${feed.items.length} ISRO articles from RSS\n`);

        const articles = feed.items.slice(0, 15);
        let savedCount = 0;

        for (const item of articles) {
            const externalId = `gn-isro-${Buffer.from(item.link).toString('base64')}`;

            try {
                await db.news.upsert({
                    where: { externalId },
                    update: {
                        updatedAt: new Date(),
                    },
                    create: {
                        externalId,
                        title: item.title || "ISRO News",
                        summary: item.contentSnippet || "Latest ISRO updates",
                        url: item.link || "",
                        imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop",
                        source: "ISRO News (Google)",
                        publishedAt: new Date(item.isoDate || new Date()),
                        content: item.contentSnippet || "",
                    }
                });
                savedCount++;
                console.log(`✅ Saved: ${item.title.substring(0, 60)}...`);
            } catch (error) {
                console.error(`❌ Error saving article: ${error.message}`);
            }
        }

        console.log(`\n✅ Successfully saved ${savedCount} ISRO articles to database`);

        // Check database
        const isroArticles = await db.news.findMany({
            where: {
                source: "ISRO News (Google)"
            },
            orderBy: {
                publishedAt: 'desc'
            },
            take: 15
        });

        console.log(`\n📊 Database Check: Found ${isroArticles.length} ISRO articles in database`);
        console.log("\nRecent ISRO Articles:");
        isroArticles.slice(0, 5).forEach((article, i) => {
            console.log(`${i + 1}. ${article.title}`);
        });

    } catch (error) {
        console.error("❌ Sync Error:", error);
    } finally {
        await db.$disconnect();
    }
}

syncISRONews();
