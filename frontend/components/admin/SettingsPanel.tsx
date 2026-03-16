"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Settings, 
    Mail, 
    Shield, 
    Clock, 
    Database, 
    Lock, 
    UserCheck,
    RefreshCw,
    Save,
    CheckCircle2,
    HardDrive,
    Terminal,
    Loader2
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SettingsPanel() {
    const [settings, setSettings] = useState<Record<string, any>>({
        REGISTRATION_ENABLED: true,
        SESSION_TIMEOUT: 60,
        SMTP_NOTIFICATIONS: false,
        LAB_DURATION: 120
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/settings');
            const data = await res.json();
            const config: Record<string, any> = {};
            data.forEach((s: any) => config[s.key] = s.value);
            setSettings(prev => ({ ...prev, ...config }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string, value: any) => {
        setSaving(true);
        try {
            await fetch('http://localhost:5000/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Environment Controls</h2>
                <p className="text-slate-500 text-sm font-medium">Fine-tune the virtual lab architecture and system-wide security policies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Security & Access */}
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-8">
                        <div className="flex items-center gap-3">
                            <Shield className="text-indigo-400" />
                            <CardTitle className="text-xl font-black uppercase tracking-tighter">Security Protocols</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-black text-slate-800 uppercase tracking-tight">Public Registration</Label>
                                <p className="text-xs text-slate-400 font-medium">Allow new students to sign up without admin invite.</p>
                            </div>
                            <Switch 
                                checked={settings.REGISTRATION_ENABLED} 
                                onCheckedChange={(val: boolean) => handleSave('REGISTRATION_ENABLED', val)} 
                            />
                        </div>
                        <div className="h-px bg-slate-50" />
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Session Guard (Minutes)</Label>
                            <div className="flex gap-4">
                                <Input 
                                    type="number" 
                                    className="rounded-xl border-slate-100 font-bold h-12" 
                                    value={settings.SESSION_TIMEOUT}
                                    onChange={e => setSettings({...settings, SESSION_TIMEOUT: parseInt(e.target.value)})}
                                />
                                <Button onClick={() => handleSave('SESSION_TIMEOUT', settings.SESSION_TIMEOUT)} className="rounded-xl px-6 bg-slate-100 text-slate-900 hover:bg-indigo-600 hover:text-white font-black uppercase text-xs">Update</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Email (SMTP) */}
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden">
                    <CardHeader className="bg-indigo-600 text-white p-8">
                        <div className="flex items-center gap-3">
                            <Mail className="text-white" />
                            <CardTitle className="text-xl font-black uppercase tracking-tighter">Communications Hub</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-black text-slate-800 uppercase tracking-tight">Email Notifications</Label>
                                <p className="text-xs text-slate-400 font-medium">Send automatic welcome and alert emails.</p>
                            </div>
                            <Switch 
                                checked={settings.SMTP_NOTIFICATIONS} 
                                onCheckedChange={(val: boolean) => handleSave('SMTP_NOTIFICATIONS', val)} 
                            />
                        </div>
                        <div className="h-px bg-slate-50" />
                        <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-black uppercase text-[10px] tracking-widest text-indigo-600 hover:bg-slate-50">
                            Configure SMTP Server
                        </Button>
                    </CardContent>
                </Card>

                {/* Lab parameters */}
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <Clock className="text-slate-400" />
                            <CardTitle className="text-xl font-black uppercase tracking-tighter text-slate-800">Laboratory Config</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Max Lab Session (Mins)</Label>
                            <Input 
                                type="number" 
                                className="rounded-xl border-slate-100 font-bold h-12" 
                                value={settings.LAB_DURATION}
                                onChange={e => setSettings({...settings, LAB_DURATION: parseInt(e.target.value)})}
                            />
                            <Button onClick={() => handleSave('LAB_DURATION', settings.LAB_DURATION)} className="w-full rounded-xl h-12 bg-slate-900 text-white font-black uppercase text-xs">Apply Duration</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Maintenance */}
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden flex flex-col justify-between">
                    <div className="p-8 border-b border-slate-50">
                         <div className="flex items-center gap-3 mb-4">
                            <Database className="text-amber-500" />
                            <CardTitle className="text-xl font-black uppercase tracking-tighter text-slate-800">System Utilities</CardTitle>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Backup snapshots and system log rotation.</p>
                    </div>
                    <div className="p-8 bg-slate-900 text-white space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-50">
                            <span>Last Backup</span>
                            <span>2h Ago</span>
                        </div>
                        <Button className="w-full h-12 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 font-black uppercase text-xs">
                             Create Database Snapshot
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
