"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Labs", href: "/labs" },
        { name: "Experiments", href: "/experiments" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground transform group-hover:rotate-12 transition-transform duration-300">
                        <Command className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground leading-none tracking-tight">Prayukti VLab</span>
                        <span className="text-[10px] font-medium text-muted-foreground leading-none tracking-widest uppercase">Academic Platform</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group py-2"
                        >
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-primary">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button size="sm" className="font-semibold shadow-md shadow-primary/20">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-background p-4 absolute top-16 left-0 w-full shadow-lg animate-in slide-in-from-top-5">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-muted transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-border/50 my-2" />
                        <div className="flex flex-col gap-3">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;
