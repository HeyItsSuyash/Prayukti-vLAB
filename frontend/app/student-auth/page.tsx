"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function StudentAuthSelection() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-orange-100">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4 bg-[linear-gradient(to_right,#f8f8f8_1px,transparent_1px),linear-gradient(to_bottom,#f8f8f8_1px,transparent_1px)] bg-[size:4rem_4rem]">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">

                    {/* Decorative element */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -z-10"></div>

                    {/* New Student Registration */}
                    <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col items-center text-center transition-all hover:border-[#d32f2f] group">
                        <div className="w-20 h-20 bg-red-50 text-[#d32f2f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UserPlus size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">NEW STUDENT</h2>
                        <p className="text-slate-500 mb-8 font-medium">
                            First time here? Register with your university email to access the virtual labs and track your progress.
                        </p>
                        <Link href="/register" className="w-full mt-auto">
                            <Button className="w-full h-14 text-lg font-bold bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded-xl shadow-lg shadow-red-100">
                                REGISTRATION
                            </Button>
                        </Link>
                    </div>

                    {/* Already Registered Login */}
                    <div className="bg-slate-900 p-10 rounded-3xl shadow-xl border-2 border-slate-800 flex flex-col items-center text-center transition-all hover:border-white group">
                        <div className="w-20 h-20 bg-slate-800 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <LogIn size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">EXISTING STUDENT</h2>
                        <p className="text-slate-400 mb-8 font-medium">
                            Already have an account? Sign in to continue your experiments and view your certificates.
                        </p>
                        <Link href="/login" className="w-full mt-auto">
                            <Button className="w-full h-14 text-lg font-bold bg-white text-slate-900 hover:bg-slate-100 rounded-xl shadow-lg">
                                STUDENT LOGIN
                            </Button>
                        </Link>
                    </div>

                </div>
            </main>

            {/* Footer info */}
            <div className="bg-white py-8 border-t border-slate-100">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        <span>MMMUT UNIVERSITY ACCESS ONLY</span>
                    </div>
                    <span className="hidden md:block">•</span>
                    <span>SECURE AUTHENTICATION SYSTEM</span>
                </div>
            </div>
            <Footer />
        </div>
    );
}
