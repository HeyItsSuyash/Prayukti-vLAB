import { StepForward, Settings, Database, Table } from "lucide-react";

export default function Procedure() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-200">
                Procedure
            </h2>

            <div className="relative border-l-2 border-gray-200 ml-3 space-y-12">
                {/* Step 1 */}
                <div className="relative pl-8">
                    <span className="absolute -left-[11px] top-0 bg-white border-2 border-[#2ecc71] rounded-full w-5 h-5"></span>
                    <div className="flex items-start gap-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <Settings className="text-[#2ecc71]" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Step 1: Select Environment</h3>
                            <p className="text-gray-600">
                                Choose the database environment you want to simulate (e.g., MySQL, Oracle, PostgreSQL) from the dropdown menu. This changes the context of the operations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8">
                    <span className="absolute -left-[11px] top-0 bg-white border-2 border-[#2ecc71] rounded-full w-5 h-5"></span>
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Database className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Step 2: Create Database</h3>
                            <p className="text-gray-600">
                                Click the <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">Create Database</span> button. Enter a name for your database when prompted. Observe how the database container is created in the visualization area.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8">
                    <span className="absolute -left-[11px] top-0 bg-white border-2 border-[#2ecc71] rounded-full w-5 h-5"></span>
                    <div className="flex items-start gap-4">
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <Table className="text-purple-500" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Step 3: Create Table</h3>
                            <p className="text-gray-600">
                                Within the created database, click <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">Create Table</span>. Define the table schema (Columns, Data Types). Observe the table structure being formed inside the database.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 pb-4">
                    <span className="absolute -left-[11px] top-0 bg-white border-2 border-[#2ecc71] rounded-full w-5 h-5"></span>
                    <div className="flex items-start gap-4">
                        <div className="bg-orange-50 p-3 rounded-lg">
                            <StepForward className="text-orange-500" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Step 4: Verify</h3>
                            <p className="text-gray-600">
                                Check the "Observation" tab to verify your understanding of the steps and the result.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
