"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, Users, BookOpen, Activity } from 'lucide-react';

export default function TeacherExamsDashboard() {
    const router = useRouter();
    const [exams, setExams] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form state
    const [newExam, setNewExam] = useState({
        subjectId: '',
        experimentId: '',
        durationMinutes: 30,
        startTime: ''
    });

    const loadExams = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return router.push('/login');

            const res = await fetch("http://localhost:5000/api/exams/teacher", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setExams(data);
            }
        } catch (error) {
            console.error("Error fetching exams:", error);
        }
    };

    const loadStudents = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users");
            if (res.ok) {
                const allUsers = await res.json();
                setStudents(allUsers.filter((u: any) => u.role === 'student'));
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        setIsClient(true);
        loadExams();
        loadStudents();
    }, []);

    const handleCreateExam = async () => {
        if (!newExam.subjectId || !newExam.experimentId || !newExam.startTime) {
            alert("Please fill all fields");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            // Assign all students for simplicity right now
            const assignedStudents = students.map(s => s._id);

            const res = await fetch("http://localhost:5000/api/exams/create", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subjectId: newExam.subjectId,
                    experimentId: newExam.experimentId,
                    durationMinutes: newExam.durationMinutes,
                    startTime: new Date(newExam.startTime).toISOString(),
                    assignedStudents
                })
            });

            if (res.ok) {
                setIsCreateOpen(false);
                loadExams();
            } else {
                const errData = await res.json().catch(() => ({ message: res.statusText }));
                alert(`Failed: ${errData.message}`);
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    const navigateToLiveMonitor = (examId: string) => {
        router.push(`/dashboard/teacher/exams/${examId}`);
    };

    if (!isClient) return <div className="p-8">Loading Exams Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-6 md:p-10 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Exams</h1>
                    <p className="text-muted-foreground mt-1">Create timed practical exams and monitor live progress.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Create New Exam
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Practical Exam</DialogTitle>
                            <DialogDescription>Configure details for the timed lab examination.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Subject</label>
                                <Select onValueChange={(val) => setNewExam({ ...newExam, subjectId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                                        <SelectItem value="OOPs">OOPs</SelectItem>
                                        <SelectItem value="Database Management System">Database Management System (DBMS)</SelectItem>
                                        <SelectItem value="Digital Logic Design">Digital Logic Design</SelectItem>
                                        <SelectItem value="Microprocessor and Microcontroller">Microprocessor and Microcontroller (MPMC)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Experiment</label>
                                <Input
                                    placeholder="e.g. Stop and Wait Protocol"
                                    value={newExam.experimentId}
                                    onChange={(e) => setNewExam({ ...newExam, experimentId: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Duration (Minutes)</label>
                                <Input
                                    type="number"
                                    value={newExam.durationMinutes}
                                    onChange={(e) => setNewExam({ ...newExam, durationMinutes: parseInt(e.target.value) || 30 })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Start Time</label>
                                <Input
                                    type="datetime-local"
                                    value={newExam.startTime}
                                    onChange={(e) => setNewExam({ ...newExam, startTime: e.target.value })}
                                />
                            </div>
                            <div className="text-sm text-amber-600 mt-2">
                                * This will automatically be assigned to all {students.length} registered students.
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateExam}>Create Exam</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            {
                exams.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                        <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                        <p>No exams created yet.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam) => {
                            const isPast = new Date(exam.startTime) < new Date();
                            const statusColor = exam.status === 'completed' ? 'bg-gray-100' : 'bg-white';

                            return (
                                <Card key={exam._id} className={`${statusColor} transition-shadow hover:shadow-md border border-gray-200`}>
                                    <CardHeader className="pb-3 border-b bg-gray-50/50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg text-primary">{exam.subjectId}</CardTitle>
                                                <CardDescription className="font-medium text-gray-700 mt-1">{exam.experimentId}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                            <span>{new Date(exam.startTime).toLocaleString()} ({exam.durationMinutes} min)</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                                            <span>{exam.assignedStudents.length} Students Assigned</span>
                                        </div>

                                        <Button
                                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                                            onClick={() => navigateToLiveMonitor(exam._id)}
                                        >
                                            <Activity className="w-4 h-4 mr-2" />
                                            {isPast ? "View Report" : "Live Monitor"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )
            }
        </div >
    );
}
