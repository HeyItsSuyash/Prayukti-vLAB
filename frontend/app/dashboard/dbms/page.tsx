"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle, ArrowLeft } from "lucide-react";
import { getLabsBySubject } from "@/lib/labs/registry";
import { Badge } from "@/components/ui/badge";
import { Chatbot } from "@/components/lab/Chatbot";

export default function DBMSPage() {
    const labs = getLabsBySubject("DBMS");

    return (
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
                    <h1 className="text-lg font-bold uppercase tracking-tight">Database Management</h1>
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
                                    <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-green-600 transition-colors">{p.metadata.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1 max-w-2xl font-medium">{p.metadata.description}</p>
                                </div>
                            </div>
                            <Link href={`/dashboard/dbms/${p.id}`}>
                                <Button className="w-full md:w-auto h-12 px-6 rounded-lg border-2 border-black bg-transparent text-black hover:bg-black hover:text-white uppercase font-bold tracking-wider transition-all whitespace-nowrap">
                                    Start Experiment <PlayCircle className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
            <Chatbot subject="DBMS" />
        </div>
    );
}
