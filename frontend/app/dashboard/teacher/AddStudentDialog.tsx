"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { StudentMetric } from "@/data/mock-teacher-data";

interface AddStudentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddStudent: (student: StudentMetric) => void;
}

export function AddStudentDialog({ open, onOpenChange, onAddStudent }: AddStudentDialogProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [subject, setSubject] = useState("Computer Networks");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            const newStudent = {
                id: `stu-${Date.now()}`,
                name,
                email,
                rollNo,
                subject,
                practicalsAssigned: 10,
                practicalsCompleted: 0,
                quizScoreAvg: 0,
                avgAttempts: 0,
                totalTimeSpent: 0,
                lastActive: new Date().toISOString(),
                status: 'Average' as const, // Default status
                quizTrend: [],
                completedPracticals: [],
                weakAreas: []
            };

            onAddStudent(newStudent);
            setLoading(false);
            onOpenChange(false);

            // Reset form
            setName("");
            setEmail("");
            setRollNo("");
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Enter student details to register them in the system.
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
                            <Label htmlFor="roll" className="text-right">
                                Roll No
                            </Label>
                            <Input
                                id="roll"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
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
                            {loading ? "Adding..." : "Add Student"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
