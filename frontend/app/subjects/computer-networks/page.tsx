import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComputerNetworksSubjectPage() {
    return (
        <div className="container mx-auto p-6">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-[#d32f2f]">Computer Networks</h1>
                <p className="text-gray-600 mt-2">Code: CN-202 | Semester: 5</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Experiment 1 Card */}
                <div className="border rounded-lg shadow-sm hover:shadow-md transition bg-white p-6">
                    <h2 className="text-xl font-semibold mb-2">Experiment 1: Error Detection & Correction</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Simulation of Parity Check, Checksum, CRC, and Hamming Code algorithms.
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Simulation</span>
                        <Link href="/subjects/computer-networks/error-detection">
                            <Button className="bg-[#2e7d32] hover:bg-[#1b5e20]">Start Experiment</Button>
                        </Link>
                    </div>
                </div>

                {/* Placeholder for Exp 2 */}
                <div className="border rounded-lg shadow-sm bg-gray-50 p-6 opacity-75">
                    <h2 className="text-xl font-semibold mb-2">Experiment 2: Stop and Wait ARQ</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Understanding flow control mechanisms.
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Coming Soon</span>
                        <Button disabled variant="outline">Locked</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
