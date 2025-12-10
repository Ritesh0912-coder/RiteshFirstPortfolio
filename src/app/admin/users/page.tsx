import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Shield, User } from "lucide-react";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-orbitron">Personnel</h2>
                    <p className="text-gray-400">Manage crew members and access levels.</p>
                </div>
            </div>

            <div className="rounded-md border border-white/10 bg-black/40 backdrop-blur-md">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-300">Name</TableHead>
                            <TableHead className="text-gray-300">Email</TableHead>
                            <TableHead className="text-gray-300">Role</TableHead>
                            <TableHead className="text-gray-300">Joined</TableHead>
                            <TableHead className="text-right text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: any) => (
                            <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium text-white flex items-center gap-2">
                                    <div className="bg-blue-600/20 p-1 rounded-full">
                                        <User className="w-4 h-4 text-blue-400" />
                                    </div>
                                    {user.name}
                                </TableCell>
                                <TableCell className="text-gray-400">{user.email}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1 ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                        'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-400">
                                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No personnel found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
