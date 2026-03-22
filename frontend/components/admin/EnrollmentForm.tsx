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
import { Plus, Trash2, BookPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Subject {
    _id: string;
    name: string;
    code: string;
    branch: string;
    semester: number;
}

export function EnrollmentForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        enrollmentNo: '',
        rollNo: '',
        email: '',
        branch: '',
        year: 1,
        semester: 1
    });

    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [manualSubject, setManualSubject] = useState('');

    // Fetch subjects when branch/semester changes
    useEffect(() => {
        if (formData.branch && formData.semester) {
            fetchAvailableSubjects();
        }
    }, [formData.branch, formData.semester]);

    const fetchAvailableSubjects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/subjects?branch=${formData.branch}&semester=${formData.semester}`);
            const data = await res.json();
            setAvailableSubjects(data);
            // Default select all standard subjects
            setSelectedSubjects(data.map((s: Subject) => s._id));
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: 'student',
                    password: 'password123',
                    assignedSubjects: selectedSubjects
                })
            });

            if (res.ok) {
                // Log action
                await fetch('http://localhost:5000/api/logs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'ENROLL_STUDENT',
                        details: `Enrolled student: ${formData.fullName} (${formData.enrollmentNo})`
                    })
                });

                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    setSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Enrollment failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleSubject = (id: string) => {
        setSelectedSubjects(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle2 className="text-green-600 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Enrollment Successful!</h3>
                <p className="text-slate-500">Student has been registered and subjects assigned.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 p-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                    <Input 
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        required
                        className="rounded-xl border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                    <Input 
                        type="email"
                        placeholder="rahul@mmmut.ac.in"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                        className="rounded-xl border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Enrollment Number</Label>
                    <Input 
                        placeholder="2024CSE001"
                        value={formData.enrollmentNo}
                        onChange={e => setFormData({...formData, enrollmentNo: e.target.value})}
                        required
                        className="rounded-xl border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">University Roll No</Label>
                    <Input 
                        placeholder="240101001"
                        value={formData.rollNo}
                        onChange={e => setFormData({...formData, rollNo: e.target.value})}
                        required
                        className="rounded-xl border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Branch</Label>
                    <Select onValueChange={v => setFormData({...formData, branch: v})}>
                        <SelectTrigger className="rounded-xl border-slate-200">
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CSE">Computer Science & Eng.</SelectItem>
                            <SelectItem value="IT">Information Technology</SelectItem>
                            <SelectItem value="ECE">Electronics & Comm. Eng.</SelectItem>
                            <SelectItem value="EE">Electrical Eng.</SelectItem>
                            <SelectItem value="ME">Mechanical Eng.</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Academic Year</Label>
                        <Select onValueChange={v => setFormData({...formData, year: parseInt(v)})}>
                            <SelectTrigger className="rounded-xl border-slate-200">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1,2,3,4].map(y => <SelectItem key={y} value={y.toString()}>{y}st Year</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Semester</Label>
                        <Select onValueChange={v => setFormData({...formData, semester: parseInt(v)})}>
                            <SelectTrigger className="rounded-xl border-slate-200">
                                <SelectValue placeholder="Sem" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Smart Subject Assignment */}
            <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-black text-slate-800 uppercase tracking-tighter">Subject Assignment</h4>
                        <p className="text-xs text-slate-500">Suggested based on Branch & Semester</p>
                    </div>
                    {loading && <Loader2 className="animate-spin text-indigo-600" size={20} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableSubjects.map(subject => (
                        <div 
                            key={subject._id}
                            onClick={() => toggleSubject(subject._id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between
                                ${selectedSubjects.includes(subject._id) 
                                    ? 'border-indigo-600 bg-indigo-50/50' 
                                    : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            <div>
                                <p className="font-bold text-sm text-slate-800">{subject.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{subject.code}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${selectedSubjects.includes(subject._id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}>
                                {selectedSubjects.includes(subject._id) && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>
                    ))}
                    
                    {availableSubjects.length === 0 && !loading && (
                        <div className="col-span-2 p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                            <BookPlus className="mb-2 opacity-50" />
                            <p className="text-sm font-bold">No standard subjects found for this criteria.</p>
                            <p className="text-xs">Use the manual assignment option below.</p>
                        </div>
                    )}
                </div>

                {/* Manual Assignment */}
                <div className="pt-4 border-t border-dashed">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">Additional Manual Assignment</Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter Subject Name or Code"
                            className="rounded-xl border-slate-200 bg-slate-50/50"
                            value={manualSubject}
                            onChange={e => setManualSubject(e.target.value)}
                        />
                        <Button type="button" variant="outline" className="rounded-xl border-slate-200">
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </div>
                </div>
            </div>

            <Button 
                type="submit" 
                disabled={submitting}
                className="w-full py-8 text-lg font-black tracking-widest rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 shadow-xl transition-all active:scale-[0.98]"
            >
                {submitting ? <Loader2 className="animate-spin" /> : "COMPLETE ENROLLMENT"}
            </Button>
        </form>
    );
}
