"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Search, 
    UserPlus, 
    Mail, 
    ShieldCheck, 
    ShieldAlert, 
    Trash2, 
    Edit, 
    MoreVertical,
    CheckCircle2,
    XCircle,
    Loader2,
    Filter
} from 'lucide-react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface Teacher {
    _id: string;
    fullName: string;
    email: string;
    employeeId: string;
    status: 'active' | 'disabled';
    assignedSubjects: any[];
    createdAt: string;
}

export function TeacherManagement() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    
    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        employeeId: '',
        assignedSubjects: [] as string[],
        role: 'teacher'
    });

    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [selectedTeacherForEmail, setSelectedTeacherForEmail] = useState<Teacher | null>(null);
    const [emailData, setEmailData] = useState({
        subject: '',
        content: ''
    });
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        fetchTeachers();
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/subjects');
            const data = await res.json();
            setSubjects(data);
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
        }
    };

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/users?role=teacher');
            const data = await res.json();
            setTeachers(data);
        } catch (error) {
            console.error("Failed to fetch teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsAddDialogOpen(false);
                fetchTeachers();
                setFormData({ fullName: '', email: '', password: '', employeeId: '', assignedSubjects: [], role: 'teacher' });
            }
        } catch (error) {
            console.error("Create failed:", error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTeacher) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/${editingTeacher._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setEditingTeacher(null);
                fetchTeachers();
                setFormData({ fullName: '', email: '', password: '', employeeId: '', assignedSubjects: [], role: 'teacher' });
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const toggleSubject = (subjectId: string) => {
        setFormData(prev => ({
            ...prev,
            assignedSubjects: prev.assignedSubjects.includes(subjectId)
                ? prev.assignedSubjects.filter(id => id !== subjectId)
                : [...prev.assignedSubjects, subjectId]
        }));
    };

    const startEditing = (teacher: Teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            fullName: teacher.fullName,
            email: teacher.email,
            password: '', 
            employeeId: teacher.employeeId,
            assignedSubjects: teacher.assignedSubjects?.map(s => typeof s === 'string' ? s : s._id) || [],
            role: 'teacher'
        });
    };

    const handleToggleStatus = async (teacher: Teacher) => {
        const newStatus = teacher.status === 'active' ? 'disabled' : 'active';
        try {
            await fetch(`http://localhost:5000/api/users/${teacher._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchTeachers();
        } catch (error) {
            console.error("Status toggle failed:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will permanently remove the teacher account.")) return;
        try {
            await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
            fetchTeachers();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacherForEmail) return;
        
        setSendingEmail(true);
        try {
            const res = await fetch('http://localhost:5000/api/users/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedTeacherForEmail._id,
                    subject: emailData.subject,
                    content: emailData.content
                })
            });

            if (res.ok) {
                setIsEmailDialogOpen(false);
                setEmailData({ subject: '', content: '' });
                alert("Email sent successfully!");
            } else {
                alert("Failed to send email. Check backend logs.");
            }
        } catch (error) {
            console.error("Email send failed:", error);
            alert("Error sending email.");
        } finally {
            setSendingEmail(false);
        }
    };

    const filteredTeachers = teachers.filter(t => 
        t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Teacher Faculty</h2>
                    <p className="text-slate-500 text-sm font-medium">Manage faculty accounts, subject permissions, and status.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            placeholder="Search faculty..." 
                            className="pl-10 w-64 rounded-xl border-slate-100 shadow-sm"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => {
                        setFormData({ fullName: '', email: '', password: '', employeeId: '', assignedSubjects: [], role: 'teacher' });
                        setIsAddDialogOpen(true);
                    }} className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl px-6">
                        <UserPlus className="mr-2 h-4 w-4" /> ADD FACULTY
                    </Button>
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 overflow-hidden bg-white">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500 py-6 pl-8">Faculty Details</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">ID / Dept</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Assigned Labs</TableHead>
                                <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Status</TableHead>
                                <TableHead className="text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center">
                                        <Loader2 className="animate-spin inline-block mr-2 text-indigo-600" />
                                        <span className="font-black text-slate-400 uppercase tracking-widest">Accessing Faculty Directory...</span>
                                    </TableCell>
                                </TableRow>
                            ) : filteredTeachers.map((teacher) => (
                                <TableRow key={teacher._id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="py-6 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                                                {teacher.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 tracking-tight">{teacher.fullName}</p>
                                                <p className="text-xs font-medium text-slate-400">{teacher.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-lg font-mono text-xs border-slate-200">
                                            {teacher.employeeId || 'FA-9921'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {teacher.assignedSubjects?.length > 0 ? (
                                                teacher.assignedSubjects.slice(0, 3).map((sub, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black" title={sub.name}>
                                                        {sub.name?.charAt(0)}
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 italic uppercase">No Labs Assigned</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            className={`rounded-lg uppercase font-black text-[10px] tracking-widest ${
                                                teacher.status === 'active' 
                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                            }`}
                                        >
                                            {teacher.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical size={20} className="text-slate-400" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuItem className="rounded-xl font-bold text-xs py-3" onClick={() => startEditing(teacher)}>
                                                    <Edit size={16} className="mr-2 text-blue-500" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl font-bold text-xs py-3" onClick={() => handleToggleStatus(teacher)}>
                                                    {teacher.status === 'active' ? 'Disable Account' : 'Enable Account'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl font-bold text-xs py-3" onClick={() => {
                                                    setSelectedTeacherForEmail(teacher);
                                                    setIsEmailDialogOpen(true);
                                                }}>
                                                    <Mail size={16} className="mr-2 text-indigo-500" /> Send Mail
                                                </DropdownMenuItem>
                                                <div className="h-px bg-slate-100 my-1" />
                                                <DropdownMenuItem className="rounded-xl font-bold text-xs py-3 text-red-600" onClick={() => handleDelete(teacher._id)}>
                                                    <Trash2 size={16} className="mr-2" /> Terminate Record
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add Faculty Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="rounded-[2.5rem] bg-white border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="bg-slate-900 p-8 text-white">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Registration Portal</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">Create a new faculty account. Credentials will be mailed automatically.</DialogDescription>
                    </div>
                    <form onSubmit={handleCreate} className="p-8 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                            <Input 
                                required
                                className="rounded-xl border-slate-100" 
                                placeholder="Dr. John Doe" 
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Employee ID</Label>
                                <Input 
                                    required
                                    className="rounded-xl border-slate-100" 
                                    placeholder="FA-2024-01" 
                                    value={formData.employeeId}
                                    onChange={e => setFormData({...formData, employeeId: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Temporary Password</Label>
                                <Input 
                                    required
                                    type="password"
                                    className="rounded-xl border-slate-100" 
                                    placeholder="••••••••" 
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                            <Input 
                                required
                                type="email"
                                className="rounded-xl border-slate-100" 
                                placeholder="john.doe@university.edu" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Assigned Subjects</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                {subjects.map(subject => (
                                    <div key={subject._id} className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id={`add-${subject._id}`}
                                            checked={formData.assignedSubjects.includes(subject._id)}
                                            onChange={() => toggleSubject(subject._id)}
                                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`add-${subject._id}`} className="text-xs font-bold text-slate-600 truncate">
                                            {subject.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl py-6 mt-4">
                            GENERATE FACULTY RECORD
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Edit Faculty Dialog */}
            <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
                <DialogContent className="rounded-[2.5rem] bg-white border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="bg-blue-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Edit Faculty Account</DialogTitle>
                        <DialogDescription className="text-blue-100 font-medium">Modify existing record and lab permissions.</DialogDescription>
                    </div>
                    <form onSubmit={handleUpdate} className="p-8 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                            <Input 
                                required
                                className="rounded-xl border-slate-100" 
                                placeholder="Dr. John Doe" 
                                value={formData.fullName}
                                onChange={e => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Employee ID</Label>
                                <Input 
                                    required
                                    className="rounded-xl border-slate-100" 
                                    placeholder="FA-2024-01" 
                                    value={formData.employeeId}
                                    onChange={e => setFormData({...formData, employeeId: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2" title="Leave blank to keep current password">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Update Password</Label>
                                <Input 
                                    type="password"
                                    className="rounded-xl border-slate-100" 
                                    placeholder="••••••••" 
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                            <Input 
                                required
                                type="email"
                                className="rounded-xl border-slate-100" 
                                placeholder="john.doe@university.edu" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Assigned Subjects</Label>
                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                {subjects.map(subject => (
                                    <div key={subject._id} className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id={`edit-${subject._id}`}
                                            checked={formData.assignedSubjects.includes(subject._id)}
                                            onChange={() => toggleSubject(subject._id)}
                                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`edit-${subject._id}`} className="text-xs font-bold text-slate-600 truncate">
                                            {subject.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-black rounded-xl py-6 mt-4">
                            UPDATE FACULTY RECORD
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Individual Email Dialog */}
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogContent className="rounded-[2.5rem] bg-white border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="bg-indigo-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Compose Message</DialogTitle>
                        <DialogDescription className="text-indigo-100 font-medium">
                            Send a secure email to {selectedTeacherForEmail?.fullName}.
                        </DialogDescription>
                    </div>
                    <form onSubmit={handleSendEmail} className="p-8 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Subject</Label>
                            <Input 
                                required
                                className="rounded-xl border-slate-100" 
                                placeholder="Lab Assignment Update..." 
                                value={emailData.subject}
                                onChange={e => setEmailData({...emailData, subject: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Message Content</Label>
                            <textarea
                                required
                                className="w-full min-h-[150px] p-4 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium text-slate-600"
                                placeholder="Dear Faculty member, please note that..."
                                value={emailData.content}
                                onChange={e => setEmailData({...emailData, content: e.target.value})}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={sendingEmail}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl py-6 mt-4"
                        >
                            {sendingEmail ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> DISPATCHING...</>
                            ) : (
                                <><Mail className="mr-2 h-4 w-4" /> SEND SECURE MAIL</>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
