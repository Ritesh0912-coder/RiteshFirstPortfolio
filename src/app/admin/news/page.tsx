import { db } from "@/lib/db";
import { deleteNews, hideExternalResource, getBlacklist } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, ExternalLink, Trash, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getSpaceNews } from "@/lib/news";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
    // 1. Fetch Local News
    const dbNews = await db.news.findMany({
        orderBy: { publishedAt: "desc" },
        include: { author: true }
    });

    // 2. Fetch External News
    const apiData = await getSpaceNews(20);

    // 3. Fetch Blacklist
    const hiddenIds = await getBlacklist("NEWS");

    // 4. Normalize Data
    const localNews = dbNews.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary,
        imageUrl: item.imageUrl,
        source: "UniverseHub",
        publishedAt: item.publishedAt,
        isLocal: true,
        url: `/news/${item.id}`
    }));

    const externalNews = apiData.results.map((item: any) => ({
        id: `ext-${item.id}`,
        title: item.title,
        summary: item.summary,
        imageUrl: item.image_url,
        source: item.news_site,
        publishedAt: new Date(item.published_at),
        isLocal: false,
        url: item.url
    }));

    // 5. Merge & Filter
    const allNews = [...localNews, ...externalNews]
        .filter(item => !hiddenIds.includes(item.id))
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-orbitron">News Transmissions</h2>
                    <p className="text-gray-400">Manage interstellar news articles & View global feed.</p>
                </div>
                <Link href="/admin/news/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Transmission
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-gray-300 w-[100px]">Image</TableHead>
                                <TableHead className="text-gray-300 w-[300px]">Title</TableHead>
                                <TableHead className="text-gray-300 w-[300px]">Summary</TableHead>
                                <TableHead className="text-gray-300">Source</TableHead>
                                <TableHead className="text-gray-300">Published</TableHead>
                                <TableHead className="text-right text-gray-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allNews.map((item: any) => (
                                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                                    <TableCell>
                                        <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-800">
                                            {item.imageUrl ? (
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-white">
                                        <div className="line-clamp-2" title={item.title}>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                                                {item.title}
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        <div className="line-clamp-2 text-sm" title={item.summary}>
                                            {item.summary || "No summary available."}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${item.isLocal ? 'bg-blue-900/50 text-blue-200' : 'bg-gray-800 text-gray-300'}`}>
                                            {item.source}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-sm whitespace-nowrap">
                                        {format(item.publishedAt, "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {item.isLocal ? (
                                                <>
                                                    <Link href={`/admin/news/edit/${item.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-white/10">
                                                            <Edit className="w-4 h-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </Link>
                                                    <form action={deleteNews.bind(null, item.id)}>
                                                        <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/10">
                                                            <Trash className="w-4 h-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </form>
                                                </>
                                            ) : (
                                                <form action={hideExternalResource.bind(null, item.id, "NEWS")}>
                                                    <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/10" title="Delete (Hide)">
                                                        <Trash className="w-4 h-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </form>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {allNews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                        No transmissions found.
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
