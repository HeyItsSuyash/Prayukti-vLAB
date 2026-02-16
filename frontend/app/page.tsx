import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SplineScene from "@splinetool/react-spline";
import { Twitter, Facebook, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-orange-100 selection:text-orange-900">
      {/* Header with Integrated Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Banner Section - Redesigned for White Theme + 3D Robot */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0 opacity-50"></div>

          <div className="container mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full pt-10">
            {/* Left Content */}
            <div className="space-y-8 max-w-2xl relative z-30">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                vLAB Ecosystem Active
              </div>

              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-black leading-[0.9] tracking-tighter">
                FUTURE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d32f2f] to-orange-600">READY.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-lg leading-relaxed border-l-4 border-black pl-6">
                Interact with <span className="text-black font-bold">digital logic</span>, simulate <span className="text-black font-bold">networks</span>, and master engineering concepts in a <span className="underline decoration-orange-500 decoration-4 underline-offset-4">real-time 3D environment</span>.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/login">
                  <Button size="lg" className="h-16 px-10 text-lg bg-black text-white hover:bg-slate-900 rounded-none border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(211,47,47,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    Start Experimenting
                  </Button>
                </Link>
                <Link href="/dashboard/dld">
                  <Button variant="outline" size="lg" className="h-16 px-10 text-lg rounded-none border-2 border-slate-200 hover:border-black hover:bg-transparent shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                    View Modules
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - 3D Robot / Spline Scene */}
            <div className="relative h-[500px] lg:h-[700px] w-full flex items-center justify-center">
              {/* Abstract decorative elements behind robot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-rose-50 to-orange-50 rounded-full opacity-30 blur-3xl -z-10"></div>

              <div className="w-full h-full relative z-10 transition-transform duration-700 hover:scale-[1.02]">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-20 -left-10 bg-white border-2 border-slate-100 p-6 shadow-2xl z-20 max-w-[200px] hidden md:block">
                <p className="text-4xl font-black text-black mb-1">98%</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulation Accuracy Rate</p>
                <div className="w-full h-1 bg-slate-100 mt-3 rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-[#d32f2f]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Works / Modules Grid */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b-2 border-black pb-8">
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-4">
                  ACADEMIC <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">MODULES</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium max-w-md">Curriculum-aligned virtual laboratories tailored for precision and interactivity.</p>
              </div>
              <div className="mb-2">
                <div className="text-right hidden md:block">
                  <p className="font-black text-8xl text-slate-100 leading-none -mb-6">04</p>
                  <p className="font-bold text-black uppercase tracking-widest">Active Domains</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
              {/* Computer Networks */}
              <div className="flex flex-col gap-6 group cursor-pointer">
                <div className="w-full h-[400px] bg-slate-50 border-2 border-slate-200 relative overflow-hidden transition-all duration-500 group-hover:border-black group-hover:shadow-[10px_10px_0px_0px_#000]">
                  <div className="absolute inset-0 bg-[radial-gradient(#d32f2f_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]"></div>
                  <div className="absolute top-0 right-0 p-8">
                    <span className="text-6xl">🌐</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-white/80 backdrop-blur-sm border-t border-slate-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-bold text-black uppercase">Simulation Type: Topology & Protocol</p>
                    <p className="text-sm text-slate-500 mt-1">Status: Active</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-3xl font-black text-black">Computer Networks</h3>
                    <span className="text-sm font-bold text-slate-400">01</span>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed mb-4">
                    Simulate complex topologies, packet flows, and protocol behaviors including CSMA/CD, Token Ring, and OSI Layer interactions.
                  </p>
                  <Link href="/dashboard/cn" className="inline-flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-1 hover:text-[#d32f2f] hover:border-[#d32f2f] transition-colors">
                    Enter Lab <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>

              {/* Digital Logic */}
              <div className="flex flex-col gap-6 group cursor-pointer md:mt-24">
                <div className="w-full h-[400px] bg-slate-50 border-2 border-slate-200 relative overflow-hidden transition-all duration-500 group-hover:border-black group-hover:shadow-[10px_10px_0px_0px_#f57f17]">
                  <div className="absolute inset-0 bg-[radial-gradient(#f57f17_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]"></div>
                  <div className="absolute top-0 right-0 p-8">
                    <span className="text-6xl">🧠</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-white/80 backdrop-blur-sm border-t border-slate-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-bold text-black uppercase">Simulation Type: Circuit Design</p>
                    <p className="text-sm text-slate-500 mt-1">Status: Active</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-3xl font-black text-black">Digital Logic & Design</h3>
                    <span className="text-sm font-bold text-slate-400">02</span>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed mb-4">
                    Build and test logic circuits, master flip-flops, and visualize gate-level operations with real-time waveform analysis.
                  </p>
                  <Link href="/dashboard/dld" className="inline-flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-1 hover:text-[#f57f17] hover:border-[#f57f17] transition-colors">
                    Enter Lab <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>

              {/* OOPS */}
              <div className="flex flex-col gap-6 group cursor-pointer">
                <div className="w-full h-[400px] bg-slate-50 border-2 border-slate-200 relative overflow-hidden transition-all duration-500 group-hover:border-black group-hover:shadow-[10px_10px_0px_0px_#4f46e5]">
                  <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]"></div>
                  <div className="absolute top-0 right-0 p-8">
                    <span className="text-6xl">💻</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-white/80 backdrop-blur-sm border-t border-slate-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-bold text-black uppercase">Simulation Type: Code Execution</p>
                    <p className="text-sm text-slate-500 mt-1">Status: Active</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-3xl font-black text-black">Object Oriented Prog.</h3>
                    <span className="text-sm font-bold text-slate-400">03</span>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed mb-4">
                    Visualize memory allocation, inheritance hierarchies, and polymorphism through interactive code simulation.
                  </p>
                  <Link href="/dashboard/oops" className="inline-flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-colors">
                    Enter Lab <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>

              {/* DBMS */}
              <div className="flex flex-col gap-6 group cursor-pointer md:mt-24">
                <div className="w-full h-[400px] bg-slate-50 border-2 border-slate-200 relative overflow-hidden transition-all duration-500 group-hover:border-black group-hover:shadow-[10px_10px_0px_0px_#059669]">
                  <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]"></div>
                  <div className="absolute top-0 right-0 p-8">
                    <span className="text-6xl">🗄️</span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-8 w-full bg-white/80 backdrop-blur-sm border-t border-slate-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-bold text-black uppercase">Simulation Type: Query Design</p>
                    <p className="text-sm text-slate-500 mt-1">Status: Active</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-3xl font-black text-black">Database Mgmt. System</h3>
                    <span className="text-sm font-bold text-slate-400">04</span>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed mb-4">
                    Design schemas, normalize tables, and execute complex SQL queries in a visual environment.
                  </p>
                  <Link href="/dashboard/dbms" className="inline-flex items-center gap-2 font-black uppercase text-sm border-b-2 border-black pb-1 hover:text-emerald-600 hover:border-emerald-600 transition-colors">
                    Enter Lab <span className="text-xl">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Minimal Style */}
        <section className="py-24 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <span className="text-[#f57f17] font-black uppercase tracking-widest text-sm mb-4 block">Platform DNA</span>
                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                  ENGINEERED FOR <br />
                  EXCELLENCE.
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed mb-8">
                  Built specifically for MMMUT students, facilitating a seamless bridge between theoretical lectures and practical application.
                </p>
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-4xl font-black text-white mb-1">100%</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Web Based</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white mb-1">~0ms</p>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Input Latency</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  { title: "24/7 Access", desc: "Experiment anytime, anywhere without lab hour restrictions." },
                  { title: "Real-time Feedback", desc: "Instant validation of logic circuits and code execution." },
                  { title: "Industrial Standard", desc: "Tools and interfaces modeled after industry software." },
                ].map((item, i) => (
                  <div key={i} className="border border-white/20 p-8 hover:bg-white/5 transition-colors group">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#f57f17] transition-colors">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="bg-white text-black py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-black text-xl tracking-tighter">MMMUT <span className="text-[#f57f17]">vLAB</span></p>
            <p className="text-xs text-slate-500 mt-1">© 2025 Madan Mohan Malaviya University of Technology</p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="w-10 h-10 border border-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors rounded-full">
              <Twitter size={16} />
            </a>
            <a href="#" className="w-10 h-10 border border-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors rounded-full">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-10 h-10 border border-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors rounded-full">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
