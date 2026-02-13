"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_TEACHER_DATA, StudentMetric } from '@/data/mock-teacher-data';
import { Users, BookOpen, AlertCircle, TrendingUp, Search, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StudentTable } from './StudentTable';
import { StudentDetailView } from './StudentDetailView';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// --- Sub-components ---

interface OverviewCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: any;
    colorClass: string;
}

const OverviewCard = ({ title, value, subtext, icon: Icon, colorClass }: OverviewCardProps) => (
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

export default function TeacherDashboard() {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState<string>("Computer Networks");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<StudentMetric | null>(null);
    const [data, setData] = useState<StudentMetric[]>([]);
    const [isClient, setIsClient] = useState(false);

    const loadData = () => {
        const storedData = localStorage.getItem('vlab_students');
        if (storedData) {
            setData(JSON.parse(storedData));
        } else {
            setData(MOCK_TEACHER_DATA);
        }
    };

    useEffect(() => {
        loadData();
        setIsClient(true);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'vlab_students') {
                loadData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('vlab_students_updated', loadData);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('vlab_students_updated', loadData);
        };
    }, []);


    // Filter Data
    const filteredData = useMemo(() => {
        return data.filter(s =>
            s.subject === selectedSubject &&
            (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery))
        );
    }, [selectedSubject, searchQuery, data]);

    // Calculate Aggregates
    const stats = useMemo(() => {
        const total = filteredData.length;
        if (total === 0) return { total: 0, avgCompletion: 0, weakCount: 0, avgScore: 0 };

        const avgCompletion = Math.round(filteredData.reduce((acc, s) => acc + (s.practicalsCompleted / s.practicalsAssigned) * 100, 0) / total);
        const avgScore = Math.round(filteredData.reduce((acc, s) => acc + s.quizScoreAvg, 0) / total);
        const weakCount = filteredData.filter(s => s.status === 'Weak').length;

        return { total, avgCompletion, weakCount, avgScore };
    }, [filteredData]);

    // Chart Data
    const statusDistribution = useMemo(() => {
        const counts = { Weak: 0, Average: 0, Good: 0, Excellent: 0 };
        filteredData.forEach(s => {
            if (counts[s.status] !== undefined) {
                counts[s.status]++;
            }
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [filteredData]);

    const COLORS = ['#ef4444', '#eab308', '#22c55e', '#059669'];

    const handleViewStudent = (student: StudentMetric) => {
        setSelectedStudent(student);
    };

    const handleLogout = () => {
        localStorage.removeItem('vlab_user');
        localStorage.removeItem('vlab_token');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {!isClient && <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50">Loading dashboard...</div>}
            {isClient && (
                <>
                    <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Teacher Analytics</h1>
                            <p className="text-sm text-muted-foreground">Monitor performance & engagement</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-[250px] hidden md:block">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search Student..."
                                    className="pl-8 bg-gray-100 border-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                                    <SelectItem value="OOPs">Object Oriented Programming</SelectItem>
                                    <SelectItem value="Digital Logic Design">Digital Logic Design</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </header>

                    <main className="p-6 space-y-6">

                        {/* Stats Row */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <OverviewCard
                                title="Total Students"
                                value={stats.total}
                                subtext="Enrolled in this subject"
                                icon={Users}
                                colorClass="text-blue-600"
                            />
                            <OverviewCard
                                title="Avg. Completion"
                                value={`${stats.avgCompletion}%`}
                                subtext="Practical submissions"
                                icon={BookOpen}
                                colorClass="text-blue-600"
                            />
                            <OverviewCard
                                title="Weak Students"
                                value={stats.weakCount}
                                subtext="Requiring attention (<40%)"
                                icon={AlertCircle}
                                colorClass="text-red-600"
                            />
                            <OverviewCard
                                title="Avg. Quiz Score"
                                value={`${stats.avgScore}%`}
                                subtext="Class performance"
                                icon={TrendingUp}
                                colorClass="text-emerald-600"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Performance Distribution</CardTitle>
                                    <CardDescription>Student classification based on completion & scores</CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={statusDistribution}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                                <YAxis tickLine={false} axisLine={false} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50}>
                                                    {statusDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Class Composition</CardTitle>
                                    <CardDescription>Ratio of student performance levels</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {statusDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Student Progress Report</CardTitle>
                                    <CardDescription>Detailed list of all students in {selectedSubject}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <StudentTable data={filteredData} onViewStudent={handleViewStudent} />
                            </CardContent>
                        </Card>

                        {/* Detail Dialog */}
                        <Dialog open={!!selectedStudent} onOpenChange={(open: boolean) => !open && setSelectedStudent(null)}>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Student Analysis</DialogTitle>
                                    <DialogDescription>Performance breakdown for {selectedStudent?.name}</DialogDescription>
                                </DialogHeader>
                                {selectedStudent && (
                                    <StudentDetailView student={selectedStudent} />
                                )}
                            </DialogContent>
                        </Dialog>
                    </main>
                </>
            )}
        </div>
    );
}
