"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    ArrowRight,
    Loader2,
    AlertCircle,
    FlaskConical,
    ChevronRight,
    Terminal
} from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface Experiment {
    _id: string;
    title: string;
    theory?: string;
    algorithm?: string;
    language?: string;
}

export default function LabPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.subjectId as string;

    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [subject, setSubject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!subjectId) return;
            try {
                setLoading(true);
                // Fetch Subject Info first to check for legacy slug
                const subResponse = await axios.get(`${API_URL}/api/subjects`);
                const currentSubject = subResponse.data.find((s: any) => s._id === subjectId || s.slug === subjectId);

                if (currentSubject) {
                    setSubject(currentSubject);
                    if (currentSubject.slug) {
                        router.replace(`/dashboard/${currentSubject.slug}`);
                        return;
                    }
                }

                // Fetch experiments
                const response = await axios.get(`${API_URL}/api/experiments/subject/${subjectId}`);
                setExperiments(response.data);
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError("Failed to load lab environment. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subjectId, router]);

    const handleOpenExperiment = (experimentId: string) => {
        router.push(`/experiment/${experimentId}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans">
            <Navbar />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
                        <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push("/")}>Portal</span>
                        <ChevronRight size={12} />
                        <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push("/labs")}>Labs</span>
                        <ChevronRight size={12} />
                        <span className="text-blue-600">Experiments</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <FlaskConical size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {subject?.title || "Virtual"} <span className="text-blue-600">Experiments</span>
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    {subject?.description || "Browse and select an experiment to start simulation"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Lab Environment...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-950/20 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 text-center px-6">
                            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-xl font-black text-red-600 dark:text-red-400 uppercase italic">Connection Issue</h3>
                            <p className="text-red-500/80 dark:text-red-400/80 max-w-md mx-auto mt-2 font-medium">
                                {error}
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="mt-8 border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 uppercase font-black tracking-widest text-xs h-12 px-10 rounded-xl"
                            >
                                Retry Connection
                            </Button>
                        </div>
                    ) : experiments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
                                <BookOpen size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">No Experiments Found</h3>
                            <p className="text-slate-400 dark:text-slate-500 mt-2 font-medium max-w-sm px-6">
                                We haven't added any experiments to this module yet. Check back soon for updates!
                            </p>
                            <Button
                                onClick={() => router.push("/labs")}
                                className="mt-10 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white uppercase font-black tracking-widest text-xs h-12 px-12 rounded-xl"
                            >
                                Go Back to Labs
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {experiments.map((exp) => (
                                <div
                                    key={exp._id}
                                    className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Glass decoration */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                <Terminal size={20} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-500 transition-colors">
                                                {exp.language || "Universal"} Simulation
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {exp.title}
                                        </h3>

                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 flex-1 line-clamp-3 leading-relaxed">
                                            {exp.theory || "Interactive virtual laboratory simulation designed for syllabus-mapped learning and practical assessment."}
                                        </p>

                                        <Button
                                            onClick={() => handleOpenExperiment(exp._id)}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 rounded-2xl border-none text-slate-900 dark:text-slate-100 group/btn shadow-none flex items-center justify-between px-6"
                                        >
                                            <span className="text-xs font-black uppercase tracking-widest">Open Experiment</span>
                                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 group-hover/btn:bg-white/20 flex items-center justify-center transition-all">
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
