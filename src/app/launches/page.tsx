import { getGlobalUpcomingLaunches, getGlobalPastLaunches } from "@/lib/launch_service";
import LaunchTimeline from "@/components/LaunchTimeline";
import { getBlacklist } from "@/lib/actions";
import ParticleBackground from "@/components/ParticleBackground";

export const dynamic = 'force-dynamic';

export default async function LaunchesPage() {
    const upcomingRaw = await getGlobalUpcomingLaunches();
    const pastRaw = await getGlobalPastLaunches();
    const hiddenIds = await getBlacklist("LAUNCH");

    const upcoming = upcomingRaw.filter((l: any) => !hiddenIds.includes(l.id));
    const past = pastRaw.filter((l: any) => !hiddenIds.includes(l.id));

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 max-w-7xl mx-auto relative overflow-hidden">
            <ParticleBackground />

            <div className="text-center mb-16 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-2xl">
                    Launches Control
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                    Live telemetry and historical data from the global space network.
                </p>
            </div>

            <div className="relative z-10 space-y-24">
                <LaunchTimeline launches={upcoming} title="Scheduled Missions" />
                <LaunchTimeline launches={past} title="Mission Log" />
            </div>
        </div>
    );
}
