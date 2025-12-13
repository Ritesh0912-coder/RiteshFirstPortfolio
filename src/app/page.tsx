import GlassHero from "@/components/GlassHero";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { getAPOD } from "@/lib/nasa";
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
  const [apodData, newsData, nextLaunchesRaw, featuredMissions, hiddenNewsIds] = await Promise.all([
    getAPOD(),
    getSpaceNews(4),
    getGlobalUpcomingLaunches(),
    db.mission.findMany({
      where: { status: "ACTIVE" },
      take: 3
    }),
    getBlacklist("NEWS")
  ]);

  if (newsData.results) {
    newsData.results = newsData.results.filter((item: any) => !hiddenNewsIds.includes(`ext-${item.id}`));
  }

  const nextLaunches = nextLaunchesRaw.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">

      <GlassHero />

      {/* Top Banner Area (Optional - currently empty) */}
      <div className="mt-4 px-4 max-w-7xl mx-auto hidden">
      </div>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LATEST NEWS - Span 6 (Expanded from 4) */}
          <GlassCard className="col-span-1 md:col-span-6 p-6 flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron font-bold text-xl text-blue-300">LATEST NEWS</h2>
              <Link href="/news" className="text-xs text-gray-400 hover:text-white transition-colors">VIEW ALL</Link>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              {newsData.results.map((article: any) => (
                <div key={article.id} className="group cursor-pointer">
                  <div className="flex gap-4 mb-2">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                      <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] text-blue-400 font-mono block mb-1">{new Date(article.published_at).toLocaleDateString()}</span>
                      <h3 className="text-base font-medium leading-tight text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{article.summary}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5 w-full mt-3" />
                </div>
              ))}
            </div>

            <Link href="/news" className="w-full mt-4">
              <GlassButton variant="outline" className="w-full text-xs h-10">
                Explore Archives
              </GlassButton>
            </Link>
          </GlassCard>

          {/* FEATURE STORIES / APOD - Span 6 (Expanded from 5) */}
          <GlassCard className="col-span-1 md:col-span-6 relative h-full min-h-[400px] group overflow-hidden">
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
                  <h3 className="text-3xl font-bold font-orbitron mb-3">{apodData.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-3 mb-6 max-w-lg">
                    {apodData.explanation}
                  </p>
                  <GlassButton className="text-xs px-6 py-2.5 h-auto">Read Story</GlassButton>
                </div>
              </>
            )}
          </GlassCard>

          {/* ROW 2 */}

          {/* NEXT LAUNCH - Span 4 */}
          <GlassCard className="col-span-1 md:col-span-4 p-6 flex flex-col h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 min-h-[300px]">
            <div className="flex items-center gap-2 mb-6">
              <Rocket className="text-purple-400 w-5 h-5" />
              <h2 className="font-orbitron font-bold text-xl text-purple-300">NEXT LAUNCH</h2>
            </div>

            {nextLaunches.length > 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 animate-pulse-slow">
                  <Image
                    src={nextLaunches[0].image || "/images/rocket-placeholder.svg"}
                    alt="Rocket"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white max-w-[200px] mx-auto leading-tight">{nextLaunches[0].name}</h3>
                  <p className="text-purple-300 text-sm font-mono mt-1">
                    {new Date(nextLaunches[0].window_start || nextLaunches[0].net).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 w-full mt-4">
                  {['days', 'hours', 'mins'].map(unit => (
                    <div key={unit} className="bg-black/40 rounded p-2 border border-white/5">
                      <div className="text-lg font-bold font-mono">00</div>
                      <div className="text-[10px] text-gray-500 uppercase">{unit}</div>
                    </div>
                  ))}
                </div>

                <GlassButton className="w-full mt-auto">Watch Live</GlassButton>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                No upcoming launches
              </div>
            )}
          </GlassCard>

          {/* ACTIVE MISSIONS - Span 4 */}
          <GlassCard className="col-span-1 md:col-span-4 p-6 flex flex-col h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Globe className="text-cyan-400 w-5 h-5" />
                <h2 className="font-orbitron font-bold text-xl text-cyan-300">ACTIVE MISSIONS</h2>
              </div>
              <Link href="/missions" className="text-xs text-gray-400 hover:text-white transition-colors">VIEW ALL</Link>
            </div>

            <div className="flex-1 space-y-4">
              {featuredMissions.length > 0 ? (
                featuredMissions.map((mission: any) => (
                  <div key={mission.id} className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${mission.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{mission.name}</h4>
                        <p className="text-xs text-gray-400 truncate">{mission.agency || "Unknown Agency"}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                  No active missions tracked
                </div>
              )}
            </div>
          </GlassCard>

          {/* GALLERY PREVIEW - Span 4 */}
          <GlassCard className="col-span-1 md:col-span-4 relative h-full min-h-[300px] overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
              alt="Earth from Space"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-orbitron font-bold text-xl">GALLERY</h3>
              <p className="text-xs text-gray-300 mb-3">Stunning views from across the cosmos.</p>
              <GlassButton variant="outline" className="w-full text-xs py-2 h-8">View All</GlassButton>
            </div>
          </GlassCard>

        </div>
      </section>


    </main>
  );
}
