"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function StudentAttendancePage() {
    const [attendanceData, setAttendanceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userJson = localStorage.getItem('vlab_user');
                if (!userJson) return;
                const user = JSON.parse(userJson);
                const userId = user.id || user._id;

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/attendance/student/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('vlab_token')}` }
                });
                setAttendanceData(response.data);
            } catch (err) {
                console.error("Failed to fetch student attendance");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const risk = attendanceData?.risk_summary;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <main className="container mx-auto px-4 pt-28 pb-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">My Attendance info</h1>
                    <p className="text-slate-500">Track your session history and risk status.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="rounded-[2rem] border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Status</CardTitle>
                            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <CheckCircle2 size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">
                                {risk?.risk_status || "Standard"}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Overall Engagement</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Total Hours</CardTitle>
                            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <Clock size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">
                                {Math.round((risk?.total_lab_time || 0) / 60)}h { (risk?.total_lab_time || 0) % 60}m
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Time spent in Labs</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Experiments</CardTitle>
                            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Calendar size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">
                                {risk?.experiments_done || 0}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Completed Sessions</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-[2.5rem] border-2 overflow-hidden bg-white dark:bg-slate-900">
                    <CardHeader className="p-8 border-b">
                        <CardTitle className="text-xl font-black uppercase flex items-center gap-2">
                            <Calendar className="text-blue-600" /> Recent Session Logs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Date</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Login</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Subject</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Duration</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest">IP Address</TableHead>
                                    <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest text-right">Activity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceData?.logs?.length > 0 ? (
                                    attendanceData.logs.map((log: any) => (
                                        <TableRow key={log._id}>
                                            <TableCell className="px-8 font-bold">{log.date}</TableCell>
                                            <TableCell className="text-slate-500">{new Date(log.login_time).toLocaleTimeString()}</TableCell>
                                            <TableCell className="text-[10px] font-bold uppercase tracking-tight text-blue-600 max-w-[150px] truncate">
                                                {log.subject_name || "None"}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{log.session_duration} mins</TableCell>
                                            <TableCell className="text-slate-400 text-xs">{log.ip_address}</TableCell>
                                            <TableCell className="px-8 text-right">
                                                {log.is_suspicious ? (
                                                    <Badge variant="destructive" className="rounded-full text-[10px] font-black uppercase">Low Activity</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase border-emerald-200 text-emerald-600">Productive</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-12 text-center text-slate-400 uppercase font-black tracking-widest text-xs">No activity logs found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
