import GlassHero from "@/components/GlassHero";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import ImageTrail from "@/components/ui/ImageTrail";
import { getAPOD, getRecentAPODs } from "@/lib/nasa";
import { getSpaceNews } from "@/lib/news";
import { getGlobalUpcomingLaunches } from "@/lib/launch_service";
import { getBlacklist } from "@/lib/actions";
import Link from "next/link";
import { ArrowRight, Calendar, ExternalLink, Rocket, Globe } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/db";
import GoogleAdSense from "@/components/GoogleAdSense";



export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [apodData, newsData, nextLaunchesRaw, featuredMissions, hiddenNewsIds, recentApods] = await Promise.all([
    getAPOD(),
    getSpaceNews(12),
    getGlobalUpcomingLaunches(),
    db.mission.findMany({
      where: { status: "ACTIVE" },
      take: 3
    }),
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

  const nextLaunches = nextLaunchesRaw.slice(0, 3);



  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">

      <GlassHero />



      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* UPCOMING LAUNCHES LIST - REMOVED AS PER USER REQUEST */}

          {/* FEATURE STORIES / APOD - Full Width */}
          <GlassCard className="col-span-1 md:col-span-12 relative h-full min-h-[500px] group overflow-hidden">
            {apodData && (
              <>
                <Image
                  src={apodData.url}
                  alt={apodData.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold inline-block mb-3 text-white">
                    ASTRONOMY PICTURE OF THE DAY
                  </div>
                  <h3 className="text-4xl font-bold font-orbitron mb-4">{apodData.title}</h3>
                  <p className="text-base text-gray-300 line-clamp-3 mb-6 max-w-2xl">
                    {apodData.explanation}
                  </p>
                  <GlassButton className="text-sm px-8 py-3 h-auto">Read Story</GlassButton>
                </div>
              </>
            )}
          </GlassCard>

          <GlassCard className="col-span-1 md:col-span-12 relative min-h-[500px] overflow-hidden">
            <div className="w-full h-[500px] relative overflow-hidden">
              <ImageTrail
                items={trailImages.length > 0 ? trailImages : [
                  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2074&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1454789548728-85d2696cf667?q=80&w=2060&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1614730341194-75c60740a087?q=80&w=2148&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?q=80&w=2074&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop"
                ]}
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
          {safeNewsData.results.slice(0, 12).map((article: any) => (
            <Link href={article.url} key={article.id} target="_blank" rel="noopener noreferrer" className="block h-full">
              <GlassCard className="h-full flex flex-col group hover:border-cyan-500/50 transition-colors duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.image_url || "/images/placeholder-news.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className="absolute bottom-2 right-2 text-xs font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                    {new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold font-orbitron mb-3 text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                    {article.summary}
                  </p>
                  <div className="flex items-center text-xs text-cyan-500 font-mono mt-auto">
                    READ MORE <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>


    </main>
  );
}
