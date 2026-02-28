"use client";

import { useState } from "react";
import CodeEditor from "./editor";
import Theory from "./theory";
import Problem from "./problem";
import { Button } from "@/components/ui/button";
import ChatPanel from "@/components/Chat/ChatPanel";

export default function Experiment1Page() {
    const [activeTab, setActiveTab] = useState<"theory" | "problem">("theory");

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <div className="bg-[#d32f2f] text-white p-4 flex justify-between items-center shrink-0">
                <h1 className="text-lg font-bold">Exp 1: Intro to Java</h1>
                <div className="text-xs">Prayukti vLAB</div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Content */}
                <div className="w-1/3 border-r bg-gray-50 flex flex-col">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("theory")}
                            className={`flex-1 p-3 text-sm font-medium ${activeTab === "theory" ? "bg-white border-b-2 border-[#d32f2f] text-[#d32f2f]" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Theory
                        </button>
                        <button
                            onClick={() => setActiveTab("problem")}
                            className={`flex-1 p-3 text-sm font-medium ${activeTab === "problem" ? "bg-white border-b-2 border-[#d32f2f] text-[#d32f2f]" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Problem & Submission
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === "theory" ? <Theory /> : <Problem />}
                    </div>
                </div>

                {/* Right Panel: Editor */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    <CodeEditor />
                </div>
            </div>

            <ChatPanel experimentId="oopj-exp-1" />
        </div>
    );
}
