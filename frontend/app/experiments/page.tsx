import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LabsGrid } from "@/components/home/LabsGrid";

export default function ExperimentsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1">
                <section className="bg-white border-b border-slate-200 py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">All Experiments</h1>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Select a domain to view the list of available experiments and simulations.
                        </p>
                    </div>
                </section>

                <div className="py-12">
                    <LabsGrid />
                </div>
            </main>

            <Footer />
        </div>
    );
}
