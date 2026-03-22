"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle, ArrowLeft, Award, CheckCircle2 } from "lucide-react";
import { getLabsBySubject } from "@/lib/labs/registry";
import { Chatbot } from "@/components/lab/Chatbot";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateCertificate } from "@/lib/certificate";
import { getStudentName, getStudentRollNo, getSubjectProgress, isSubjectCompleted, getSubjectCompletionRate } from "@/lib/progress-utils";
import { Lock } from "lucide-react";

export default function DLDPage() {
    const labs = useMemo(() => getLabsBySubject("DLD"), []);
    const [studentNameStr, setStudentNameStr] = useState("");
    const [studentRollStr, setStudentRollStr] = useState("");
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [overallCompletion, setOverallCompletion] = useState(0);
    const [isFullyCompleted, setIsFullyCompleted] = useState(false);

    useEffect(() => {
        const studentName = getStudentName();
        const studentRoll = getStudentRollNo();
        const subjectProgress = getSubjectProgress("dld");
        const labIds = labs.map(p => p.id);

        setStudentNameStr(studentName);
        setStudentRollStr(studentRoll);
        setProgress(subjectProgress);
        setOverallCompletion(getSubjectCompletionRate("dld", labIds));
        setIsFullyCompleted(isSubjectCompleted("dld", labIds));
    }, [labs]);

    const handleGenerateFinalCertificate = async () => {
        if (!studentNameStr.trim()) {
            alert("Student name is missing. Please log out and enter your name during login to generate the certificate.");
            return;
        }
        await generateCertificate(studentNameStr, "Digital Logic Design", true, studentRollStr);
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
                body: JSON.stringify({ subject: "DLD", labId })
            });
        } catch (error) {
            console.error("Error logging lab attendance:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-10">
            <header className="bg-white border-b-2 border-black/5 sticky top-0 z-20 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="h-4 w-[2px] bg-black/10"></div>
                    <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Department</span>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                    <div className="flex-1">
                        <h1 className="text-lg font-bold uppercase tracking-tight leading-tight">{studentNameStr || "Student Name"}</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{studentRollStr || "Roll Number Not Set"}</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="bg-gray-50 p-8 rounded-2xl border-2 border-black/5 mb-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-sm font-bold uppercase tracking-wider text-gray-400">Student Name</p>
                                <p className="text-2xl font-black text-gray-900 border-l-4 border-black pl-4 py-1 bg-white rounded-r-lg">
                                    {studentNameStr || "Not Set"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                                    <span>Course Progress</span>
                                    <span>{overallCompletion}%</span>
                                </div>
                                <Progress value={overallCompletion} className="h-4 bg-black/5 rounded-full" indicatorClassName={isFullyCompleted ? "bg-orange-600" : "bg-black"} />
                            </div>
                        </div>

                        <div className={`p-8 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-4 transition-all ${isFullyCompleted
                            ? 'bg-orange-50 border-orange-200 shadow-lg'
                            : 'bg-white border-black/5 opacity-80'
                            }`}>
                            {isFullyCompleted ? (
                                <>
                                    <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
                                        <Award className="h-10 w-10 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-orange-900 text-xl uppercase tracking-tighter">Subject Completed!</h3>
                                        <p className="text-sm text-orange-700 mt-1 font-medium">Download your official certification of excellence.</p>
                                    </div>
                                    <Button
                                        onClick={handleGenerateFinalCertificate}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black h-14 rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest border-b-4 border-orange-800 active:border-b-0 active:translate-y-1"
                                    >
                                        Download Final Certificate
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
                                        <Lock className="h-8 w-8 text-black/20" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-400 text-xl uppercase tracking-tighter">Certificate Locked</h3>
                                        <p className="text-sm text-gray-400 mt-1 font-medium leading-relaxed max-w-[200px]">Unlock by completing 100% of all listed experiments.</p>
                                    </div>
                                    <Button disabled className="w-full bg-gray-100 text-gray-400 cursor-not-allowed h-14 rounded-xl uppercase tracking-widest font-black">
                                        Certificate Locked
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-2">Experiments</h2>
                        <p className="text-lg text-gray-500 font-medium">Select an experiment to launch the simulation.</p>
                    </div>
                </div>

                <div className="border-t-2 border-black/10">
                    {labs.length === 0 && (
                        <div className="p-12 text-center text-gray-400 font-medium border-x-2 border-b-2 border-dashed border-black/5">
                            No experiments found for this subject.
                        </div>
                    )}
                    {labs.map((p, index) => {
                        const completion = progress[p.id] || 0;
                        const isCompleted = completion === 100;

                        return (
                            <div key={p.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-b-2 border-black/5 hover:bg-gray-50 transition-colors gap-6">
                                <div className="flex items-start gap-6 flex-1">
                                    <div className={`hidden md:flex flex-col items-center justify-center w-16 h-16 border-2 ${isCompleted ? 'border-orange-600 bg-orange-600 text-white' : 'border-black/10 text-black'} rounded-lg transition-all`}>
                                        {isCompleted ? <CheckCircle2 className="h-8 w-8" /> : (
                                            <>
                                                <span className="text-2xl font-black leading-none">{index + 1}</span>
                                                <span className="text-[10px] uppercase font-bold tracking-wider">Exp</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="space-y-3 w-full max-w-xl">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge variant="outline" className={`rounded-none uppercase text-[10px] font-bold tracking-widest border-2 ${p.metadata.difficulty === 'Easy' ? 'border-green-600 text-green-700 bg-green-50' :
                                                    p.metadata.difficulty === 'Medium' ? 'border-yellow-600 text-yellow-700 bg-yellow-50' :
                                                        'border-red-600 text-red-700 bg-red-50'
                                                    }`}>
                                                    {p.metadata.difficulty}
                                                </Badge>
                                                <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">EST. TIME: {p.metadata.estimatedTime || "45 MIN"}</span>
                                            </div>
                                            <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-orange-600 transition-colors leading-none">{p.metadata.title}</h3>
                                            <p className="text-gray-500 text-sm mt-2 font-medium leading-relaxed">{p.metadata.description}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                <span>Progress</span>
                                                <span>{completion}%</span>
                                            </div>
                                            <Progress value={completion} className="h-2 bg-black/5" indicatorClassName={isCompleted ? "bg-orange-600" : "bg-black"} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <Link href={`/dashboard/dld/${p.id}`} className="w-full md:w-auto">
                                        <Button 
                                            onClick={() => logLabAttendance(p.id)}
                                            className={`w-full md:w-auto h-12 px-8 rounded-lg border-2 ${isCompleted
                                                ? 'border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
                                                : 'border-black bg-transparent text-black hover:bg-black hover:text-white'
                                                } uppercase font-bold tracking-wider transition-all whitespace-nowrap`}
                                        >
                                            {isCompleted ? "Review Lab" : "Start Lab"} <PlayCircle className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
            <Chatbot subject="DLD" />
            <Footer />
        </div>
    );
}
