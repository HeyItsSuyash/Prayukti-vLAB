"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ExperimentList } from "@/components/dashboard/ExperimentList";

const practicals = [
    {
        id: 1,
        title: "Study and Verification of Logic Gates",
        difficulty: "Easy" as const,
        href: "/dashboard/dld/1",
        description: "Analyze the truth tables and behavior of AND, OR, NOT, NAND, NOR, XOR, and XNOR gates.",
        duration: "30 mins"
    },
    {
        id: 2,
        title: "Half Adder and Full Adder",
        difficulty: "Medium" as const,
        href: "/dashboard/dld/2",
        description: "Design and implement combinational circuits to perform binary addition.",
        duration: "45 mins"
    },
    {
        id: 3,
        title: "Half Subtractor and Full Subtractor",
        difficulty: "Medium" as const,
        href: "/dashboard/dld/3",
        description: "Design and implement combinational circuits to perform binary subtraction.",
        duration: "45 mins"
    },
    {
        id: 4,
        title: "Binary to Gray Code Converter",
        difficulty: "Hard" as const,
        href: "/dashboard/dld/4",
        description: "Design a 4-bit converter and verify its operation using logic gates.",
        duration: "60 mins"
    },
];
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle } from "lucide-react";
import { getLabsBySubject } from "@/lib/labs/registry";

export default function DLDPage() {
    const labs = getLabsBySubject("DLD");

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-primary">Digital Logic & Design</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                Digital Logic & Design
                            </h1>
                            <p className="text-slate-600 max-w-2xl leading-relaxed">
                                Master the building blocks of digital electronics from basic gates to complex sequential circuits using our interactive simulator.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <div className="text-center px-4 border-r border-slate-100">
                                <span className="block text-2xl font-bold text-primary">{practicals.length}</span>
                                <span className="text-xs text-slate-400 uppercase font-bold">Labs</span>
                            </div>
                            <div className="text-center px-4">
                                <span className="block text-2xl font-bold text-green-600">0%</span>
                                <span className="text-xs text-slate-400 uppercase font-bold">Progress</span>
                </div>

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {labs.length === 0 && <div className="p-8 text-center text-gray-500">No experiments found.</div>}
                    {labs.map((p, index) => (
                        <div key={p.id} className="p-4 border-b last:border-b-0 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800">{p.metadata.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded ${p.metadata.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        p.metadata.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>{p.metadata.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experiments List */}
                <ExperimentList subject="Digital Logic & Design" experiments={practicals} />
            </main>

            <Footer />
        </div>
    );
}
