"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExperimentList } from "@/components/dashboard/ExperimentList";

const practicals = [
    {
        id: 1,
        title: "OSI vs TCP/IP Reference Models",
        difficulty: "Easy" as const,
        href: "/dashboard/cn/1",
        description: "Compare and contrast the OSI and TCP/IP layered architectures through interactive visualisations.",
        duration: "30 mins"
    },
    {
        id: 2,
        title: "CSMA/CD Protocol Study",
        difficulty: "Medium" as const,
        href: "/dashboard/cn/2",
        description: "Simulate collision detection and backoff algorithms in a shared medium network.",
        duration: "45 mins"
    },
    {
        id: 3,
        title: "Token Bus and Token Ring Protocols",
        difficulty: "Medium" as const,
        href: "/dashboard/cn/3",
        description: "Understand token passing mechanisms and ring topology efficiency.",
        duration: "50 mins"
    },
    {
        id: 4,
        title: "Sliding Window Protocols",
        difficulty: "Hard" as const,
        href: "/dashboard/cn/4",
        description: "Implement Stop-and-Wait, Go-Back-N, and Selective Repeat ARQ protocols.",
        duration: "60 mins"
    },
    {
        id: 5,
        title: "Error Detection and Correction",
        difficulty: "Medium" as const,
        href: "/subjects/computer-networks/error-detection",
        description: "Analyze CRC, Checksum, and Hamming Code algorithms for reliable data transmission.",
        duration: "40 mins"
    },
];
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle, ArrowLeft } from "lucide-react";
import { getLabsBySubject } from "@/lib/labs/registry";
import { Badge } from "@/components/ui/badge";

export default function CNPage() {
    const labs = getLabsBySubject("CN");

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-primary">Computer Networks</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                Computer Networks
                            </h1>
                            <p className="text-slate-600 max-w-2xl leading-relaxed">
                                Explore the fundamental concepts of data communication, network architectures, and protocols through our interactive virtual experiments.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <div className="text-center px-4 border-r border-slate-100">
                                <span className="block text-2xl font-bold text-primary">{practicals.length}</span>
                                <span className="text-xs text-slate-400 uppercase font-bold">Labs</span>
                            </div>
                            <div className="text-center px-4">
                                <span className="block text-2xl font-bold text-green-600">0%</span>
                                <span className="text-xs text-slate-400 uppercase font-bold">Progress</span>
                            </div>
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <header className="bg-white border-b-2 border-black/5 sticky top-0 z-20 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="h-4 w-[2px] bg-black/10"></div>
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Department</span>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                    <h1 className="text-lg font-bold uppercase tracking-tight">Computer Networks</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2">Experiments</h2>
                        <p className="text-lg text-gray-500 font-medium">Select an experiment to launch the simulation.</p>
                    </div>
                </div>

                <div className="border-t-2 border-black/10">
                    {labs.length === 0 && (
                        <div className="p-12 text-center text-gray-400 font-medium border-x-2 border-b-2 border-dashed border-black/5">
                            No experiments found for this subject.
                        </div>
                    )}
                    {labs.map((p, index) => (
                        <div key={p.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b-2 border-black/5 hover:bg-gray-50 transition-colors gap-6">
                            <div className="flex items-start gap-6">
                                <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 border-2 border-black/10 rounded-lg group-hover:border-black group-hover:bg-black group-hover:text-white transition-all">
                                    <span className="text-2xl font-black leading-none">{index + 1}</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Exp</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge variant="outline" className={`rounded-none uppercase text-[10px] font-bold tracking-widest border-2 ${p.metadata.difficulty === 'Easy' ? 'border-green-600 text-green-700 bg-green-50' :
                                                p.metadata.difficulty === 'Medium' ? 'border-yellow-600 text-yellow-700 bg-yellow-50' :
                                                    'border-red-600 text-red-700 bg-red-50'
                                            }`}>
                                            {p.metadata.difficulty}
                                        </Badge>
                                        <span className="text-xs font-bold text-gray-400 tracking-wider">EST. TIME: {p.metadata.estimatedTime || "45 MIN"}</span>
                                    </div>
                                    <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-blue-600 transition-colors">{p.metadata.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1 max-w-2xl font-medium">{p.metadata.description}</p>
                                </div>
                            </div>
                            <Link href={`/dashboard/cn/${p.id}`}>
                                <Button className="w-full md:w-auto h-12 px-6 rounded-lg border-2 border-black bg-transparent text-black hover:bg-black hover:text-white uppercase font-bold tracking-wider transition-all whitespace-nowrap">
                                    Start Experiment <PlayCircle className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Experiments List */}
                <ExperimentList subject="Computer Networks" experiments={practicals} />
            </main>

            <Footer />
        </div>
    );
}
