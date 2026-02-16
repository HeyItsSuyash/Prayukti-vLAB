"use client";

import { useState } from 'react';
import { StudentMetric } from '@/data/mock-teacher-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Mail, Download, BrainCircuit, Clock, Send, AlertTriangle, Bell, Loader2, TrendingUp } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface StudentDetailViewProps {
    student: StudentMetric;
}

export function StudentDetailView({ student }: StudentDetailViewProps) {
    const daysInactive = differenceInDays(new Date(), parseISO(student.lastActive));
    const isInactive = daysInactive > 7;

    const quizTrendData = student.quizTrend.map((score, i) => ({
        name: `Quiz ${i + 1}`,
        score: score
    }));

    const [emailLoading, setEmailLoading] = useState<string | null>(null);

    const handleSendEmail = async (type: 'inactive' | 'performance' | 'manual') => {
        const typeLabels = {
            inactive: "Inactive Alert",
            performance: "Performance Alert",
            manual: "Manual Reminder"
        };

        if (!confirm(`Send ${typeLabels[type]} to ${student.email}?`)) return;
        setEmailLoading(type);

        const emailTemplates = {
            inactive: {
                subject: '⚠ Virtual Lab Inactivity Alert',
                body: `<p>Dear <strong>${student.name}</strong>,</p>
                       <p>You have been inactive in the Virtual Lab platform for over <strong>${daysInactive} days</strong>.</p>
                       <p>Please log in and complete your pending practical work.</p>`
            },
            performance: {
                subject: '📉 Virtual Lab Performance Alert',
                body: `<p>Dear <strong>${student.name}</strong>,</p>
                       <p>Your current average score is <strong>${student.quizScoreAvg}%</strong>, which is below the recommended threshold.</p>
                       <p>Please review the course materials and retake the quizzes.</p>`
            },
            manual: {
                subject: '🔔 Virtual Lab Reminder',
                body: `<p>Dear <strong>${student.name}</strong>,</p>
                       <p>This is a reminder to continue your progress in the Virtual Lab.</p>
                       <p>Current Progress: <strong>${Math.round((student.practicalsCompleted / student.practicalsAssigned) * 100)}%</strong></p>`
            }
        };

        const template = emailTemplates[type];

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: student.email,
                    subject: template.subject,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333;">
                            <h2 style="color: #d32f2f;">Prayukti vLab</h2>
                            ${template.body}
                            <br/>
                            <a href="http://localhost:3000" style="background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a>
                            <br/><br/>
                            <p>Regards,<br/>Virtual Lab Team</p>
                        </div>
                    `
                })
            });

            const result = await response.json();
            if (result.success) {
                alert(`✅ Email sent successfully to ${student.email}`);
            } else {
                alert(`❌ Failed to send email: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Failed to send email", error);
            alert("❌ Network error. Check console.");
        } finally {
            setEmailLoading(null);
        }
    };

    const handleExport = () => {
        // CSV Export Logic
        const headers = ["ID", "Name", "Roll No", "Subject", "Score", "Status"];
        const row = [student.id, student.name, student.rollNo, student.subject, student.quizScoreAvg, student.status];

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n" + row.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${student.name}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Top Profile Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{student.name}</h2>
                        <Badge variant="outline">{student.rollNo}</Badge>
                    </div>
                    <p className="text-muted-foreground">{student.email}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Email Actions Toolbar */}
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm font-semibold text-muted-foreground self-center mr-2">Email Actions:</span>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSendEmail('inactive')}
                    disabled={!!emailLoading}
                >
                    {emailLoading === 'inactive' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                    Send Inactive Alert
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleSendEmail('performance')}
                    disabled={!!emailLoading}
                >
                    {emailLoading === 'performance' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                    Send Performance Alert
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSendEmail('manual')}
                    disabled={!!emailLoading}
                >
                    {emailLoading === 'manual' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bell className="mr-2 h-4 w-4" />}
                    Send Manual Reminder
                </Button>
            </div>

            {/* Alerts Section */}
            {isInactive && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
                    <Clock className="text-red-600 h-5 w-5 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-red-800">Inactive Alert</h4>
                        <p className="text-sm text-red-700">Has not accessed the lab for {daysInactive} days. Immediate follow-up recommended.</p>
                    </div>
                </div>
            )}

            {/* Smart Recommendations */}
            {student.weakAreas.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="text-indigo-600 h-5 w-5" />
                        <h4 className="font-bold text-indigo-800">Smart Recommendations</h4>
                    </div>
                    <p className="text-sm text-indigo-700 mb-2">Based on quiz performance, this student struggles with:</p>
                    <div className="flex flex-wrap gap-2">
                        {student.weakAreas.map(area => (
                            <Badge key={area} className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200">
                                {area}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Practical Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">
                            {student.practicalsCompleted} / {student.practicalsAssigned}
                        </div>
                        <Progress value={(student.practicalsCompleted / student.practicalsAssigned) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                            {Math.round((student.practicalsCompleted / student.practicalsAssigned) * 100)}% Completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Attempts / Practical</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-2">
                            {student.avgAttempts.toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {student.avgAttempts > 3 ? "High number of retries indicates potential struggle." : "Consistent performance."}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quiz Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Quiz Performance Trend</CardTitle>
                    <CardDescription>Scores from last 5 attempts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={quizTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{ fill: '#2563eb', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
