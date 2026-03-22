"use client";

import React, { useState, useEffect, useRef } from "react";
import { MonacoEditor } from "@/components/lab/MonacoEditor";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Loader2, ChevronRight, Download, Save, Copy, Settings2, Moon, Sun, Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabConsole } from "./LabConsole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface CodeCompilerProps {
    labId: string;
    code: string;
    setCode: (val: string) => void;
    currentLanguage: string;
    setLanguage: (val: string) => void;
    output: any;
    setOutput: (output: any) => void;
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    handleRun: () => void;
    error: string | null;
    setError: (error: string | null) => void;
    customInput: string;
    setCustomInput: (val: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function CodeCompiler({
    labId,
    code,
    setCode,
    currentLanguage,
    setLanguage,
    output,
    setOutput,
    isRunning,
    setIsRunning,
    handleRun,
    error,
    setError,
    customInput,
    setCustomInput
}: CodeCompilerProps) {
    const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [isChallengeMode, setIsChallengeMode] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const savedCode = localStorage.getItem(`vlab_code_${labId}`);
        if (savedCode) setCode(savedCode);
    }, [labId, setCode]);

    const handleSave = () => {
        setSaveStatus("saving");
        localStorage.setItem(`vlab_code_${labId}`, code);
        setTimeout(() => setSaveStatus("saved"), 600);
        setTimeout(() => setSaveStatus("idle"), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `solution_${currentLanguage}.${currentLanguage === 'c' ? 'c' : 'cpp'}`;
        document.body.appendChild(element);
        element.click();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleReset = () => {
        setCode(""); // ExperimentPage handles initial template
        setOutput(null);
        setError(null);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-x border-black/10 overflow-hidden">
            {/* Professional Lab Header */}
            <div className="bg-[#252526] border-b border-black/20 p-2 flex items-center justify-between z-10">
                <div className="flex items-center gap-1">
                    <select
                        value={currentLanguage}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-black/40 text-blue-400 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none hover:bg-black/60 transition-all cursor-pointer mr-2 shadow-inner"
                    >
                        <option value="c" className="bg-[#252526]">C</option>
                        <option value="cpp" className="bg-[#252526]">C++</option>
                        <option value="python" className="bg-[#252526]">Python</option>
                        <option value="java" className="bg-[#252526]">Java</option>
                    </select>

                    <div className="flex border border-white/5 rounded-lg overflow-hidden mr-2 bg-black/20">
                        <button
                            onClick={() => setTheme("vs-dark")}
                            className={`p-1.5 transition-colors ${theme === 'vs-dark' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Moon className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => setTheme("light")}
                            className={`p-1.5 transition-colors ${theme === 'light' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <Sun className="h-3 w-3" />
                        </button>
                    </div>

                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 animate-pulse">
                        <div className="h-1 w-1 bg-emerald-500 rounded-full mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                        Live Compiler
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        className={`p-2 rounded-lg transition-all ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                        {saveStatus === 'saving' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-white/10 mx-1" />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsChallengeMode(!isChallengeMode)}
                        className={`h-8 px-3 text-[10px] font-black uppercase tracking-widest transition-all ${isChallengeMode ? 'bg-orange-500/20 text-orange-500 border-orange-500/40 hover:bg-orange-500/30' : 'bg-slate-500/10 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white'}`}
                    >
                        {isChallengeMode ? 'Challenge Mode ON' : 'Challenge Mode'}
                    </Button>
                </div>
            </div>

            {/* Split View: Editor + Console/Input */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 relative">
                    <MonacoEditor
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        language={currentLanguage === 'c' || currentLanguage === 'cpp' ? 'cpp' : currentLanguage}
                        theme={theme}
                    />
                </div>

                {/* Bottom Workbench Area */}
                <div className="h-2/5 flex border-t border-black/40">
                    <div className="w-1/3 bg-[#252526] border-r border-white/5 flex flex-col pt-3 px-4">
                        <div className="flex items-center gap-2 text-blue-400 mb-3">
                            <Keyboard className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Custom Input</span>
                        </div>
                        <textarea
                            ref={inputRef}
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder={isChallengeMode ? "Hidden Inputs are enabled..." : "Type test data here..."}
                            className="flex-1 w-full bg-black/30 border border-white/5 rounded-xl p-3 text-xs font-mono text-slate-300 outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner"
                        />
                        <div className="py-3 flex items-center justify-between gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleReset}
                                className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest h-6 px-1"
                            >
                                <RotateCcw className="h-3 w-3 mr-1" /> Reset Code
                            </Button>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => inputRef.current?.focus()}
                                className="text-blue-500 hover:text-blue-400 text-[9px] font-black uppercase tracking-widest h-6 px-1"
                            >
                                Try Different Input
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <LabConsole
                            output={output}
                            isRunning={isRunning}
                            error={error}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
