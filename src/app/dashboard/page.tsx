import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db"; // Use the DB connection
import GlassCard from "@/components/ui/GlassCard";
import { User as UserIcon, Rocket, Star, Calendar, Shield, Settings, Mail } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function UserDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    if (session.user.role === 'ADMIN') {
        redirect("/admin");
    }

    // Fetch full user data from database for persistence info
    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        // Fallback if DB sync hasn't happened yet (rare with adapter)
        return <div>Loading profile...</div>;
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="relative mb-12">
                <GlassCard className="p-8 border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative bg-black/50">
                                {user.image ? (
                                    <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                                        <span className="text-4xl font-bold text-white">{user.name?.[0] || "U"}</span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-black" title="Online" />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-4xl font-bold font-orbitron text-white">{user.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 text-sm">
                                <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4 text-blue-400" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    {user.role} Class Personnel
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-green-400" />
                                    Joined {format(new Date(user.createdAt), "MMMM yyyy")}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <Link href="/dashboard/edit">
                            <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-white">
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats / Activity */}
                <GlassCard className="p-6 border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-600/20 p-3 rounded-xl group-hover:bg-blue-600/30 transition-colors">
                            <UserIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Profile Settings</h3>
                    <p className="text-gray-400 text-sm">Manage your personal data and preferences.</p>
                </GlassCard>

                <GlassCard className="p-6 border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-600/20 p-3 rounded-xl group-hover:bg-purple-600/30 transition-colors">
                            <Star className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Missions</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">0 Saved</h3>
                            <p className="text-gray-400 text-sm">Your tracked missions.</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-600/20 p-3 rounded-xl group-hover:bg-green-600/30 transition-colors">
                            <Rocket className="w-6 h-6 text-green-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Active</h3>
                    <p className="text-gray-400 text-sm">Ready for next launch.</p>
                </GlassCard>
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="mt-8">
                <h2 className="text-xl font-bold font-orbitron mb-4 text-white">Flight Check Logs</h2>
                <GlassCard className="p-8 border-white/10 bg-black/20 text-center">
                    <p className="text-gray-500">No recent activity detected on this frequency.</p>
                </GlassCard>
            </div>
        </div>
    );
}
