"use client";

import { useSearchParams, useParams } from "next/navigation";
import { CheckCircle, XCircle, Award, Calendar, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyCertificatePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const certificateId = params.id as string;

    // In a real app, we would fetch these from a database using the ID.
    // For this prototype, we're extracting them from searching parameters.
    const studentName = searchParams.get("name") || "N/A";
    const subject = searchParams.get("subject") || "N/A";
    const issueDate = searchParams.get("date");

    const formattedDate = issueDate
        ? new Date(issueDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "N/A";

    const isValid = certificateId.startsWith("PVL-") && studentName !== "N/A";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                {/* Header */}
                <div className={`p-8 text-center ${isValid ? 'bg-blue-600' : 'bg-red-600'} text-white`}>
                    <div className="flex justify-center mb-4">
                        {isValid ? (
                            <CheckCircle className="w-16 h-16" />
                        ) : (
                            <XCircle className="w-16 h-16" />
                        )}
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">
                        {isValid ? "Authentic Certificate" : "Verification Failed"}
                    </h1>
                    <p className="mt-2 opacity-90 font-medium">
                        {isValid ? "This certificate is officially issued by Prayukti Virtual Lab." : "The certificate provided could not be verified."}
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <User className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Student Name</p>
                                <p className="text-lg font-bold text-slate-800">{studentName}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Course/Subject</p>
                                <p className="text-lg font-bold text-slate-800">{subject}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Issue Date</p>
                                <p className="text-lg font-bold text-slate-800">{formattedDate}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <Award className="w-6 h-6 text-blue-600 mt-1" />
                            <div>
                                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Certificate ID</p>
                                <p className="text-sm font-mono font-bold text-blue-600">{certificateId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/">
                            <Button variant="outline" className="w-full sm:w-auto h-12 uppercase font-bold tracking-wider px-8 border-2">
                                Visit Portal
                            </Button>
                        </Link>
                        <Button
                            className="w-full sm:w-auto h-12 uppercase font-bold tracking-wider px-8 bg-blue-600 hover:bg-blue-700"
                            onClick={() => window.print()}
                        >
                            Print Details
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Prayukti Virtual Lab &copy; 2025 - Secure Verification System
                    </p>
                </div>
            </div>
        </div>
    );
}
