"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import {
    Search, Filter, ArrowRight, TrendingUp, Flame,
    BookOpen, FlaskConical, Star, ChevronDown
} from "lucide-react";
import { getLabs } from "@/lib/labs/registry";
import { AuthGuard } from "@/components/auth/AuthGuard";

// ─── Static Data ─────────────────────────────────────────────
const BRANCHES = [
    { name: "Computer Science Engineering", icon: "💻", code: "CSE", subjects: 4, practicals: 17, color: "from-blue-500 to-indigo-600" },
    { name: "Electrical Engineering", icon: "⚡", code: "EE", subjects: 3, practicals: 12, color: "from-yellow-500 to-orange-500", comingSoon: true },
    { name: "Electronics & Comm.", icon: "📡", code: "ECE", subjects: 3, practicals: 14, color: "from-purple-500 to-violet-600", comingSoon: true },
    { name: "Mechanical Engineering", icon: "⚙️", code: "ME", subjects: 3, practicals: 10, color: "from-slate-500 to-slate-700", comingSoon: true },
    { name: "Civil Engineering", icon: "🏗️", code: "CE", subjects: 2, practicals: 8, color: "from-green-500 to-emerald-600", comingSoon: true },
];

const SUBJECTS = [
    { name: "Database Management System", code: "DBMS", semester: "5th Semester", experiments: 5, icon: "🗄️", difficulty: "Intermediate", href: "/dashboard/dbms", color: "blue" },
    { name: "Computer Networks", code: "CN", semester: "5th Semester", experiments: 5, icon: "🌐", difficulty: "Intermediate", href: "/dashboard/cn", color: "indigo" },
    { name: "Digital Logic & Design", code: "DLD", semester: "3rd Semester", experiments: 4, icon: "🧠", difficulty: "Beginner", href: "/dashboard/dld", color: "purple" },
    { name: "Object Oriented Programming", code: "OOPS", semester: "4th Semester", experiments: 4, icon: "💻", difficulty: "Beginner", href: "/dashboard/oops", color: "violet" },
];

const SEMESTERS = ["All Semesters", "1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];
const DIFFICULTIES = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const TRENDING = [
    { title: "Study and Verification of Logic Gates", subject: "DLD", difficulty: "Easy", practices: "2.1k", href: "/dashboard/dld/dld-exp-1", icon: "⚡" },
    { title: "OSI vs TCP/IP Reference Models", subject: "CN", difficulty: "Easy", practices: "1.8k", href: "/dashboard/cn/cn-exp-1", icon: "🌐" },
    { title: "Introduction to DBMS", subject: "DBMS", difficulty: "Easy", practices: "1.6k", href: "/dashboard/dbms/dbms-exp-1", icon: "🗄️" },
    { title: "Introduction to Classes and Objects", subject: "OOPS", difficulty: "Easy", practices: "1.3k", href: "/dashboard/oops/oops-exp-1", icon: "💻" },
    { title: "CSMA/CD Protocol Study", subject: "CN", difficulty: "Medium", practices: "980", href: "/dashboard/cn/cn-exp-2", icon: "🌐" },
    { title: "Database Application Development", subject: "DBMS", difficulty: "Medium", practices: "850", href: "/dashboard/dbms/dbms-exp-2", icon: "🗄️" },
];

const difficultyColor: Record<string, string> = {
    Easy: "text-green-700 bg-green-50 border-green-200",
    Beginner: "text-green-700 bg-green-50 border-green-200",
    Medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
    Intermediate: "text-yellow-700 bg-yellow-50 border-yellow-200",
    Hard: "text-red-700 bg-red-50 border-red-200",
    Advanced: "text-red-700 bg-red-50 border-red-200",
};

const subjectColorMap: Record<string, string> = {
    blue: "border-blue-200 dark:border-blue-900 hover:border-blue-400",
    indigo: "border-indigo-200 dark:border-indigo-900 hover:border-indigo-400",
    purple: "border-purple-200 dark:border-purple-900 hover:border-purple-400",
    violet: "border-violet-200 dark:border-violet-900 hover:border-violet-400",
};

const subjectIconBg: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950",
    indigo: "bg-indigo-50 dark:bg-indigo-950",
    purple: "bg-purple-50 dark:bg-purple-950",
    violet: "bg-violet-50 dark:bg-violet-950",
};

// ─── Reusable Fade-in Variant ─────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay },
});

export default function ExplorePage() {
    const [search, setSearch] = useState("");
    const [semester, setSemester] = useState("All Semesters");
    const [difficulty, setDifficulty] = useState("All Levels");

    const allLabs = getLabs();

    const filteredSubjects = SUBJECTS.filter((s) => {
        const matchesSearch = search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
        const matchesSemester = semester === "All Semesters" || s.semester === semester;
        const matchesDifficulty = difficulty === "All Levels" || s.difficulty === difficulty;
        return matchesSearch && matchesSemester && matchesDifficulty;
    });

    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
                <Navbar />

                <main className="flex-1">

                    {/* ─── Hero Section ──────────────────────────────────────── */}
                    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/15 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                            <div className="absolute top-20 -right-4 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-900/15 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                            <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/15 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </div>

                        <div className="container mx-auto px-4 relative z-10 text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50 mb-8"
                            >
                                <FlaskConical className="w-4 h-4" />
                                {allLabs.length} Experiments Available
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.15 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6"
                            >
                                Explore{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Virtual Labs
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10"
                            >
                                Discover syllabus-based practical modules across engineering disciplines. Filter by semester, subject, or difficulty and start experimenting — right in your browser.
                            </motion.p>

                            {/* Stats Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.45 }}
                                className="flex flex-wrap justify-center gap-8"
                            >
                                {[
                                    { label: "Subjects", value: "4" },
                                    { label: "Experiments", value: `${allLabs.length}+` },
                                    { label: "Universities", value: "1" },
                                    { label: "Access", value: "24/7" },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stat.value}</p>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </section>

                    {/* ─── Search & Filter Bar ───────────────────────────────── */}
                    <section className="py-10 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 sticky top-16 z-30 backdrop-blur-md">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                                {/* Search */}
                                <div className="relative flex-1 min-w-0 group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500" />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 w-5 h-5 transition-colors z-10" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search subject or experiment…"
                                        className="relative w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all font-medium shadow-sm"
                                    />
                                </div>

                                {/* University */}
                                <div className="relative">
                                    <select
                                        className="appearance-none pl-4 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-sm"
                                        defaultValue="MMMUT"
                                    >
                                        <optgroup label="✅ Active">
                                            <option value="MMMUT">MMMUT, Gorakhpur</option>
                                        </optgroup>
                                        <optgroup label="🔒 Coming Soon">
                                            <option disabled>AKTU, Lucknow (Coming Soon)</option>
                                            <option disabled>BBDU, Lucknow (Coming Soon)</option>
                                            <option disabled>Amity University, Noida (Coming Soon)</option>
                                            <option disabled>HBTU, Kanpur (Coming Soon)</option>
                                            <option disabled>DDU, Gorakhpur (Coming Soon)</option>
                                            <option disabled>NIT Allahabad (Coming Soon)</option>
                                            <option disabled>DTU, Delhi (Coming Soon)</option>
                                            <option disabled>SRM University (Coming Soon)</option>
                                        </optgroup>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Semester */}
                                <div className="relative">
                                    <select
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        className="appearance-none pl-4 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-sm"
                                    >
                                        {SEMESTERS.map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Difficulty */}
                                <div className="relative">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="appearance-none pl-4 pr-10 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-sm"
                                    >
                                        {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Filter Icon (visual) */}
                                <div className="hidden md:flex items-center justify-center w-13 h-13 bg-blue-600 text-white rounded-xl px-4 py-3.5 shadow-md shadow-blue-500/20">
                                    <Filter className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ─── Branch Grid ──────────────────────────────────────── */}
                    <section className="py-24 bg-white dark:bg-slate-950">
                        <div className="container mx-auto px-4">
                            <motion.div {...fadeUp()} className="mb-14">
                                <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">By Department</span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Browse by Branch</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {BRANCHES.map((branch, i) => (
                                    <motion.div key={branch.code} {...fadeUp(i * 0.08)}>
                                        <div className={`group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 ${branch.comingSoon ? "opacity-70" : "cursor-pointer"}`}>
                                            {branch.comingSoon && (
                                                <span className="absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                                    Coming Soon
                                                </span>
                                            )}
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${branch.color} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                                                {branch.icon}
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {branch.name}
                                            </h3>
                                            <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                                                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {branch.subjects} Subjects</span>
                                                <span className="flex items-center gap-1"><FlaskConical className="w-4 h-4" /> {branch.practicals} Practicals</span>
                                            </div>
                                            {branch.comingSoon ? (
                                                <Button disabled className="rounded-full h-9 px-5 text-sm font-bold opacity-50">
                                                    Explore Branch
                                                </Button>
                                            ) : (
                                                <Link href="/explore#subjects">
                                                    <Button className="rounded-full h-9 px-5 text-sm font-bold btn-gradient btn-interaction">
                                                        Explore Branch <ArrowRight className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ─── Subject Grid ──────────────────────────────────────── */}
                    <section id="subjects" className="py-24 bg-slate-50/60 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50">
                        <div className="container mx-auto px-4">
                            <motion.div {...fadeUp()} className="mb-14">
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Syllabus-Mapped</span>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">All Subjects</h2>
                            </motion.div>

                            {filteredSubjects.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 dark:text-slate-600">
                                    <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                    <p className="text-lg font-semibold">No subjects match your filters.</p>
                                    <button onClick={() => { setSearch(""); setSemester("All Semesters"); setDifficulty("All Levels"); }} className="mt-4 text-blue-600 font-bold underline">Reset filters</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {filteredSubjects.map((subject, i) => (
                                        <motion.div key={subject.code} {...fadeUp(i * 0.1)}>
                                            <div className={`group relative bg-white dark:bg-slate-900 border-2 ${subjectColorMap[subject.color]} dark:border-slate-800 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col h-full`}>
                                                <div className={`w-14 h-14 ${subjectIconBg[subject.color]} rounded-2xl flex items-center justify-center text-3xl mb-5`}>
                                                    {subject.icon}
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border w-fit mb-3 ${difficultyColor[subject.difficulty]}`}>
                                                    {subject.difficulty}
                                                </span>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {subject.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">{subject.semester}</p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-sm text-slate-500 font-semibold flex items-center gap-1.5">
                                                        <FlaskConical className="w-4 h-4" /> {subject.experiments} Experiments
                                                    </span>
                                                    <Link href={subject.href}>
                                                        <Button size="sm" className="rounded-full h-8 px-4 text-xs font-bold btn-gradient btn-interaction">
                                                            Start <ArrowRight className="ml-1.5 w-3 h-3" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ─── Trending Labs ─────────────────────────────────────── */}
                    <section className="py-24 bg-white dark:bg-slate-950">
                        <div className="container mx-auto px-4">
                            <motion.div {...fadeUp()} className="mb-14 flex items-end justify-between flex-wrap gap-4">
                                <div>
                                    <span className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Most Practiced</span>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                                        Trending Labs <Flame className="w-7 h-7 text-orange-500" />
                                    </h2>
                                </div>
                                <Link href="/dashboard/dld" className="text-sm font-bold text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-700 transition-colors">
                                    See all experiments →
                                </Link>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {TRENDING.map((item, i) => (
                                    <motion.div key={item.title} {...fadeUp(i * 0.07)}>
                                        <Link href={item.href}>
                                            <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 dark:hover:border-purple-900 cursor-pointer h-full flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{item.icon}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${difficultyColor[item.difficulty]}`}>
                                                            {item.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-orange-500 font-black bg-orange-50 dark:bg-orange-950/30 px-2 py-1 rounded-full border border-orange-200 dark:border-orange-900">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                        Trending
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                    {item.title}
                                                </h3>

                                                <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
                                                    <span className="flex items-center gap-1 font-semibold">
                                                        <BookOpen className="w-4 h-4" />
                                                        {item.subject}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-semibold">
                                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                                        {item.practices} practices
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ─── Closing CTA ───────────────────────────────────────── */}
                    <section className="py-24 bg-white dark:bg-slate-950">
                        <div className="container mx-auto px-4">
                            <div className="bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -ml-48 -mb-48 group-hover:scale-110 transition-transform duration-1000" />
                                <div className="relative z-10">
                                    <motion.h2 {...fadeUp()} className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                                        Start Practicing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Today</span>
                                    </motion.h2>
                                    <motion.p {...fadeUp(0.1)} className="text-lg text-slate-400 font-medium max-w-xl mx-auto mb-10">
                                        Join thousands of students mastering their syllabus with precision-mapped virtual experiments.
                                    </motion.p>
                                    <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link href="/login">
                                            <Button size="lg" className="h-14 px-10 text-lg rounded-full btn-gradient btn-interaction w-full sm:w-auto">
                                                Start Practicing <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard/dld">
                                            <Button size="lg" className="h-14 px-10 text-lg rounded-full border-2 border-slate-700 text-white hover:bg-white/10 transition-all btn-interaction w-full sm:w-auto">
                                                Browse All Labs
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>

                <Footer />
            </div>
        </AuthGuard>
    );
}
