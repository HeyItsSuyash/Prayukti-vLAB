"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MonacoEditor } from "@/components/lab/MonacoEditor";
import { Button } from "@/components/ui/button";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    RotateCcw,
    Loader2,
    BarChart3,
    Table as TableIcon,
    Zap,
    Settings2,
    CheckCircle2,
    Info,
    History,
    TrendingUp,
    Timer,
    Plus,
    X,
    Maximize2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabConsole } from "../core/LabConsole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

interface DAACompilerProps {
    labId: string;
    initialCode?: string;
    language?: string;
}

interface AnalysisResult {
    inputLabel: string;
    inputSize: number;
    time: number;
    memory: number;
    comparisons?: number;
    shifts?: number;
    status: string;
    steps?: any[];
    dataset_preview?: number[];
    execution_time: number;
    size: number;
}

export default function DAACompiler({ labId, initialCode, language = "cpp" }: DAACompilerProps) {
    const [code, setCode] = useState(initialCode || "");
    const [currentLanguage, setCurrentLanguage] = useState(language);
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [bestResults, setBestResults] = useState<AnalysisResult[]>([]);
    const [worstResults, setWorstResults] = useState<AnalysisResult[]>([]);
    const [averageResults, setAverageResults] = useState<AnalysisResult[]>([]);
    
    const [estimatedComplexity, setEstimatedComplexity] = useState<string>("");
    const [activeTab, setActiveTab] = useState("editor");
    const [showComparison, setShowComparison] = useState(true);
    const [showBaselines, setShowBaselines] = useState(false);
    const [caseType, setCaseType] = useState<"BEST" | "WORST" | "AVERAGE">("AVERAGE");
    const [customInputs, setCustomInputs] = useState<number[]>([100, 500, 1000, 2000, 5000]);

    // Default code for Insertion Sort
    const defaultInsertionSortCode = `#include <iostream>
#include <vector>

long long comparisons = 0;
long long shifts = 0;

// Helper functions for dataset generation
std::vector<int> generateBestCase(int n) {
    std::vector<int> arr(n);
    for(int i=0; i<n; i++) arr[i] = i+1;
    return arr;
}

std::vector<int> generateWorstCase(int n) {
    std::vector<int> arr(n);
    for(int i=0; i<n; i++) arr[i] = n-i;
    return arr;
}

std::vector<int> generateAverageCase(int n) {
    std::vector<int> arr(n);
    for(int i=0; i<n; i++) arr[i] = rand() % 10000;
    return arr;
}

// Insertion Sort Implementation
void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (++comparisons && j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            shifts++;
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int n;
    std::string case_type = \"average\"; // Injected by backend
    
    if (!(std::cin >> n)) return 0;
    
    std::vector<int> arr;
    if(case_type == \"best\") arr = generateBestCase(n);
    else if(case_type == \"worst\") arr = generateWorstCase(n);
    else arr = generateAverageCase(n);
    
    comparisons = 0;
    shifts = 0;

    // Sort
    insertionSort(arr);
    
    // Output result for verification
    if (n <= 20) {
        for(int i=0; i<n; i++) std::cout << arr[i] << \" \";
        std::cout << std::endl;
    }
    
    // Output metrics for backend parsing
    std::cout << \"__metrics__ \" << comparisons << \" \" << shifts << std::endl;

    return 0;
}`;

    useEffect(() => {
        if (!code) {
            setCode(defaultInsertionSortCode);
        }
    }, [code, defaultInsertionSortCode]);

    const [vizSteps, setVizSteps] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaybackRunning, setIsPlaybackRunning] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isPlaybackRunning && currentStep < vizSteps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, 800);
        } else {
            setIsPlaybackRunning(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaybackRunning, currentStep, vizSteps.length]);

    const runAnalysis = async () => {
        setIsRunning(true);
        setActiveTab("analysis");
        try {
            const sortedSizes = [...customInputs].sort((a, b) => a - b);
            
            // Run all 3 cases for comparison visualization
            const types: ("best" | "average" | "worst")[] = ["best", "average", "worst"];
            const allResults: Record<string, AnalysisResult[]> = {};

            for (const type of types) {
                const response = await axios.post(`${API_URL}/api/code/complexity`, {
                    code,
                    language: currentLanguage,
                    sizes: sortedSizes,
                    case_type: type
                });
                allResults[type] = Array.isArray(response.data) ? response.data : response.data.results;
            }

            setBestResults(allResults.best);
            setAverageResults(allResults.average);
            setWorstResults(allResults.worst);

            // Set current results based on selection
            const currentFinalResults = allResults[caseType.toLowerCase()] || allResults.average;
            setResults(currentFinalResults);

            // Set up visualization from the current result (usually smallest)
            if (currentFinalResults[0] && currentFinalResults[0].steps && currentFinalResults[0].steps.length > 0) {
                setVizSteps(currentFinalResults[0].steps);
                setCurrentStep(0);
            } else {
                setVizSteps([]);
            }

            // Calculate Complexity Insight using current results
            if (currentFinalResults.length >= 3) {
                const ratios = [];
                for (let i = 1; i < currentFinalResults.length; i++) {
                    const dt = currentFinalResults[i].comparisons || 0;
                    const prevDt = currentFinalResults[i-1].comparisons || 1;
                    const growth = dt / prevDt;
                    const dn = currentFinalResults[i].size / currentFinalResults[i - 1].size;
                    
                    if (dn > 1) {
                        ratios.push(Math.log(growth) / Math.log(dn));
                    }
                }
                const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

                let detected;
                if (avgRatio < 1.4) detected = "O(N)";
                else if (avgRatio < 2.5) detected = "O(N²)";
                else detected = "O(N³)";

                setEstimatedComplexity(detected);
            } else {
                setEstimatedComplexity("O(?)");
            }
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsRunning(false);
        }
    };

    const addInputSize = () => {
        const nextSize = Math.max(...customInputs) * 2;
        if (nextSize <= 10000) {
            setCustomInputs([...customInputs, nextSize]);
        }
    };

    const removeInputSize = (size: number) => {
        if (customInputs.length > 2) {
            setCustomInputs(customInputs.filter(s => s !== size));
        }
    };
    // Calculate chart data with comparisons and baselines
    const chartData = useMemo(() => {
        if (averageResults.length === 0) return [];

        const data = averageResults.map((avg, i) => {
            const size = avg.inputSize;
            const best = bestResults[i]?.comparisons || 0;
            const worst = worstResults[i]?.comparisons || 0;
            const average = avg.comparisons || 0;

            // Theoretical Baselines (scaled for visual comparison)
            // We scale based on the average case's largest point
            const maxAvg = averageResults[averageResults.length - 1].comparisons || 1;
            const maxN = averageResults[averageResults.length - 1].inputSize;
            
            return {
                name: avg.inputLabel,
                size,
                best,
                average,
                worst,
                // Scaled baselines
                O_1: (maxAvg / 10), // Constant
                O_logN: (Math.log2(size) / Math.log2(maxN)) * maxAvg,
                O_N: (size / maxN) * maxAvg,
                O_NlogN: ((size * Math.log2(size)) / (maxN * Math.log2(maxN))) * maxAvg,
                O_N2: ((size * size) / (maxN * maxN)) * maxAvg,
                O_N3: ((size * size * size) / (maxN * maxN * maxN)) * maxAvg,
            };
        });

        return data;
    }, [bestResults, averageResults, worstResults]);


    return (
        <div className="flex h-full bg-[#0d0d0e] text-white font-sans overflow-hidden">
            {/* Left Sidebar: Controls & Metrics */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-[#111112]">
                <div className="p-6 border-b border-white/10 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-blue-400 fill-blue-400/20" />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">DAA Analyzer</h2>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-6 leading-relaxed">
                        Analyze time complexity through multi-stage execution and growth visualization.
                    </p>

                    <Button
                        onClick={runAnalysis}
                        disabled={isRunning}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95 group mb-4"
                    >
                        {isRunning ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <Play className="h-4 w-4 mr-2 fill-current" />
                                Run Analysis
                            </>
                        )}
                    </Button>

                    {/* Dataset Case Selector */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Generation Mode</h3>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
                            {(["BEST", "AVERAGE", "WORST"] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setCaseType(type)}
                                    className={`text-[9px] font-black uppercase py-2 rounded-md transition-all ${caseType === type
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setShowBaselines(!showBaselines)}
                                className={`text-[9px] font-black uppercase py-4 rounded-md border-white/10 ${showBaselines ? "bg-purple-600/20 text-purple-400 border-purple-500/30" : "bg-white/5 text-gray-500"}`}
                             >
                                {showBaselines ? "Hide Baselines" : "Show Baselines"}
                             </Button>
                             <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setShowComparison(!showComparison)}
                                className={`text-[9px] font-black uppercase py-4 rounded-md border-white/10 ${showComparison ? "bg-amber-600/20 text-amber-400 border-amber-500/30" : "bg-white/5 text-gray-500"}`}
                             >
                                {showComparison ? "Hide Comparison" : "Show Comparison"}
                             </Button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Input Sizes Config */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Input Sizes (N)</h3>
                            <button onClick={addInputSize} className="p-1 hover:bg-white/5 rounded text-blue-400 transition-colors">
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {customInputs.sort((a, b) => a - b).map(size => (
                                <Badge key={size} variant="outline" className="bg-white/5 border-white/10 text-[10px] py-1 pl-2 pr-1 font-mono hover:bg-white/10 transition-colors group">
                                    {size}
                                    <button onClick={() => removeInputSize(size)} className="ml-1 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 rounded transition-all">
                                        <X className="h-2 w-2" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Results Overview */}
                    <AnimatePresence>
                        {results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-2 text-green-400">
                                        <History className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Complexity Insight</span>
                                    </div>
                                    <div className="text-2xl font-black text-green-100 tracking-tighter mb-1">
                                        {estimatedComplexity}
                                    </div>
                                    <p className="text-[9px] text-green-500/70 font-bold uppercase tracking-wider leading-relaxed">
                                        {estimatedComplexity === "O(N)"
                                            ? "Analysis suggests linear growth consistent with efficient processing."
                                            : "Analysis confirms quadratic growth patterns found in nested iterations."}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Execution Metrics</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Peak Time</span>
                                            <span className="text-[11px] font-mono text-blue-400 font-bold">
                                                {Math.max(...results.map(r => r.time)).toFixed(4)}s
                                            </span>
                                        </div>
                                        <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Samples</span>
                                            <span className="text-[11px] font-mono text-purple-400 font-bold">{results.length} cases</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!results.length && !isRunning && (
                        <div className="p-8 text-center space-y-4 border-2 border-dashed border-white/5 rounded-2xl opacity-50">
                            <BarChart3 className="h-8 w-8 mx-auto text-gray-600" />
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                                Run analysis to generate growth metrics and complexity graphs.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <div className="px-6 h-14 border-b border-white/10 flex items-center justify-between bg-[#111112]/80 backdrop-blur-md z-10">
                        <TabsList className="bg-white/5 border border-white/5 p-1 h-9 space-x-1 rounded-lg">
                            <TabsTrigger value="editor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-4 h-full rounded-md transition-all">
                                <Plus className="h-3 w-3 mr-2 hidden sm:inline" /> Code Editor
                            </TabsTrigger>
                            <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-4 h-full rounded-md transition-all">
                                <TrendingUp className="h-3 w-3 mr-2 hidden sm:inline" /> Complexity Lab
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1">
                                <div className="h-1 w-1 bg-blue-500 rounded-full mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                Insertion Sort Module
                            </Badge>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <TabsContent value="editor" className="h-full m-0 p-0">
                            <div className="h-full relative group">
                                <MonacoEditor
                                    value={code}
                                    onChange={(v) => setCode(v || "")}
                                    language="cpp"
                                    theme="vs-dark"
                                />
                                <div className="absolute right-6 bottom-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    <Button size="icon" className="h-10 w-10 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                                        <Settings2 className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={() => setCode(defaultInsertionSortCode)} size="icon" className="h-10 w-10 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="analysis" className="h-full m-0 p-0 overflow-y-auto custom-scrollbar bg-[#0d0d0e]">
                            {!results.length && isRunning ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <div className="h-24 w-24 rounded-full border-4 border-blue-600/10 border-t-blue-600 animate-spin" />
                                        <Zap className="h-10 w-10 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white">Execution in Progress</h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Allocating compute nodes for simulation...</p>
                                    </div>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="p-8 space-y-10 max-w-6xl mx-auto">
                                    {/* Stats Board */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5 relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 p-12 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors"></div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 ">Complexity Conclusion</h4>
                                            <div className="text-3xl font-black text-blue-400 tracking-tighter">{estimatedComplexity}</div>
                                            <div className="flex items-center gap-2 mt-4 text-[10px] text-blue-500/70 font-bold uppercase">
                                                <TrendingUp className="h-3 w-3" /> Growth Rate: {estimatedComplexity === "O(N)" ? "Linear" : "Quadratic"}
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Max Dataset Tested</h4>
                                            <div className="text-3xl font-black text-white tracking-tighter">{Math.max(...results.map(r => r.inputSize))} <span className="text-lg text-gray-600">items</span></div>
                                            <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-500 font-bold uppercase">
                                                <CheckCircle2 className="h-3 w-3 text-green-500" /> Stable Execution
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Avg. Micro-time</h4>
                                            <div className="text-3xl font-black text-purple-400 tracking-tighter">
                                                {(results.reduce((a, b) => a + b.time, 0) / results.length).toFixed(4)}s
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-500 font-bold uppercase">
                                                <Timer className="h-3 w-3" /> Latency Optimized
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dataset Preview Section (New) */}
                                    {results.length > 0 && results[0].dataset_preview && results[0].dataset_preview.length > 0 && (
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Info className="h-4 w-4 text-blue-400" />
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Initial Dataset Preview</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {results[0].dataset_preview.slice(0, 50).map((val, idx) => (
                                                    <span key={idx} className="text-[11px] font-mono bg-white/5 px-2 py-1 rounded border border-white/5 text-gray-300">
                                                        {val}
                                                    </span>
                                                ))}
                                                {results[0].dataset_preview.length > 50 && (
                                                    <span className="text-[11px] text-gray-500 font-bold self-end pb-1 ml-2">... and {results[0].dataset_preview.length - 50} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step-by-Step Visualization Panel */}
                                    {vizSteps.length > 0 && (
                                        <div className="p-8 rounded-[2.5rem] bg-[#111112] border border-white/5 bg-gradient-to-b from-blue-500/[0.03] to-transparent">
                                            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                                                <div>
                                                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                                        Algorithm Visualization <span className="text-blue-500 underline decoration-blue-500/30">Step-by-Step</span>
                                                    </h3>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                        Observing inner state transformations (Step {currentStep + 1} of {vizSteps.length})
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                                                    <Button
                                                        size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white/10 active:scale-95"
                                                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                                        disabled={currentStep === 0}
                                                    >
                                                        <SkipBack className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon" variant="ghost" className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                                                        onClick={() => setIsPlaybackRunning(!isPlaybackRunning)}
                                                    >
                                                        {isPlaybackRunning ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                                                    </Button>
                                                    <Button
                                                        size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white/10 active:scale-95"
                                                        onClick={() => setCurrentStep(Math.min(vizSteps.length - 1, currentStep + 1))}
                                                        disabled={currentStep === vizSteps.length - 1}
                                                    >
                                                        <SkipForward className="h-4 w-4" />
                                                    </Button>
                                                    <div className="w-px h-6 bg-white/10 mx-1" />
                                                    <Button
                                                        size="sm" variant="ghost" className="text-[9px] font-black uppercase tracking-widest hover:text-white"
                                                        onClick={() => setCurrentStep(0)}
                                                    >
                                                        Reset
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="relative h-48 flex items-end justify-center gap-1.5 px-4 mb-4">
                                                {vizSteps[currentStep].array.map((val: number, idx: number) => {
                                                    const activeIndex = vizSteps[currentStep].activeIndex;
                                                    const outerIndex = vizSteps[currentStep].outerIndex;
                                                    
                                                    const isActive = idx === activeIndex;
                                                    const isShifted = idx > activeIndex && idx <= outerIndex;
                                                    const isSorted = idx <= outerIndex && !isActive && !isShifted;

                                                    const maxValue = Math.max(...vizSteps[currentStep].array);
                                                    const height = (val / maxValue) * 100;

                                                    return (
                                                        <div key={idx} className="flex-1 flex flex-col items-center group">
                                                            <div
                                                                className={`w-full rounded-t-lg transition-all duration-500 ease-out relative group-hover:brightness-125
                                                                    ${isActive ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 
                                                                      isShifted ? 'bg-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.3)]' :
                                                                      isSorted ? 'bg-green-500/60' : 'bg-white/10'}
                                                                `}
                                                                style={{ height: `${Math.max(height, 5)}%` }}
                                                            >
                                                                {isActive && currentStep > 0 && (
                                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-blue-400 uppercase tracking-widest whitespace-nowrap bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                                                                        Inserted
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className={`text-[9px] font-mono mt-3 ${isActive ? 'text-blue-400 font-bold' : isShifted ? 'text-orange-400' : isSorted ? 'text-green-500' : 'text-gray-600'}`}>
                                                                {val}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Inserted element</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-orange-500/80" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Shifted elements</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Sorted portion</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-white/10" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Unsorted</span>
                                                    </div>
                                                </div>
                                                <p className="text-[9px] text-gray-600 font-medium italic hidden sm:block">
                                                    {currentStep === 0 ? "Initial array state before sorting begins." :
                                                        currentStep === vizSteps.length - 1 ? "Sorting complete! The array is now fully ordered." :
                                                            `Iteration ${currentStep}: Placed key into the sorted portion.`}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Graph Section */}
                                    <div className="p-8 rounded-[2.5rem] bg-[#111112] border border-white/5">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-tighter">Complexity Curves</h3>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Comparisons vs Input Size (N) across all execution cases</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-black uppercase py-1 px-3">
                                                    Metric: Comparisons
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="h-[400px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                                    <XAxis
                                                        dataKey="size"
                                                        stroke="#444"
                                                        fontSize={10}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        label={{ value: 'Input Size (n)', position: 'insideBottomRight', offset: -10, fontSize: 10, fill: '#444' }}
                                                    />
                                                    <YAxis
                                                        stroke="#444"
                                                        fontSize={10}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        label={{ value: 'Comparisons', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#444' }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                                                        itemStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                                    />
                                                    <Legend 
                                                        wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', paddingTop: '20px' }}
                                                        verticalAlign="bottom"
                                                    />
                                                    
                                                    {/* Standard Baselines (Faded) */}
                                                    {showBaselines && (
                                                        <>
                                                            <Line type="monotone" dataKey="O_1" name="O(1)" stroke="#555" strokeDasharray="3 3" dot={false} strokeOpacity={0.3} />
                                                            <Line type="monotone" dataKey="O_logN" name="O(log N)" stroke="#555" strokeDasharray="3 3" dot={false} strokeOpacity={0.4} />
                                                            <Line type="monotone" dataKey="O_N" name="O(N)" stroke="#555" strokeDasharray="3 3" dot={false} strokeOpacity={0.5} />
                                                            <Line type="monotone" dataKey="O_NlogN" name="O(N log N)" stroke="#555" strokeDasharray="3 3" dot={false} strokeOpacity={0.6} />
                                                            <Line type="monotone" dataKey="O_N2" name="O(N²)" stroke="#555" strokeDasharray="3 3" dot={false} strokeOpacity={0.7} />
                                                            <Line type="monotone" dataKey="O_N3" name="O(N³)" stroke="#555" strokeDasharray="3 3" dot={false} strokeOpacity={0.2} />
                                                        </>
                                                    )}

                                                    {/* Actual Case Curves with Dynamic Highlighting */}
                                                    <Line
                                                        type="monotone"
                                                        dataKey="best"
                                                        name="Best Case"
                                                        stroke="#10b981"
                                                        strokeWidth={caseType === "BEST" ? 4 : 1.5}
                                                        strokeOpacity={caseType === "BEST" ? 1 : 0.3}
                                                        dot={caseType === "BEST"}
                                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                                        className={caseType === "BEST" ? "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" : ""}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="average"
                                                        name="Average Case"
                                                        stroke="#f97316"
                                                        strokeWidth={caseType === "AVERAGE" ? 4 : 1.5}
                                                        strokeOpacity={caseType === "AVERAGE" ? 1 : 0.3}
                                                        dot={caseType === "AVERAGE"}
                                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                                        className={caseType === "AVERAGE" ? "drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : ""}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="worst"
                                                        name="Worst Case"
                                                        stroke="#ef4444"
                                                        strokeWidth={caseType === "WORST" ? 4 : 1.5}
                                                        strokeOpacity={caseType === "WORST" ? 1 : 0.3}
                                                        dot={caseType === "WORST"}
                                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                                        className={caseType === "WORST" ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : ""}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Metrics Summary Panel */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Comparisons</h4>
                                            <div className="text-2xl font-black text-purple-400 font-mono">
                                                {results.reduce((acc, curr) => acc + (curr.comparisons || 0), 0).toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-bold uppercase mt-1">Aggregated across all sizes</div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5 bg-gradient-to-br from-orange-500/5 to-transparent">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Shifts</h4>
                                            <div className="text-2xl font-black text-orange-400 font-mono">
                                                {results.reduce((acc, curr) => acc + (curr.shifts || 0), 0).toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-bold uppercase mt-1">Movement operations count</div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5 bg-gradient-to-br from-green-500/5 to-transparent">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Peak Exec Time</h4>
                                            <div className="text-2xl font-black text-blue-400 font-mono">
                                                {Math.max(...results.map(r => r.time)).toFixed(5)}s
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-bold uppercase mt-1">Worst performing sample</div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-[#111112] border border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Case Type</h4>
                                            <div className="text-2xl font-black text-white uppercase tracking-tighter">
                                                {caseType} <span className="text-xs text-blue-500">CASE</span>
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-bold uppercase mt-1">Generation Mode Used</div>
                                        </div>
                                    </div>

                                    {/* Data Table */}
                                    <div className="overflow-hidden rounded-[2.5rem] bg-[#111112] border border-white/5">
                                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <TableIcon className="h-5 w-5 text-gray-500" />
                                                <h3 className="text-xl font-black uppercase tracking-tighter">Raw Analysis Data</h3>
                                            </div>
                                            <Button size="icon" variant="ghost" className="rounded-full bg-white/5 border border-white/5">
                                                <Maximize2 className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5 bg-white/1">
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Test Case</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Size (n)</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Exec Time</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Comparisons</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Shifts</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Memory</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results.map((r, i) => (
                                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                            <td className="px-8 py-5 font-bold text-gray-400 group-hover:text-white transition-colors">Case #{i + 1}</td>
                                                            <td className="px-8 py-5 font-mono text-sm">{r.inputSize}</td>
                                                            <td className="px-8 py-5 font-mono text-sm text-blue-400 font-bold">{r.time.toFixed(5)}s</td>
                                                            <td className="px-8 py-5 font-mono text-sm text-purple-400">{r.comparisons?.toLocaleString() || 0}</td>
                                                            <td className="px-8 py-5 font-mono text-sm text-orange-400">{r.shifts?.toLocaleString() || 0}</td>
                                                            <td className="px-8 py-5 font-mono text-xs text-gray-500">{(r.memory / 1024).toFixed(2)} MB</td>
                                                            <td className="px-8 py-5">
                                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] font-black uppercase tracking-widest px-2">
                                                                    {r.status}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center space-y-6 text-center max-w-sm mx-auto">
                                    <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center">
                                        <BarChart3 className="h-10 w-10 text-blue-600 opacity-50" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter">No Analysis Context</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                                            Return to the editor to refine your implementation, then trigger the analyzer.
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={() => setActiveTab("editor")} className="bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-widest h-10 px-6 rounded-full">
                                        Switch to Editor
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Notification / Educational Pop-up */}
            <div className="absolute right-8 top-20 z-10 pointer-events-none">
                <AnimatePresence>
                    {!results.length && !isRunning && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-blue-600/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-blue-400/30 max-w-xs pointer-events-auto"
                        >
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-white shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="font-black text-xs uppercase tracking-wider text-white">Lab Tip</h5>
                                    <p className="text-[10px] text-blue-100 font-bold leading-relaxed mt-1">
                                        Insertion Sort is highly efficient for small datasets (N &lt; 50) and nearly sorted arrays. Use the analyzer to verify this behavior!
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
