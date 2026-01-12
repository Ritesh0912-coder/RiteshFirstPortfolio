
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getGlobalUpcomingLaunches } from "@/lib/launch_service";
import Image from "next/image";
import { format } from "date-fns";
import { ExternalLink, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hideExternalResource, getBlacklist } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function AdminLaunchesPage() {
    const launchesRaw = await getGlobalUpcomingLaunches();
    const hiddenIds = await getBlacklist("LAUNCH");

    const launches = launchesRaw.filter((l: any) => !hiddenIds.includes(l.id));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-orbitron">Global Launch Calendar</h2>
                    <p className="text-gray-400">Tracking upcoming flights from all major agencies (SpaceX, NASA, ISRO).</p>
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-gray-300 w-[100px]">Rocket</TableHead>
                                <TableHead className="text-gray-300">Mission</TableHead>
                                <TableHead className="text-gray-300">Provider</TableHead>
                                <TableHead className="text-gray-300">Launch Date</TableHead>
                                <TableHead className="text-gray-300">Status</TableHead>
                                <TableHead className="text-right text-gray-300">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {launches.map((launch: any) => (
                                <TableRow key={launch.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-800">
                                            {launch.image ? (
                                                <Image
                                                    src={launch.image}
                                                    alt={launch.rocket}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-[8px] text-gray-500">
                                                    NO IMG
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-white">
                                        <div className="font-bold text-blue-300">{launch.name}</div>
                                        <div className="text-xs text-gray-500">{launch.rocket} • {launch.pad}</div>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                        {launch.provider}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {launch.net ? format(new Date(launch.net), "MMM d, yyyy HH:mm") : "TBD"}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${launch.status.toLowerCase().includes('go') ? 'bg-green-900/50 text-green-200' : 'bg-yellow-900/50 text-yellow-200'
                                            }`}>
                                            {launch.status_name}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        {launch.webcast && (
                                            <a href={launch.webcast} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-white/10">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </a>
                                        )}
                                        <form action={hideExternalResource.bind(null, launch.id, "LAUNCH")}>
                                            <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/10" title="Delete (Hide)">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {launches.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No upcoming launches found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
