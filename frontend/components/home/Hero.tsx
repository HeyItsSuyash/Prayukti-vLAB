"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden bg-background">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Content */}
                    <div className="flex-1 text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider border border-blue-100">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Next-Gen Virtual Labs
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            Experience Practical Learning Through <span className="text-primary">Virtual Labs</span>
                        </h1>

                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Bridge the gap between theory and practice with our state-of-the-art virtual laboratory platform. Perform complex experiments, visualize results, and master engineering concepts from anywhere.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link href="/labs">
                                <Button size="lg" className="h-14 px-8 text-base rounded-full btn-gradient btn-interaction">
                                    Explore Labs <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/demo">
                                <Button variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-2 hover:bg-slate-50 dark:bg-slate-800">
                                    <PlayCircle className="mr-2 w-5 h-5" /> Watch Demo
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-slate-500">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">2.5k+</span>
                                <span className="text-sm font-medium uppercase tracking-wide">Students</span>
                            </div>
                            <div className="w-px h-12 bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">50+</span>
                                <span className="text-sm font-medium uppercase tracking-wide">Simulations</span>
                            </div>
                            <div className="w-px h-12 bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">24/7</span>
                                <span className="text-sm font-medium uppercase tracking-wide">Access</span>
                            </div>
                        </div>
                    </div>

                    {/* Graphics / Interactive Element placeholder */}
                    <div className="flex-1 w-full max-w-[600px] lg:max-w-none relative">
                        <div className="relative aspect-square md:aspect-[4/3] bg-slate-100 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden group">
                            {/* Placeholder for now - can be replaced with Spline or Image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-white flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 p-8 w-full h-full opacity-50 rotate-3 scale-110">
                                    <div className="bg-blue-50 rounded-2xl w-full h-40 animate-pulse"></div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl w-full h-40 mt-12"></div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl w-full h-40 -mt-12"></div>
                                    <div className="bg-blue-50 rounded-2xl w-full h-40"></div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-white dark:bg-slate-900/80 backdrop-blur border border-white/50 px-6 py-3 rounded-xl shadow-xl font-bold text-slate-800">
                                        Interactive Simulation Preview
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl border border-slate-100 hidden md:block animate-bounce duration-[3000ms]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                                    <span className="font-bold text-slate-800">Experiment Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
