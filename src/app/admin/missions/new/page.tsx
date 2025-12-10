"use client";

export const dynamic = 'force-dynamic';

import { createMission } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from "@/components/ui/GlassCard";
import { ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-purple-600 hover:bg-purple-500">
            {pending ? "Initiating Countdown..." : "Launch Mission Profile"} <Rocket className="ml-2 w-4 h-4" />
        </Button>
    );
}

export default function CreateMissionPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/missions">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold font-orbitron">New Mission</h2>
                    <p className="text-gray-400">Schedule a new mission profile.</p>
                </div>
            </div>

            <GlassCard className="p-8 border-white/10 bg-black/40">
                <form action={createMission} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Mission Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g., Artemis III"
                                required
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agency" className="text-white">Agency</Label>
                            <Input
                                id="agency"
                                name="agency"
                                placeholder="e.g., NASA, SpaceX"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-white">Status</Label>
                            <select name="status" className="w-full h-10 px-3 rounded-md border border-white/10 bg-white/5 text-white">
                                <option value="PLANNED" className="bg-black">PLANNED</option>
                                <option value="ACTIVE" className="bg-black">ACTIVE</option>
                                <option value="COMPLETED" className="bg-black">COMPLETED</option>
                                <option value="CANCELLED" className="bg-black">CANCELLED</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="launchDate" className="text-white">Launch Date</Label>
                            <Input
                                id="launchDate"
                                name="launchDate"
                                type="datetime-local"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Mission objectives..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[150px]"
                        />
                    </div>

                    <SubmitButton />
                </form>
            </GlassCard>
        </div>
    );
}
