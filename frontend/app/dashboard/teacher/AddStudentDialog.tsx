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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Call API
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const res = await fetch(`${baseUrl}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: name,
                    email,
                    password: "password123", // Default password for new users
                    role: "student",
                    rollNo,
                    subject
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to add student");
            }

            const savedStudent = await res.json();

            // Format to match frontend
            const newStudent = {
                id: savedStudent._id,
                name: savedStudent.fullName,
                email: savedStudent.email,
                rollNo,
                subject,
                practicalsAssigned: 10,
                practicalsCompleted: 0,
                quizScoreAvg: 0,
                avgAttempts: 0,
                totalTimeSpent: 0,
                lastActive: savedStudent.createdAt || new Date().toISOString(),
                status: 'Average' as const,
                quizTrend: [],
                completedPracticals: [],
                weakAreas: []
            };

            onAddStudent(newStudent);
            onOpenChange(false);
            setName("");
            setEmail("");
            setRollNo("");
        } catch (err: any) {
            console.error(err);
            alert(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
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
