"use client";

import { MousePointerClick, Beaker, BarChart3 } from "lucide-react";

const steps = [
    {
        id: "01",
        icon: <MousePointerClick className="w-6 h-6 text-white" />,
        title: "Select Lab",
        description: "Choose from our wide range of engineering domains and specific experiments.",
        color: "bg-blue-600",
    },
    {
        id: "02",
        icon: <Beaker className="w-6 h-6 text-white" />,
        title: "Perform Experiment",
        description: "Follow step-by-step instructions to configure apparatus and record observations.",
        color: "bg-indigo-600",
    },
    {
        id: "03",
        icon: <BarChart3 className="w-6 h-6 text-white" />,
        title: "Analyze Results",
        description: "Generate graphs, verify calculations, and download your customized report.",
        color: "bg-violet-600",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-16">
                    <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Simple Workflow</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">
                        How It Works
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center group">
                            <div className={`w-24 h-24 rounded-2xl ${step.color} shadow-lg flex items-center justify-center mb-8 rotate-3 transition-transform group-hover:rotate-6 group-hover:scale-110`}>
                                {step.icon}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                                    {step.id}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                            <p className="text-slate-500 max-w-xs mx-auto leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
