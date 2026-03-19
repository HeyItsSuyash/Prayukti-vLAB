"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, BookOpen } from 'lucide-react';

export default function StudentExamsDashboard() {
    const router = useRouter();
    const [exams, setExams] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);

    const loadExams = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return router.push('/login');

            const res = await fetch("http://localhost:5000/api/exams/student", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setExams(await res.json());
            }
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };

    useEffect(() => {
        setIsClient(true);
        loadExams();
    }, []);

    const handleStartExam = async (examId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/exams/${examId}/start`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const session = await res.json();
                router.push(`/exam/${session._id}`);
            } else {
                const err = await res.json().catch(() => ({ message: res.statusText }));
                alert(`Backend API Error (${res.status}): ${err.message || "Cannot start exam"}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(`Network Error: ${error.message}`);
        }
    };

    if (!isClient) return <div className="p-8">Loading Exams...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-10 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Practical Exams</h1>
                    <p className="text-muted-foreground mt-1">View and attempt your assigned lab examinations.</p>
                </div>
            </header>

            {exams.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                    <p>No exams assigned to you currently.</p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam) => {
                        const isPast = new Date(exam.startTime) < new Date();
                        const session = exam.session; // Attached from backend

                        let statusText = "Upcoming";
                        let statusColor = "text-amber-600";
                        let actionButton = null;

                        if (session) {
                            if (session.status === 'in_progress') {
                                statusText = "In Progress";
                                statusColor = "text-blue-600";
                                actionButton = (
                                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/exam/${session._id}`)}>
                                        <PlayCircle className="w-4 h-4 mr-2" /> Resume Exam
                                    </Button>
                                );
                            } else {
                                statusText = "Completed";
                                statusColor = "text-green-600";
                                actionButton = (
                                    <Button className="w-full mt-4" variant="outline" disabled>
                                        Exam Submitted
                                    </Button>
                                );
                            }
                        } else if (isPast) {
                            statusText = "Active / Available";
                            statusColor = "text-green-600";
                            actionButton = (
                                <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleStartExam(exam._id)}>
                                    <PlayCircle className="w-4 h-4 mr-2" /> Start Exam
                                </Button>
                            );
                        } else {
                            actionButton = (
                                <Button className="w-full mt-4" variant="outline" disabled>
                                    Starts at {new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Button>
                            );
                        }

                        return (
                            <Card key={exam._id} className="transition-shadow hover:shadow-md border border-gray-200">
                                <CardHeader className="pb-3 border-b bg-gray-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg text-primary">{exam.subjectId}</CardTitle>
                                            <CardDescription className="font-medium text-gray-700 mt-1">{exam.experimentId}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={statusColor}>{statusText}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        <span>{new Date(exam.startTime).toLocaleDateString()} ({exam.durationMinutes} min)</span>
                                    </div>

                                    {actionButton}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
