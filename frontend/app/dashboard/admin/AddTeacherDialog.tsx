"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface Teacher {
    id: string;
    name: string;
    email: string;
    employeeId: string;
    subject: string;
    status: 'Active' | 'Inactive';
    joinedDate: string;
}

interface AddTeacherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTeacher: (teacher: Teacher) => void;
}

export function AddTeacherDialog({ open, onOpenChange, onAddTeacher }: AddTeacherDialogProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [subject, setSubject] = useState("Computer Networks");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newTeacher: Teacher = {
                id: `teach-${Date.now()}`,
                name,
                email,
                employeeId,
                subject,
                status: 'Active',
                joinedDate: new Date().toISOString()
            };

            onAddTeacher(newTeacher);
            setLoading(false);
            onOpenChange(false);

            // Reset form
            setName("");
            setEmail("");
            setEmployeeId("");
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogDescription>
                        Register a new faculty member to the Virtual Lab.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeId" className="text-right">
                                Emp ID
                            </Label>
                            <Input
                                id="employeeId"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">
                                Subject
                            </Label>
                            <Select value={subject} onValueChange={setSubject}>
                                <SelectTrigger className="w-[180px] col-span-3">
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                                    <SelectItem value="OOPs">OOPs</SelectItem>
                                    <SelectItem value="Digital Logic Design">DLD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Adding..." : "Add Teacher"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
