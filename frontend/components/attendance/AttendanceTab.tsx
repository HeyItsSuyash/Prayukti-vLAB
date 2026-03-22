"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';

export default function AttendanceTab() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    const fetchData = async () => {
        try {
            setLoading(true);
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const [aRes, alRes] = await Promise.all([
                axios.get(`${API_BASE}/api/attendance/analytics?range=daily`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('vlab_token')}` }
                }),
                axios.get(`${API_BASE}/api/attendance/alerts`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('vlab_token')}` }
                })
            ]);

            setAnalytics(aRes.data);
            setAlerts(alRes.data);
        } catch (err) {
            console.error("Error fetching attendance data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resolveAlert = async (id: string) => {
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            await axios.patch(`${API_BASE}/api/attendance/alerts/${id}/resolve`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('vlab_token')}` }
            });
            fetchData();
        } catch (err) {
            console.error("Error resolving alert:", err);
        }
    };

    const downloadReport = async () => {
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await axios.get(`${API_BASE}/api/attendance/report?month=${selectedMonth}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('vlab_token')}` }
            });
            
            const data = response.data;
            if (!data || data.length === 0) return;

            const toCSV = (data: any[]) => {
                const headers = Object.keys(data[0]).join(',');
                const rows = data.map(r => Object.values(r).join(','));
                return [headers, ...rows].join('\n');
            };

            const csvContent = toCSV(data);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `Attendance_Report_${selectedMonth}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Error downloading report:", err);
        }
    };

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case 'LOW_ATTENDANCE': return 'bg-red-100 text-red-800 border-red-200';
            case 'MISSED_EXPERIMENTS': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'SHORT_SESSION': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'SUSPICIOUS_ACTIVITY': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    if (loading && !analytics) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Today's Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">{analytics?.attendance_rate_percent || 0}%</div>
                        <p className="text-xs text-slate-500 mt-1">{analytics?.present_count || 0} students present</p>
                    </CardContent>
                </Card>
                <Card className="border-2 border-red-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-red-500">At Risk Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-red-600">{analytics?.at_risk_students?.length || 0}</div>
                        <p className="text-xs text-red-400 mt-1">Requires immediate attention</p>
                    </CardContent>
                </Card>
                <Card className="border-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Unresolved Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">{alerts.length}</div>
                        <p className="text-xs text-slate-500 mt-1">{alerts.filter(a => a.alert_type === 'SHORT_SESSION').length} short sessions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts Table */}
            <Card className="border-2 rounded-[2rem] overflow-hidden">
                <CardHeader>
                    <CardTitle className="uppercase font-black tracking-tight">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-6">Student</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest">Roll No</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest">Type</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest">Message</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest">Date</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest text-right pr-6">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alerts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-slate-400 font-medium">No active alerts found.</TableCell>
                                </TableRow>
                            ) : (
                                alerts.map((alert) => (
                                    <TableRow key={alert._id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-bold pl-6">{alert.student_id?.fullName}</TableCell>
                                        <TableCell className="text-slate-500 font-medium">{alert.student_id?.rollNo || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getBadgeStyle(alert.alert_type)}>
                                                {alert.alert_type.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600 max-w-xs">{alert.message}</TableCell>
                                        <TableCell className="text-xs text-slate-400 font-medium">{new Date(alert.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => resolveAlert(alert._id)}
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Resolve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Monthly Report Section */}
            <Card className="border-2 rounded-[2rem] bg-slate-900 text-white p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-40 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Monthly Student Insights</h3>
                        <p className="text-slate-400 font-medium max-w-md">Generate and download a complete performance report for all students.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Input 
                            type="month" 
                            className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl w-full md:w-48"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        />
                        <Button 
                            onClick={downloadReport}
                            className="bg-white text-slate-900 hover:bg-slate-100 h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs shrink-0"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
