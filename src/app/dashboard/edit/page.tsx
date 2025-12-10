
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { updateUser } from "@/lib/actions";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
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
        return <div>User not found</div>;
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold font-orbitron text-white">Edit Profile</h2>
                    <p className="text-gray-400">Update your personal information.</p>
                </div>
            </div>

            <GlassCard className="p-8 border-white/10 bg-black/40 backdrop-blur-xl">
                <form action={updateUser} className="space-y-6">
                    <input type="hidden" name="email" value={user.email} />

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Display Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name || ""}
                            placeholder="Commander Shepard"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-white">Avatar URL</Label>
                        <Input
                            id="image"
                            name="image"
                            defaultValue={user.image || ""}
                            placeholder="https://..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        <p className="text-xs text-gray-500">
                            Enter a URL for your profile picture.
                        </p>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold tracking-wide">
                        <Save className="mr-2 w-4 h-4" /> Save Changes
                    </Button>
                </form>
            </GlassCard>
        </div>
    );
}
