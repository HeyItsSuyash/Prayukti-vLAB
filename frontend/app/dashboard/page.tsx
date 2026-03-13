"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/lib/auth/withRole";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import axios from "axios";
import {
    Globe,
    Cpu,
    Terminal,
    Database,
    Layers,
    FlaskConical,
    Loader2,
    AlertCircle,
    ArrowRight
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Subject {
    _id: string;
    title: string;
    description: string;
    icon: string;
    experimentsCount: number;
    slug?: string;
}

// Icon mapping based on subject icon string or title keywords
const getSubjectIcon = (iconName: string, title: string) => {
    const name = (iconName || title).toLowerCase();
    if (name.includes("network") || name.includes("cn")) return <Globe className="w-8 h-8" />;
    if (name.includes("digital") || name.includes("logic") || name.includes("dld")) return <Cpu className="w-8 h-8" />;
    if (name.includes("oop") || name.includes("object") || name.includes("program")) return <Terminal className="w-8 h-8" />;
    if (name.includes("dbms") || name.includes("data") || name.includes("sql")) return <Database className="w-8 h-8" />;
    if (name.includes("dsa") || name.includes("algorithm")) return <Layers className="w-8 h-8" />;
    return <FlaskConical className="w-8 h-8" />;
};

// Color mapping for cards
const getSubjectColor = (index: number) => {
    const colors = [
        "border-blue-500/20 hover:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 text-blue-600",
        "border-amber-500/20 hover:border-amber-500 bg-amber-50/30 dark:bg-amber-900/10 text-amber-600",
        "border-emerald-500/20 hover:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-600",
        "border-indigo-500/20 hover:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-600",
        "border-purple-500/20 hover:border-purple-500 bg-purple-50/30 dark:bg-purple-900/10 text-purple-600",
        "border-rose-500/20 hover:border-rose-500 bg-rose-50/30 dark:bg-rose-900/10 text-rose-600",
    ];
    return colors[index % colors.length];
};

export default function Dashboard() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/subjects`);
                setSubjects(response.data);
            } catch (err) {
                console.error("Fetch subjects error:", err);
                setError("Failed to load laboratory modules. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const navigateToLab = (sub: Subject) => {
        if (sub.slug) {
            router.push(`/dashboard/${sub.slug}`);
        } else {
            router.push(`/lab/${sub._id}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
            <Navbar />

            <main className="container mx-auto px-4 pt-28 pb-20">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">User Session Active</p>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                            My <span className="text-blue-600 italic">Dashboard</span>
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-4 max-w-xl">
                            Select a virtual laboratory module to begin your experimental session.
                        </p>
                    </div>

                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <Link href="/admin/lab-designer">
                            <Button className="h-14 px-8 uppercase font-black tracking-widest bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-black dark:hover:bg-slate-200 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none transition-transform active:scale-95">
                                + Create New Lab
                            </Button>
                        </Link>
                    </RoleGuard>
                </div>

                {/* Subjects Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Modules...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-950/20 rounded-[3rem] border border-red-100 dark:border-red-900/30 text-center px-6">
                        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                        <h2 className="text-2xl font-black text-red-600 dark:text-red-400 uppercase italic">Connection Refused</h2>
                        <p className="text-red-500/80 dark:text-red-400/80 max-w-md mx-auto mt-3 font-medium text-lg">
                            {error}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-8 bg-black dark:bg-white dark:text-black text-white px-10 h-12 rounded-xl uppercase font-black tracking-widest text-xs"
                        >
                            Reconnect
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {subjects.map((sub, idx) => (
                            <Card
                                key={sub._id}
                                onClick={() => navigateToLab(sub)}
                                className={`group cursor-pointer transition-all duration-500 border-2 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:-translate-y-2 ${getSubjectColor(idx)}`}
                            >
                                <CardContent className="p-8">
                                    <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center mb-8 shadow-inner border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500">
                                        {getSubjectIcon(sub.icon, sub.title)}
                                    </div>

                                    <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-4 group-hover:text-blue-600 transition-colors">
                                        {sub.title}
                                    </h3>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 line-clamp-3">
                                        {sub.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                Active Simulations
                                            </span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Analytics / Status Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-600">
                            <span className="text-2xl font-black italic">!</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-slate-900 dark:text-white">System Status</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
                            Simulation clusters are fully operational. Optimal performance detected across all node regions.
                        </p>
                    </div>

                    <RoleGuard allowedRoles={["TEACHER", "ADMIN"]}>
                        <div className="bg-slate-900 dark:bg-white rounded-[3rem] p-10 text-white dark:text-slate-900 relative overflow-hidden group shadow-2xl">
                            {/* Decorative visual */}
                            <div className="absolute top-0 right-0 p-40 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-colors duration-700"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Academic Insights</h3>
                                <p className="text-slate-400 dark:text-slate-500 font-medium mb-8 leading-relaxed max-w-xs">
                                    New simulation metrics are available for your current student batches.
                                </p>

                                <Link href="/teacher/analytics">
                                    <Button className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-none uppercase font-black tracking-widest text-xs h-12 px-8 rounded-xl w-full md:w-auto shadow-lg transition-transform active:scale-95">
                                        View Analytics Layer
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>
                </div>
            </main>

            <Footer />
        </div>
    );
}
