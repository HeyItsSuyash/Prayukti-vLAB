"use client";

import { Monitor, Zap, Users, Trophy } from "lucide-react";

const features = [
    {
        icon: <Monitor className="w-8 h-8 text-primary" />,
        title: "Interactive Simulations",
        description: "Experience hands-on learning with our high-fidelity virtual apparatus and real-time feedback systems.",
    },
    {
        icon: <Zap className="w-8 h-8 text-amber-500" />,
        title: "Real-time Results",
        description: "Get instant analysis and validation of your experimental data with our advanced calculation engine.",
    },
    {
        icon: <Users className="w-8 h-8 text-green-500" />,
        title: "Student Friendly",
        description: "Designed with an intuitive interface that simplifies complex procedures without compromising academic rigor.",
    },
    {
        icon: <Trophy className="w-8 h-8 text-indigo-500" />,
        title: "Evaluated Learning",
        description: "Track your progress with integrated quizzes and automated performance assessment tools.",
    },
];

export function Features() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">Why Choose Prayukti?</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-4 mb-6">
                        Reimagining Technical Education
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                        Our platform combines the flexibility of digital learning with the precision of physical laboratory equipment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-white dark:bg-slate-900 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
