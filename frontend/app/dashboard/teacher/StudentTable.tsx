"use client";

import { useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, Eye } from "lucide-react";
import { StudentMetric, PerformanceLevel } from '@/data/mock-teacher-data';

interface StudentTableProps {
    data: StudentMetric[];
    onViewStudent: (student: StudentMetric) => void;
}

const STATUS_PY = {
    Weak: "bg-red-100 text-red-800 hover:bg-red-200",
    Average: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Good: "bg-green-100 text-green-800 hover:bg-green-200",
    Excellent: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
};

export function StudentTable({ data, onViewStudent }: StudentTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof StudentMetric; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: keyof StudentMetric) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Roll No</TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('name')}>
                                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-center">
                                <Button variant="ghost" onClick={() => handleSort('practicalsCompleted')}>
                                    Completion <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-center">
                                <Button variant="ghost" onClick={() => handleSort('quizScoreAvg')}>
                                    Avg Score <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-center">
                                <Button variant="ghost" onClick={() => handleSort('avgAttempts')}>
                                    Avg Attempts <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.length > 0 ? (
                            sortedData.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-mono">{student.rollNo}</TableCell>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={student.practicalsCompleted / student.practicalsAssigned < 0.4 ? "text-red-600 font-bold" : ""}>
                                                {Math.round((student.practicalsCompleted / student.practicalsAssigned) * 100)}%
                                            </span>
                                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${student.status === 'Weak' ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${(student.practicalsCompleted / student.practicalsAssigned) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-bold text-gray-700">{student.quizScoreAvg}%</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{student.avgAttempts.toFixed(1)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className={STATUS_PY[student.status]}>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => onViewStudent(student)}>
                                            <Eye className="h-4 w-4 mr-1" /> View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No students found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground text-center">
                Showing {sortedData.length} students
            </div>
        </div>
    );
}
