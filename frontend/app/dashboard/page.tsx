"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/lib/auth/withRole";
import { getLabsBySubject, LabSubject } from "@/lib/labs/registry";

export default function Dashboard() {
    const subjects: { id: LabSubject; title: string; icon: string; bg: string; color: string; hoverColor: string; description: string }[] = [
        {
            id: "DLD",
            title: "Digital Logic & Design (DLD)",
            icon: "⚡",
            bg: "bg-orange-100",
            color: "bg-[#f57f17]",
            hoverColor: "hover:bg-[#e65100]",
            description: "Master the fundamentals of digital electronics, logic gates, and circuit design."
        },
        {
            id: "CN",
            title: "Computer Networks (CN)",
            icon: "🌐",
            bg: "bg-blue-100",
            color: "bg-[#1976d2]",
            hoverColor: "hover:bg-[#1565c0]",
            description: "Explore the architecture of the internet, networking protocols, and the OSI/TCP-IP models."
        },
        {
            id: "DBMS",
            title: "Database Management Systems (DBMS)",
            icon: "🗄️",
            bg: "bg-green-100",
            color: "bg-[#2e7d32]",
            hoverColor: "hover:bg-[#1b5e20]",
            description: "Learn to design, query, and manage relational databases using SQL."
        },
        {
            id: "OOPS",
            title: "Object Oriented Programming (OOPs)",
            icon: "💻",
            bg: "bg-purple-100",
            color: "bg-[#7b1fa2]",
            hoverColor: "hover:bg-[#6a1b9a]",
            description: "Learn the principles of encapsulation, inheritance, polymorphism, and abstraction."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-[#d32f2f]">Prayukti vLAB <span className="text-gray-500 font-normal">| Modular Dashboard</span></h1>
                    <div className="flex gap-4 items-center">
                        <RoleGuard allowedRoles={["STUDENT"]}>
                            <span className="text-sm font-medium">Hello, Student</span>
                        </RoleGuard>
                        <RoleGuard allowedRoles={["TEACHER"]}>
                            <span className="text-sm font-medium">Hello, Teacher</span>
                        </RoleGuard>
                        <RoleGuard allowedRoles={["ADMIN"]}>
                            <span className="text-sm font-medium">Hello, Admin</span>
                        </RoleGuard>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Logout</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Subjects</h2>
                    <RoleGuard allowedRoles={["ADMIN"]}>
                        <Link href="/admin/lab-designer">
                            <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600">Create New Lab</Button>
                        </Link>
                    </RoleGuard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjects.map((sub) => (
                        <div key={sub.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group">
                            <div className={`h-32 ${sub.bg} flex items-center justify-center`}>
                                <span className="text-4xl">{sub.icon}</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[#d32f2f] transition-colors">{sub.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {sub.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {getLabsBySubject(sub.id).length} Labs
                                        </span>
                                    </div>
                                    <Link href={`/dashboard/${sub.id.toLowerCase()}`}>
                                        <Button className={`${sub.color} ${sub.hoverColor}`}>Enter Lab</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Activity</h2>
                        <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
                            <p>All laboratory systems operational. No recent alerts.</p>
                        </div>
                    </div>

                    <RoleGuard allowedRoles={["TEACHER", "ADMIN"]}>
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Teacher Insights</h2>
                            <div className="bg-white rounded-lg shadow-sm border p-8 text-center border-indigo-100 bg-indigo-50/30">
                                <p className="text-indigo-600 font-medium mb-4">You have 12 pending lab submissions to review.</p>
                                <Link href="/teacher/analytics">
                                    <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-100">View Class Analytics</Button>
                                </Link>
                            </div>
                        </div>
                    </RoleGuard>
                </div>
            </main>
        </div>
    );
}
