import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LabsGrid } from "@/components/home/LabsGrid";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function LabsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Header Section */}
                <section className="bg-white border-b border-slate-200 py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Explore Virtual Labs</h1>
                        <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
                            Browse our collection of high-fidelity simulations across various engineering disciplines.
                        </p>

                        {/* Search Bar Placeholder */}
                        <div className="max-w-md mx-auto relative">
                            <input
                                type="text"
                                placeholder="Search for labs..."
                                className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        </div>
                    </div>
                </section>

                {/* Labs Grid */}
                <div className="py-12">
                    <LabsGrid />
                </div>
            </main>

            <Footer />
        </div>
    );
}
