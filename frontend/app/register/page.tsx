import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Create Account</h1>
                    <p className="text-slate-600 mb-8">
                        Registration is currently valid only for <strong>@mmmut.ac.in</strong> domains. Please contact the administrator for access.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link href="/login">
                            <Button className="w-full">Go to Login</Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" className="w-full">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
