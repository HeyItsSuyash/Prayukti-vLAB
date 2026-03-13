"use client";

import React from "react";
import { BookOpen, Info, Clock, Layers, Zap, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TheoryPanelProps {
    experiment: any;
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({ experiment }) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-slate-50/50">
            {/* Concept Overview */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <BookOpen className="h-4 w-4" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Concept Overview</h2>
                </div>
                <div className="prose prose-sm prose-slate max-w-none">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Introduction</h3>
                    <p className="text-slate-600 leading-relaxed">
                        {experiment.concept || experiment.theory || "Theoretical foundations are being finalized for this experiment."}
                    </p>
                </div>
            </section>

            {/* Procedural Logic / Algorithm */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <Layers className="h-4 w-4" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Procedural Logic</h2>
                </div>
                <div className="space-y-3">
                    {Array.isArray(experiment.algorithm) ? (
                        experiment.algorithm.map((step: string, i: number) => (
                            <div key={i} className="flex gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200 transition-colors group">
                                <div className="h-6 w-6 shrink-0 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-[10px] shadow-lg shadow-blue-200">
                                    {i + 1}
                                </div>
                                <p className="text-xs font-semibold text-slate-700 leading-normal">{step}</p>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-4 rounded-xl font-mono text-[11px] whitespace-pre-wrap border border-slate-200 text-slate-500 italic">
                            {experiment.algorithm || "Step-by-step logic is being documented."}
                        </div>
                    )}
                </div>
            </section>

            {/* Complexity Analysis */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <Zap className="h-4 w-4" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Complexity Analysis</h2>
                </div>
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col p-3 bg-white border border-slate-200 rounded-xl">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Worst Case</span>
                            <Badge className="bg-red-500/10 text-red-600 border-red-200 font-mono text-[10px] w-fit">
                                {experiment.worstCase || "O(N²)"}
                            </Badge>
                        </div>
                        <div className="flex flex-col p-3 bg-white border border-slate-200 rounded-xl">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1">Average Case</span>
                            <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 font-mono text-[10px] w-fit">
                                {experiment.averageCase || "O(N log N)"}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Space Complexity</span>
                        <Badge className="bg-purple-500/10 text-purple-600 border-purple-200 font-mono text-[10px]">
                            {experiment.spaceComplexity || "O(N)"}
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Real-world Applications */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <Globe className="h-4 w-4" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Real-world Applications</h2>
                </div>
                <div className="bg-blue-600/5 border border-blue-600/10 rounded-2xl p-4 text-slate-700 text-xs leading-relaxed italic">
                    {experiment.applications || "This algorithm is fundamental in optimizing search operations and managing structured data in large-scale system architectures."}
                </div>
            </section>

            {/* Dry Run Table */}
            {experiment.dryRun && (
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Dry Run Trace</h2>
                    </div>
                    <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm font-mono text-[10px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-2 font-black text-slate-900">Step</th>
                                    <th className="p-2 font-black text-slate-900">Variables</th>
                                    <th className="p-2 font-black text-slate-900">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {experiment.dryRun.map((row: any, i: number) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-2 text-slate-500">{i + 1}</td>
                                        <td className="p-2 text-blue-600 font-bold">{row.vars}</td>
                                        <td className="p-2 text-slate-600">{row.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
};
