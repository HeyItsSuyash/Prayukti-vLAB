"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
    FlaskConical,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Book,
    Code,
    Layers,
    RefreshCw,
    Play,
    Check,
    Terminal as TerminalIcon
} from "lucide-react";
import axios from "axios";
import { MonacoEditor } from "@/components/lab/MonacoEditor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Experiment {
    _id: string;
    title: string;
    theory?: string;
    algorithm?: string;
    codeTemplate?: string;
    language?: string;
    subjectId?: string;
    testcases?: Array<{ input: string; output: string }>;
}

interface ExecutionResult {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
}

export default function ExperimentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const experimentId = params.experimentId as string;

    const [experiment, setExperiment] = useState<Experiment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userCode, setUserCode] = useState("");

    // Execution State
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [input, setInput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [validation, setValidation] = useState<{
        status: "PASSED" | "FAILED" | "IDLE";
        expected: string | null;
        actual: string | null;
    }>({ status: "IDLE", expected: null, actual: null });

    const DEFAULT_TEMPLATES: Record<string, string> = {
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"C++ Simulation Active\" << endl;\n    // Write your code here\n    return 0;\n}",
        python: "print(\"Python Simulation Active\")\n# Write your code here\n",
        java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Java Simulation Active\");\n        // Write your code here\n    }\n}",
        c: "#include <stdio.h>\n\nint main() {\n    printf(\"C Simulation Active\\n\");\n    // Write your code here\n    return 0;\n}"
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!experimentId) return;
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/experiments/${experimentId}`);
                const data = response.data;
                setExperiment(data);
                setUserCode(data.codeTemplate || DEFAULT_TEMPLATES[data.language?.toLowerCase() || "cpp"] || "");
                if (data.language) {
                    setSelectedLanguage(data.language.toLowerCase());
                }
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError("Failed to load experiment. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [experimentId]);

    const handleLanguageChange = (newLang: string) => {
        setSelectedLanguage(newLang);
        // Automatically switch code to default template for the new language
        setUserCode(DEFAULT_TEMPLATES[newLang.toLowerCase()] || "");
        setResult(null);
        setValidation({ status: "IDLE", expected: null, actual: null });
    };

    const handleRun = async () => {
        if (!userCode || !experiment?.language) return;

        setIsRunning(true);
        setResult(null);
        setValidation({ status: "IDLE", expected: null, actual: null });

        try {
            const response = await axios.post(`${API_URL}/api/code/run`, {
                code: userCode,
                language: selectedLanguage,
                input: input
            });
            setResult(response.data);

            // Validation logic
            if (response.data.stdout !== null) {
                const actualOutput = response.data.stdout.trim();
                const matchedTestcase = experiment?.testcases?.find(
                    tc => (tc.input || "").trim() === (input || "").trim()
                );

                if (matchedTestcase) {
                    const expectedOutput = matchedTestcase.output.trim();
                    const isPassed = actualOutput === expectedOutput;
                    setValidation({
                        status: isPassed ? "PASSED" : "FAILED",
                        expected: expectedOutput,
                        actual: actualOutput
                    });
                }
            }
        } catch (err: any) {
            console.error("Execution error:", err);
            setResult({
                stdout: null,
                stderr: err.response?.data?.details || err.message,
                compile_output: null
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleBackToLab = () => {
        if (experiment?.subjectId) {
            router.push(`/lab/${experiment.subjectId}`);
        } else {
            router.back();
        }
    };

    const handleReset = () => {
        if (confirm("Reset code to original template?")) {
            setUserCode(experiment?.codeTemplate || "");
            setResult(null);
            setValidation({ status: "IDLE", expected: null, actual: null });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans">
            <Navbar />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Header with Navigation */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBackToLab}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900 transition-all shadow-sm"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                                    {loading ? "Loading..." : experiment?.title}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-[10px] mt-2 flex items-center gap-2">
                                    <FlaskConical size={12} className="text-blue-600" />
                                    Virtual Simulation Environment
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="border-2 border-slate-200 dark:border-slate-800 text-[10px] md:text-xs font-black uppercase tracking-widest h-10 md:h-12 px-4 md:px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                <RefreshCw size={14} className="mr-2" />
                                Reset
                            </Button>
                            <Button className="bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-black dark:hover:bg-white text-white font-black uppercase tracking-widest text-[10px] md:text-xs px-4 md:px-8 h-10 md:h-12 rounded-xl shadow-lg transition-transform active:scale-[0.98]">
                                Download Theory
                            </Button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Assembling Lab Components...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-red-50 dark:bg-red-950/20 rounded-[3rem] border border-red-100 dark:border-red-900/30 text-center px-6">
                            <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                            <h2 className="text-2xl font-black text-red-600 dark:text-red-400 uppercase italic">Execution Interface Error</h2>
                            <p className="text-red-500/80 dark:text-red-400/80 max-w-md mx-auto mt-3 font-medium text-lg leading-relaxed">
                                {error}
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="mt-10 bg-red-600 hover:bg-red-700 text-white uppercase font-black tracking-widest text-xs h-14 px-12 rounded-2xl shadow-xl shadow-red-500/20"
                            >
                                Reload Environment
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                            {/* Left Column: Documentation */}
                            <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-28">
                                {/* Theory Block */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                                            <Book size={16} />
                                        </div>
                                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Scientific Theory</h2>
                                    </div>
                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <div className="text-slate-600 dark:text-slate-400 font-medium leading-[1.6] text-sm text-justify whitespace-pre-wrap">
                                            {experiment?.theory || "Documentation pending for this simulation module."}
                                        </div>
                                    </div>
                                </div>

                                {/* Algorithm Block */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600">
                                            <Layers size={16} />
                                        </div>
                                        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Procedural Algorithm</h2>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed border-l-4 border-l-indigo-500">
                                        {experiment?.algorithm || "1. Initialization\n2. Input processing\n3. Core logic\n4. Termination"}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Code Editor & Execution */}
                            <div className="xl:col-span-8 space-y-6">
                                {/* Editor Header */}
                                <div className="bg-slate-900 rounded-t-[2rem] border-x border-t border-slate-800 p-4 flex items-center justify-between shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
                                            <Code size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Main Simulation Entry</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{experiment?.language?.toUpperCase()} KERNEL ACTIVE</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mr-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                            IDE READY
                                        </div>

                                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                                            <SelectTrigger className="w-[140px] h-9 bg-slate-800 border-slate-700 text-white text-[10px] uppercase font-black tracking-widest rounded-lg focus:ring-0 focus:ring-offset-0">
                                                <SelectValue placeholder="Language" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-400">
                                                <SelectItem value="cpp" className="text-[10px] uppercase font-black focus:bg-slate-800 focus:text-white">C++ (G++)</SelectItem>
                                                <SelectItem value="python" className="text-[10px] uppercase font-black focus:bg-slate-800 focus:text-white">Python 3</SelectItem>
                                                <SelectItem value="java" className="text-[10px] uppercase font-black focus:bg-slate-800 focus:text-white">Java (OpenJDK)</SelectItem>
                                                <SelectItem value="c" className="text-[10px] uppercase font-black focus:bg-slate-800 focus:text-white">C (GCC)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Editor Container */}
                                <div className="h-[500px] border-x border-slate-800 bg-slate-900 overflow-hidden relative">
                                    <MonacoEditor
                                        value={userCode}
                                        onChange={(val) => setUserCode(val || "")}
                                        language={selectedLanguage === "python" ? "python" : selectedLanguage === "java" ? "java" : selectedLanguage === "c" ? "c" : "cpp"}
                                    />
                                </div>

                                {/* Controls & Stdin */}
                                <div className="bg-white dark:bg-slate-900 p-6 border-x border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <TerminalIcon size={12} />
                                            Standard Input (Stdin)
                                        </label>
                                        <textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Provide input if your program requires it..."
                                            className="w-full h-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all dark:text-slate-300"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleRun}
                                        disabled={isRunning}
                                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs h-12 px-10 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play size={18} />}
                                        {isRunning ? "Running..." : "Run Code"}
                                    </Button>
                                </div>

                                {/* Output Console */}
                                <div className="bg-black rounded-b-[2rem] border-x border-b border-slate-800 overflow-hidden shadow-2xl">
                                    <div className="bg-slate-900/80 px-6 py-3 border-b border-slate-800 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <TerminalIcon size={14} />
                                        Execution Console
                                    </div>

                                    <div className="p-6 font-mono text-sm h-[300px] overflow-auto CustomScrollbar">
                                        {result ? (
                                            <div className="space-y-6">
                                                {/* Validation Status */}
                                                {validation.status !== "IDLE" && (
                                                    <div className={`p-4 rounded-xl border-2 flex items-center justify-between gap-4 ${validation.status === "PASSED"
                                                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                                                        : "bg-red-500/10 border-red-500/30 text-red-400"
                                                        }`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${validation.status === "PASSED" ? "bg-green-500" : "bg-red-500"
                                                                }`}>
                                                                {validation.status === "PASSED" ? <Check size={18} className="text-white" /> : <AlertCircle size={18} className="text-white" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Simulation Result</p>
                                                                <p className="text-sm font-bold mt-1 tracking-tight">{validation.status === "PASSED" ? "TEST CASE PASSED" : "TEST CASE FAILED"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-[10px] font-black uppercase tracking-tighter opacity-50">
                                                            Validation Active
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Comparison Block */}
                                                {validation.status === "FAILED" && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                                            <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest pl-2 border-l-2 border-amber-500">Expected Output:</p>
                                                            <pre className="text-slate-300 text-xs whitespace-pre-wrap break-all pl-2">{validation.expected}</pre>
                                                        </div>
                                                        <div className="space-y-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                                            <p className="text-[9px] text-red-500 font-black uppercase tracking-widest pl-2 border-l-2 border-red-500">Actual Output:</p>
                                                            <pre className="text-slate-300 text-xs whitespace-pre-wrap break-all pl-2">{validation.actual}</pre>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* stdout */}
                                                {(result.stdout || result.stdout === "") && validation.status !== "FAILED" && (
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest border-l-2 border-blue-500 pl-2">Output:</p>
                                                        <pre className="text-white whitespace-pre-wrap break-all pl-2">{result.stdout || "Program finished with no output."}</pre>
                                                    </div>
                                                )}

                                                {/* stderr */}
                                                {result.stderr && (
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] text-red-500 font-black uppercase tracking-widest border-l-2 border-red-500 pl-2">Errors:</p>
                                                        <pre className="text-red-300 whitespace-pre-wrap break-all pl-2">{result.stderr}</pre>
                                                    </div>
                                                )}

                                                {/* compile_output */}
                                                {result.compile_output && (
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest border-l-2 border-amber-500 pl-2">Build Log:</p>
                                                        <pre className="text-amber-200 whitespace-pre-wrap break-all pl-2">{result.compile_output}</pre>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                                <TerminalIcon size={40} className="text-slate-500 mb-4" />
                                                <p className="text-slate-500 italic text-xs uppercase tracking-widest font-black">Waiting for code execution...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Custom Styles for Console Scrollbar */}
            <style jsx global>{`
                .CustomScrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .CustomScrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .CustomScrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
                .CustomScrollbar::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
}
