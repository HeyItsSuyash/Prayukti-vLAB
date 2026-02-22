"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function VerifyPage() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem("vlab_verifyEmail");
        if (!storedEmail) {
            router.push("/register");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/auth/verify-otp`, {
                email,
                otp
            });
            setSuccess("Account verified successfully! Redirecting to login...");
            localStorage.removeItem("vlab_verifyEmail");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Verification failed. Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");
        setSuccess("");
        try {
            await axios.post(`${API_URL}/api/auth/resend-otp`, { email });
            setSuccess("A new OTP has been sent to your email.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-6">
                        <ShieldCheck size={32} />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Verify OTP</h1>
                    <p className="text-slate-500 font-medium mb-8">
                        We've sent a 6-digit code to <br />
                        <span className="text-slate-900 font-bold">{email}</span>
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-xl">
                            ✅ {success}
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-6">
                        <Input
                            type="text"
                            maxLength={6}
                            placeholder="· · · · · ·"
                            className="h-20 text-center text-4xl font-black tracking-[1em] rounded-2xl bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white transition-all"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            required
                        />

                        <Button
                            className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl transition-all active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "VERIFY ACCOUNT"}
                        </Button>
                    </form>

                    <div className="mt-8">
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-slate-500 text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:text-orange-600 transition-colors"
                        >
                            {resending ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw size={16} />}
                            RESEND OTP
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
