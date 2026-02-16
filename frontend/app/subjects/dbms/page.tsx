"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DBMSPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-[#2ecc71] text-white p-6 shadow-md">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <Link href="/" className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Database Management Systems</h1>
                        <p className="opacity-90 mt-1">Virtual Laboratory for DBMS Concepts</p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Experiment Card */}
                    <Link 
                        href="/subjects/dbms/experiments/basic-operations"
                        className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-[#2ecc71]"
                    >
                        <div className="h-2 bg-[#2ecc71]" />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Exp 1
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2ecc71] transition-colors">
                                DBMS Environment & Basic Operations
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3">
                                Learn about Database Environments, Tables, Records, and Fields. Simulate Creation of Databases and Tables in various environments like Oracle, MySQL, etc.
                            </p>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
