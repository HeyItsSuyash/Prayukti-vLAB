"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, GraduationCap, School, ShieldCheck } from "lucide-react";

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type UserRole = "student" | "teacher" | "admin";

export default function LoginPage() {
    const [role, setRole] = useState<UserRole>("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const router = useRouter();

    // Reset form when switching roles
    useEffect(() => {
        setEmail("");
        setPassword("");
        setError("");
        setSent(false);
    }, [role]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simple domain check simulation
        const domain = "@mmmut.ac.in";
        if (!email.endsWith(domain)) {
            setError(`Access Restricted: Only ${domain} emails are allowed.`);
            setLoading(false);
            return;
        }

        try {
            // Simulate verification logic for prototype
            // In a real app, this would verify the password or send an OTP

            // Redirect logic based on role
            // We'll set a timeout to simulate network request then 'send' magic link or just redirect
            setTimeout(() => {
                setSent(true);
                setLoading(false);
            }, 1000);

        } catch (err: unknown) {
            setError((err as Error).message || "An error occurred");
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("token", "mock-jwt-token");
            localStorage.setItem("user", JSON.stringify({ email, role }));
        }

        if (role === 'teacher') {
            router.push("/dashboard/teacher");
        } else if (role === 'admin') {
            // Assuming admin dashboard might be /dashboard/admin or similar, pointing to main dashboard for now or teacher if not ready
            router.push("/dashboard/admin");
        } else {
            router.push("/dashboard");
        }
    }

    const getRoleStyles = (r: UserRole) => {
        if (role === r) {
            return "bg-white text-primary shadow-sm ring-1 ring-black/5";
        }
        return "text-muted-foreground hover:bg-white/50 hover:text-foreground";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className={`p-8 text-center relative overflow-hidden transition-colors duration-500 
                    ${role === 'student' ? 'bg-[#d32f2f]' : role === 'teacher' ? 'bg-orange-600' : 'bg-slate-800'}`}>

                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-white rounded-full -translate-x-10 -translate-y-10"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 border-4 border-white rounded-full translate-x-10 translate-y-10"></div>
                    </div>

                    <h1 className="text-white text-3xl font-black tracking-tight relative z-10">Prayukti vLAB</h1>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">
                        {role === 'student' ? 'Student Access' : role === 'teacher' ? 'Faculty Portal' : 'Admin Console'}
                    </p>
                </div>

                {/* Role Switcher */}
                <div className="p-2 m-4 bg-gray-100/50 rounded-xl flex p-1">
                    <button onClick={() => setRole('student')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${getRoleStyles('student')}`}>
                        <GraduationCap className="w-4 h-4" /> Student
                    </button>
                    <button onClick={() => setRole('teacher')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${getRoleStyles('teacher')}`}>
                        <School className="w-4 h-4" /> Teacher
                    </button>
                    <button onClick={() => setRole('admin')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${getRoleStyles('admin')}`}>
                        <ShieldCheck className="w-4 h-4" /> Admin
                    </button>
                </div>

                <div className="px-8 pb-8 pt-2">
                    {!sent ? (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    {role === 'admin' ? 'Admin ID / Email' : 'University Email'}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder={role === 'admin' ? "admin@mmmut.ac.in" : "yourname@mmmut.ac.in"}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#d32f2f] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-medium"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#d32f2f] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold rounded-xl animate-in fade-in slide-in-from-top-1">
                                    ⚠️ {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-white font-black py-7 rounded-2xl shadow-lg transition-all active:scale-[0.98]
                                    ${role === 'student' ? 'bg-[#f57f17] hover:bg-[#e65100] shadow-orange-200' :
                                        role === 'teacher' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' :
                                            'bg-slate-700 hover:bg-slate-800 shadow-slate-200'}`}
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "SECURE LOGIN"}
                            </Button>

                            {/* Test Credentials Box */}
                            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Auto-Fill Prototype Creds</p>
                                </div>
                                <div className="space-y-1">
                                    {role === 'student' && (
                                        <div className="text-[10px] font-mono cursor-pointer hover:text-blue-600 truncate"
                                            onClick={() => { setEmail("student@mmmut.ac.in"); setPassword("student123") }}>
                                            👉 student@mmmut.ac.in / student123
                                        </div>
                                    )}
                                    {role === 'teacher' && (
                                        <div className="text-[10px] font-mono cursor-pointer hover:text-blue-600 truncate"
                                            onClick={() => { setEmail("teacher@mmmut.ac.in"); setPassword("teacher123") }}>
                                            👉 teacher@mmmut.ac.in / teacher123
                                        </div>
                                    )}
                                    {role === 'admin' && (
                                        <div className="text-[10px] font-mono cursor-pointer hover:text-blue-600 truncate"
                                            onClick={() => { setEmail("admin@mmmut.ac.in"); setPassword("admin123") }}>
                                            👉 admin@mmmut.ac.in / admin123
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                                ✓
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                            <p className="text-sm text-gray-600">
                                Authentication successful. Redirecting you to the secure dashboard.
                            </p>
                            <Button
                                onClick={handleContinue}
                                className={`w-full text-white ${role === 'admin' ? 'bg-slate-800 hover:bg-slate-900' : 'bg-green-600 hover:bg-green-700'}`}

                            >
                                Continue to Dashboard
                            </Button>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                    &copy; 2025 MMMUT Gorakhpur
                </div>
            </div>
        </div>
    );
}
