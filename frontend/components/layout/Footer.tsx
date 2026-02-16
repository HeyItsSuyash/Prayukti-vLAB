"use client";

import Link from "next/link";
import { Command, Twitter, Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-100 py-16 border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                                <Command className="w-4 h-4" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Prayukti VLab
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            A next-generation virtual laboratory platform designed to bridge the gap between theoretical knowledge and practical application.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {[Twitter, Facebook, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-3">
                            {["Home", "Virtual Labs", "Experiments Request", "Documentation", "Status"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources section */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-3">
                            {["Student Guide", "Faculty Portal", "Admin Dashboard", "API Documentation", "Community Forum"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-slate-400">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>MMMUT Campus, Gorakhpur<br />Uttar Pradesh, India 273010</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+91-551-2273958</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>support@vlab.mmmut.ac.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© 2025 Prayukti VLab. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
