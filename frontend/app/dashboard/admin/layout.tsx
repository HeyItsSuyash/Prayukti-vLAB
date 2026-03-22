"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    BookOpen, 
    FlaskConical, 
    FolderKanban, 
    History, 
    Settings, 
    LogOut,
    ChevronRight,
    PieChart,
    Menu,
    X,
    Shield
} from 'lucide-react';

const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Faculty', icon: ShieldCheck },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'logs', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentView = searchParams.get('view') || 'overview';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-slate-900 transition-all duration-500 flex flex-col p-6 gap-8 relative overflow-hidden z-50`}>
                <div className="absolute top-0 right-0 p-24 bg-indigo-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header/Logo */}
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-900/40">
                            <Shield className="text-white fill-current" size={24} />
                        </div>
                        {isSidebarOpen && (
                            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                                <h2 className="font-black tracking-tighter text-2xl text-white leading-none">Prayukti</h2>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Admin Console</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
                        {navItems.map((item) => (
                            <Link 
                                key={item.id} 
                                href={`/dashboard/admin?view=${item.id}`}
                                className={`flex items-center group p-4 rounded-2xl transition-all relative ${
                                    currentView === item.id 
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/50 scale-[1.02]' 
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                } ${!isSidebarOpen && 'justify-center px-0'}`}
                            >
                                <div className={`flex items-center gap-4 ${!isSidebarOpen && 'mx-auto'}`}>
                                    <item.icon size={22} className={currentView === item.id ? 'text-white' : 'group-hover:text-indigo-400 transition-colors'} />
                                    {isSidebarOpen && (
                                        <span className="font-black text-[11px] uppercase tracking-widest animate-in fade-in slide-in-from-left-2 duration-300">
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                                {isSidebarOpen && currentView === item.id && (
                                    <ChevronRight size={14} className="text-white/40 absolute right-4" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-8 border-t border-white/5 space-y-2">
                        <button 
                            onClick={handleLogout}
                            className={`flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-950/20 w-full transition-all group ${!isSidebarOpen && 'justify-center px-0'}`}
                        >
                            <LogOut size={22} />
                            {isSidebarOpen && <span className="font-black text-[11px] uppercase tracking-widest">Terminate Session</span>}
                        </button>
                        
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`flex items-center justify-center w-full p-3 text-slate-500 hover:text-white transition-all bg-white/5 rounded-2xl ${!isSidebarOpen && 'p-4'}`}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden flex flex-col relative bg-slate-50/50">
                <div className="absolute top-0 right-0 p-40 bg-indigo-50/50 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                {children}
            </main>
        </div>
    );
}
