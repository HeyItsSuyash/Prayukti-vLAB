"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SimulationRenderer from "@/components/simulation/SimulationRenderer";
import { Button } from "@/components/ui/button";

export default function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const labId = id.startsWith('dbms-exp-') ? id : `dbms-exp-${id}`;

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="bg-white border-b-2 border-black/5 px-4 py-3 flex items-center justify-between shrink-0 h-16">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/dbms/${id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="h-4 w-[2px] bg-black/10"></div>
                    <h1 className="font-bold uppercase tracking-tight text-black">DBMS Workbench <span className="text-gray-400 text-sm font-medium ml-2 hidden sm:inline-block">| {id}</span></h1>
                </div>
            </header>
            <div className="flex-1 overflow-hidden relative">
                <SimulationRenderer labId={labId} />
            </div>
        </div>
    );
}
