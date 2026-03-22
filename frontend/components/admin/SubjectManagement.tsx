"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2, Edit, BookOpen, Loader2, Check, Search, FlaskConical, ChevronLeft, Video, FileText, ExternalLink, Link as LinkIcon, ChevronRight, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Subject {
    _id: string;
    name: string;
    code: string;
    branch: string;
    semester: number;
    hasLab: boolean;
    experimentCount?: number;
}

export function SubjectManagement() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<string>("all");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    
    // New Subject State
    const [newSubject, setNewSubject] = useState({
        name: '',
        code: '',
        branch: '',
        semester: 1,
        hasLab: true
    });

    useEffect(() => {
        fetchSubjects();
    }, [selectedBranch, selectedSemester]);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:5000/api/subjects?';
            if (selectedBranch !== 'all') url += `branch=${selectedBranch}&`;
            if (selectedSemester !== 'all') url += `semester=${selectedSemester}`;
            const res = await fetch(url);
            const data = await res.json();
            setSubjects(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubject)
            });
            if (res.ok) {
                fetchSubjects();
                setIsAdding(false);
                setNewSubject({ name: '', code: '', branch: '', semester: 1, hasLab: true });
            }
        } catch (error) {
            console.error("Failed to create subject:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`http://localhost:5000/api/subjects/${id}`, { method: 'DELETE' });
            fetchSubjects();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    if (selectedSubjectId) {
        const subject = subjects.find(s => s._id === selectedSubjectId);
        return <SubjectDetail subject={subject!} onBack={() => setSelectedSubjectId(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Subject Repository</h3>
                    <p className="text-sm text-slate-500">Manage lab modules and theory assignments</p>
                </div>
                <div className="flex gap-3">
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="w-[180px] rounded-xl border-slate-100 shadow-sm bg-white font-bold h-12">
                            <SelectValue placeholder="All Branches" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Branches</SelectItem>
                            <SelectItem value="CSE">Computer Science</SelectItem>
                            <SelectItem value="IT">Information Tech</SelectItem>
                            <SelectItem value="ECE">Electronics</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                        <SelectTrigger className="w-[160px] rounded-xl border-slate-100 shadow-sm bg-white font-bold h-12">
                            <SelectValue placeholder="All Semesters" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Semesters</SelectItem>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button 
                        onClick={() => setIsAdding(!isAdding)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-12 font-bold"
                    >
                        {isAdding ? "Cancel" : "Add New Subject"}
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="border-2 border-indigo-100 bg-indigo-50/30 rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-indigo-900">Define New Subject</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Subject Name</Label>
                                <Input 
                                    className="rounded-xl border-indigo-200" 
                                    placeholder="e.g. Computer Networks Lab"
                                    value={newSubject.name}
                                    onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Subject Code</Label>
                                <Input 
                                    className="rounded-xl border-indigo-200" 
                                    placeholder="e.g. KCS-453"
                                    value={newSubject.code}
                                    onChange={e => setNewSubject({...newSubject, code: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Department / Branch</Label>
                                <Select onValueChange={v => setNewSubject({...newSubject, branch: v})}>
                                    <SelectTrigger className="rounded-xl border-indigo-200">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CSE">Computer Science</SelectItem>
                                        <SelectItem value="IT">Information Tech</SelectItem>
                                        <SelectItem value="ECE">Electronics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Target Semester</Label>
                                <Select onValueChange={v => setNewSubject({...newSubject, semester: parseInt(v)})}>
                                    <SelectTrigger className="rounded-xl border-indigo-200">
                                        <SelectValue placeholder="Semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end md:col-span-2">
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 rounded-xl font-bold">
                                    <Plus className="mr-2" /> Register Subject
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest p-6">Subject Information</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Branch</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Semester</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Experiments</TableHead>
                            <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Lab Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20">
                                    <Loader2 className="animate-spin inline-block mr-2 text-indigo-600" /> 
                                    <span className="font-black text-slate-300 uppercase tracking-widest italic">Syncing Registry...</span>
                                </TableCell>
                            </TableRow>
                        ) : subjects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[3rem] m-6">
                                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest italic">No subjects found for current selection</p>
                                </TableCell>
                            </TableRow>
                        ) : subjects.map((subject) => (
                            <TableRow 
                                key={subject._id} 
                                className="hover:bg-indigo-50/30 transition-all cursor-pointer group"
                                onClick={() => setSelectedSubjectId(subject._id)}
                            >
                                <TableCell className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-white transition-colors">
                                            <BookOpen className="text-slate-500 w-5 h-5 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{subject.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{subject.code}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-lg border-indigo-100 bg-indigo-50 text-indigo-600 font-black text-[10px] px-3 py-1 uppercase tracking-widest">
                                        {subject.branch}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 font-black text-slate-700">
                                        {subject.semester}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary" className="rounded-xl bg-slate-950 text-white font-black border-none px-4 py-1.5 text-xs">
                                        {subject.experimentCount || 0}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {subject.hasLab ? (
                                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.1em] bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Lab Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.1em] bg-slate-100 w-fit px-3 py-1.5 rounded-full">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                            Theory
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

// --- SUB-COMPONENTS ---


interface SubjectDetailProps {
    subject: Subject;
    onBack: () => void;
}

function SubjectDetail({ subject, onBack }: SubjectDetailProps) {
    const [experiments, setExperiments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
    const [isAddingExp, setIsAddingExp] = useState(false);
    const [newExp, setNewExp] = useState({ name: '', slug: '', status: 'Active' });

    useEffect(() => {
        fetchExperiments();
    }, [subject._id]);

    const fetchExperiments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/experiments?subjectId=${subject._id}`);
            const data = await res.json();
            setExperiments(data);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/experiments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newExp, subject: subject._id })
            });
            if (res.ok) {
                fetchExperiments();
                setIsAddingExp(false);
                setNewExp({ name: '', slug: '', status: 'Alpha' });
            }
        } catch (error) {
            console.error("Experiment creation failed:", error);
        }
    };

    const handleDeleteExp = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure? All resources linked to this experiment will be orphaned or deleted.")) return;
        try {
            await fetch(`http://localhost:5000/api/experiments/${id}`, { method: 'DELETE' });
            if (id === selectedExpId) setSelectedExpId(null);
            fetchExperiments();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-6">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={onBack}
                        className="rounded-2xl border-slate-100 bg-white shadow-xl shadow-slate-100 hover:scale-110 transition-all w-14 h-14"
                    >
                        <ChevronLeft size={24} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em]">{subject.branch}</Badge>
                            <Badge variant="outline" className="rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border-slate-200">Semester {subject.semester}</Badge>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{subject.name}</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{subject.code} • Simulation Registry & Resource Management</p>
                    </div>
                </div>
            </div>

            {/* Experiments Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Experiment List */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Module Terminal</h4>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="rounded-lg bg-slate-950 text-white font-black">{experiments.length}</Badge>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100" onClick={() => setIsAddingExp(!isAddingExp)}>
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                    
                    {isAddingExp && (
                        <Card className="rounded-[2rem] border-2 border-indigo-100 bg-indigo-50/50 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <form onSubmit={handleCreateExp} className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-indigo-400">Exp Name</Label>
                                    <Input className="rounded-xl h-10 bg-white" placeholder="Selective Repeat" value={newExp.name} onChange={e => setNewExp({...newExp, name: e.target.value})} required />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-indigo-400">Slug</Label>
                                    <Input className="rounded-xl h-10 bg-white" placeholder="selective-repeat" value={newExp.slug} onChange={e => setNewExp({...newExp, slug: e.target.value})} required />
                                </div>
                                <Button type="submit" className="w-full bg-indigo-600 rounded-xl font-bold h-10 mt-2">Add Module</Button>
                            </form>
                        </Card>
                    )}
    
                    {loading ? (
                        <div className="py-12 text-center bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                            <Loader2 className="animate-spin inline-block text-indigo-600 mb-2" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Accessing Files...</p>
                        </div>
                    ) : experiments.map((exp) => (
                        <Card 
                            key={exp._id}
                            onClick={() => setSelectedExpId(exp._id)}
                            className={`rounded-[2rem] border-none shadow-xl transition-all cursor-pointer group overflow-hidden ${
                                selectedExpId === exp._id 
                                ? 'bg-indigo-600 text-white shadow-indigo-200' 
                                : 'bg-white text-slate-800 shadow-slate-100/50 hover:bg-slate-50'
                            }`}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${
                                        selectedExpId === exp._id ? 'bg-indigo-500' : 'bg-slate-50 group-hover:bg-white'
                                    }`}>
                                        <FlaskConical size={20} className={selectedExpId === exp._id ? 'text-white' : 'text-slate-500'} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Badge className={`rounded-full text-[8px] font-black uppercase tracking-widest ${
                                            selectedExpId === exp._id ? 'bg-white text-indigo-600' : 'bg-indigo-50 text-indigo-600'
                                        }`}>
                                            {exp.status}
                                        </Badge>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded-lg ${selectedExpId === exp._id ? 'hover:bg-indigo-500 text-white/50 hover:text-white' : 'text-slate-300 hover:text-red-500'}`}
                                            onClick={(e) => handleDeleteExp(exp._id, e)}
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                </div>
                                <h4 className="font-black tracking-tight text-lg mb-1 leading-tight">{exp.name}</h4>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                    selectedExpId === exp._id ? 'text-indigo-200' : 'text-slate-400'
                                }`}>
                                    Slug: {exp.slug}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Right: Resource Management (Scoped to Selected Experiment) */}
                <div className="lg:col-span-8">
                    {selectedExpId ? (
                        <SubjectResourceManager experimentId={selectedExpId} experimentName={experiments.find(e => e._id === selectedExpId)?.name} />
                    ) : (
                        <Card className="h-full min-h-[400px] rounded-[3rem] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
                            <div className="bg-white p-6 rounded-full shadow-2xl shadow-indigo-100 mb-6">
                                <ChevronRight size={32} className="text-slate-200" />
                            </div>
                            <h4 className="text-xl font-black text-slate-300 uppercase tracking-tight italic mb-2">Select a simulation terminal</h4>
                            <p className="text-xs font-bold text-slate-400 max-w-[240px]">Select an experiment from the left menu to manage its interactive resources and learning assets.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

function SubjectResourceManager({ experimentId, experimentName }: { experimentId: string, experimentName: string }) {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newRes, setNewRes] = useState({
        type: 'video' as 'video' | 'pdf' | 'notes' | 'external',
        title: '',
        url: '',
        content: ''
    });

    useEffect(() => {
        fetchResources();
    }, [experimentId]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/resources?experimentId=${experimentId}`);
            const data = await res.json();
            setResources(data);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newRes.title) return;
        setSaving(true);
        try {
            await fetch('http://localhost:5000/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newRes, experiment: experimentId })
            });
            setNewRes({ type: 'video', title: '', url: '', content: '' });
            fetchResources();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this asset?")) return;
        await fetch(`http://localhost:5000/api/resources/${id}`, { method: 'DELETE' });
        fetchResources();
    };

    return (
        <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-100 overflow-hidden bg-white animate-in slide-in-from-right-4 duration-500">
            <div className="bg-slate-900 p-8 text-white">
                <h4 className="text-2xl font-black tracking-tighter uppercase mb-1">Asset Control: {experimentName}</h4>
                <p className="text-slate-400 text-xs font-medium tracking-wide">Manage educational resources for this laboratory terminal.</p>
            </div>
            
            <CardContent className="p-8 space-y-8">
                {/* Addition Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Header</Label>
                        <Input 
                            className="rounded-xl border-white bg-white font-bold" 
                            placeholder="Resource Title"
                            value={newRes.title}
                            onChange={e => setNewRes({...newRes, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Category</Label>
                        <Select value={newRes.type} onValueChange={(v: any) => setNewRes({...newRes, type: v})}>
                            <SelectTrigger className="rounded-xl border-white bg-white font-bold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="video">Video Lecture</SelectItem>
                                <SelectItem value="pdf">Manual (PDF)</SelectItem>
                                <SelectItem value="notes">Study Notes</SelectItem>
                                <SelectItem value="external">External Link</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Source URL / Direct Link</Label>
                        <Input 
                            className="rounded-xl border-white bg-white font-bold" 
                            placeholder="https://..."
                            value={newRes.url}
                            onChange={e => setNewRes({...newRes, url: e.target.value})}
                        />
                    </div>
                    <Button 
                        onClick={handleCreate}
                        disabled={saving || !newRes.title}
                        className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 h-14 rounded-2xl font-black uppercase tracking-widest mt-2"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2" size={18} /> Deploy Asset</>}
                    </Button>
                </div>

                {/* Resource List */}
                <div className="space-y-4">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs ml-2">Deployed Assets</h4>
                    {loading ? (
                        <div className="py-12 text-center">
                            <Loader2 className="animate-spin inline-block text-indigo-600" />
                        </div>
                    ) : resources.length === 0 ? (
                        <div className="py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic">No assets linked to this simulation</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {resources.map((res) => (
                                <div key={res._id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/10 transition-all group">
                                    <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-white transition-colors">
                                        {res.type === 'video' ? <Video size={20} className="text-rose-500" /> :
                                         res.type === 'pdf' ? <FileText size={20} className="text-indigo-500" /> :
                                         res.type === 'external' ? <ExternalLink size={20} className="text-amber-500" /> :
                                         <LinkIcon size={20} className="text-slate-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-black text-slate-800 leading-tight">{res.title}</h5>
                                        <p className="text-[10px] font-bold text-slate-400 truncate max-w-[300px]">{res.url}</p>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                        onClick={() => handleDelete(res._id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
