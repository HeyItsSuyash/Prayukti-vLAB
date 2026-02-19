"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/lib/auth/withRole";
import { getLabsBySubject, LabSubject } from "@/lib/labs/registry";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    const subjects: { id: LabSubject; title: string; icon: string; color: string; description: string }[] = [
        {
            id: "DLD",
            title: "Digital Logic & Design",
            icon: "⚡",
            color: "text-orange-600",
            description: "Master the fundamentals of digital electronics, logic gates, and circuit design."
        },
        {
            id: "CN",
            title: "Computer Networks",
            icon: "🌐",
            color: "text-blue-600",
            description: "Explore the architecture of the internet, networking protocols, and the OSI/TCP-IP models."
        },
        {
            id: "DBMS",
            title: "Database Management",
            icon: "🗄️",
            color: "text-green-600",
            description: "Learn to design, query, and manage relational databases using SQL."
        },
        {
            id: "OOPS",
            title: "Object Oriented Programming",
            icon: "💻",
            color: "text-purple-600",
            description: "Learn the principles of encapsulation, inheritance, polymorphism, and abstraction."
        },
        {
            id: "MPMC",
            title: "Microprocessor and Microcontroller (MPMC)",
            icon: "📟",
            color: "text-orange-600",
            description: "Study the architecture, programming, and interfacing of microprocessors and microcontrollers."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <header className="bg-white border-b-2 border-black/5 sticky top-0 z-20 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xl rounded-none">
                            M
                        </div>
                        <h1 className="text-xl font-bold tracking-tighter uppercase">Prayukti vLAB</h1>
                    </div>

                    <div className="flex gap-6 items-center">
                        <div className="hidden md:flex flex-col items-end text-sm">
                            {typeof window !== 'undefined' && localStorage.getItem('user') && (
                                <span className="font-black text-slate-900 mb-1">
                                    {JSON.parse(localStorage.getItem('user')!).fullName}
                                </span>
                            )}
                            <RoleGuard allowedRoles={["STUDENT"]}>
                                <span className="font-bold uppercase tracking-wide text-[10px] text-orange-600 bg-orange-50 px-2 rounded-full border border-orange-100">Student</span>
                            </RoleGuard>
                            <RoleGuard allowedRoles={["TEACHER"]}>
                                <span className="font-bold uppercase tracking-wide text-[10px] text-blue-600 bg-blue-50 px-2 rounded-full border border-blue-100">Teacher</span>
                            </RoleGuard>
                            <RoleGuard allowedRoles={["ADMIN"]}>
                                <span className="font-bold uppercase tracking-wide text-[10px] text-slate-600 bg-slate-50 px-2 rounded-full border border-slate-100">Admin</span>
                            </RoleGuard>
                        </div>
                        <Link href="/">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-4 uppercase text-xs font-bold tracking-wider hover:bg-black hover:text-white transition-all rounded-lg"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                }}
                            >
                                Logout
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">My Dashboard</h2>
                        <p className="text-lg text-gray-500 font-medium">Select a laboratory to begin your experiments.</p>
                    </div>
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <Link href="/admin/lab-designer">
                            <Button className="h-12 px-6 uppercase font-bold tracking-wider bg-black text-white hover:bg-gray-800 rounded-none">
                                + Create New Lab
                            </Button>
                        </Link>
                    </RoleGuard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subjects.map((sub) => (
                        <Card key={sub.id} className="group hover:scale-[1.02] transition-all duration-300 border-2 border-black/10 hover:border-black rounded-xl overflow-hidden bg-white shadow-none">
                            <div className="h-40 bg-gray-50 flex items-center justify-center border-b-2 border-black/5 group-hover:bg-white transition-colors">
                                <span className="text-6xl group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0">{sub.icon}</span>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{sub.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                                    {sub.description}
                                </p>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                        {getLabsBySubject(sub.id).length} Experiments Active
                                    </span>
                                </div>
                                <Link href={`/dashboard/${sub.id.toLowerCase()}`} className="block">
                                    <Button className="w-full rounded-lg border-2 border-black bg-transparent text-black hover:bg-black hover:text-white uppercase font-bold tracking-wider h-12 transition-all">
                                        Enter Lab
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <span className="text-xl">i</span>
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight mb-2">System Status</h3>
                        <p className="text-gray-500 font-medium max-w-md">All systems operational. No recent alerts or maintenance scheduled.</p>
                    </div>

                    <RoleGuard allowedRoles={["TEACHER", "ADMIN"]}>
                        <div className="border-2 border-black rounded-xl p-8 bg-black text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <h3 className="text-xl font-bold uppercase tracking-tight mb-2 relative z-10">Teacher Insights</h3>
                            <p className="text-gray-400 font-medium mb-6 relative z-10">You have 12 pending lab submissions to review from your students.</p>

                            <Link href="/teacher/analytics">
                                <Button className="bg-white text-black hover:bg-gray-200 border-none uppercase font-bold tracking-wider relative z-10 w-full md:w-auto">
                                    View Analytics
                                </Button>
                            </Link>
                        </div>
                    </RoleGuard>
                </div>
            </main>
        </div>
    );
}
