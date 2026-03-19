"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, Activity, SkipForward } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import OOPSCompiler from '@/components/simulation/oops/OOPSCompiler';
import CircuitCanvas from '@/components/simulation/dld/CircuitCanvas';
import MPMCSimulator from '@/components/simulation/mpmc/MPMCSimulator';
import BasicOperationsSimulation from '@/components/simulation/dbms/BasicOperationsSimulation';
import SQLQueriesSimulation from '@/components/simulation/dbms/SQLQueriesSimulation';
import ApplicationDevelopmentSimulation from '@/components/simulation/dbms/ApplicationDevelopmentSimulation';
import NormalizationSimulation from '@/components/simulation/dbms/NormalizationSimulation';
import HostLanguageSimulation from '@/components/simulation/dbms/HostLanguageSimulation';

export default function ExamLiveMonitor() {
    const params = useParams();
    const router = useRouter();
    const [sessions, setSessions] = useState<any[]>([]);
    const [exam, setExam] = useState<any>(null);
    const [isClient, setIsClient] = useState(false);
    const [viewData, setViewData] = useState<any>(null);
    const [isViewDataOpen, setIsViewDataOpen] = useState(false);

    const examId = params.examId as string;

    const fetchLiveStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/exams/${examId}/live`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (error) {
            console.error("Error fetching live status:", error);
        }
    };

    const fetchExamDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/exams/${examId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setExam(await res.json());
            }
        } catch (error) {
            console.error("Error fetching exam:", error);
        }
    };

    useEffect(() => {
        setIsClient(true);
        fetchExamDetails();
        fetchLiveStatus();

        // Poll every 5 seconds for live updates
        const interval = setInterval(fetchLiveStatus, 5000);
        return () => clearInterval(interval);
    }, [examId]);

    if (!isClient || !exam) return <div className="p-8">Loading Live Monitor...</div>;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'in_progress':
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1 w-max"><Activity className="w-3 h-3" /> Active</span>;
            case 'submitted':
                return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3" /> Submitted</span>;
            case 'time_up':
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Time Up</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full w-max">Not Started</span>;
        }
    };

    const getWarningBadge = (warnings: number) => {
        if (warnings === 0) return <span className="text-gray-400">-</span>;
        if (warnings >= 3) return <span className="text-red-600 font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {warnings}</span>;
        return <span className="text-amber-600 font-medium">{warnings}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-10 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2 -ml-2 text-muted-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Exams
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{exam.subjectId}</h1>
                    <p className="text-muted-foreground mt-1 font-medium">{exam.experimentId}</p>
                </div>

                <div className="flex bg-white shadow-sm border rounded-lg overflow-hidden divide-x">
                    <div className="px-4 py-3 flex flex-col justify-center text-center bg-gray-50/50">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</span>
                        <span className="text-lg font-bold text-gray-900">{exam.durationMinutes} min</span>
                    </div>
                    <div className="px-4 py-3 flex flex-col justify-center text-center bg-gray-50/50">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned</span>
                        <span className="text-lg font-bold text-gray-900">{exam.assignedStudents.length}</span>
                    </div>
                    <div className="px-4 py-3 flex flex-col justify-center text-center bg-gray-50/50">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active</span>
                        <span className="text-lg font-bold text-blue-600">{sessions.filter(s => s.status === 'in_progress').length}</span>
                    </div>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Student Activity</CardTitle>
                    <CardDescription>Live feed of student exam progress. Auto-refreshes every 5s.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Started At</TableHead>
                                <TableHead className="text-right">Time Spent</TableHead>
                                <TableHead className="text-center">Warnings</TableHead>
                                <TableHead className="text-center">Tab Switches</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        No students have started the exam yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sessions.map((session) => (
                                    <TableRow key={session._id}>
                                        <TableCell>
                                            <div className="font-medium">{session.studentId?.fullName || 'Unknown Student'}</div>
                                            <div className="text-xs text-muted-foreground">{session.studentId?.email || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                                        <TableCell className="text-gray-600 text-sm">
                                            {session.startTime ? new Date(session.startTime).toLocaleTimeString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-sm">
                                            {session.timeSpentSeconds > 0
                                                ? `${Math.floor(session.timeSpentSeconds / 60)}m ${session.timeSpentSeconds % 60}s`
                                                : session.status === 'in_progress'
                                                    ? 'In Progress...'
                                                    : '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getWarningBadge(session.warnings)}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-600">
                                            {session.tabSwitches > 0 ? (
                                                <span className="font-semibold text-amber-600 flex items-center justify-center gap-1">
                                                    <SkipForward className="w-3 h-3" /> {session.tabSwitches}
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {session.status === 'submitted' || session.status === 'time_up' ? (
                                                <Button size="sm" variant="outline" onClick={() => {
                                                    setViewData(session.submissionData);
                                                    setIsViewDataOpen(true);
                                                }}>
                                                    View Work
                                                </Button>
                                            ) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isViewDataOpen} onOpenChange={setIsViewDataOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Student's Practical Work</DialogTitle>
                        <DialogDescription>
                            Artifacts captured from the student's exam environment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 h-[60vh]">
                        {!viewData ? (
                            <div className="text-gray-500 italic">No work submitted. This could happen if the student exited early or the simulation connection dropped.</div>
                        ) : viewData.type === 'CODE' ? (
                            <OOPSCompiler initialData={{ code: viewData.code, output: viewData.output }} />
                        ) : viewData.type === 'CIRCUIT' ? (
                            <CircuitCanvas initialData={{ nodes: viewData.nodes, edges: viewData.edges }} readonly={true} />
                        ) : viewData.type === 'MPMC' ? (
                            <MPMCSimulator labId={exam?.experimentId || "mpmc-exp-1"} initialData={{ asmCode: viewData.asmCode }} readonly={true} />
                        ) : viewData.type === 'DBMS_BASIC' ? (
                            <BasicOperationsSimulation initialData={viewData} readonly={true} mode="EXAM" />
                        ) : viewData.type === 'DBMS_SQL' ? (
                            <SQLQueriesSimulation initialData={viewData} readonly={true} mode="EXAM" />
                        ) : viewData.type === 'DBMS_APP_DEV' ? (
                            <ApplicationDevelopmentSimulation initialData={viewData} readonly={true} mode="EXAM" />
                        ) : viewData.type === 'DBMS_NORMALIZATION' ? (
                            <NormalizationSimulation initialData={viewData} readonly={true} mode="EXAM" />
                        ) : viewData.type === 'DBMS_HOST_LANG' ? (
                            <HostLanguageSimulation initialData={viewData} readonly={true} mode="EXAM" />
                        ) : (
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-xs max-h-[50vh]">
                                {JSON.stringify(viewData, null, 2)}
                            </pre>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsViewDataOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
