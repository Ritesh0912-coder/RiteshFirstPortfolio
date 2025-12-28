// Quick check for ISRO news in database
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

async function checkISRONews() {
    // Use dynamic import for ES modules
    const { PrismaClient } = await import('@prisma/client');
    const db = new PrismaClient();

    try {
        console.log("🔍 Checking for ISRO news in database...\n");

        // Get all ISRO articles
        const isroArticles = await db.news.findMany({
            where: {
                OR: [
                    { source: { contains: "ISRO", mode: 'insensitive' } },
                    { title: { contains: "ISRO", mode: 'insensitive' } },
                ]
            },
            orderBy: { publishedAt: 'desc' },
            take: 20
        });

        console.log(`✅ Found ${isroArticles.length} ISRO-related articles\n`);

        if (isroArticles.length > 0) {
            console.log("Recent ISRO Articles:");
            isroArticles.forEach((article, i) => {
                console.log(`\n${i + 1}. ${article.title}`);
                console.log(`   Source: ${article.source}`);
                console.log(`   URL: ${article.url}`);
                console.log(`   Image: ${article.imageUrl ? 'Yes' : 'No'}`);
            });
        } else {
            console.log("❌ No ISRO articles found in database");
            console.log("   This means the sync hasn't run yet or failed");
        }

        // Check total news count
        const totalNews = await db.news.count();
        console.log(`\n📊 Total news articles in database: ${totalNews}`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await db.$disconnect();
    }
}

checkISRONews();
