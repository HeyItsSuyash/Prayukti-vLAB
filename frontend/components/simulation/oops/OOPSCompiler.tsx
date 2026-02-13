"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export default function OOPSCompiler() {
    const [code, setCode] = useState<string>(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`);
    const [output, setOutput] = useState<string>("");
    const [isRunning, setIsRunning] = useState(false);

    const runCode = async () => {
        setIsRunning(true);
        setOutput("Compiling and Running...");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/oopj/run`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (data.success) {
                setOutput(data.output || "Program executed successfully (No Output).");
            } else {
                setOutput(`Error:\n${data.error}\n\nOutput:\n${data.output}`);
            }
        } catch {
            setOutput("Failed to connect to compilation server.");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white font-mono">
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                <div className="text-sm text-gray-400">Main.java</div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setCode("")} className="text-gray-400 hover:text-white">
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                    </Button>
                    <Button size="sm" onClick={runCode} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-2" /> Run
                    </Button>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="p-4 bg-gray-900 text-gray-300 resize-none focus:outline-none font-mono text-sm leading-6"
                    spellCheck={false}
                />
                <div className="border-l border-gray-700 bg-black p-4 flex flex-col">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Console Output</div>
                    <pre className="flex-1 text-green-400 font-mono text-sm whitespace-pre-wrap">
                        {output}
                    </pre>
                </div>
            </div>
        </div>
    );
}
