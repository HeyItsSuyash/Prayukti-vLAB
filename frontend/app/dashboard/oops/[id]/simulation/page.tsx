"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getLabById } from "@/lib/labs/registry";

export default function SimulationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const lab = getLabById(id);
    const [Component, setComponent] = useState<any>(null);

    useEffect(() => {
        if (lab?.component) {
            setComponent(() => lab.component);
        }
    }, [lab]);

    if (!lab) {
        return <div className="p-8 text-center">Lab not found</div>;
    }

    if (!Component) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-xl font-bold mb-4">Simulation Loading...</h1>
                <p className="text-gray-500">Please wait while we prepare the environment.</p>
                <div className="mt-4">
                    <Link href={`/dashboard/oops/${id}`}>
                        <Button variant="outline">Go Back</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/oops/${id}`} className="text-gray-500 hover:text-black p-1 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-gray-800">{lab.metadata.title} - Simulation</h1>
                </div>
                <div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200">
                        Java Compiler
                    </span>
                </div>
            </header>
            <div className="flex-1 overflow-hidden relative">
                <Component practicalId={id} />
            </div>
        </div>
    );
}
