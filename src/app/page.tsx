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



      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* UPCOMING LAUNCHES LIST - Span 4 (Replaces News) */}
          <GlassCard className="col-span-1 md:col-span-4 p-6 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron font-bold text-xl text-purple-300">UPCOMING LAUNCHES</h2>
              <Link href="/launches" className="text-xs text-gray-400 hover:text-white transition-colors">VIEW ALL</Link>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {nextLaunches.map((launch: any) => (
                <div key={launch.id} className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                      {launch.image ? (
                        <Image src={launch.image} alt="Rocket" width={30} height={30} className="object-contain" />
                      ) : (
                        <Rocket className="w-6 h-6 text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-purple-400 font-mono block mb-0.5">
                        {new Date(launch.window_start || launch.net).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <h3 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors leading-tight mb-1">
                        {launch.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 truncate">{launch.provider}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* FEATURE STORIES / APOD - Span 8 (Expanded) */}
          <GlassCard className="col-span-1 md:col-span-8 relative h-full min-h-[500px] group overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsData.results.slice(0, 4).map((article: any) => (
            <GlassCard key={article.id} className="group overflow-hidden flex flex-col h-full hover:border-blue-500/30 transition-all duration-300">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-blue-600/90 px-2 py-1 rounded text-white">
                  {article.news_site}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.published_at).toLocaleDateString()}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors line-clamp-3">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                  {article.summary}
                </p>
                <Link href={article.url} target="_blank" className="flex items-center text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors mt-auto">
                  READ FULL ARTICLE <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>


    </main>
  );
}
