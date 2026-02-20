"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText, Download, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TheorySectionProps {
    content: React.ReactNode;
}

export function TheorySection({ content }: TheorySectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    const handleDownload = () => {
        // Mock download functionality - in a real app, this would generate a PDF
        alert("Downloading Theory PDF...");
    };

    return (
        <section className="bg-white rounded-xl border-2 border-black/5 shadow-sm overflow-hidden">
            {/* Header / Toggle */}
            <div
                className="flex items-center justify-between p-6 bg-slate-50 border-b border-black/5 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Theory & Concepts</h2>
                        <p className="text-xs text-slate-500 font-medium">Click to {isOpen ? 'collapse' : 'expand'} detailed explanation</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:flex gap-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                    >
                        <Download size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Download PDF</span>
                    </Button>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Content Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-8 max-h-[800px] overflow-y-auto custom-scrollbar">
                            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-p:text-gray-600 prose-strong:text-black prose-li:text-gray-600 prose-ul:list-disc prose-ol:list-decimal">
                                {content}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
