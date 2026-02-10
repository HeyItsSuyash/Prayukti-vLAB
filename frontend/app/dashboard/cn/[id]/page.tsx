import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { getLabById } from "@/lib/labs/registry";
import { LAB_CONTENT } from "@/lib/labs/rich-content";

export default async function PracticalDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lab = getLabById(id);
    const content = LAB_CONTENT[id];

    if (!lab || !content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Experiment Not Found</h1>
                    <p className="text-gray-600 mb-6">The requested experiment ID "{id}" does not exist.</p>
                    <Link href="/dashboard/cn">
                        <Button>Return to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/dashboard/cn" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-lg font-bold text-gray-800 truncate">{lab.metadata.title}</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Content (Theory) */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Aim</h2>
                        <p className="text-gray-700">{content.aim}</p>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Theory</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: content.theory }} />
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-xl font-bold text-[#1976d2] mb-4 border-b pb-2">Procedure</h2>
                        <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: content.procedure }} />
                    </section>
                </div>

                {/* Right Sidebar (Actions) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200">
                        <h3 className="font-bold text-lg mb-2 text-blue-900">Start Learning</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Enter the interactive simulation to visualize the layer architecture and packet flow.
                        </p>
                        <Link href={`/dashboard/cn/${id}/simulation`}>
                            <Button className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-lg font-bold py-6 shadow-lg hover:shadow-xl transition-all">
                                <FlaskConical className="mr-2 h-6 w-6" />
                                Enter Simulation
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="font-bold text-md mb-4 text-gray-800">Resources</h3>
                        <ul className="space-y-2 text-sm text-[#1976d2]">
                            <li className="cursor-pointer hover:underline">Reference Guide (PDF)</li>
                            <li className="cursor-pointer hover:underline">Animation Lecture</li>
                            <li className="cursor-pointer hover:underline">Self Assessment Quiz</li>
                        </ul>
                    </div>
                </div>

            </main>
        </div>
    );
}
