"use client";

import React from "react";
import { Terminal, Bug, BarChart3, Clock, Cpu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface LabConsoleProps {
    output: any;
    isRunning: boolean;
    error: string | null;
}

export const LabConsole: React.FC<LabConsoleProps> = ({ output, isRunning, error }) => {
    return (
        <div className="h-full bg-[#1e1e1e] flex flex-col border-t border-white/5">
            <Tabs defaultValue="output" className="flex-1 flex flex-col">
                <div className="bg-[#252526] px-2 flex items-center justify-between border-b border-black/20">
                    <TabsList className="bg-transparent h-9 border-none gap-1">
                        <TabsTrigger
                            value="output"
                            className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-blue-400 text-slate-500 text-[10px] font-black uppercase tracking-widest h-7 px-3 rounded-t-lg transition-all"
                        >
                            <Terminal className="h-3 w-3 mr-2" /> Output
                        </TabsTrigger>
                        <TabsTrigger
                            value="debug"
                            className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-orange-400 text-slate-500 text-[10px] font-black uppercase tracking-widest h-7 px-3 rounded-t-lg transition-all"
                        >
                            <Bug className="h-3 w-3 mr-2" /> Debug Console
                        </TabsTrigger>
                        <TabsTrigger
                            value="metrics"
                            className="data-[state=active]:bg-[#1e1e1e] data-[state=active]:text-green-400 text-slate-500 text-[10px] font-black uppercase tracking-widest h-7 px-3 rounded-t-lg transition-all"
                        >
                            <BarChart3 className="h-3 w-3 mr-2" /> Analytics
                        </TabsTrigger>
                    </TabsList>

                    {output?.status && (
                        <Badge className={`text-[9px] h-5 font-black uppercase tracking-widest ${output.status.description === 'Accepted'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                            {output.status.description}
                        </Badge>
                    )}
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e] font-mono p-4 text-sm leading-relaxed">
                    <TabsContent value="output" className="mt-0 outline-none">
                        {isRunning && (
                            <div className="flex items-center gap-3 text-blue-400 animate-pulse">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <span>Compiler active... Generating output stream</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-xs">
                                <span className="font-black uppercase tracking-widest block mb-2 text-red-500">Execution Error</span>
                                <pre className="whitespace-pre-wrap">{error}</pre>
                            </div>
                        )}

                        {output?.stdout && (
                            <pre className="text-slate-300 whitespace-pre-wrap">{output.stdout}</pre>
                        )}

                        {!isRunning && output?.status?.id === 6 && (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-orange-400 text-xs mt-4">
                                <span className="font-black uppercase tracking-widest block mb-2 text-orange-500">Compilation Failed</span>
                                <p className="mb-2 text-slate-400">Your code could not be compiled. Please check the syntax and imports.</p>
                                <p className="text-[10px] text-slate-500">Go to the <span className="text-orange-400 font-bold">Debug Console</span> tab for the full error log.</p>
                            </div>
                        )}

                        {!isRunning && !output && !error && (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50">
                                <Terminal className="h-8 w-8 stroke-[1px]" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Ready for execution</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="debug" className="mt-0 outline-none">
                        <div className="space-y-4">
                            {output?.compile_output ? (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase text-yellow-500/50">Full Compilation Stack Trace</span>
                                    <pre className="text-yellow-400/80 text-xs whitespace-pre-wrap leading-tight">{output.compile_output}</pre>
                                </div>
                            ) : (
                                <p className="text-slate-600 italic text-xs">No compilation issues detected.</p>
                            )}
                            {output?.stderr && (
                                <div className="space-y-2 pt-4 border-t border-white/5">
                                    <span className="text-[10px] font-black uppercase text-red-500/50">Runtime Standard Error</span>
                                    <pre className="text-red-400 whitespace-pre-wrap text-xs">{output.stderr}</pre>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="metrics" className="mt-0 outline-none">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Execution Time</span>
                                </div>
                                <span className="text-xl font-black text-blue-400">{output?.time || "0.000"} <span className="text-[10px] text-slate-500">sec</span></span>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Cpu className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Peak Memory</span>
                                </div>
                                <span className="text-xl font-black text-green-400">
                                    {output?.memory ? (output.memory / 1024).toFixed(2) : "0.00"} <span className="text-[10px] text-slate-500">MB</span>
                                </span>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
