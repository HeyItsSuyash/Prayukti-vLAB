"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_TEACHER_DATA, StudentMetric } from '@/data/mock-teacher-data';
import { Users, UserPlus, Activity, ShieldCheck, Search, Trash2, Edit, LogOut, Video, LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StudentTable } from '../teacher/StudentTable';
import { AddTeacherDialog, Teacher } from './AddTeacherDialog';
import { VideoManager } from '@/components/admin/VideoManager';
import { AddStudentDialog } from '../teacher/AddStudentDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StudentDetailView } from '../teacher/StudentDetailView';

// --- Admin Stats Component ---
// import { LucideIcon } from 'lucide-react'; // Removing duplicate, already imported above or better to use named import if needed

// --- Admin Stats Component ---
interface AdminStatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: LucideIcon;
    colorClass: string;
}

const AdminStatCard = ({ title, value, subtext, icon: Icon, colorClass }: AdminStatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${colorClass}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtext}</p>
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
    const router = useRouter();
    const [data, setData] = useState<StudentMetric[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]); // New teacher state
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false); // New dialog state
    const [isVideoManagerOpen, setIsVideoManagerOpen] = useState(false); // New video manager state
    const [selectedStudent, setSelectedStudent] = useState<StudentMetric | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Initialize data from LocalStorage or Mock Data
    useEffect(() => {
        const storedData = localStorage.getItem('vlab_students');
        if (storedData) {
            setData(JSON.parse(storedData));
        } else {
            setData(MOCK_TEACHER_DATA);
            localStorage.setItem('vlab_students', JSON.stringify(MOCK_TEACHER_DATA));
        }

        // Initialize Teachers
        const storedTeachers = localStorage.getItem('vlab_teachers');
        if (storedTeachers) {
            setTeachers(JSON.parse(storedTeachers));
        }

        setIsClient(true);
    }, []);

    // Save to LocalStorage whenever data changes
    useEffect(() => {
        if (isClient) {
            if (data.length > 0) localStorage.setItem('vlab_students', JSON.stringify(data));
            localStorage.setItem('vlab_teachers', JSON.stringify(teachers));
        }
    }, [data, teachers, isClient]);

    const handleAddStudent = (newStudent: StudentMetric) => {
        const updatedData = [newStudent, ...data];
        setData(updatedData);

        // Force immediate save and notify
        localStorage.setItem('vlab_students', JSON.stringify(updatedData));
        window.dispatchEvent(new Event('vlab_students_updated'));

        alert("Student added successfully to the system.");
    };

    const handleAddTeacher = (newTeacher: Teacher) => {
        setTeachers(prev => [newTeacher, ...prev]);
        alert(`Teacher ${newTeacher.name} added successfully.`);
    };

    const handleDeleteStudent = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            const updatedData = data.filter(s => s.id !== id);
            setData(updatedData);
        }
    };

    const handleViewStudent = (student: StudentMetric) => {
        setSelectedStudent(student);
    };

    const handleLogout = () => {
        localStorage.removeItem('vlab_user');
        localStorage.removeItem('vlab_token');
        router.push('/login');
    };

    // ... (keep filtering logic)
    const filteredData = useMemo(() => {
        return data.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.rollNo.includes(searchQuery) ||
            s.email.includes(searchQuery)
        );
    }, [data, searchQuery]);

    const activeStudents = data.filter(s => s.practicalsCompleted > 0).length;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {!isClient && <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50">Loading Admin Console...</div>}

            {isClient && (
                <>
                    <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Console</h1>
                            <p className="text-sm text-muted-foreground">System-wide user management</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-[300px] hidden md:block">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by Name, Roll No or Email..."
                                    className="pl-8 bg-gray-100 border-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setIsVideoManagerOpen(true)} variant="outline" className="border-slate-300">
                                    <Video className="mr-2 h-4 w-4" /> Manage Videos
                                </Button>
                                <Button onClick={() => setIsAddTeacherOpen(true)} variant="outline" className="border-slate-300">
                                    <UserPlus className="mr-2 h-4 w-4" /> Add Teacher
                                </Button>
                                <Button onClick={() => setIsAddStudentOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white">
                                    <UserPlus className="mr-2 h-4 w-4" /> Add Student
                                </Button>
                            </div>
                            <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </header>

                    <main className="p-6 space-y-6">

                        {/* Admin Stats */}
                        <div className="grid gap-4 md:grid-cols-4">
                            <AdminStatCard
                                title="Total Students"
                                value={data.length}
                                subtext="Registered across all years"
                                icon={Users}
                                colorClass="text-slate-600"
                            />
                            <AdminStatCard
                                title="Total Teachers"
                                value={teachers.length + 42}
                                subtext={`+${teachers.length} recently added`}
                                icon={ShieldCheck}
                                colorClass="text-indigo-600"
                            />
                            {/* ... (keep other stats) */}
                            <AdminStatCard
                                title="Active Students"
                                value={activeStudents}
                                subtext="Engaged in last 30 days"
                                icon={Activity}
                                colorClass="text-emerald-600"
                            />
                            <AdminStatCard
                                title="System Status"
                                value="Healthy"
                                subtext="All services operational"
                                icon={ShieldCheck}
                                colorClass="text-green-600"
                            />
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Global Student Database</CardTitle>
                                <CardDescription>Manage all registered students.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <StudentTable data={filteredData} onViewStudent={handleViewStudent} />
                            </CardContent>
                        </Card>

                        {/* Dialogs */}
                        <Dialog open={isVideoManagerOpen} onOpenChange={setIsVideoManagerOpen}>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Experiment Video Manager</DialogTitle>
                                    <DialogDescription>
                                        Assign YouTube videos to experiments.
                                    </DialogDescription>
                                </DialogHeader>
                                <VideoManager />
                            </DialogContent>
                        </Dialog>

                        <AddStudentDialog
                            open={isAddStudentOpen}
                            onOpenChange={setIsAddStudentOpen}
                            onAddStudent={handleAddStudent}
                        />

                        <AddTeacherDialog
                            open={isAddTeacherOpen}
                            onOpenChange={setIsAddTeacherOpen}
                            onAddTeacher={handleAddTeacher}
                        />

                        {/* Detail Dialog */}
                        <Dialog open={!!selectedStudent} onOpenChange={(open: boolean) => !open && setSelectedStudent(null)}>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Student Analysis (Admin View)</DialogTitle>
                                    <DialogDescription>Full record for {selectedStudent?.name}</DialogDescription>
                                </DialogHeader>
                                {selectedStudent && (
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            <Button variant="destructive" onClick={() => {
                                                handleDeleteStudent(selectedStudent.id, selectedStudent.name);
                                                setSelectedStudent(null);
                                            }}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Student
                                            </Button>
                                        </div>
                                        <StudentDetailView student={selectedStudent} />
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </main>
                </>
            )}
        </div>
    );
}
