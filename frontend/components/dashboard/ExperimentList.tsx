"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, PlayCircle, Clock, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Experiment {
    id: number | string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    href: string;
    description?: string;
    duration?: string;
}

interface ExperimentListProps {
    subject: string;
    experiments: Experiment[];
}

export function ExperimentList({ subject, experiments }: ExperimentListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

    const filteredExperiments = experiments.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterDifficulty ? exp.difficulty === filterDifficulty : true;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search experiments..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button
                        variant={filterDifficulty === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterDifficulty(null)}
                        className="whitespace-nowrap"
                    >
                        All
                    </Button>
                    <Button
                        variant={filterDifficulty === "Easy" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterDifficulty("Easy")}
                        className={filterDifficulty === "Easy" ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-200 hover:bg-green-50"}
                    >
                        Easy
                    </Button>
                    <Button
                        variant={filterDifficulty === "Medium" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterDifficulty("Medium")}
                        className={filterDifficulty === "Medium" ? "bg-amber-500 hover:bg-amber-600" : "text-amber-600 border-amber-200 hover:bg-amber-50"}
                    >
                        Medium
                    </Button>
                    <Button
                        variant={filterDifficulty === "Hard" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterDifficulty("Hard")}
                        className={filterDifficulty === "Hard" ? "bg-red-600 hover:bg-red-700" : "text-red-600 border-red-200 hover:bg-red-50"}
                    >
                        Hard
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperiments.map((exp) => (
                    <div key={exp.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col group">
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${exp.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        exp.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {exp.difficulty}
                                </span>
                                <div className="text-slate-400">
                                    <BarChart className="w-4 h-4" />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                                {exp.title}
                            </h3>

                            <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                {exp.description || "Master this concept through interactive simulation and real-time analysis."}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {exp.duration || "45 mins"}
                                </span>
                                <span>•</span>
                                <span>1.2k attempts</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                            <Link href={exp.href} className="w-full">
                                <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                                    Start Experiment <PlayCircle className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExperiments.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-500">No experiments found</h3>
                    <p className="text-slate-400">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
}
