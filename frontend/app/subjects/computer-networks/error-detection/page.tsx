import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical, BookOpen, CheckCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ErrorDetectionLandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                {/* Breadcrumbs & Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/cn" className="hover:text-primary transition-colors">Computer Networks</Link>
                        <span>/</span>
                        <span className="text-primary truncate max-w-[200px]">Error Detection</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-4">Error Detection and Correction</h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Theory</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Quiz Available</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content (Theory) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Aim */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                Aim
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To implement and study various error detection and correction techniques used in data communication, specifically: Parity Check, Checksum, CRC, and Hamming Code.
                            </p>
                        </section>

                        {/* Theory */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                Theory
                            </h2>
                            <div className="space-y-6 text-slate-600 leading-relaxed">
                                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                    <h4 className="font-bold text-blue-900 mb-2">Why Error Detection?</h4>
                                    <p className="text-sm text-blue-800">Data transmitted over a network can be corrupted by noise or interference. Error detection mechanisms allow the receiver to verify data integrity.</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">1. Parity Check</h3>
                                    <p>Appends a single bit to make the number of 1s even (Even Parity) or odd (Odd Parity). Simple but only detects single-bit errors.</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">2. Checksum</h3>
                                    <p>Used in TCP/IP. The sender calculates the sum of data segments and sends the 1's complement. The receiver sums segments + checksum; the result should be all 1s (0 in 1's complement).</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">3. CRC (Cyclic Redundancy Check)</h3>
                                    <p>Uses polynomial division. The sender appends a remainder to the data. The receiver divides by the same polynomial; a zero remainder indicates valid data.</p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">4. Hamming Code</h3>
                                    <p>An Error Correction Code (ECC). It adds redundant bits at power-of-2 positions. It can detect and correct single-bit errors by calculating syndrome bits.</p>
                                </div>
                            </div>
                        </section>

                        {/* Procedure */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-primary rounded-full"></div>
                                Procedure
                            </h2>
                            <ol className="list-decimal ml-6 space-y-3 text-slate-600 leading-relaxed">
                                <li>Click "Enter Simulation" to open the virtual lab workspace.</li>
                                <li>Select the algorithm you wish to study (e.g., Parity Check).</li>
                                <li>Enter binary data in the "Sender" panel.</li>
                                <li>Observe the encoded data.</li>
                                <li>Use the "Inject Error" button to simulate noise in the channel.</li>
                                <li>Click "Verify" on the Receiver side to see if the error is detected or corrected.</li>
                                <li>Repeat for all 4 algorithms.</li>
                            </ol>
                        </section>
                    </div>

                    {/* Right Sidebar (Actions) */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-primary/10 sticky top-24">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Start Learning</h3>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                Enter the interactive simulation to experiment with error detection algorithms.
                            </p>

                            <Link href="/subjects/computer-networks/error-detection/simulation">
                                <Button className="w-full gap-2 text-base font-semibold py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                                    Enter Simulation <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Button>
                            </Link>

                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-4 uppercase tracking-wider">Self Evaluation</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button className="flex items-center gap-3 text-slate-600 hover:text-primary transition-colors text-sm font-medium w-full text-left group">
                                            <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <FlaskConical className="w-4 h-4" />
                                            </span>
                                            Take Quiz (Coming Soon)
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
