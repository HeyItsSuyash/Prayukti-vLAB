"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect, useMemo } from 'react';

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

function AdminContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentView = searchParams.get('view') || 'overview';
    
    const [data, setData] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const res = await fetch(`${baseUrl}/api/users`);
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const token = localStorage.getItem('vlab_token');
            const res = await fetch(`${baseUrl}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!res.ok) throw new Error("Failed to fetch users");
            const allUsers = await res.json();

            const fetchedStudents = allUsers
                .filter((u: any) => u.role === 'student' || u.role === undefined)
                .map((u: any) => ({
                    id: u._id,
                    name: u.fullName,
                    rollNo: u.rollNo || "N/A",
                    email: u.email,
                    branch: u.branch || "N/A",
                    semester: u.semester || "N/A",
                    practicalsAssigned: 10,
                    practicalsCompleted: 2,
                    quizScoreAvg: 75,
                    avgAttempts: 1.2,
                    status: 'Good'
                }));
            
            const fetchedTeachers = allUsers.filter((u: any) => u.role === 'teacher' || u.role === 'admin');
                
            setData(fetchedStudents);
            setTeachers(fetchedTeachers);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('vlab_token');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/attendance/logout`, {
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
    };

    const handleViewStudent = (student: StudentMetric) => {
        setSelectedStudent(student);
    };

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

        switch (currentView) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in duration-700">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Control Center</h1>
                                <p className="text-slate-500 text-sm font-medium">Core system management and analytical overview.</p>
                            </div>
                            <Button variant="outline" className="rounded-2xl border-slate-200" onClick={handleLogout}>Logout</Button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-4">
                            <StatCard title="Total Students" value={data.length} subtext="Enrolled successfully" icon={Users} color="text-indigo-600" />
                            <StatCard title="Total Staff" value={teachers.length} subtext="Active administration" icon={ShieldCheck} color="text-emerald-500" />
                            <StatCard title="Active Session" value="ENABLED" subtext="System online" icon={Activity} color="text-amber-500" />
                            <StatCard title="Security" value="SAFE" subtext="Mock Auth Active" icon={Shield} color="text-emerald-600" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                            <div className="lg:col-span-7 space-y-6">
                                <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
                                    <div className="p-8 pb-4 flex justify-between items-center bg-white border-b border-slate-50">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Recent Students</h3>
                                        <Button variant="link" className="text-indigo-600 font-black text-xs uppercase" onClick={() => router.push('?view=students')}>
                                            View All
                                        </Button>
                                    </div>
                                    <CardContent className="p-0">
                                        <StudentTable data={data.slice(0, 5)} onViewStudent={(s) => setSelectedStudent(s)} />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-3 space-y-8">
                                <Card className="rounded-[2.5rem] border-none bg-indigo-600 text-white p-8 shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <UserPlus size={120} />
                                    </div>
                                    <div className="relative z-10 space-y-6">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <UserPlus size={24} />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tighter">Fast Enrollment</h3>
                                        <Button 
                                            onClick={() => router.push('?view=students')}
                                            className="w-full bg-white text-indigo-600 hover:bg-slate-50 font-black py-6 rounded-2xl uppercase"
                                        >
                                            Open Form
                                        </Button>
                                    </div>
                                </Card>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">System Utilities</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <QuickLinkButton label="Videos" icon={Activity} onClick={() => router.push('?view=subjects')} />
                                        <QuickLinkButton label="Logs" icon={Activity} onClick={() => router.push('?view=logs')} />
                                        <QuickLinkButton label="Database" icon={Activity} onClick={() => router.push('?view=settings')} />
                                        <QuickLinkButton label="Stats" icon={Activity} onClick={() => router.push('?view=analytics')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'students':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Student Management</h2>
                        <EnrollmentForm onSuccess={fetchData} />
                        <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden mt-8">
                            <CardContent className="p-0">
                                <StudentTable data={data} onViewStudent={(s) => setSelectedStudent(s)} />
                            </CardContent>
                        </Card>
                    </div>
                );
            case 'teachers': return <TeacherManagement />;
            case 'subjects': return <SubjectManagement />;
            case 'experiments': return <ExperimentManagement />;
            case 'resources': return <ResourceManager />;
            case 'analytics': return <AnalyticsDashboard />;
            case 'logs': return <ActivityLogView />;
            case 'settings': return <SettingsPanel />;
            default: return <div>View not found</div>;
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto w-full h-full overflow-y-auto">
            {renderView()}
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Administration...</div>}>
            <AdminContent />
        </Suspense>
    );
}
