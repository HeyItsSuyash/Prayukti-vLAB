"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// Determine API URL based on environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function CodeEditor() {
    // Default starter code
    const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, Prayukti!");
    }
}`);

    // Console output state
    const [output, setOutput] = useState("");
    const [isError, setIsError] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState<any[] | null>(null);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Compiling and Running...");
        setTestResults(null);
        try {
            const res = await fetch(`${API_URL}/api/v1/oopj/run`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    experimentId: "exp-1", // Hardcoded for this file
                    code: code,
                    input: ""
                })
            });
            const data = await res.json();

            if (data.success) {
                setOutput(data.output);
                setIsError(false);
            } else {
                setOutput(data.error || "Execution Failed");
                setIsError(true);
            }
        } catch (err) {
            setOutput("Network Error: Could not connect to compiler service.");
            setIsError(true);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setOutput("Evaluating against Test Cases...");
        try {
            const res = await fetch(`${API_URL}/api/v1/oopj/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    experimentId: "exp-1",
                    code: code
                })
            });
            const data = await res.json();

            if (data.results) {
                setTestResults(data.results);
                setOutput(data.verdict === "PASS" ? "All Test Cases Passed! 🎉" : "Some Test Cases Failed.");
                setIsError(data.verdict !== "PASS");
            } else {
                setOutput(data.message || "Submission Error");
            }

        } catch (err) {
            setOutput("Submission Failed.");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col h-full text-white">
            {/* Toolbar */}
            <div className="bg-[#2d2d2d] p-2 flex gap-2 border-b border-[#444]">
                <Button
                    size="sm"
                    onClick={handleRun}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    {isRunning ? "Running..." : "Run Code"}
                </Button>
                <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isRunning}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Submit
                </Button>
            </div>

            {/* Editor Area (Textarea for MVP) */}
            <div className="flex-1 relative">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none focus:outline-none"
                    spellCheck="false"
                />
            </div>

            {/* Console / Output Panel */}
            <div className="h-1/3 bg-[#1e1e1e] border-t border-[#444] flex flex-col">
                <div className="bg-[#2d2d2d] px-4 py-1 text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Console / Output
                </div>
                <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                    {/* Standard Output */}
                    <pre className={isError ? "text-red-400" : "text-green-400 whitespace-pre-wrap"}>
                        {output}
                    </pre>

                    {/* Test Case Results Table */}
                    {testResults && (
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <h4 className="text-xs font-bold mb-2">Detailed Results:</h4>
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-1">Input</th>
                                        <th className="py-1">Expected</th>
                                        <th className="py-1">Actual</th>
                                        <th className="py-1">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testResults.map((res: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-800 text-gray-300">
                                            <td className="py-1 opacity-70">{res.input || "(Empty)"}</td>
                                            <td className="py-1 opacity-70">{res.expected}</td>
                                            <td className="py-1 font-mono">{res.actual}</td>
                                            <td className={`py-1 font-bold ${res.passed ? "text-green-500" : "text-red-500"}`}>
                                                {res.passed ? "PASS" : "FAIL"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
