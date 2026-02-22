"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("vlab_token");
        const userData = localStorage.getItem("vlab_user");

        console.log("AuthGuard Diagnostics:", {
            hasToken: !!token,
            hasUserData: !!userData,
            path: window.location.pathname
        });

        if (!token || !userData) {
            console.log("AuthGuard: No session found, redirecting to /login");
            setIsAuthenticated(false);
            const currentPath = window.location.pathname;
            router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        try {
            const user = JSON.parse(userData);
            console.log("AuthGuard: Session user:", { email: user.email, isVerified: user.isVerified });

            if (user.isVerified === false) {
                console.log("AuthGuard: User not verified, redirecting to /verify");
                setIsAuthenticated(false);
                localStorage.setItem("vlab_verifyEmail", user.email);
                router.replace("/verify");
                return;
            }
            setIsAuthenticated(true);
        } catch (error) {
            console.error("AuthGuard Logic Error:", error);
            setIsAuthenticated(false);
            router.replace("/login");
        }
    }, [router]);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Verifying Session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
