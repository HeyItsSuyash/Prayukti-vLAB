"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle, Award, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateCertificate } from "@/lib/certificate";
import { getStudentName, getStudentRollNo, getSubjectProgress, isSubjectCompleted, getSubjectCompletionRate } from "@/lib/progress-utils";
import { Lock } from "lucide-react";

const practicals = [
    { id: 1, title: "Decimal Addition & Subtraction (8085)", difficulty: "Medium" },
    { id: 2, title: "Hexadecimal Addition & Subtraction (8085)", difficulty: "Easy" },
    { id: 3, title: "Addition & Subtraction of Two BCD Numbers (8085)", difficulty: "Hard" },
    { id: 4, title: "Multiplication & Division of Two 8-bit Numbers (8085)", difficulty: "Medium" },
    { id: 5, title: "Find Largest & Smallest Number in an Array (8085)", difficulty: "Medium" },
    { id: 6, title: "Arrange Array in Ascending Order (8085)", difficulty: "Hard" },
    { id: 7, title: "Arrange Array in Descending Order (8085)", difficulty: "Hard" },
    { id: 8, title: "Hexadecimal to ASCII & Vice Versa (8085)", difficulty: "Medium" },
];

export default function MPMCPage() {
    const [studentNameStr, setStudentNameStr] = useState("");
    const [studentRollStr, setStudentRollStr] = useState("");
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [overallCompletion, setOverallCompletion] = useState(0);
    const [isFullyCompleted, setIsFullyCompleted] = useState(false);

    useEffect(() => {
        const studentName = getStudentName();
        const studentRoll = getStudentRollNo();
        const subjectProgress = getSubjectProgress("mpmc");
        const labIds = practicals.map(p => p.id);

        setStudentNameStr(studentName);
        setStudentRollStr(studentRoll);
        setProgress(subjectProgress);
        setOverallCompletion(getSubjectCompletionRate("mpmc", labIds));
        setIsFullyCompleted(isSubjectCompleted("mpmc", labIds));
    }, []);

    const handleGenerateFinalCertificate = async () => {
        if (!studentNameStr.trim()) {
            alert("Student name is missing. Please log out and enter your name during login to generate the certificate.");
            return;
        }
        await generateCertificate(studentNameStr, "Microprocessor and Microcontroller", true, studentRollStr);
    };

    const logLabAttendance = async (labId: string) => {
        try {
            const token = localStorage.getItem('vlab_token') || localStorage.getItem('token');
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            await fetch(`${baseUrl}/api/attendance/log-lab`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subject: "MPMC", labId })
            });
        } catch (error) {
            console.error("Error logging lab attendance:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded-full transition-colors">Dashboard</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-[#2e7d32] leading-tight">{studentNameStr || "Student Name"}</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{studentRollStr || "Roll Number Not Set"}</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Student Name</p>
                                <p className="text-2xl font-black text-gray-900 border-l-4 border-[#2e7d32] pl-4 py-1 bg-gray-50 rounded-r-lg">
                                    {studentNameStr || "Not Set"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm font-bold text-gray-600 mb-1">
                                    <span>Subject Completion Progress</span>
                                    <span>{overallCompletion}%</span>
                                </div>
                                <Progress value={overallCompletion} className="h-3 w-full bg-gray-100" indicatorClassName={isFullyCompleted ? "bg-green-600" : "bg-[#2e7d32]"} />
                            </div>
                        </div>

                        <div className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-4 transition-all ${isFullyCompleted
                            ? 'bg-green-50 border-green-200 shadow-md'
                            : 'bg-gray-50 border-gray-200 opacity-70'
                            }`}>
                            {isFullyCompleted ? (
                                <>
                                    <Award className="h-12 w-12 text-green-600" />
                                    <div>
                                        <h3 className="font-bold text-green-800 text-lg uppercase tracking-tight">Final Certificate Unlocked!</h3>
                                        <p className="text-sm text-green-700 mt-1">You have successfully completed all experiments in this subject.</p>
                                    </div>
                                    <Button
                                        onClick={handleGenerateFinalCertificate}
                                        className="bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold px-8 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-wider"
                                    >
                                        Download Final Certificate
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Lock className="h-12 w-12 text-gray-400" />
                                    <div>
                                        <h3 className="font-bold text-gray-600 text-lg uppercase tracking-tight">Final Certificate Locked</h3>
                                        <p className="text-sm text-gray-400 mt-1 text-balance">Complete all experiments with 100% to download your official subject certificate.</p>
                                    </div>
                                    <Button disabled className="bg-gray-300 text-gray-500 cursor-not-allowed h-12 px-8 rounded-lg uppercase tracking-wider font-bold">
                                        Download Final Certificate
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">List of Experiments</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" className="hidden sm:flex">Course Content</Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {practicals.length > 0 ? (
                        practicals.map((p, index) => {
                            const completion = progress[p.id] || 0;
                            const isCompleted = completion === 100;

                            return (
                                <div key={p.id} className="bg-white p-5 rounded-lg border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#2e7d32]/30 transition-all group">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`w-10 h-10 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'} flex items-center justify-center font-bold shrink-0 mt-1`}>
                                            {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : index + 1}
                                        </div>
                                        <div className="space-y-1 w-full max-w-md">
                                            <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-[#2e7d32] transition-colors">{p.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                    p.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                    }`}>{p.difficulty}</span>
                                                <span className="text-xs text-gray-500">{completion}% Completed</span>
                                            </div>
                                            <div className="pt-2">
                                                <Progress value={completion} className="h-1.5 w-full bg-gray-100" indicatorClassName={isCompleted ? "bg-green-500" : "bg-[#2e7d32]"} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <Link href={`/dashboard/mpmc/${p.id}`} className="w-full md:w-auto">
                                            <Button 
                                                onClick={() => logLabAttendance(`mpmc-exp-${p.id}`)}
                                                variant="outline" 
                                                className={`w-full md:w-auto gap-2 border-2 ${isCompleted
                                                    ? 'border-green-600 text-green-700 hover:bg-green-50'
                                                    : 'border-black text-black hover:bg-black hover:text-white'
                                                    } uppercase font-bold text-xs tracking-wider transition-all h-10 px-4`}
                                            >
                                                {isCompleted ? "Review Lab" : "Start Lab"} <PlayCircle className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500 mb-2 font-medium">Labs for Microprocessor and Microcontroller are currently being prepared.</p>
                            <p className="text-sm text-gray-400">Please check back later for exciting experiments with 8085, 8086, and 8051!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

