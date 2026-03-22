"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Clock, 
    User, 
    Tag, 
    FileText, 
    CheckCircle2, 
    PlusCircle,
    Trash2,
    Settings,
    Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Log {
    _id: string;
    action: string;
    userName: string;
    userRole: string;
    details: string;
    timestamp: string;
}

const getActionIcon = (action: string) => {
    switch (action) {
        case 'CREATE_SUBJECT': return <PlusCircle className="text-indigo-600" size={16} />;
        case 'ENROLL_STUDENT': return <User className="text-emerald-600" size={16} />;
        case 'DELETE_STUDENT': return <Trash2 className="text-red-600" size={16} />;
        case 'SYSTEM_CONFIG': return <Settings className="text-slate-600" size={16} />;
        default: return <FileText className="text-slate-400" size={16} />;
    }
};

export function ActivityLogView() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/logs');
            const data = await res.json();
            setLogs(data);
        } catch (error) {
            console.error("Log fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">System Activity Logs</CardTitle>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time audit trail of all admin actions</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-2xl">
                        <HistoryIcon className="w-6 h-6 text-indigo-400" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                        <Loader2 className="animate-spin mb-4" />
                        <p className="font-bold text-sm">Accessing audit server...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-20 text-center text-slate-400 italic font-medium">
                        No activity recorded in the current session.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <div key={log._id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="mt-1 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                                    {getActionIcon(log.action)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm font-black text-slate-800 truncate uppercase tracking-tight">
                                            {log.action.replace(/_/g, ' ')}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap bg-white px-3 py-1 rounded-full border border-slate-100">
                                            <Clock size={10} />
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                                        {log.details}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                            <User size={10} />
                                            {log.userName}
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Role: <span className="text-slate-600">{log.userRole}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function HistoryIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="m12 7 0 5 3 2" />
        </svg>
    );
}
