"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, History, Info } from "lucide-react";
// Components will be imported after they are created. 
// Using inline placeholders for now or commented out imports to be uncommented in next steps.
import Aim from "./aim";
import Theory from "./theory";
import Procedure from "./procedure";
import Simulation from "./simulation";
import Observation from "./observation";

type Tab = "aim" | "theory" | "procedure" | "simulation" | "observation";

export default function BasicOperationsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("aim");

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "aim", label: "Aim", icon: <Info size={18} /> },
        { id: "theory", label: "Theory", icon: <BookOpen size={18} /> },
        { id: "procedure", label: "Procedure", icon: <ClipboardCheck size={18} /> },
        { id: "simulation", label: "Simulation", icon: <FlaskConical size={18} /> },
        { id: "observation", label: "Observation", icon: <History size={18} /> },
    ];

    return (
        <div className="flex h-screen flex-col bg-gray-50 overflow-hidden font-sans">
            {/* Header */}
            <header className="bg-[#2ecc71] text-white p-4 flex justify-between items-center shadow-md z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/subjects/dbms" className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold">Exp 1: DBMS Environment & Basic Operations</h1>
                        <p className="text-xs opacity-90">Prayukti vLAB</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <nav className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
                    <div className="p-4">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            Lab Sections
                        </h2>
                        <div className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                                            ? "bg-green-50 text-[#2ecc71]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden relative bg-gray-50/50">
                    <div className="absolute inset-0 overflow-y-auto p-8">
                        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-8rem)]">
                            {activeTab === "aim" && <Aim />}
                            {activeTab === "theory" && <Theory />}
                            {activeTab === "procedure" && <Procedure />}
                            {activeTab === "simulation" && <Simulation />}
                            {activeTab === "observation" && <Observation />}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
