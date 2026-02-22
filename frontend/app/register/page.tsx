"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, User, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

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
                password
            });

            // Success - store email for verification flow
            localStorage.setItem("vlab_verifyEmail", email);
            router.push("/verify");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
