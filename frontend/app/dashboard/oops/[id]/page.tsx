"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, BookOpen, ChevronRight, Box, FileText, PlayCircle, CheckCircle } from "lucide-react";
import { getLabById } from "@/lib/labs/registry";
import { LAB_CONTENT } from "@/lib/labs/rich-content";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import { use } from "react";
import { Chatbot } from "@/components/lab/Chatbot";
import { TheorySection } from "@/components/lab/TheorySection";
import { ResourcesSection } from "@/components/lab/ResourcesSection";

export default function PracticalDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const labId = !isNaN(Number(id)) ? `oops-exp-${id}` : id;

    // Fallback logic if needed, but registry uses full IDs
    const labId = !isNaN(Number(id)) ? `oops-exp-${id}` : id;

    const lab = getLabById(labId);
    const content = LAB_CONTENT[labId];

    if (!lab || !content) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Experiment Not Found</h1>
                    <p className="text-gray-500 font-medium">The requested experiment ID <span className="font-mono bg-gray-100 px-1 rounded">{id}</span> does not exist.</p>
                    <Link href="/dashboard/oops">
                        <Button className="h-12 px-8 uppercase font-bold tracking-wider rounded-none bg-black text-white hover:bg-gray-800">
                            Return to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <header className="bg-white border-b-2 border-black/5 sticky top-0 z-20 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard/oops">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="h-4 w-[2px] bg-black/10"></div>
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-400">OOPS</span>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                    <h1 className="text-lg font-bold uppercase tracking-tight truncate max-w-md">{lab.metadata.title}</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Content (Theory & Procedure) */}
                <div className="lg:col-span-8 space-y-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className={`rounded-none uppercase text-[10px] font-bold tracking-widest border-2 ${lab.metadata.difficulty === 'Easy' ? 'border-green-600 text-green-700 bg-green-50' :
                                lab.metadata.difficulty === 'Medium' ? 'border-yellow-600 text-yellow-700 bg-yellow-50' :
                                    'border-red-600 text-red-700 bg-red-50'
                                }`}>
                                {lab.metadata.difficulty}
                            </Badge>
                            <span className="text-xs font-bold text-gray-400 tracking-wider">EST. TIME: {lab.metadata.estimatedTime || "45 min"}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6 text-purple-600">
                            {lab.metadata.title}
                        </h1>
                        <p className="text-xl text-gray-600 font-medium leading-relaxed border-l-4 border-purple-200 pl-6">
                            {content.aim}
                        </p>
                    </div>

                    <div className="space-y-8">
                        <TheorySection content={content.theory} />

                        <section className="bg-white rounded-xl border-2 border-black/5 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b-2 border-black/5 pb-4">
                                <FlaskConical className="w-6 h-6 text-purple-600" />
                                <h2 className="text-2xl font-black uppercase tracking-tight">Procedure</h2>
                            </div>
                            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-p:text-gray-600 prose-strong:text-black">
                                {content.procedure}
                            </div>
                        </section>

                        <ResourcesSection resources={content.resources} labId={labId} />
                    </div>
                </div>

                {/* Right Sidebar (Actions) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24 space-y-8">
                        <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-24 bg-purple-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-black text-xl uppercase tracking-tight mb-2 relative z-10 text-purple-900">Ready to Start?</h3>
                            <p className="text-sm font-medium text-purple-800/70 mb-8 relative z-10 leading-relaxed">
                                Launch the virtual simulator to build and test your classes.
                            </p>
                            <Link href={`/dashboard/oops/${labId}/simulation`}>
                                <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white uppercase font-bold tracking-wider rounded-lg shadow-lg hover:shadow-purple-200 hover:-translate-y-1 transition-all relative z-10">
                                    <FlaskConical className="mr-2 h-5 w-5" />
                                    Launch Simulator
                                </Button>
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl border-2 border-black/5 p-8">
                            <h3 className="font-black text-lg uppercase tracking-tight mb-4">Lab Status</h3>
                            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-3 rounded-lg border border-green-100">
                                <FlaskConical size={20} />
                                <span>Active Simulation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Chatbot subject="OOPS" labTitle={lab.metadata.title} />

            <Footer />
        </div>
    );
}
