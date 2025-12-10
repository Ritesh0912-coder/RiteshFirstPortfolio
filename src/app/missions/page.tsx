import { db } from "@/lib/db";
import MissionCard from "@/components/MissionCard";
import { Rocket } from "lucide-react";

export const revalidate = 60; // Revalidate every minute for development

export const metadata = {
    title: "Missions - UniverseHub",
    description: "Tracking humanity's biggest space missions.",
};

export default async function MissionsPage() {
    // Fetch missions from our local database
    const missions = await db.mission.findMany({
        orderBy: { launchDate: "desc" },
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4">
                    Major Missions
                </h1>
                <p className="text-gray-400 text-lg">
                    Tracking humanity's journey to the stars.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {missions.map((mission: any) => (
                    <MissionCard key={mission.id} mission={mission} />
                ))}
                {missions.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                        <Rocket className="w-12 h-12 mb-4 opacity-20" />
                        <p>No missions currently in the database.</p>
                        <p className="text-sm mt-2">Login as Admin to add new missions.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
