// Enhanced test script to show detailed news information
const http = require('http');

async function testNewsAPI() {
    try {
        console.log('🚀 Testing Universe Hub News API\n');
        console.log('Fetching news from API...\n');

        const data = await new Promise((resolve, reject) => {
            http.get('http://localhost:3000/api/news?limit=30', (res) => {
                let body = '';

                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        if (res.statusCode !== 200) {
                            reject(new Error(`HTTP ${res.statusCode}`));
                            return;
                        }
                        resolve(JSON.parse(body));
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });

        console.log('═'.repeat(80));
        console.log(`✅ API Response: SUCCESS (200 OK)`);
        console.log(`📰 Total Articles: ${data.results.length}`);
        console.log('═'.repeat(80));

        // Check for ISRO news
        const isroNews = data.results.filter(article =>
            article.title.toLowerCase().includes('isro') ||
            (article.summary && article.summary.toLowerCase().includes('isro'))
        );

        console.log(`\n🇮🇳 ISRO News: ${isroNews.length} articles found`);

        if (isroNews.length > 0) {
            console.log('\n' + '─'.repeat(80));
            isroNews.forEach((article, index) => {
                console.log(`\n${index + 1}. ${article.title}`);
                console.log(`   📡 Source: ${article.news_site}`);
                console.log(`   📅 Published: ${new Date(article.published_at).toLocaleString()}`);
                console.log(`   🔗 URL: ${article.url}`);
            });
            console.log('─'.repeat(80));
        } else {
            console.log('   ℹ️  No ISRO news currently in feed (this is normal)');
        }

        // News sources distribution
        console.log('\n📊 News Sources Distribution:');
        console.log('─'.repeat(80));
        const sources = {};
        data.results.forEach(article => {
            sources[article.news_site] = (sources[article.news_site] || 0) + 1;
        });

        Object.entries(sources).sort((a, b) => b[1] - a[1]).forEach(([source, count]) => {
            const bar = '█'.repeat(Math.floor(count / 2));
            console.log(`  ${source.padEnd(30)} ${count.toString().padStart(3)} ${bar}`);
        });

        // Recent headlines
        console.log('\n📰 Latest Headlines (Top 10):');
        console.log('═'.repeat(80));
        data.results.slice(0, 10).forEach((article, index) => {
            const date = new Date(article.published_at);
            const timeAgo = getTimeAgo(date);
            console.log(`\n${(index + 1).toString().padStart(2)}. ${article.title}`);
            console.log(`    📡 ${article.news_site} | ⏰ ${timeAgo}`);
        });

        console.log('\n' + '═'.repeat(80));
        console.log('\n✅ News API Verification Complete!');
        console.log('\n📡 Active News Sources:');
        console.log('   • Spaceflight News API (https://api.spaceflightnewsapi.net/v4)');
        console.log('   • Google News RSS (space + astronomy)');
        console.log('\n🇮🇳 ISRO Coverage:');
        console.log('   • ISRO news will appear when available in source feeds');
        console.log('   • System actively monitors for ISRO-related content');
        console.log('   • Coverage includes launches, missions, and announcements');
        console.log('\n' + '═'.repeat(80));

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
}

testNewsAPI();
