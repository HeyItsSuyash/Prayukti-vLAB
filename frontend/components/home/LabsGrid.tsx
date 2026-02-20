"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Globe, Cpu, Terminal, Database, BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Lab data ─────────────────────────────────────────────────
const labs = [
    {
        id: "cn",
        title: "Computer Networks",
        subtitle: "Networking & Protocols",
        description: "Simulate complex topologies, packet flows, and protocol behaviors including CSMA/CD and OSI Layers.",
        icon: <Globe className="w-7 h-7" />,
        href: "/dashboard/cn",
        // Gradient banner colours
        bannerFrom: "#1e40af",
        bannerVia: "#2563eb",
        bannerTo: "#3b82f6",
        iconBg: "bg-blue-600",
        accentColor: "text-blue-600 dark:text-blue-400",
        badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
        borderHover: "hover:border-blue-300 dark:hover:border-blue-700",
        shadowHover: "hover:shadow-blue-100 dark:hover:shadow-blue-900/20",
        tag: "OSI · TCP/IP · Routing",
        experiments: 8,
        // decorative SVG pattern id
        pattern: "net",
    },
    {
        id: "dld",
        title: "Digital Logic & Design",
        subtitle: "Logic Gates & Circuits",
        description: "Build and test logic circuits, master flip-flops, and visualize gate-level operations in real time.",
        icon: <Cpu className="w-7 h-7" />,
        href: "/dashboard/dld",
        bannerFrom: "#92400e",
        bannerVia: "#d97706",
        bannerTo: "#f59e0b",
        iconBg: "bg-amber-500",
        accentColor: "text-amber-600 dark:text-amber-400",
        badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
        borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
        shadowHover: "hover:shadow-amber-100 dark:hover:shadow-amber-900/20",
        tag: "Gates · Flip-Flops · K-Map",
        experiments: 10,
        pattern: "dld",
    },
    {
        id: "oops",
        title: "Object Oriented Programming",
        subtitle: "OOP Concepts & Patterns",
        description: "Visualize memory allocation, inheritance hierarchies, and polymorphism through live code simulation.",
        icon: <Terminal className="w-7 h-7" />,
        href: "/dashboard/oops",
        bannerFrom: "#3730a3",
        bannerVia: "#4f46e5",
        bannerTo: "#818cf8",
        iconBg: "bg-indigo-600",
        accentColor: "text-indigo-600 dark:text-indigo-400",
        badgeBg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
        borderHover: "hover:border-indigo-300 dark:hover:border-indigo-700",
        shadowHover: "hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20",
        tag: "Classes · Inheritance · STL",
        experiments: 9,
        pattern: "oop",
    },
    {
        id: "dbms",
        title: "Database Management",
        subtitle: "SQL & Relational Design",
        description: "Learn to design, query, and manage relational databases using SQL with interactive ER diagrams.",
        icon: <Database className="w-7 h-7" />,
        href: "/dashboard/dbms",
        bannerFrom: "#065f46",
        bannerVia: "#059669",
        bannerTo: "#34d399",
        iconBg: "bg-emerald-600",
        accentColor: "text-emerald-600 dark:text-emerald-400",
        badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
        borderHover: "hover:border-emerald-300 dark:hover:border-emerald-700",
        shadowHover: "hover:shadow-emerald-100 dark:hover:shadow-emerald-900/20",
        tag: "SQL · ER Diagram · Normalization",
        experiments: 7,
        pattern: "dbms",
    },
];

// ─── SVG pattern overlays per subject ─────────────────────────
function BannerPattern({ id }: { id: string }) {
    if (id === "net") return (
        // Network nodes + lines
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
            <circle cx="20" cy="20" r="5" fill="white" /><circle cx="100" cy="15" r="5" fill="white" /><circle cx="180" cy="25" r="5" fill="white" />
            <circle cx="50" cy="70" r="5" fill="white" /><circle cx="140" cy="65" r="5" fill="white" /><circle cx="90" cy="100" r="5" fill="white" />
            <line x1="20" y1="20" x2="100" y2="15" stroke="white" strokeWidth="1.5" /><line x1="100" y1="15" x2="180" y2="25" stroke="white" strokeWidth="1.5" />
            <line x1="20" y1="20" x2="50" y2="70" stroke="white" strokeWidth="1.5" /><line x1="100" y1="15" x2="140" y2="65" stroke="white" strokeWidth="1.5" />
            <line x1="50" y1="70" x2="90" y2="100" stroke="white" strokeWidth="1.5" /><line x1="140" y1="65" x2="90" y2="100" stroke="white" strokeWidth="1.5" />
            <line x1="50" y1="70" x2="140" y2="65" stroke="white" strokeWidth="1.5" /><line x1="180" y1="25" x2="140" y2="65" stroke="white" strokeWidth="1.5" />
        </svg>
    );
    if (id === "dld") return (
        // Logic gate shapes
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
            <rect x="20" y="30" width="40" height="25" rx="3" stroke="white" strokeWidth="2" fill="none" />
            <line x1="0" y1="38" x2="20" y2="38" stroke="white" strokeWidth="2" /><line x1="0" y1="48" x2="20" y2="48" stroke="white" strokeWidth="2" />
            <line x1="60" y1="42" x2="80" y2="42" stroke="white" strokeWidth="2" />
            <rect x="100" y="25" width="50" height="30" rx="15" stroke="white" strokeWidth="2" fill="none" />
            <line x1="80" y1="33" x2="100" y2="33" stroke="white" strokeWidth="2" /><line x1="80" y1="47" x2="100" y2="47" stroke="white" strokeWidth="2" />
            <line x1="150" y1="40" x2="180" y2="40" stroke="white" strokeWidth="2" />
            <text x="27" y="48" fill="white" fontSize="9" fontFamily="monospace">AND</text>
            <text x="109" y="45" fill="white" fontSize="9" fontFamily="monospace">OR</text>
            <circle cx="183" cy="40" r="3" stroke="white" strokeWidth="2" fill="none" />
            <line x1="20" y1="90" x2="60" y2="90" stroke="white" strokeWidth="2" /><line x1="40" y1="80" x2="40" y2="100" stroke="white" strokeWidth="2" />
        </svg>
    );
    if (id === "oop") return (
        // Class hierarchy boxes
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
            <rect x="75" y="5" width="50" height="28" rx="4" stroke="white" strokeWidth="2" fill="none" />
            <text x="83" y="24" fill="white" fontSize="9" fontFamily="monospace">Animal</text>
            <line x1="100" y1="33" x2="100" y2="50" stroke="white" strokeWidth="1.5" />
            <line x1="45" y1="50" x2="155" y2="50" stroke="white" strokeWidth="1.5" />
            <line x1="45" y1="50" x2="45" y2="65" stroke="white" strokeWidth="1.5" />
            <line x1="155" y1="50" x2="155" y2="65" stroke="white" strokeWidth="1.5" />
            <rect x="10" y="65" width="70" height="28" rx="4" stroke="white" strokeWidth="2" fill="none" />
            <text x="22" y="84" fill="white" fontSize="9" fontFamily="monospace">Dog</text>
            <rect x="120" y="65" width="70" height="28" rx="4" stroke="white" strokeWidth="2" fill="none" />
            <text x="132" y="84" fill="white" fontSize="9" fontFamily="monospace">Cat</text>
        </svg>
    );
    // DBMS – table grid
    return (
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
            <rect x="10" y="15" width="170" height="85" rx="4" stroke="white" strokeWidth="2" fill="none" />
            <line x1="10" y1="35" x2="180" y2="35" stroke="white" strokeWidth="2" />
            <line x1="10" y1="55" x2="180" y2="55" stroke="white" strokeWidth="1" />
            <line x1="10" y1="70" x2="180" y2="70" stroke="white" strokeWidth="1" />
            <line x1="10" y1="85" x2="180" y2="85" stroke="white" strokeWidth="1" />
            <line x1="65" y1="15" x2="65" y2="100" stroke="white" strokeWidth="1.5" />
            <line x1="118" y1="15" x2="118" y2="100" stroke="white" strokeWidth="1.5" />
            <text x="20" y="30" fill="white" fontSize="8" fontFamily="monospace">id</text>
            <text x="75" y="30" fill="white" fontSize="8" fontFamily="monospace">name</text>
            <text x="125" y="30" fill="white" fontSize="8" fontFamily="monospace">dept</text>
            <text x="20" y="48" fill="white" fontSize="8" fontFamily="monospace">001</text>
            <text x="75" y="48" fill="white" fontSize="8" fontFamily="monospace">Ravi</text>
            <text x="125" y="48" fill="white" fontSize="8" fontFamily="monospace">CSE</text>
        </svg>
    );
}

// ─── Auth-aware navigation helper ─────────────────────────────
function useLabNavigate() {
    const router = useRouter();
    return (href: string) => {
        // Check for JWT / session token stored by the login page
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token") ||
                localStorage.getItem("authToken") ||
                sessionStorage.getItem("token")
                : null;
        if (token) {
            router.push(href);
        } else {
            router.push("/login");
        }
    };
}

// ─── Individual Lab Card ───────────────────────────────────────
function LabCard({ lab }: { lab: (typeof labs)[number] }) {
    const navigate = useLabNavigate();

    return (
        <button
            onClick={() => navigate(lab.href)}
            className={cn(
                "group text-left w-full h-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 overflow-hidden",
                "hover:shadow-xl hover:-translate-y-1",
                lab.borderHover,
                lab.shadowHover
            )}
        >
            {/* ── Subject Banner ── */}
            <div
                className="relative h-44 overflow-hidden flex items-end p-5"
                style={{
                    background: `linear-gradient(135deg, ${lab.bannerFrom}, ${lab.bannerVia}, ${lab.bannerTo})`,
                }}
            >
                {/* Decorative SVG pattern */}
                <BannerPattern id={lab.pattern} />

                {/* Floating glow blob */}
                <div className="absolute top-3 right-3 w-24 h-24 rounded-full bg-white/10 blur-2xl" />

                {/* Icon pill */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl", lab.iconBg)}>
                        {lab.icon}
                    </div>
                    <div>
                        <p className="text-[10px] text-white/70 font-black uppercase tracking-[0.2em]">{lab.subtitle}</p>
                        <p className="text-white font-black text-sm leading-snug">{lab.title}</p>
                    </div>
                </div>

                {/* Experiment count badge */}
                <div className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/30">
                    {lab.experiments} Exps
                </div>
            </div>

            {/* ── Card Body ── */}
            <div className="p-6 flex flex-col gap-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {lab.description}
                </p>

                {/* Topic tags */}
                <p className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit", lab.badgeBg)}>
                    {lab.tag}
                </p>

                {/* CTA row */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Labs Active</span>
                    </div>
                    <div className={cn("flex items-center gap-1 text-[11px] font-black uppercase tracking-widest", lab.accentColor)}>
                        Enter Lab
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5 duration-300" />
                    </div>
                </div>
            </div>
        </button>
    );
}

// ─── Main Section ─────────────────────────────────────────────
export function LabsGrid() {
    const router = useRouter();

    const handleSeeAll = () => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token") ||
                localStorage.getItem("authToken") ||
                sessionStorage.getItem("token")
                : null;
        // Always go to /explore — login guard is on individual labs
        router.push("/explore");
    };

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950/20" id="labs">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-14 gap-6">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-3">
                            <BookOpen className="w-3.5 h-3.5" />
                            Academic Modules
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-2 leading-tight uppercase italic">
                            Explore Our <br />
                            <span className="text-blue-600">Virtual Ecosystem</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-medium mt-4 max-w-md">
                            Syllabus-aligned virtual labs for every core engineering subject — practice anytime, anywhere.
                        </p>
                    </div>

                    {/* Desktop "See All" beside header */}
                    <button
                        onClick={handleSeeAll}
                        className="hidden md:flex items-center gap-2.5 h-12 px-8 rounded-full font-bold uppercase tracking-widest text-xs border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                        <Layers className="w-4 h-4" />
                        View All Labs
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* 4-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {labs.map((lab) => (
                        <LabCard key={lab.id} lab={lab} />
                    ))}
                </div>

                {/* ── "See All Subjects" CTA at the bottom ── */}
                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-slate-400 dark:text-slate-600">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 max-w-xs" />
                        <span className="text-xs font-bold uppercase tracking-widest">More coming soon</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800 max-w-xs" />
                    </div>

                    <button
                        onClick={handleSeeAll}
                        className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-black uppercase tracking-widest text-white overflow-hidden shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        {/* Gradient background */}
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300 group-hover:from-blue-700 group-hover:via-indigo-700 group-hover:to-purple-700" />
                        {/* Shine sweep */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <Layers className="relative w-5 h-5" />
                        <span className="relative">See All Subjects</span>
                        <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        Browse the full catalogue on our Explore page
                    </p>
                </div>

            </div>
        </section>
    );
}
