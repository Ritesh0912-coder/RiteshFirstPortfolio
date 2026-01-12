import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { updateUser } from "@/lib/actions";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, User, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function EditProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                User not found
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-3xl mx-auto">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                            Edit Profile
                        </h2>
                        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                    </div>
                    <p className="text-gray-400 mt-1">Update your personal information.</p>
                </div>
            </div>

            <GlassCard className="relative overflow-hidden p-8 border border-white/10 bg-gradient-to-br from-slate-900/80 via-blue-900/20 to-purple-900/30 backdrop-blur-2xl shadow-2xl">
                {/* Decorative Border Glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

                {/* Preview Section */}
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-40 blur-lg" />
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800/80 shadow-2xl bg-black/50">
                            {user.image ? (
                                <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600">
                                    <span className="text-3xl font-bold text-white">{user.name?.[0] || "U"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <form action={updateUser} className="space-y-6">
                    <input type="hidden" name="email" value={user.email} />

                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-white">
                            <User className="w-4 h-4 text-cyan-400" />
                            Display Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name || ""}
                            placeholder="Commander Shepard"
                            className="bg-slate-900/50 border-white/10 text-white placeholder:text-gray-500 
                                     focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-300
                                     hover:border-white/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image" className="flex items-center gap-2 text-white">
                            <ImageIcon className="w-4 h-4 text-purple-400" />
                            Avatar URL
                        </Label>
                        <Input
                            id="image"
                            name="image"
                            defaultValue={user.image || ""}
                            placeholder="https://..."
                            className="bg-slate-900/50 border-white/10 text-white placeholder:text-gray-500 
                                     focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300
                                     hover:border-white/20"
                        />
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-gray-500" />
                            Enter a URL for your profile picture.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 
                                 font-bold tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40
                                 transition-all duration-300 border border-cyan-400/20 hover:border-cyan-400/40"
                    >
                        <Save className="mr-2 w-4 h-4" />
                        Save Changes
                    </Button>
                </form>
            </GlassCard>

            {/* Helpful Tips */}
            <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                    Changes will be reflected across the entire UniverseHub.
                </p>
            </div>
        </div>
    );
}
