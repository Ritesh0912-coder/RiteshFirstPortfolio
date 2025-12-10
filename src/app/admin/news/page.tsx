import { db } from "@/lib/db";
import { deleteNews } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
    const news = await db.news.findMany({
        orderBy: { publishedAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-orbitron">News Transmissions</h2>
                    <p className="text-gray-400">Manage interstellar news articles.</p>
                </div>
                <Link href="/admin/news/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Transmission
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-white/10 bg-black/40 backdrop-blur-md">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                            <TableHead className="text-gray-300">Title</TableHead>
                            <TableHead className="text-gray-300">Source</TableHead>
                            <TableHead className="text-gray-300">Published</TableHead>
                            <TableHead className="text-right text-gray-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {news.map((item: any) => (
                            <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium text-white">{item.title}</TableCell>
                                <TableCell className="text-gray-400">{item.source || "Unknown"}</TableCell>
                                <TableCell className="text-gray-400">
                                    {format(new Date(item.publishedAt), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/news/edit/${item.id}`}>
                                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-white/10">
                                                Edit
                                            </Button>
                                        </Link>
                                        <form action={deleteNews.bind(null, item.id)}>
                                            <Button variant="ghost" size="sm" type="submit" className="text-red-400 hover:text-red-300 hover:bg-white/10">
                                                Delete
                                            </Button>
                                        </form>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {news.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No transmissions found. Start by creating one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
