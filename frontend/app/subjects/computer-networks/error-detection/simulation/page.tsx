"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import ParityCheck from "@/components/simulation/error-detection/ParityCheck";
import Checksum from "@/components/simulation/error-detection/Checksum";
import CRC from "@/components/simulation/error-detection/CRC";
import HammingCode from "@/components/simulation/error-detection/HammingCode";
import QuizComponent from "@/components/simulation/error-detection/QuizComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ErrorDetectionSimulationPage() {
    const [activeAlgo, setActiveAlgo] = useState("parity");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/subjects/computer-networks/error-detection" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-lg font-bold text-gray-800">Simulation: Error Detection & Correction</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2 mb-6 p-2 bg-white border rounded-lg shadow-sm">
                        <Button
                            variant={activeAlgo === "parity" ? "default" : "ghost"}
                            onClick={() => setActiveAlgo("parity")}
                            className="flex-1"
                        >
                            Parity Check
                        </Button>
                        <Button
                            variant={activeAlgo === "checksum" ? "default" : "ghost"}
                            onClick={() => setActiveAlgo("checksum")}
                            className="flex-1"
                        >
                            Checksum
                        </Button>
                        <Button
                            variant={activeAlgo === "crc" ? "default" : "ghost"}
                            onClick={() => setActiveAlgo("crc")}
                            className="flex-1"
                        >
                            CRC
                        </Button>
                        <Button
                            variant={activeAlgo === "hamming" ? "default" : "ghost"}
                            onClick={() => setActiveAlgo("hamming")}
                            className="flex-1"
                        >
                            Hamming Code
                        </Button>
                        <Button
                            variant={activeAlgo === "quiz" ? "default" : "ghost"}
                            onClick={() => setActiveAlgo("quiz")}
                            className="flex-1"
                        >
                            Quiz
                        </Button>
                    </div>

                    <div className="mt-4">
                        {activeAlgo === "parity" && <ParityCheck />}
                        {activeAlgo === "checksum" && <Checksum />}
                        {activeAlgo === "crc" && <CRC />}
                        {activeAlgo === "hamming" && <HammingCode />}
                        {activeAlgo === "quiz" && <QuizComponent />}
                    </div>
                </div>
            </main>
        </div>
    );
}
