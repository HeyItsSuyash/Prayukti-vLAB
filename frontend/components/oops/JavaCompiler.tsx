"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, Terminal, Code2, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";

const DEFAULT_JAVA_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, OOPS World!");
    }
}`;

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function JavaCompiler() {
    const [code, setCode] = useState(DEFAULT_JAVA_CODE);
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const runCode = async () => {
        setIsLoading(true);
        setOutput("");
        setError("");

        try {
            const response = await axios.post(`${BACKEND_URL}/api/run-java`, {
                code: code,
            });

            const result = response.data;

            if (result.output) {
                setOutput(result.output);
            } else {
                setOutput("Program executed successfully (no output)");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.output ||
                err.message ||
                "Failed to connect to compilation server"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const resetCode = () => {
        if (confirm("Are you sure you want to reset the code to default?")) {
            setCode(DEFAULT_JAVA_CODE);
            setOutput("");
            setError("");
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[700px]">

            {/* Header */}
            <div className="flex items-center justify-between bg-black text-white p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded">
                        <Code2 className="h-5 w-5 text-black" />
                    </div>
                    <div>
                        <h3 className="font-bold uppercase tracking-tighter text-lg leading-none">
                            Online Java Compiler
                        </h3>
                        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mt-1">
                            JDK 17 | Main.java
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetCode}
                        className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>

                    <Button
                        onClick={runCode}
                        disabled={isLoading}
                        className="bg-white text-black hover:bg-gray-200 border-none font-black uppercase tracking-widest"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="mr-2 h-4 w-4 fill-current" />
                        )}
                        Run Code
                    </Button>
                </div>
            </div>

            {/* Main Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">

                {/* Editor */}
                <div className="border-2 border-black rounded-lg overflow-hidden flex flex-col bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="bg-gray-50 border-b-2 border-black px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest">
                            Editor
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                            Main.java
                        </span>
                    </div>

                    <div className="flex-1">
                        <Editor
                            height="100%"
                            defaultLanguage="java"
                            theme="vs-light"
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontWeight: "600",
                                fontFamily: "var(--font-geist-mono)",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16 },
                            }}
                        />
                    </div>
                </div>

                {/* Output Console */}
                <div className="border-2 border-black rounded-lg overflow-hidden flex flex-col bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
                    <div className="bg-white/10 border-b border-white/10 px-4 py-2 flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                            Output Console
                        </span>
                    </div>

                    <div className="flex-1 p-4 font-mono text-sm overflow-auto">

                        {!output && !error && !isLoading && (
                            <p className="text-gray-500 italic">
                                Click "Run Code" to see the output here...
                            </p>
                        )}

                        {isLoading && (
                            <div className="flex items-center gap-2 text-gray-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Compiling and executing...</span>
                            </div>
                        )}

                        {output && (
                            <pre className="whitespace-pre-wrap text-green-400">
                                {output}
                            </pre>
                        )}

                        {error && (
                            <pre className="whitespace-pre-wrap text-red-500">
                                {error}
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
