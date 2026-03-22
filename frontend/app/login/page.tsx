"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, GraduationCap, School, ShieldCheck, User, Lock, Mail } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type UserRole = "student" | "teacher" | "admin";

export default function LoginPage() {
    const [role, setRole] = useState<UserRole>("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setError("");
        setSuccess(false);
    }, [role, email, password]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Role specific endpoint handling
            const endpoint = role === 'student' ? '/api/auth/login' : '/api/auth/login'; // Adjust if teacher/admin have different routes

            const response = await axios.post(`${API_URL}${endpoint}`, {
                email,
                password
            });

            const { token, user } = response.data;

            // Store token and user info
            if (typeof window !== 'undefined') {
                localStorage.setItem("vlab_token", token);
                localStorage.setItem("vlab_user", JSON.stringify(user));
                localStorage.setItem("studentName", user.fullName);
                localStorage.setItem("studentRoll", user.rollNo || "");
            }

            setSuccess(true);
            setTimeout(() => {
                if (role === 'teacher') router.push("/dashboard/teacher");
                else if (role === 'admin') router.push("/dashboard/admin");
                else router.push("/dashboard");
            }, 1500);

        } catch (err: any) {
            const message = err.response?.data?.message || "Login failed";
            setError(message);

            // Handle unverified user redirect
            if (message === "Your account is not verified" && role === 'student') {
                localStorage.setItem("verifyEmail", email);
                router.push("/verify");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTestLogin = async () => {
        try {
            setError("");
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'test.student@mmmut.ac.in',
                        password: 'test123'
                    })
                }
            );
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('vlab_token', data.token);
                localStorage.setItem('vlab_user', JSON.stringify(data.user));
                localStorage.setItem('studentName', data.user?.fullName || '');
                localStorage.setItem('studentRoll', data.user?.rollNo || '');
                setSuccess(true);
                setTimeout(() => router.push('/dashboard'), 1000);
            } else {
                setError(data.message || 'Test login failed — check backend credentials');
            }
        } catch (err: any) {
            setError('Test login error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherLogin = async () => {
        try {
            setError("");
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'teacher@mmmut.ac.in',
                        password: 'teacher123'
                    })
                }
            );
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('vlab_token', data.token);
                localStorage.setItem('vlab_user', JSON.stringify(data.user));
                setSuccess(true);
                setTimeout(() => router.push('/dashboard/teacher'), 1000);
            } else {
                setError(data.message || 'Teacher login failed — check backend credentials');
            }
        } catch (err: any) {
            setError('Teacher login error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = async () => {
        try {
            setError("");
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'admin@mmmut.ac.in',
                        password: 'admin123' // Placeholder credentials
                    })
                }
            );
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('vlab_token', data.token);
                localStorage.setItem('vlab_user', JSON.stringify(data.user));
                setSuccess(true);
                setTimeout(() => router.push('/dashboard/admin'), 1000);
            } else {
                setError(data.message || 'Admin login failed — check backend credentials');
            }
        } catch (err: any) {
            setError('Admin login error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRoleStyles = (r: UserRole) => {
        if (role === r) {
            return "bg-white text-slate-900 shadow-sm ring-1 ring-black/5";
        }
        return "text-white/60 hover:bg-white/10 hover:text-white";
    };

    return (
        <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] p-4">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
                <div className={`p-10 text-center relative overflow-hidden transition-all duration-500 
                    ${role === 'student' ? 'bg-[#d32f2f]' : role === 'teacher' ? 'bg-orange-600' : 'bg-slate-800'}`}>

                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-24 h-24 border-8 border-white rounded-full -translate-x-12 -translate-y-12"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 border-8 border-white rounded-full translate-x-12 translate-y-12"></div>
                    </div>

                    <h1 className="text-white text-4xl font-black tracking-tight relative z-10">Prayukti vLAB</h1>
                    <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mt-2 relative z-10">
                        {role === 'student' ? 'Student Portal' : role === 'teacher' ? 'Faculty Portal' : 'Administrator Control'}
                    </p>

                    {/* Role Switcher Inside Header */}
                    <div className="mt-8 p-1 bg-black/20 backdrop-blur-md rounded-xl flex relative z-10">
                        <button onClick={() => setRole('student')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${getRoleStyles('student')}`}>
                            <GraduationCap size={14} /> Student
                        </button>
                        <button onClick={() => setRole('teacher')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${getRoleStyles('teacher')}`}>
                            <School size={14} /> Teacher
                        </button>
                        <button onClick={() => setRole('admin')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${getRoleStyles('admin')}`}>
                            <ShieldCheck size={14} /> Admin
                        </button>
                    </div>
                </div>

                <div className="p-10">
                    {!success ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">University Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@mmmut.ac.in"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-slate-700 font-semibold pl-12"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end pr-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                    <button type="button" className="text-[10px] font-black text-orange-600 uppercase tracking-tighter hover:underline">Forgot password?</button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-slate-700 font-semibold pl-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black rounded-xl animate-shake">
                                    🚨 {error.toUpperCase()}
                                </div>
                            )}

                            <Button
                                suppressHydrationWarning
                                type="submit"
                                disabled={loading}
                                className={`w-full py-8 text-lg font-black tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98]
                                    ${role === 'student' ? 'bg-[#f57f17] hover:bg-[#e65100] shadow-orange-100' :
                                        role === 'teacher' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' :
                                            'bg-slate-700 hover:bg-slate-800 shadow-slate-200'}`}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "AUTHENTICATE"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={async (e) => {
                                    e.preventDefault();

                                    const testEmail = role === 'student' ? "test.student@mmmut.ac.in" :
                                        role === 'teacher' ? "test.faculty@mmmut.ac.in" :
                                            "test.admin@mmmut.ac.in";

                                    setEmail(testEmail);
                                    setPassword("password123");

                                    setError("");
                                    setLoading(true);

                                    try {
                                        const response = await axios.post(`${API_URL}/api/auth/login`, {
                                            email: testEmail,
                                            password: "password123"
                                        });

                                        const { token, user } = response.data;

                                        // Store token and user info
                                        if (typeof window !== 'undefined') {
                                            localStorage.setItem("token", token);
                                            localStorage.setItem("user", JSON.stringify(user));
                                        }

                                        setSuccess(true);
                                        setTimeout(() => {
                                            if (role === 'teacher') router.push("/dashboard/teacher");
                                            else if (role === 'admin') router.push("/dashboard/admin");
                                            else router.push("/dashboard");
                                        }, 1000);

                                    } catch (err: any) {
                                        const message = err.response?.data?.message || "Test Login failed";
                                        setError(message);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="w-full py-6 text-sm font-bold tracking-wider rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-500 mt-4"
                            >
                                TEST SIGN IN ({role.toUpperCase()})
                            </Button>
                            {role === 'student' && (
                                <button
                                    suppressHydrationWarning
                                    type="button"
                                    onClick={handleTestLogin}
                                    disabled={loading}
                                    className="w-full py-3 text-xs font-bold tracking-wider rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all mt-1"
                                >
                                    ⚡ QUICK STUDENT LOGIN (dev only)
                                </button>
                            )}

                            {role === 'teacher' && (
                                <button
                                    type="button"
                                    onClick={handleTeacherLogin}
                                    disabled={loading}
                                    className="w-full py-3 text-xs font-bold tracking-wider rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all mt-2"
                                >
                                    🎓 QUICK TEACHER LOGIN (dev only)
                                </button>
                            )}

                            {role === 'admin' && (
                                <button
                                    type="button"
                                    onClick={handleAdminLogin}
                                    disabled={loading}
                                    className="w-full py-3 text-xs font-bold tracking-wider rounded-2xl border-2 border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all mt-2"
                                >
                                    🛡️ QUICK ADMIN LOGIN (dev only)
                                </button>
                            )}

                            {role === 'student' && (
                                <div className="text-center pt-4">
                                    <p className="text-xs font-bold text-slate-400">
                                        DON'T HAVE AN ACCOUNT? <Link href="/register" className="text-orange-600 hover:underline">REGISTER HERE</Link>
                                    </p>
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="text-center py-10 space-y-6">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto transition-transform scale-110">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Granted</h3>
                            <p className="text-slate-500 font-medium">
                                Secure session initialized. <br />
                                Redirecting to your dashboard...
                            </p>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 animate-progress"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        &copy; 2025 Madan Mohan Malaviya University of Technology
                    </p>
                </div>
            </div>
        </div>
    );
}
