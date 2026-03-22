"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Code2, PlayCircle, Loader2, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimulationRenderer from "@/components/simulation/SimulationRenderer";
import { TheoryPanel } from "@/components/simulation/core/TheoryPanel";
import { ExecutionInsights } from "@/components/simulation/core/ExecutionInsights";
import CodeCompiler from "@/components/simulation/core/CodeCompiler";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function ExperimentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [experiment, setExperiment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [output, setOutput] = useState<any>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [code, setCode] = useState("");
    const [currentLanguage, setCurrentLanguage] = useState("c");
    const [compilerError, setCompilerError] = useState<string | null>(null);
    const [customInput, setCustomInput] = useState("");
    const [complexityData, setComplexityData] = useState<any>(null);

    useEffect(() => {
        if (output?.status?.description === "Accepted" && !isCompleted) {
            setIsCompleted(true);
        }
    }, [output, isCompleted]);

    useEffect(() => {
        const fetchExperiment = async () => {
            try {
                const res = await fetch(`${API_URL}/api/experiments/${id}`);
                const data = await res.ok ? await res.json() : null;
                if (data) {
                    setExperiment(data);
                    setCode(data.codeTemplate || data.defaultCode || "");
                    setCurrentLanguage(data.language || "c");
                } else {
                    setError("Experiment not found");
                }
            } catch (err) {
                setError("Failed to fetch experiment details");
            } finally {
                setLoading(false);
            }
        };
        fetchExperiment();
    }, [id]);

    const handleRun = async () => {
        setIsRunning(true);
        setCompilerError(null);
        setOutput(null);
        setComplexityData(null); // Clear old analysis when code changes

        try {
            console.log(`[VLAB] Running ${currentLanguage} on ${API_URL}`);
            const res = await fetch(`${API_URL}/api/code/run`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    language: currentLanguage.toLowerCase(),
                    input: customInput
                })
            });

            const data = await res.json();

            if (res.ok) {
                setOutput(data);
            } else {
                setCompilerError(data.error || "Execution failed");
            }
        } catch (err) {
            console.error("[VLAB ERROR]", err);
            setCompilerError("Network Error: Could not connect to compiler service.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleAnalyzeComplexity = async () => {
        setIsRunning(true);
        setCompilerError(null);

        try {
            // Generate test inputs for N = 1000, 10000, 50000, 100000
            const inputs = [
                { label: "N=1,000", size: 1000, input: "1000" },
                { label: "N=10,000", size: 10000, input: "10000" },
                { label: "N=50,000", size: 50000, input: "50000" },
                { label: "N=100,000", size: 100000, input: "100000" }
            ];

            const res = await fetch(`${API_URL}/api/code/complexity`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code,
                    language: currentLanguage.toLowerCase(),
                    inputs
                })
            });

            const data = await res.json();
            if (res.ok) {
                setComplexityData(data);
            } else {
                setCompilerError(data.error || "Complexity analysis failed");
            }
        } catch (err) {
            console.error("[COMPLEXITY ERROR]", err);
            setCompilerError("Network Error: Could not connect to complexity service.");
        } finally {
            setIsRunning(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Initializing Lab Environment...</p>
            </div>
        );
    }

    if (error || !experiment) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-white p-4 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <Info className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-slate-900">Experiment Not Found</h1>
                <p className="text-slate-500 max-w-md mb-8">The experiment you are looking for might have been moved or deleted.</p>
                <Link href="/dashboard">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-blue-200 transition-all">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    // Safety Check: Use 3-Panel Layout only for programming labs
    const isProgrammingLab = experiment.compilerEnabled === true || !!experiment.codeTemplate;

    if (!isProgrammingLab) {
        return (
            <div className="flex flex-col h-screen bg-white overflow-hidden">
                <main className="flex-1 flex overflow-hidden">
                    <div className="w-1/3 border-r border-black/5 flex flex-col bg-slate-50/50">
                        <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white z-10">
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard" className="p-2 hover:bg-black/5 rounded-lg transition-colors text-slate-400">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                                <h1 className="font-black uppercase tracking-tighter text-sm truncate max-w-[200px] text-slate-900">
                                    {experiment.title}
                                </h1>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="prose prose-sm prose-slate max-w-none text-slate-600">
                                {experiment.theory}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col bg-white">
                        <SimulationRenderer
                            labId={experiment._id}
                            initialCode={experiment.codeTemplate}
                            language={experiment.language}
                        />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-100 selection:bg-blue-600 selection:text-white overflow-hidden">
            {/* Top Minimal Navigation */}
            <header className="h-12 bg-white border-b border-black/5 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors group">
                        <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-all">
                            <ArrowLeft className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                    </Link>
                    <div className="h-3 w-[1px] bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 hover:bg-blue-600 text-[9px] font-black tracking-widest px-1.5 py-0">EXP {experiment.experimentNumber || "01"}</Badge>
                        <h1 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate max-w-[300px]">{experiment.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200/50">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Auto-Saving Active</span>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mr-2">Pro Lab Mode</Badge>

                    <Button
                        size="sm"
                        onClick={handleRun}
                        disabled={isRunning}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4 font-black text-[10px] uppercase tracking-widest transition-all rounded-lg shadow-lg shadow-blue-500/20"
                    >
                        {isRunning ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <PlayCircle className="h-3 w-3 mr-2" />}
                        {isRunning ? 'Compiling' : 'Run Experiment'}
                    </Button>
                </div>
            </header>

            {/* Experiment Progress Bar */}
            <div className="h-1 w-full bg-slate-100 relative group cursor-help">
                <div
                    className="h-full bg-blue-600 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                    style={{ width: isCompleted ? '100%' : '65%' }}
                />
            </div>

            <main className="flex-1 flex overflow-hidden">
                {/* LEFT PANEL: Documentation (25%) */}
                <div className="w-[25%] border-r border-black/5 bg-white flex flex-col shadow-2xl z-20 overflow-hidden">
                    <TheoryPanel experiment={experiment} />
                </div>

                {/* CENTER PANEL: Professional Workbench (50%) */}
                <div className="w-[50%] flex flex-col bg-[#1e1e1e] relative z-10 shadow-2xl overflow-hidden border-x border-black/10">
                    <CodeCompiler
                        labId={experiment._id}
                        code={code}
                        setCode={setCode}
                        currentLanguage={currentLanguage}
                        setLanguage={setCurrentLanguage}
                        output={output}
                        setOutput={setOutput}
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        handleRun={handleRun}
                        error={compilerError}
                        setError={setCompilerError}
                        customInput={customInput}
                        setCustomInput={setCustomInput}
                    />
                </div>

                {/* RIGHT PANEL: Execution Insights (25%) */}
                <ExecutionInsights
                    output={output}
                    isRunning={isRunning}
                    complexityData={complexityData}
                    onAnalyzeComplexity={handleAnalyzeComplexity}
                />
            </main>
        </div>
    );
}
