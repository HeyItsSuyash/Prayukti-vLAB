"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SimulationRenderer from "@/components/simulation/SimulationRenderer";
import { Button } from "@/components/ui/button";

export default function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const labId = id.startsWith('mpmc-exp-') ? id : `mpmc-exp-${id}`;

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="bg-white border-b px-4 py-3 flex items-center justify-between shrink-0 h-16">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/mpmc/${id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="h-4 w-[2px] bg-black/10"></div>
                    <h1 className="font-bold text-gray-800">MPMC Simulator <span className="text-gray-400 text-sm font-medium ml-2 hidden sm:inline-block">| {labId}</span></h1>
                </div>
            </header>
            <div className="flex-1 overflow-hidden relative">
                <SimulationRenderer labId={labId} />
            </div>
        </div>
    );
}
