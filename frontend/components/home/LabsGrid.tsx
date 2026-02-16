"use client";

import Link from "next/link";
import { ArrowRight, Globe, Cpu, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const labs = [
    {
        title: "Computer Networks",
        description: "Simulate complex topologies, packet flows, and protocol behaviors including CSMA/CD and OSI Layers.",
        icon: <Globe className="w-8 h-8 text-blue-600" />,
        href: "/dashboard/cn",
        color: "hover:border-blue-200 hover:shadow-blue-100",
        bg: "bg-blue-50",
        accent: "text-blue-600",
    },
    {
        title: "Digital Logic & Design",
        description: "Build and test logic circuits, master flip-flops, and visualize gate-level operations.",
        icon: <Cpu className="w-8 h-8 text-amber-600" />,
        href: "/dashboard/dld",
        color: "hover:border-amber-200 hover:shadow-amber-100",
        bg: "bg-amber-50",
        accent: "text-amber-600",
    },
    {
        title: "Object Oriented Programming",
        description: "Visualize memory allocation, inheritance hierarchies, and polymorphism through code simulation.",
        icon: <Terminal className="w-8 h-8 text-indigo-600" />,
        href: "/dashboard/oops",
        color: "hover:border-indigo-200 hover:shadow-indigo-100",
        bg: "bg-indigo-50",
        accent: "text-indigo-600",
    },
];

export function LabsGrid() {
    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200" id="labs">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Academic Modules</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                            Explore Our <span className="text-primary">Virtual Ecosystem</span>
                        </h2>
                    </div>
                    <Link href="/labs">
                        <Button variant="outline" className="gap-2">
                            View All Labs <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {labs.map((lab, index) => (
                        <Link href={lab.href} key={index} className="group">
                            <div className={`h-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 ${lab.color}`}>
                                <div className={`w-14 h-14 rounded-xl ${lab.bg} flex items-center justify-center mb-6`}>
                                    {lab.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                    {lab.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {lab.description}
                                </p>
                                <div className={`flex items-center text-sm font-bold ${lab.accent} gap-2`}>
                                    Enter Lab <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
