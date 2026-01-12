import GlassHero from "@/components/GlassHero";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import ImageTrail from "@/components/ui/ImageTrail";
import { getAPOD, getRecentAPODs } from "@/lib/nasa";
import { getSpaceNews, getArchivedNews, syncSpaceNews, ensureNewsUpdate } from "@/lib/news";
import { getGlobalUpcomingLaunches } from "@/lib/launch_service";
import { getBlacklist } from "@/lib/actions";
import Link from "next/link";
import { db } from "@/lib/db";
import NewsGridItem from "@/components/NewsGridItem";
import { SPACE_PLACEHOLDERS } from "@/lib/utils";



export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Ensure news is fresh
  await ensureNewsUpdate();

  // Fetch archived news for display
  let newsData = await getArchivedNews(50);

  const [nextLaunchesRaw, hiddenNewsIds, recentApods] = await Promise.all([
    getGlobalUpcomingLaunches(),
    getBlacklist("NEWS"),
    getRecentAPODs(15)
  ]);

  const trailImages = recentApods && Array.isArray(recentApods)
    ? recentApods.filter((item: any) => item.media_type === "image").map((item: any) => item.url)
    : [];

  const safeNewsData = newsData && newsData.results ? newsData : { results: [] };
  if (safeNewsData.results) {
    safeNewsData.results = safeNewsData.results.filter((item: any) => !hiddenNewsIds.includes(`ext-${item.id}`));
  }




  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">

      <GlassHero />



      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* UPCOMING LAUNCHES LIST - REMOVED AS PER USER REQUEST */}

          {/* FEATURE STORIES / APOD - Full Width */}


          <GlassCard className="col-span-1 md:col-span-12 relative min-h-[500px] overflow-hidden">
            <div className="w-full h-[500px] relative overflow-hidden">
              <ImageTrail
                items={trailImages.length > 0 ? trailImages : SPACE_PLACEHOLDERS}
                variant={1}
              />
            </div>
          </GlassCard>



        </div>
      </section>

      {/* LATEST NEWS SECTION (Outside Box) */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            LATEST SPACE NEWS
          </h2>
          <Link href="/news">
            <GlassButton variant="outline">View Archive</GlassButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeNewsData.results.slice(0, 18).map((article: any, index: number) => (
            <NewsGridItem key={article.id} article={article} index={index} />
          ))}
        </div>
      </section>


    </main>
  );
}
