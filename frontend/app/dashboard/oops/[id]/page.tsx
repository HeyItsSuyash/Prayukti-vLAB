"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, BookOpen, FileText, CheckCircle, PlayCircle, Box } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Mock Data for OOPs
const practicalData = {
    1: {
        title: "Introduction to Classes and Objects",
        aim: "To understand the basic concepts of classes and objects in Object-Oriented Programming.",
        theory: `
      <div class="space-y-6 text-slate-600 leading-relaxed">
        <p><strong>Class</strong> is a blueprint or template for creating objects. It defines a set of attributes and methods that the created objects will have.</p>
        <p><strong>Object</strong> is an instance of a class. It is a real-world entity that has state and behavior.</p>
        <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
            <h4 class="font-bold text-blue-900 mb-3">Key Concepts:</h4>
            <ul class="list-disc ml-6 space-y-2 text-blue-800">
                <li><strong>Classes</strong> provide the logical structure and data types.</li>
                <li><strong>Objects</strong> provide the actual data in memory.</li>
                <li><strong>Methods</strong> define the behavior and operations on the data.</li>
            </ul>
        </div>
      </div>
    `,
        procedure: `
      <ol class="list-decimal ml-6 space-y-3 text-slate-600 leading-relaxed">
        <li>Select the Classes and Objects simulation from the dashboard.</li>
        <li>Define a "Student" class with properties like name and roll number.</li>
        <li>Instantiate multiple student objects using the class blueprint.</li>
        <li>Interact with the objects to see how independent states are maintained.</li>
        <li>Visualize the memory allocation for each object in the heap.</li>
      </ol>
    `,
    }
};
import { ArrowLeft, FlaskConical, BookOpen, ChevronRight } from "lucide-react";
import { getLabById } from "@/lib/labs/registry";
import { LAB_CONTENT } from "@/lib/labs/rich-content";
import { Badge } from "@/components/ui/badge";
import { use } from "react";

export default function PracticalDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const lab = getLabById(id);
    const content = LAB_CONTENT[id];

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
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/oops" className="hover:text-primary transition-colors">OOPs</Link>
                        <span>/</span>
                        <span className="text-primary truncate max-w-[200px]">{practical.title}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-4">{practical.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Theory</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Quiz Available</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content (Theory) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Aim */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                Aim
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">{practical.aim}</p>
                        </section>

                        {/* Theory */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                Theory
                            </h2>
                            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-primary" dangerouslySetInnerHTML={{ __html: practical.theory }} />
                        </section>

                        {/* Procedure */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                Procedure
                            </h2>
                            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: practical.procedure }} />
                        </section>
                    </div>

                    {/* Right Sidebar (Actions) */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-primary/10 sticky top-24">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                                <Box className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Ready to Code?</h3>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                Enter the interactive coding environment to practice this concept.
                            </p>

                            <Link href={`/dashboard/oops/${id}/simulation`}>
                                <Button className="w-full gap-2 text-base font-semibold py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                                    Launch Environment <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Button>
                            </Link>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Resources</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors text-sm font-medium w-full text-left group">
                                            <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <FileText className="w-4 h-4" />
                                            </span>
                                            Documentation
                                        </button>
                                    </li>
                                    <li>
                                        <button className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors text-sm font-medium w-full text-left group">
                                            <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <PlayCircle className="w-4 h-4" />
                                            </span>
                                            Video Tutorial
                                        </button>
                                    </li>
                                </ul>
                            </div>
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

                {/* Left Content (Theory) */}
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
                        <section className="bg-white rounded-xl border-2 border-black/5 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b-2 border-black/5 pb-4">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                                <h2 className="text-2xl font-black uppercase tracking-tight">Theory</h2>
                            </div>
                            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-p:text-gray-600 prose-strong:text-black" dangerouslySetInnerHTML={{ __html: content.theory }} />
                        </section>

                        <section className="bg-white rounded-xl border-2 border-black/5 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 border-b-2 border-black/5 pb-4">
                                <FlaskConical className="w-6 h-6 text-purple-600" />
                                <h2 className="text-2xl font-black uppercase tracking-tight">Procedure</h2>
                            </div>
                            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-p:text-gray-600 prose-strong:text-black" dangerouslySetInnerHTML={{ __html: content.procedure }} />
                        </section>
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
                            <Link href={`/dashboard/oops/${id}/simulation`}>
                                <Button className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white uppercase font-bold tracking-wider rounded-lg shadow-lg hover:shadow-purple-200 hover:-translate-y-1 transition-all relative z-10">
                                    <FlaskConical className="mr-2 h-5 w-5" />
                                    Launch Simulator
                                </Button>
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl border-2 border-black/5 p-8">
                            <h3 className="font-black text-lg uppercase tracking-tight mb-6">Resources</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-purple-500"></div>
                                    </div>
                                    <span className="font-bold text-sm text-gray-600 group-hover:text-black transition-colors uppercase tracking-wide">Video Lecture</span>
                                </li>
                                <li className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-purple-500"></div>
                                    </div>
                                    <span className="font-bold text-sm text-gray-600 group-hover:text-black transition-colors uppercase tracking-wide">Self Quiz</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
