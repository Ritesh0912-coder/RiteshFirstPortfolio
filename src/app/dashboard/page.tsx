import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import LogoutButton from "@/components/LogoutButton";
import { User as UserIcon, Rocket, Star, Calendar, Shield, Mail, Edit3, Activity, Zap, Globe } from "lucide-react";
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

    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        // Self-healing: Create user if missing but session exists
        try {
            console.log(`User ${session.user.email} not found in DB, creating...`);
            const newUser = await db.user.create({
                data: {
                    email: session.user.email,
                    name: session.user.name || "Explorer",
                    image: session.user.image,
                    role: "USER"
                }
            });

            // Re-assign user variable (we need to cast or use 'let' above, but here we can just reload or proceed with newUser)
            // Since 'user' is const, we'll continue using newUser properties implicitly or reload page
            redirect("/dashboard"); // Force reload to pick up the new user cleanly
        } catch (error) {
            console.error("Failed to auto-create user:", error);
            return <div className="min-h-screen flex items-center justify-center text-red-400">Error creating profile. Please log out and try again.</div>;
        }
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-7xl mx-auto">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Profile Header */}
            <div className="relative mb-12">
                <GlassCard className="relative overflow-hidden p-8 border border-white/10 bg-gradient-to-br from-slate-900/80 via-blue-900/20 to-purple-900/30 backdrop-blur-2xl shadow-2xl">
                    {/* Decorative Border Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-sm -z-10" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Avatar with Animated Ring */}
                        <div className="relative group">
                            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-50 group-hover:opacity-80 blur-lg transition-all duration-500 animate-spin-slow" style={{ animationDuration: '8s' }} />
                            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-slate-800/80 shadow-2xl bg-black/50">
                                {user.image ? (
                                    <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600">
                                        <span className="text-5xl font-bold text-white drop-shadow-lg">{user.name?.[0] || "U"}</span>
                                    </div>
                                )}
                            </div>
                            {/* Status Indicator */}
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-900 shadow-lg shadow-green-500/50 animate-pulse" title="Online" />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-lg">
                                    {user.name}
                                </h1>
                                <p className="text-cyan-400/80 text-sm tracking-widest uppercase mt-1">Space Explorer</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate max-w-48">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                                    <Shield className="w-4 h-4" />
                                    <span className="font-semibold">{user.role}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {format(new Date(user.createdAt), "MMM yyyy")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <Link href="/dashboard/edit">
                                <button className="group flex items-center gap-2 px-6 py-2.5 rounded-full 
                                                   bg-gradient-to-r from-cyan-600/20 to-blue-600/20 
                                                   border border-cyan-500/30 hover:border-cyan-400/60
                                                   text-cyan-400 hover:text-cyan-300
                                                   transition-all duration-300 ease-out
                                                   hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]
                                                   hover:scale-105 active:scale-95">
                                    <Edit3 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                                    <span className="font-medium text-sm tracking-wide">Edit Profile</span>
                                </button>
                            </Link>
                            <LogoutButton />
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Account Card */}
                <Link href="/dashboard/edit" className="block group">
                    <GlassCard className="relative h-full p-6 border border-white/5 bg-gradient-to-br from-slate-900/60 to-blue-900/20 
                                         hover:border-cyan-500/30 transition-all duration-500 overflow-hidden
                                         hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl translate-x-8 -translate-y-8 group-hover:bg-cyan-500/20 transition-colors duration-500" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                                    <UserIcon className="w-6 h-6 text-cyan-400" />
                                </div>
                                <Activity className="w-5 h-5 text-cyan-500/40 group-hover:text-cyan-400/60 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-50 transition-colors">Profile Settings</h3>
                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Manage your personal data</p>
                        </div>
                    </GlassCard>
                </Link>

                {/* Missions Card */}
                <Link href="/missions" className="block group">
                    <GlassCard className="relative h-full p-6 border border-white/5 bg-gradient-to-br from-slate-900/60 to-purple-900/20 
                                         hover:border-purple-500/30 transition-all duration-500 overflow-hidden
                                         hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl translate-x-8 -translate-y-8 group-hover:bg-purple-500/20 transition-colors duration-500" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 group-hover:border-purple-400/40 transition-colors">
                                    <Star className="w-6 h-6 text-purple-400" />
                                </div>
                                <span className="text-2xl font-bold text-purple-400">0</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-50 transition-colors">Saved Missions</h3>
                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Your tracked space missions</p>
                        </div>
                    </GlassCard>
                </Link>

                {/* Launches Card */}
                <Link href="/launches" className="block group">
                    <GlassCard className="relative h-full p-6 border border-white/5 bg-gradient-to-br from-slate-900/60 to-green-900/20 
                                         hover:border-green-500/30 transition-all duration-500 overflow-hidden
                                         hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl translate-x-8 -translate-y-8 group-hover:bg-green-500/20 transition-colors duration-500" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 group-hover:border-green-400/40 transition-colors">
                                    <Rocket className="w-6 h-6 text-green-400" />
                                </div>
                                <Zap className="w-5 h-5 text-green-500/40 group-hover:text-green-400/60 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-50 transition-colors">Upcoming Launches</h3>
                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Track next rocket launches</p>
                        </div>
                    </GlassCard>
                </Link>

                {/* Explore Card */}
                <Link href="/planets" className="block group">
                    <GlassCard className="relative h-full p-6 border border-white/5 bg-gradient-to-br from-slate-900/60 to-orange-900/20 
                                         hover:border-orange-500/30 transition-all duration-500 overflow-hidden
                                         hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl translate-x-8 -translate-y-8 group-hover:bg-orange-500/20 transition-colors duration-500" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 group-hover:border-orange-400/40 transition-colors">
                                    <Globe className="w-6 h-6 text-orange-400" />
                                </div>
                                <span className="text-xs font-semibold text-orange-400/60 uppercase tracking-widest">Explore</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-50 transition-colors">Solar System</h3>
                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Discover planets & moons</p>
                        </div>
                    </GlassCard>
                </Link>
            </div>

            {/* Recent Activity Section */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                    <h2 className="text-xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                        Flight Check Logs
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                </div>

                <GlassCard className="relative p-8 border border-white/5 bg-gradient-to-br from-slate-900/60 to-slate-800/20 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_70%)]" />
                    <div className="relative">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center">
                            <Activity className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-lg">No recent activity detected on this frequency.</p>
                        <p className="text-gray-600 text-sm mt-2">Start exploring to build your activity log!</p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
