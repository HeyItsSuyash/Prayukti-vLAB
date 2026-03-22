"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";

export function RiskBadge() {
    const [riskStatus, setRiskStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                // Get user from localStorage (standard pattern in this app)
                const userJson = localStorage.getItem('vlab_user');
                if (!userJson) {
                    setLoading(false);
                    return;
                }
                const user = JSON.parse(userJson);
                const userId = user.id || user._id;

                const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/attendance/student/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('vlab_token')}` }
                });

                if (response.data?.risk_summary?.risk_status) {
                    setRiskStatus(response.data.risk_summary.risk_status);
                }
            } catch (err) {
                // Silently fail as requested
                console.error("Risk badge fetch failed");
            } finally {
                setLoading(false);
            }
        };

        fetchRisk();
    }, []);

    if (loading) {
        return <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />;
    }

    if (!riskStatus) return null;

    const getBadgeStyle = (status: string) => {
        switch (status) {
            case 'At Risk':
                return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
            case 'Needs Attention':
                return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
            case 'Good Standing':
                return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
            default:
                return "bg-slate-100 text-slate-800 border-slate-200";
        }
    };

    return (
        <Badge variant="outline" className={`font-black uppercase tracking-widest text-[10px] py-1 px-3 rounded-full ${getBadgeStyle(riskStatus)}`}>
            {riskStatus}
        </Badge>
    );
}

export default RiskBadge;
