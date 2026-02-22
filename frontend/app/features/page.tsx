"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, Cpu, Terminal, MessageSquare,
    Download, BarChart, Award, Filter,
    Globe, Smartphone, Rocket, Command,
    ChevronRight, Brain, Zap, ShieldCheck,
    CheckCircle2, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureCard } from "@/components/features/FeatureCard";
import { FeatureHighlight } from "@/components/features/FeatureHighlight";
import { PlatformPreview } from "@/components/home/PlatformPreview";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function FeaturesPage() {
    const coreFeatures = [
        {
            icon: BookOpen,
            title: "Syllabus-Based Modules",
            description: "Precisely mapped experiments for all major engineering universities and curriculum standards."
        },
        {
            icon: Cpu,
            title: "Interactive Simulations",
            description: "High-fidelity digital twins of physical lab equipment for real-time experimental feedback."
        },
        {
            icon: Terminal,
            title: "Integrated Code Editor",
            description: "Compile and run code for ECE, CSE, and IT labs directly within your virtual environment."
        },
        {
            icon: MessageSquare,
            title: "Viva Preparation",
            description: "Extensive Q&A database and AI-guided mock vivas for comprehensive examination readiness."
        },
        {
            icon: Download,
            title: "Lab Manuals & PDFs",
            description: "Download detailed procedure guides, result tables, and auto-populated lab records."
        },
        {
            icon: BarChart,
            title: "Progress Tracking",
            description: "Personalized dashboard to monitor completed experiments and performance metrics."
        },
        {
            icon: Award,
            title: "Certified Completion",
            description: "Earn blockchain-verified certificates upon successful completion of virtual lab modules."
        },
        {
            icon: Globe,
            title: "24/7 Global Access",
            description: "Cloud-hosted labs ensure zero downtime. Practice anytime, from anywhere in the world."
        },
        {
            icon: Smartphone,
            title: "Mobile Responsive",
            description: "Seamlessly switch between desktop simulations and mobile-friendly theory & manuals."
        }
    ];

    return (
        <AuthGuard>
            <main className="min-h-screen bg-white dark:bg-slate-950">
                <Navbar />

                {/* 1. Hero Section */}
                <section className="relative pt-40 pb-10 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] -z-10"></div>
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tighter mb-8 uppercase">
                                Powerful Features Built for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Engineering Excellence.</span>
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                                Access a world-class engineering laboratory ecosystem in your browser. From complex simulations to AI-powered viva prep, we deliver precision at every step.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 2. Core Features Section */}
                <section className="pt-10 pb-24 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Everything you need <br /><span className="text-blue-600">in one platform.</span></h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {coreFeatures.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    {...feature}
                                    delay={index * 0.05}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Feature Highlight Blocks */}
                <section className="py-32 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <FeatureHighlight
                            icon={Cpu}
                            title="Real-time Simulation Engine"
                            description="Our custom physics and logical engine renders complex engineering phenomena with zero latency. Experience digital twins of oscilloscopes, logic gates, and fluid mechanics tools."
                            imageComponent={
                                <div className="h-[400px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden relative group">
                                    {/* Abstract Mockup for Simulation */}
                                    <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-700/50 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>
                                    <div className="relative w-48 h-48 border-4 border-blue-600/30 rounded-full flex items-center justify-center animate-spin-slow">
                                        <div className="w-32 h-32 border-4 border-indigo-600/30 rounded-full flex items-center justify-center">
                                            <Cpu className="w-12 h-12 text-blue-600 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 h-20 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/10 p-4">
                                        <div className="w-full h-2 bg-slate-200/50 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ width: ["0%", "100%", "0%"] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="h-full bg-blue-600"
                                            />
                                        </div>
                                        <p className="text-[8px] font-black uppercase text-blue-600 mt-2 tracking-widest">Processing High Fidelity Simulation Data...</p>
                                    </div>
                                </div>
                            }
                        />

                        <FeatureHighlight
                            isReversed
                            icon={Terminal}
                            title="Integrated Code Ecosystem"
                            description="Write, debug, and execute your code modules for Data Structures, Algorithms, and Digital Logic. Supports C, C++, Java, and Python with real-time output visualization."
                            imageComponent={
                                <div className="h-[400px] bg-slate-900 rounded-3xl p-6 font-mono text-sm group overflow-hidden">
                                    <div className="flex gap-2 mb-6">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-blue-400">#include &lt;vlab_engine.h&gt;</p>
                                        <p className="text-purple-400">int <span className="text-blue-300">main</span>() {"{"}</p>
                                        <p className="pl-4 text-emerald-400">// Initializing Laboratory Session</p>
                                        <p className="pl-4 text-slate-300">VLabEngine.<span className="text-blue-300">boot</span>();</p>
                                        <p className="pl-4 text-slate-300">Experiment.<span className="text-blue-300">run</span>("NAND_GATE");</p>
                                        <p className="pl-4 text-amber-500">printf(<span className="text-slate-300">"Session Status: ACTIVE"</span>);</p>
                                        <p className="text-purple-400">{"}"}</p>
                                    </div>
                                    <motion.div
                                        animate={{ opacity: [0, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="w-2 h-5 bg-blue-500 mt-4"
                                    />
                                </div>
                            }
                        />
                    </div>
                </section>

                {/* 4. Why Our Platform is Different */}
                <section className="py-24 bg-white dark:bg-slate-950">
                    <div className="container mx-auto px-4">
                        <div className="max-w-xl mx-auto text-center mb-16">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Old Ways vs <span className="text-blue-600">The Future.</span></h2>
                            <p className="text-slate-600 dark:text-slate-400 font-medium italic">"Virtualization isn't just an alternative, it's an upgrade."</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
                            <div className="bg-white dark:bg-slate-900 p-12 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                        <XCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-400 uppercase">Traditional Labs</h3>
                                </div>
                                <ul className="space-y-6">
                                    {[
                                        "Limited operational hours & physical access.",
                                        "High risk of equipment damage & safety hazards.",
                                        "Manual manual data entry & record management.",
                                        "Wait times for shared hardware/computers."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-400 font-medium">
                                            <span className="mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-600 p-12 space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Rocket className="w-64 h-64 text-white" />
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase">Prayukti Virtual LAB</h3>
                                </div>
                                <ul className="space-y-6 relative z-10">
                                    {[
                                        "Unlimited 24/7 access from any location globally.",
                                        "100% safe environment with infinite equipment retries.",
                                        "Automated digital records & PDF report generation.",
                                        "Instant personal workspace for every single student."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-white/90 font-bold">
                                            <span className="mt-1">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Final CTA Section */}
                <section className="py-24 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-[3rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <Brain className="w-16 h-16 mx-auto opacity-80" />
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                                Ready to Transform <br />Your Learning?
                            </h2>
                            <p className="text-xl text-white/80 font-medium max-w-xl mx-auto">
                                Join over 10,000+ students already mastering their engineering practicals with clinical precision.
                            </p>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                                <Button size="lg" className="h-16 px-12 text-lg rounded-full bg-white text-blue-600 hover:bg-slate-50 border-none font-black uppercase tracking-widest btn-interaction shadow-lg">
                                    Start Practicing Now
                                </Button>
                                <Button variant="outline" size="lg" className="h-16 px-12 text-lg rounded-full border-2 border-white/30 text-white bg-transparent hover:bg-white/10 font-black uppercase tracking-widest btn-interaction">
                                    View Sample Manual
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <Footer />
            </main>
        </AuthGuard>

    );
}
