import { db } from "@/lib/db";
import { deleteMission } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Rocket } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminMissionsPage() {
    const missions = await db.mission.findMany({
        orderBy: { launchDate: "asc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-orbitron">Mission Control</h2>
                    <p className="text-gray-400">Manage launch schedules and mission details.</p>
                </div>
                <Link href="/admin/missions/new">
                    <Button className="gap-2 bg-purple-600 hover:bg-purple-500">
                        <Rocket className="w-4 h-4" />
                        New Mission
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-white/10 bg-black/40 backdrop-blur-md">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-300">Mission Name</TableHead>
                            <TableHead className="text-gray-300">Agency</TableHead>
                            <TableHead className="text-gray-300">Status</TableHead>
                            <TableHead className="text-gray-300">Launch Date</TableHead>
                            <TableHead className="text-right text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {missions.map((mission: any) => (
                            <TableRow key={mission.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium text-white">{mission.name}</TableCell>
                                <TableCell className="text-gray-400">{mission.agency || "Unknown"}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${mission.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                                        mission.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400' :
                                            mission.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {mission.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {mission.launchDate ? format(new Date(mission.launchDate), "MMM d, yyyy") : "TBD"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/missions/edit/${mission.id}`}>
                                            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-white/10">
                                                Edit
                                            </Button>
                                        </Link>
                                        <form action={deleteMission.bind(null, mission.id)}>
                                            <Button variant="ghost" size="sm" type="submit" className="text-red-400 hover:text-red-300 hover:bg-white/10">
                                                Delete
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {missions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No active missions. Schedule one now.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
