import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
        redirect("/api/auth/signin"); // Or a custom 403 page
    }

    return (
        <div className="flex h-screen bg-space-black text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-md p-6 hidden md:block">
                <div className="mb-8">
                    <h1 className="text-xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        UniverseHub Command
                    </h1>
                </div>

                <nav className="space-y-2">
                    <Link href="/admin" className="block px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/news" className="block px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
                        News Control
                    </Link>
                    <Link href="/admin/missions" className="block px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
                        Missions
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
                        Personnel
                    </Link>
                    <Link href="/" className="block px-4 py-2 rounded-md hover:bg-white/10 transition-colors text-blue-300 mt-8 border-t border-white/10 pt-4">
                        ← Return to Earth
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
