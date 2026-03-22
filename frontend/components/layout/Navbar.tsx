"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Command, ChevronRight, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }

        // Check if user is logged in
        setIsLoggedIn(!!localStorage.getItem('vlab_token'));

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('vlab_token');
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/logout`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('[LOGOUT] attendance recorded');
        } catch (err) {
            console.error('[LOGOUT] attendance API failed:', err);
        } finally {
            localStorage.removeItem('vlab_token');
            localStorage.removeItem('vlab_user');
            router.push('/login');
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Features", href: "/features" },
        { name: "Labs", href: "/labs" },
        { name: "Explore", href: "/explore" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-500",
                scrolled
                    ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 py-3 shadow-sm"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-[10deg] group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-500/20">
                        <Command className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">Prayukti <span className="text-blue-600 dark:text-blue-400">VLab</span></span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-none tracking-[0.2em] uppercase mt-1">Virtual Laboratory</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/30 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-[13px] font-bold uppercase tracking-wider transition-all duration-300 px-4 py-2 relative group rounded-full",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-sm"
                                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800"
                                )}
                            >
                                {link.name}
                                <span className={cn(
                                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300",
                                    isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                                )} />
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop CTA & Controls */}
                <div className="hidden md:flex items-center gap-6">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {isLoggedIn && pathname !== "/" ? (
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold uppercase tracking-widest text-[11px] h-10 px-5 rounded-full"
                        >
                            <LogOut size={15} />
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 group relative">
                                Log In
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                            <Link href="/student-auth">
                                <Button className="h-10 px-6 rounded-full font-bold uppercase tracking-widest text-[11px] btn-gradient btn-interaction">
                                    Register
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 lg:hidden">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button
                        className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className={cn("w-6 h-0.5 bg-black dark:bg-white transition-all", isMobileMenuOpen && "rotate-45 translate-y-2")} />
                        <div className={cn("w-6 h-0.5 bg-black dark:bg-white transition-all", isMobileMenuOpen && "opacity-0")} />
                        <div className={cn("w-6 h-0.5 bg-black dark:bg-white transition-all", isMobileMenuOpen && "-rotate-45 -translate-y-2")} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 absolute top-full left-0 w-full shadow-2xl animate-in slide-in-from-top-10 duration-500">
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-2xl font-black text-slate-300 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 hover:pl-4 transition-all duration-300 py-4 flex items-center justify-between group"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                                <ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                            </Link>
                        ))}
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />
                        {isLoggedIn && pathname !== "/" ? (
                            <Button
                                variant="outline"
                                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                                className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} />
                                Logout
                            </Button>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest dark:border-slate-700">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/student-auth" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest btn-gradient btn-interaction">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;
