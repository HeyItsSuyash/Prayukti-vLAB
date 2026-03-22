"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, User, Lock, ArrowRight, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [enrollmentNo, setEnrollmentNo] = useState("");
    const [branch, setBranch] = useState("");
    const [year, setYear] = useState(1);
    const [semester, setSemester] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const cleanEmail = email.toLowerCase().trim();
        if (!cleanEmail.endsWith("@mmmut.ac.in")) {
            setError("Only @mmmut.ac.in emails are allowed.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/register`, {
                fullName,
                email,
                password,
                rollNo,
                enrollmentNo,
                branch,
                year,
                semester,
                role: 'student'
            });

            // Success - store email for verification flow
            localStorage.setItem("verifyEmail", email);
            router.push("/verify");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl mb-4">
                            <User size={32} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 mt-2 font-medium">Join the Prayukti vLAB ecosystem</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl animate-in fade-in slide-in-from-top-1">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                            <div className="relative">
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    className="h-14 pl-12 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">University Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="yourname@mmmut.ac.in"
                                    className="h-14 pl-12 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold pl-1 uppercase">Must end with @mmmut.ac.in</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-14 pl-12 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">University Roll No</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="240101001"
                                        value={rollNo}
                                        onChange={e => setRollNo(e.target.value)}
                                        required
                                        className="h-14 pl-10 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium"
                                    />
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Enrollment No</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="2024CSE001"
                                        value={enrollmentNo}
                                        onChange={e => setEnrollmentNo(e.target.value)}
                                        required
                                        className="h-14 pl-10 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium"
                                    />
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Branch</Label>
                            <Select onValueChange={v => setBranch(v)}>
                                <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium">
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
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Year</Label>
                                <Select onValueChange={v => setYear(parseInt(v))}>
                                    <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1,2,3,4].map(y => <SelectItem key={y} value={y.toString()}>{y}st Year</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Semester</Label>
                                <Select onValueChange={v => setSemester(parseInt(v))}>
                                    <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent focus:border-orange-500 focus:bg-white transition-all font-medium">
                                        <SelectValue placeholder="Sem" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl transition-all active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center gap-2">REGISTER NOW <ArrowRight size={20} /></span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-orange-600 font-bold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
