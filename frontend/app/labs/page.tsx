"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LabsGrid } from "@/components/home/LabsGrid";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function LabsPage() {
    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
                <Navbar />

                <main className="flex-1 pt-20">
                    {/* Header Section */}
                    <section className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 py-20 relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] -z-10"></div>
                        <div className="container mx-auto px-4 text-center">
                            <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Experimental Modules</span>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase">
                                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Virtual Labs</span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed">
                                Access our collection of high-fidelity, syllabus-mapped simulations across major engineering disciplines.
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
                                <input
                                    type="text"
                                    placeholder="Search for experiments (e.g. NAND Gate, Packet Tracer)..."
                                    className="relative w-full pl-14 pr-6 py-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium shadow-sm group-hover:shadow-md"
                                />
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 w-6 h-6 transition-colors" />
                            </div>
                        </div>
                    </section>

                    {/* Labs Grid */}
                    <div className="py-16 bg-slate-50/50 dark:bg-slate-950">
                        <LabsGrid />
                    </div>
                </main>

                <Footer />
            </div>
        </AuthGuard>
    );
}
