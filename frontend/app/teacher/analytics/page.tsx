"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BarChart2, Clock, Award, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceTab from '@/components/attendance/AttendanceTab';

export default function TeacherAnalytics() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-500 hover:text-black">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-indigo-600">Teacher Analytics <span className="text-gray-400 font-normal">| Prayukti vLAB</span></h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1">
                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-white border rounded-2xl p-1.5 shadow-sm">
                        <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-black uppercase tracking-widest text-[10px]">
                            <BarChart2 className="w-3.5 h-3.5 mr-2" />
                            Performance
                        </TabsTrigger>
                        <TabsTrigger value="attendance" className="rounded-xl px-6 py-2.5 font-black uppercase tracking-widest text-[10px]">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            Attendance
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-0 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                    <Users className="h-5 w-5" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Active Students</span>
                                </div>
                                <p className="text-3xl font-bold">124</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 text-blue-600 mb-2">
                                    <BarChart2 className="h-5 w-5" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Avg. Score</span>
                                </div>
                                <p className="text-3xl font-bold">82%</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 text-amber-600 mb-2">
                                    <Clock className="h-5 w-5" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Avg. Time</span>
                                </div>
                                <p className="text-3xl font-bold">14m</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 text-purple-600 mb-2">
                                    <Award className="h-5 w-5" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Completion</span>
                                </div>
                                <p className="text-3xl font-bold">91%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Analytics Overview */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <BarChart2 className="h-4 w-4 text-indigo-500" /> Student Progress Matrix
                                        </h3>
                                        <Button variant="outline" size="sm">Export Report</Button>
                                    </div>
                                    <div className="p-0 overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b">
                                                <tr>
                                                    <th className="px-6 py-4">Student Name</th>
                                                    <th className="px-6 py-4">Lab Subject</th>
                                                    <th className="px-6 py-4">Progress</th>
                                                    <th className="px-6 py-4">Last Active</th>
                                                    <th className="px-6 py-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {[
                                                    { name: "Rahul Sharma", subject: "CN", progress: "85%", active: "2h ago", status: "In Simulation" },
                                                    { name: "Priya Singh", subject: "DLD", progress: "100%", active: "5h ago", status: "Completed" },
                                                    { name: "Amit Patel", subject: "OOPS", progress: "40%", active: "1d ago", status: "Idle" },
                                                    { name: "Sneha Roy", subject: "CN", progress: "10%", active: "Just now", status: "In Theory" },
                                                ].map((student, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                                        <td className="px-6 py-4 font-bold text-slate-700">{student.name}</td>
                                                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{student.subject}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                                <div className="bg-indigo-500 h-full" style={{ width: student.progress }}></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-400 text-xs">{student.active}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${student.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                                    student.status === 'In Simulation' ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                {student.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Evaluation Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 border-t-8 border-t-indigo-500">
                                    <h3 className="font-black uppercase tracking-widest text-slate-400 text-xs mb-6">Student Evaluation</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Selected Student</label>
                                            <select className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none text-sm font-bold">
                                                <option>Rahul Sharma</option>
                                                <option>Priya Singh</option>
                                                <option>Amit Patel</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Assigned Lab</label>
                                            <select className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none text-sm">
                                                <option>CN-01: OSI Reference Models</option>
                                                <option>DLD-01: Logic Gates Intro</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase">Lab Marks</label>
                                                <input type="number" placeholder="0" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase">Viva Score</label>
                                                <input type="number" placeholder="0" className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase">Teacher Feedback</label>
                                            <textarea className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 outline-none h-24 text-sm" placeholder="Provide constructive comments..."></textarea>
                                        </div>
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-2xl font-bold shadow-lg shadow-indigo-200">
                                            Submit Evaluation
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                                    <h4 className="text-emerald-700 font-bold text-sm mb-2 flex items-center gap-2">
                                        <Award className="h-4 w-4" /> Proctoring Tip
                                    </h4>
                                    <p className="text-emerald-600/70 text-[10px] leading-relaxed">
                                        You can view real-time mouse movements and packet flow diagrams for any active student by clicking on their row in the matrix.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="mt-0">
                        <AttendanceTab />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
