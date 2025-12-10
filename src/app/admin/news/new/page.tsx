"use client";

export const dynamic = 'force-dynamic';

import { createNews } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import GlassCard from "@/components/ui/GlassCard";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-500">
            {pending ? "Transmitting..." : "Publish Transmission"} <Save className="ml-2 w-4 h-4" />
        </Button>
    );
}

export default function CreateNewsPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/news">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold font-orbitron">New Transmission</h2>
                    <p className="text-gray-400">Broadcast a new update to the universe.</p>
                </div>
            </div>

            <GlassCard className="p-8 border-white/10 bg-black/40">
                <form action={createNews} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Headline</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Contact with Alien Life Confirmed"
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="source" className="text-white">Source</Label>
                            <Input
                                id="source"
                                name="source"
                                placeholder="e.g., UniverseHub HQ"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl" className="text-white">Image URL</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                placeholder="https://..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary" className="text-white">Summary</Label>
                        <Textarea
                            id="summary"
                            name="summary"
                            placeholder="Brief briefing for the feed..."
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-white">Full Content</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="Detailed transmission data..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[200px]"
                        />
                    </div>

                    <SubmitButton />
                </form>
            </GlassCard>
        </div>
    );
}
