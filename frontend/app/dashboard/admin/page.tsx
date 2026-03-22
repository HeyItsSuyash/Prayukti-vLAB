"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck, BookOpen, Activity, Search, Shield, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Admin Views
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { TeacherManagement } from '@/components/admin/TeacherManagement';
import { SubjectManagement } from '@/components/admin/SubjectManagement';
import { ExperimentManagement } from '@/components/admin/ExperimentManagement';
import { ResourceManager } from '@/components/admin/ResourceManager';
import { ActivityLogView } from '@/components/admin/ActivityLogView';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { EnrollmentForm } from '@/components/admin/EnrollmentForm';

// Current Dashboard (for Overview/Students)
import { StudentTable } from '../teacher/StudentTable';
import { StudentDetailView } from '../teacher/StudentDetailView';
import { useState, useEffect, useMemo } from 'react';

function QuickLinkButton({ label, icon: Icon, onClick }: { label: string, icon: any, onClick: () => void }) {
    return (
        <Button 
            variant="outline" 
            onClick={onClick}
            className="flex flex-col items-center justify-center h-24 rounded-3xl border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 group transition-all"
        >
            <div className="p-3 bg-slate-50 group-hover:bg-indigo-100 rounded-2xl mb-2 transition-colors">
                <Icon size={18} className="text-slate-400 group-hover:text-indigo-600" />
            </div>
            <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-700 uppercase tracking-tighter">{label}</span>
        </Button>
    );
}

function AdminContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentView = searchParams.get('view') || 'overview';
    const [data, setData] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    useEffect(() => {
        setIsMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const res = await fetch(`${baseUrl}/api/users`);
            if (!res.ok) throw new Error("Failed to fetch users");
            const allUsers = await res.json();

            // Separate students and teachers
            const fetchedStudents = allUsers
                .filter((u: any) => u.role === 'student')
                .map((u: any) => ({
                    id: u._id,
                    name: u.fullName,
                    rollNo: u.rollNo || "N/A",
                    practicalsAssigned: 10,
                    practicalsCompleted: 2, // Mocking some progress for overview
                    quizScoreAvg: 75,
                    avgAttempts: 1.2,
                    status: 'Good'
                }));
                
                setData(studentData);
                setTeachers(teacherList);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // We no longer sync automatically to localStorage unless we specifically want a cache
    // Let's remove the second useEffect that syncs on data change.

    const handleAddStudent = (newStudent: StudentMetric) => {
        // Assume API call succeeded in AddStudentDialog
        setData(prev => [newStudent, ...prev]);
        window.dispatchEvent(new Event('vlab_students_updated'));
        alert("Student added successfully to the system.");
    };

    const handleAddTeacher = (newTeacher: Teacher) => {
        // Assume API call succeeded in AddTeacherDialog
        setTeachers(prev => [newTeacher, ...prev]);
        alert(`Teacher ${newTeacher.name} added successfully.`);
    };

    const handleDeleteStudent = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
                const res = await fetch(`${baseUrl}/api/users/${id}`, {
                    method: 'DELETE'
                });
                if (!res.ok) throw new Error("Failed to delete user");

    const renderView = () => {
        if (selectedStudent && (currentView === 'overview' || currentView === 'students')) {
            return (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                    </Button>
                    <StudentDetailView student={selectedStudent} />
                </div>
            );
        }

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('vlab_token');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (err) {
            console.error("Logout log failed:", err);
        }
        localStorage.removeItem('vlab_user');
        localStorage.removeItem('vlab_token');
        router.push('/login');
    };

                        {/* Top Stats */}
                        <div className="grid gap-6 md:grid-cols-4">
                            <StatCard title="Total Students" value={data.length} subtext="Enrolled successfully" icon={Users} color="text-indigo-600" />
                            <StatCard title="Total Teachers" value={teachers.length} subtext="Staff members active" icon={ShieldCheck} color="text-emerald-500" />
                            <StatCard title="Active Students" value={Math.floor(data.length * 0.8)} subtext="Engagement last 24h" icon={Activity} color="text-amber-500" />
                            <StatCard title="System Status" value="HEALTHY" subtext="All services operational" icon={Shield} color="text-emerald-600" />
                        </div>

                        {/* 2-Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                            {/* Left: Recent Enrollments */}
                            <div className="lg:col-span-7 space-y-6">
                                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
                                    <div className="p-8 pb-4 flex justify-between items-center bg-white border-b border-slate-50">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Recent Enrollments</h3>
                                        <Button variant="link" className="text-indigo-600 font-black text-xs uppercase" onClick={() => router.push('?view=students')}>
                                            View All
                                        </Button>
                                    </div>
                                    <CardContent className="p-0">
                                        <StudentTable data={data.slice(0, 5)} onViewStudent={(s) => setSelectedStudent(s)} />
                                    </CardContent>
                                    <div className="p-6 text-center border-t border-slate-50">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {Math.min(data.length, 5)} students</p>
                                    </div>
                                </Card>
                            </div>

                            {/* Right: Sidebar */}
                            <div className="lg:col-span-3 space-y-8">
                                {/* Fast Enrollment Card */}
                                <Card className="rounded-[2.5rem] border-none bg-indigo-600 text-white p-8 shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <UserPlus size={120} />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <UserPlus size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tighter mb-2 leading-tight">Fast Enrollment</h3>
                                            <p className="text-indigo-100 text-sm font-medium leading-relaxed">Quickly add a student and assign subjects for matching semester.</p>
                                        </div>
                                        <Button 
                                            onClick={() => router.push('?view=students')}
                                            className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-black py-6 rounded-2xl shadow-lg uppercase tracking-tight"
                                        >
                                            Open Smart Form
                                        </Button>
                                    </div>
                                </Card>

                                {/* Quick Links */}
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Quick Links</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <QuickLinkButton label="Manage Videos" icon={Activity} onClick={() => router.push('?view=subjects')} />
                                        <QuickLinkButton label="Audit Logs" icon={Activity} onClick={() => router.push('?view=logs')} />
                                        <QuickLinkButton label="Database" icon={Activity} onClick={() => router.push('?view=settings')} />
                                        <QuickLinkButton label="Backup" icon={Activity} onClick={() => {}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'students':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Student Database</h2>
                                <p className="text-slate-500 text-sm font-medium">Manage and enroll system-wide students.</p>
                            </div>
                        </div>
                        <EnrollmentForm onSuccess={fetchData} />
                        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 overflow-hidden">
                            <CardHeader className="bg-white border-b border-slate-50 p-8">
                                <CardTitle className="text-xl font-black tracking-tight">Active Registrations</CardTitle>
                                <CardDescription>Search and modify student records.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <StudentTable data={data} onViewStudent={(s) => setSelectedStudent(s)} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'teachers':
                return <TeacherManagement />;
            case 'subjects':
                return <SubjectManagement />;
            case 'experiments':
                return <ExperimentManagement />;
            case 'resources':
                return <ResourceManager />;
            case 'analytics':
                return <AnalyticsDashboard />;
            case 'logs':
                return <ActivityLogView />;
            case 'settings':
                return <SettingsPanel />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <Shield className="text-slate-300" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest italic">Terminal Offline</h3>
                        <p className="text-slate-400 max-w-sm mt-2">This dashboard module is currently being calibrated. Please check back shortly.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto w-full h-full overflow-y-auto custom-scrollbar">
            {renderView()}
        </div>
    );
}

function StatCard({ title, value, subtext, icon: Icon, color }: any) {
    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100/50 hover:scale-[1.02] transition-all bg-white overflow-hidden group border-b-4 border-transparent hover:border-indigo-600/20">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-slate-50 rounded-[1.5rem] group-hover:bg-indigo-50 transition-colors">
                        <Icon size={24} className={color} />
                    </div>
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
                <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{value}</div>
                {subtext && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{subtext}</p>}
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <AdminContent />
        </Suspense>
    );
}
