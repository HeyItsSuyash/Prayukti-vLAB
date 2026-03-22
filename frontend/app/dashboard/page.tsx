"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/auth/roles";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "./teacher/page";
import AdminDashboard from "./admin/page";

export default function DashboardPage() {
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('vlab_user');
        if (!storedUser) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            // Support both "ADMIN" and "admin" by upper-casing
            const userRole = user.role?.toUpperCase() || "STUDENT";
            setRole(userRole as Role);
        } catch (e) {
            console.error("Failed to parse user", e);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Role-based rendering
    const normalizedRole = role?.toUpperCase();
    
    switch (normalizedRole) {
        case "ADMIN":
            return <AdminDashboard />;
        case "TEACHER":
            return <TeacherDashboard />;
        case "STUDENT":
            return <StudentDashboard />;
        default:
            console.warn("Unknown or null role, defaulting to Student View:", role);
            return <StudentDashboard />;
    }
}
