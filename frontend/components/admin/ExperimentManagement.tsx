"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    FlaskConical, 
    Link as LinkIcon, 
    FileText, 
    Play,
    Loader2,
    ChevronRight,
    ArrowLeft,
    Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Subject {
    _id: string;
    name: string;
    code: string;
}

interface Experiment {
    _id: string;
    name: string;
    slug: string;
    type: string;
    difficulty: string;
    status: string;
    subject: Subject;
}

export function ExperimentManagement() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [experiments, setExperiments] = useState<Experiment[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get('subId') || "all");
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        subject: '',
        type: 'experimental',
        difficulty: 'Medium',
        status: 'Active'
    });


    useEffect(() => {
        fetchSubjects();
        fetchExperiments();
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        const res = await fetch('http://localhost:5000/api/subjects');
        const data = await res.json();
        setSubjects(data);
    };

    const fetchExperiments = async () => {
        setLoading(true);
        try {
            const url = selectedSubject === 'all' 
                ? 'http://localhost:5000/api/experiments' 
                : `http://localhost:5000/api/experiments?subjectId=${selectedSubject}`;
            const res = await fetch(url);
            const data = await res.json();
            setExperiments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/experiments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsAddOpen(false);
                fetchExperiments();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this experiment?")) return;
        await fetch(`http://localhost:5000/api/experiments/${id}`, { method: 'DELETE' });
        fetchExperiments();
    };

    const handleManageResources = (id: string) => {
        router.push(`/dashboard/admin?view=resources&expId=${id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Simulation Registry</h2>
                    <p className="text-slate-500 text-sm font-medium">Configure interactive laboratory experiments and learning modules.</p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-[240px] rounded-xl border-slate-100 shadow-sm bg-white font-bold h-12">
                            <Filter size={18} className="mr-2 text-indigo-600" />
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100">
                            <SelectItem value="all" className="font-bold">All Subjects</SelectItem>
                            {subjects.map(sub => (
                                <SelectItem key={sub._id} value={sub._id} className="font-bold">{sub.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl px-6 h-12">
                        <Plus className="mr-2 h-5 w-5" /> NEW EXPERIMENT
                    </Button>
                </div>
            </div>

            <div className="space-y-12">
                {loading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="animate-spin inline-block mr-2 text-indigo-600" />
                        <span className="font-black text-slate-400 uppercase tracking-widest italic">Syncing Registry...</span>
                    </div>
                ) : experiments.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <FlaskConical size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest italic">No experiments found in the registry</p>
                    </div>
                ) : (
                    // Group experiments by subject
                    Object.entries(
                        // Sort grouped subjects so they don't jump around
                        experiments.reduce((acc, exp) => {
                            const subName = exp.subject?.name || "Unassigned";
                            if (!acc[subName]) acc[subName] = [];
                            acc[subName].push(exp);
                            return acc;
                        }, {} as Record<string, Experiment[]>)
                    )
                    .sort(([a], [b]) => a === "Unassigned" ? 1 : b === "Unassigned" ? -1 : a.localeCompare(b))
                    .map(([subjectName, subjectExps]) => (
                        <div key={subjectName} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h4 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-4 py-2 rounded-xl whitespace-nowrap">
                                    {subjectName}
                                </h4>
                                <div className="h-px bg-slate-100 w-full" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subjectExps.map(exp => (
                                    <Card key={exp._id} className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 hover:shadow-indigo-100 transition-all group overflow-hidden bg-white">
                                        <div className="p-8 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className={`p-4 rounded-[1.5rem] ${exp.type === 'learning' ? 'bg-amber-100/50' : 'bg-indigo-100/50'}`}>
                                                    {exp.type === 'learning' ? <FileText className="text-amber-600" /> : <FlaskConical className="text-indigo-600" />}
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="rounded-xl"><Edit size={16} className="text-slate-400" /></Button>
                                                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => handleDelete(exp._id)}><Trash2 size={16} className="text-red-400" /></Button>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-1">{exp.name}</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    ID: {exp.slug}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                                <Badge className={`rounded-lg uppercase font-black text-[10px] tracking-widest ${
                                                    exp.difficulty === 'Hard' ? 'bg-red-50 text-red-600' :
                                                    exp.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {exp.difficulty}
                                                </Badge>
                                                <Badge variant="outline" className="rounded-lg uppercase font-black text-[10px] tracking-widest border-slate-100 text-slate-400">
                                                    {exp.status}
                                                </Badge>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => handleManageResources(exp._id)}
                                                className="w-full rounded-2xl border-slate-100 font-black text-xs h-12 uppercase group-hover:bg-slate-900 group-hover:text-white transition-all"
                                            >
                                                Manage Resources <ChevronRight size={14} className="ml-2" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="rounded-[2.5rem] bg-white border-none shadow-2xl p-0 overflow-hidden max-w-lg">
                    <div className="bg-slate-900 p-8 text-white">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Experiment Architect</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">Define a new laboratory terminal and link it to the syllabus.</DialogDescription>
                    </div>
                    <form onSubmit={handleCreate} className="p-8 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Experiment Name</Label>
                            <Input 
                                required
                                className="rounded-xl border-slate-100 font-bold" 
                                placeholder="Verification of Logic Gates" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">URL Slug</Label>
                                <Input 
                                    required
                                    className="rounded-xl border-slate-100 font-mono" 
                                    placeholder="logic-gates-verification" 
                                    value={formData.slug}
                                    onChange={e => setFormData({...formData, slug: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject Link</Label>
                                <Select onValueChange={val => setFormData({...formData, subject: val})}>
                                    <SelectTrigger className="rounded-xl border-slate-100 font-bold">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map(sub => (
                                            <SelectItem key={sub._id} value={sub._id} className="font-bold">{sub.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Difficulty</Label>
                                <Select defaultValue="Medium" onValueChange={val => setFormData({...formData, difficulty: val})}>
                                    <SelectTrigger className="rounded-xl border-slate-100 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy" className="font-bold">Easy</SelectItem>
                                        <SelectItem value="Medium" className="font-bold">Medium</SelectItem>
                                        <SelectItem value="Hard" className="font-bold">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Experiment Type</Label>
                                <Select defaultValue="experimental" onValueChange={val => setFormData({...formData, type: val})}>
                                    <SelectTrigger className="rounded-xl border-slate-100 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="experimental" className="font-bold">Simulation</SelectItem>
                                        <SelectItem value="learning" className="font-bold">Learning Module</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl py-6 mt-4 uppercase">
                            Deploy to Registry
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

