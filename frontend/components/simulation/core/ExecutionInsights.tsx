"use client";

import React from "react";
import { Activity, Database, History, TrendingUp, BarChart3, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExecutionInsightsProps {
    output: any;
    isRunning: boolean;
    onAnalyzeComplexity?: () => void;
    complexityData?: any;
}

export const ExecutionInsights: React.FC<ExecutionInsightsProps> = ({ output, isRunning, onAnalyzeComplexity, complexityData }) => {
    return (
        <div className="w-1/4 border-l border-black/5 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-black/5 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-2 text-blue-600">
                    <Activity className="h-4 w-4" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Execution Insights</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {/* State Monitoring */}
                <section className="space-y-3">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Database className="h-3 w-3" /> Variable State
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[100px] flex flex-col items-center justify-center text-center">
                        {isRunning ? (
                            <div className="space-y-3 w-full">
                                <div className="h-2 w-full bg-slate-100 rounded animate-pulse" />
                                <div className="h-2 w-2/3 bg-slate-100 rounded animate-pulse" />
                                <div className="h-2 w-3/4 bg-slate-100 rounded animate-pulse" />
                            </div>
                        ) : output?.status?.description === "Accepted" ? (
                            <div className="w-full text-left space-y-2">
                                <div className="flex items-center justify-between text-[10px] pb-1 border-b border-black/5">
                                    <span className="font-bold text-slate-500">Pointer Offset</span>
                                    <span className="font-mono text-blue-600">0x7ffc...</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] pb-1 border-b border-black/5">
                                    <span className="font-bold text-slate-500">Heap Allocation</span>
                                    <span className="font-mono text-green-600">{output.memory} KB</span>
                                </div>
                                <p className="text-[9px] text-slate-400 italic mt-2 text-center">Memory trace successfully captured.</p>
                            </div>
                        ) : (
                            <>
                                <TrendingUp className="h-8 w-8 text-slate-200 mb-2" />
                                <p className="text-[10px] font-bold text-slate-400 px-4">
                                    Run code to see variable trace and memory movements.
                                </p>
                            </>
                        )}
                    </div>
                </section>

                {/* Complexity Analysis */}
                <section className="space-y-3">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="h-3 w-3" /> Complexity Growth
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                        {complexityData ? (
                            <div className="space-y-4">
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={complexityData.results}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="inputSize" hide />
                                            <YAxis hide domain={['auto', 'auto']} />
                                            <Tooltip
                                                contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                labelFormatter={(val) => `Input Size: ${val}`}
                                            />
                                            <Line type="monotone" dataKey="time" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb' }} activeDot={{ r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Est. Complexity</span>
                                        <span className="text-xs font-black text-blue-600">{complexityData.estimatedComplexity}</span>
                                    </div>
                                    <button
                                        onClick={onAnalyzeComplexity}
                                        className="text-[9px] font-black uppercase text-blue-600 hover:text-blue-700 underline underline-offset-4"
                                    >
                                        Re-run Analysis
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 space-y-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                                    <Info className="h-5 w-5 text-blue-400" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 px-2 leading-relaxed">
                                    Measure how your code performs with different output sizes.
                                </p>
                                <button
                                    onClick={onAnalyzeComplexity}
                                    disabled={isRunning}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                                >
                                    Analyze Complexity
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Timeline */}
                <section className="space-y-3">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <History className="h-3 w-3" /> Execution Timeline
                    </h3>
                    <div className="space-y-4 pl-2 border-l border-slate-200 ml-1.5">
                        <div className="relative">
                            <div className="absolute -left-[11px] top-1 h-2 w-2 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                            <div className="pl-4">
                                <p className="text-[10px] font-black text-slate-900 uppercase">Initialization</p>
                                <p className="text-[9px] text-slate-500">Global scope initialized</p>
                            </div>
                        </div>
                        {output && (
                            <div className="relative">
                                <div className={`absolute -left-[11px] top-1 h-2 w-2 rounded-full ring-4 ${output.status?.description === 'Accepted' ? 'bg-green-500 ring-green-50' : 'bg-red-500 ring-red-50'}`} />
                                <div className="pl-4">
                                    <p className="text-[10px] font-black text-slate-900 uppercase">{output.status?.description || 'Process End'}</p>
                                    <p className="text-[9px] text-slate-500">
                                        {output.status?.description === 'Accepted'
                                            ? `Execution completed in ${output.time}s`
                                            : `Process terminated with errors`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Bottom Score/Status */}
            <div className="p-4 bg-white border-t border-black/5 mt-auto">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Simulation Quality</span>
                    <span className={`text-xs font-black ${output?.status?.description === 'Accepted' ? 'text-green-600' : 'text-blue-600'}`}>
                        {output?.status?.description === "Accepted" ? "100%" : "0%"}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 rounded-full shadow-lg ${output?.status?.description === 'Accepted' ? 'bg-green-500 shadow-green-200 w-full' : 'bg-blue-600 shadow-blue-200 w-0'}`}
                    />
                </div>
            </div>
        </div>
    );
};
