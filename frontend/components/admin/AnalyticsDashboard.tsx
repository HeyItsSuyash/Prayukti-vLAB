"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    LineChart, 
    Line,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { Loader2, Activity, TrendingUp, Users, BookOpen } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AnalyticsDashboard() {
    const [loading, setLoading] = useState(true);

    const experimentUsageData = [
        { name: 'DVR', usage: 450 },
        { name: 'Sliding Window', usage: 320 },
        { name: 'Error Detection', usage: 280 },
        { name: 'RSA', usage: 210 },
        { name: 'Overshoot', usage: 150 },
    ];

    const weeklyActivity = [
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 52 },
        { day: 'Wed', value: 38 },
        { day: 'Thu', value: 65 },
        { day: 'Fri', value: 48 },
        { day: 'Sat', value: 24 },
        { day: 'Sun', value: 15 },
    ];

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 p-3 rounded-2xl">
                                <Activity className="text-indigo-600 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Enrollment Velocity</p>
                                <h4 className="text-2xl font-black text-slate-800">+12%</h4>
                                <p className="text-[10px] text-emerald-500 font-bold">Increasing weekly</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Add more metric cards if needed */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            <BookOpen size={20} className="text-indigo-600" />
                            Most Used Experiments
                        </CardTitle>
                        <CardDescription>Simulations launched in the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={experimentUsageData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                                />
                                <Bar dataKey="usage" radius={[10, 10, 10, 10]} barSize={40}>
                                    {experimentUsageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            <TrendingUp size={20} className="text-emerald-500" />
                            Weekly Engagement
                        </CardTitle>
                        <CardDescription>Active student sessions per day</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyActivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#10b981" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} 
                                    activeDot={{ r: 8 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
