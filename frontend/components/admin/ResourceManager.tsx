"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from 'next/navigation';
import { 
    Plus, 
    Video, 
    FileText, 
    File, 
    Link as LinkIcon, 
    ExternalLink,
    Save,
    Trash2,
    Loader2,
    ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Subject {
    _id: string;
    name: string;
}

interface Experiment {
    _id: string;
    name: string;
    subject: Subject;
}

interface Resource {
    _id: string;
    type: 'video' | 'pdf' | 'notes' | 'external';
    title: string;
    url?: string;
    content?: string;
}

export function ResourceManager() {
    const searchParams = useSearchParams();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const [filteredExperiments, setFilteredExperiments] = useState<Experiment[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedExp, setSelectedExp] = useState<string | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // New Resource State
    const [newRes, setNewRes] = useState<{
        type: 'video' | 'pdf' | 'notes' | 'external';
        title: string;
        url: string;
        content: string;
    }>({
        type: 'video',
        title: '',
        url: '',
        content: ''
    });

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        setLoading(true);
        try {
            const [subsRes, expsRes] = await Promise.all([
                fetch('http://localhost:5000/api/subjects'),
                fetch('http://localhost:5000/api/experiments')
            ]);
            const subs = await subsRes.json();
            const exps = await expsRes.json();
            setSubjects(subs);
            setExperiments(exps);

            // Check for pre-selected experiment from URL
            const expId = searchParams.get('expId');
            if (expId) {
                const targetExp = exps.find((e: Experiment) => e._id === expId);
                if (targetExp) {
                    setSelectedSubject(targetExp.subject._id);
                    setSelectedExp(expId);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSubject) {
            const filtered = experiments.filter(e => e.subject?._id === selectedSubject);
            setFilteredExperiments(filtered);
            // Only reset if the current selectedExp doesn't belong to the new selectedSubject
            if (selectedExp && !filtered.find(e => e._id === selectedExp)) {
                setSelectedExp(null);
            }
        } else {
            setFilteredExperiments([]);
        }
    }, [selectedSubject, experiments]);

    useEffect(() => {
        if (selectedExp) fetchResources();
    }, [selectedExp]);

    const fetchResources = async () => {
        const res = await fetch(`http://localhost:5000/api/resources?experimentId=${selectedExp}`);
        const data = await res.json();
        setResources(data);
    };

    const handleCreate = async () => {
        if (!selectedExp || !newRes.title) return;
        setSaving(true);
        try {
            await fetch('http://localhost:5000/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newRes, experiment: selectedExp })
            });
            setNewRes({ type: 'video', title: '', url: '', content: '' });
            fetchResources();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        await fetch(`http://localhost:5000/api/resources/${id}`, { method: 'DELETE' });
        fetchResources();
    };

    if (loading) return <div className="p-20 text-center uppercase font-black text-slate-400 italic">Synchronizing Assets...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">Knowledge Assets</h2>
                    <p className="text-slate-500 text-sm font-medium">Provision laboratory videos, reference documents, and study material.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Select value={selectedSubject || ""} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-full sm:w-[240px] rounded-xl border-slate-100 shadow-sm bg-white font-black h-12">
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100">
                            {subjects.map(sub => (
                                <SelectItem key={sub._id} value={sub._id} className="font-bold">{sub.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedExp || ""} onValueChange={setSelectedExp} disabled={!selectedSubject}>
                        <SelectTrigger className="w-full sm:w-[240px] rounded-xl border-slate-100 shadow-sm bg-white font-black h-12">
                            <SelectValue placeholder="Select Experiment" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100">
                            {filteredExperiments.map(exp => (
                                <SelectItem key={exp._id} value={exp._id} className="font-bold">{exp.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!selectedExp ? (
                <Card className="rounded-[4rem] border-dashed border-2 border-slate-100 p-20 text-center bg-slate-50/50">
                    <CardContent>
                        <File size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="text-xl font-black text-slate-300 uppercase italic">Select an experiment to manage its resources</h4>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Resource Panel */}
                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white h-fit sticky top-8">
                        <CardHeader className="bg-slate-900 text-white rounded-t-[2.5rem] p-8">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter">Add Knowledge Item</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Resource Type</Label>
                                <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                                    {(['video', 'notes', 'pdf', 'external'] as const).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewRes({...newRes, type})}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                newRes.type === type ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Asset Title</Label>
                                <Input 
                                    className="rounded-xl border-slate-100 font-bold" 
                                    placeholder="e.g. Lab Demonstration Video" 
                                    value={newRes.title}
                                    onChange={e => setNewRes({...newRes, title: e.target.value})}
                                />
                            </div>
                            {newRes.type === 'notes' ? (
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Content Body</Label>
                                    <Textarea 
                                        className="rounded-xl border-slate-100 font-medium min-h-[150px]" 
                                        placeholder="Enter reference material..." 
                                        value={newRes.content}
                                        onChange={e => setNewRes({...newRes, content: e.target.value})}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Source URL</Label>
                                    <Input 
                                        className="rounded-xl border-slate-100 font-mono text-xs" 
                                        placeholder="https://..." 
                                        value={newRes.url}
                                        onChange={e => setNewRes({...newRes, url: e.target.value})}
                                    />
                                </div>
                            )}
                            <Button 
                                onClick={handleCreate} 
                                disabled={saving}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl py-6 mt-4 uppercase"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={18} />}
                                Commital to Vault
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Resources List */}
                    <div className="lg:col-span-2 space-y-4">
                        {resources.length === 0 ? (
                            <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                                <p className="text-slate-300 font-black uppercase italic tracking-widest">No resources cataloged yet</p>
                            </div>
                        ) : resources.map(res => (
                            <Card key={res._id} className="rounded-3xl border-none shadow-lg shadow-slate-100/50 bg-white overflow-hidden group">
                                <CardContent className="p-1 flex items-center gap-4">
                                    <div className={`p-6 rounded-2xl flex items-center justify-center ${
                                        res.type === 'video' ? 'bg-red-50 text-red-600' :
                                        res.type === 'pdf' ? 'bg-amber-50 text-amber-600' :
                                        res.type === 'external' ? 'bg-emerald-50 text-emerald-600' :
                                        'bg-indigo-50 text-indigo-600'
                                    }`}>
                                        {res.type === 'video' ? <Video size={24} /> :
                                         res.type === 'pdf' ? <FileText size={24} /> :
                                         res.type === 'external' ? <ExternalLink size={24} /> :
                                         <File size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-slate-800 tracking-tight truncate">{res.title}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {res.type} {res.url ? `• ${new URL(res.url).hostname}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 pr-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {res.url && (
                                            <Button variant="ghost" size="icon" asChild className="rounded-xl">
                                                <a href={res.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={18} className="text-slate-400" /></a>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="rounded-xl text-red-400" onClick={() => handleDelete(res._id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
