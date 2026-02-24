import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SplineScene from "@splinetool/react-spline";
import { Twitter, Facebook, Linkedin, Command } from "lucide-react";
import { FAQ } from "@/components/home/FAQ";
import { UniversityAlignment } from "@/components/home/UniversityAlignment";
import { Footer } from "@/components/layout/Footer";
import { AcademicModulesSection } from "@/components/home/AcademicModulesSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900">
      {/* Header with Integrated Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Banner Section - Redesigned for Blue-Purple Theme + 3D Robot */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-slate-950 pt-16">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-white dark:bg-slate-950">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="container mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Content */}
            <div className="space-y-8 max-w-2xl relative z-30">
              <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800/50">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                vLAB Ecosystem Active
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
                FUTURE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">READY.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-lg leading-relaxed border-l-4 border-blue-600 pl-6">
                Interact with <span className="text-slate-900 dark:text-white font-bold">Digital Logic</span>, Simulate <span className="text-slate-900 dark:text-white font-bold">Networks</span>, Write , Debug  and  <span className="text-slate-900 dark:text-white font-bold">Execute your Code</span> and master Engineering concepts.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-10 text-lg rounded-full btn-gradient btn-interaction">
                    Start Experimenting
                  </Button>
                </Link>
                <Link href="/dashboard/dld">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-2 border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-transparent transition-all dark:text-white btn-interaction">
                    View Modules
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-6 opacity-80">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[10px] text-blue-600">✓</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest" style={{ color: "#1e1e1e" }}>24/7 Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[10px] text-blue-600">✓</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest" style={{ color: "#1e1e1e" }}>Browser-Based</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-[10px] text-blue-600">✓</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest" style={{ color: "#1e1e1e" }}>No Installation</span>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Robot / Spline Scene */}
            <div className="relative h-[450px] lg:h-[650px] w-full flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full opacity-40 blur-3xl -z-10 animate-pulse"></div>

              <div className="w-full h-full relative z-10 transition-transform duration-700 hover:scale-[1.02]">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Live Stats Section */}
        <section className="py-20 section-shade-soft border-y border-slate-200/50 dark:border-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">Trusted by Engineering Students</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Our Growing Ecosystem</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Users", value: "10K+", icon: "👥" },
                { label: "Experiments", value: "150+", icon: "⚡" },
                { label: "Universities", value: "25+", icon: "🏛️" },
                { label: "Success Rate", value: "99%", icon: "⭐" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 card-interaction">
                  <span className="text-3xl mb-4">{stat.icon}</span>
                  <span className="text-4xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</span>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AcademicModulesSection />

        {/* Why Choose Us - Enhanced Glassmorphism Style */}
        <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Platform DNA</span>
                <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                  ENGINEERED FOR <br />
                  <span className="text-indigo-500">EXCELLENCE.</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-lg">
                  Built specifically for MMMUT students, facilitating a seamless bridge between theoretical lectures and practical application.
                </p>
                <div className="grid grid-cols-2 gap-12">
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 card-interaction">
                    <p className="text-4xl font-black text-white mb-2">100%</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Web Based</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 card-interaction">
                    <p className="text-4xl font-black text-white mb-2">~0ms</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Input Latency</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-6">
                {[
                  { title: "24/7 Access", desc: "Experiment anytime, anywhere without lab hour restrictions.", icon: "🕒" },
                  { title: "Real-time Feedback", desc: "Instant validation of logic circuits and code execution.", icon: "⚡" },
                  { title: "Industrial Standard", desc: "Tools and interfaces modeled after industry software.", icon: "🛠️" },
                ].map((item, i) => (
                  <div key={i} className="glass p-8 rounded-[2rem] hover:bg-white/10 transition-all group border border-white/5 card-interaction">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl mt-1">{item.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <UniversityAlignment />

        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
