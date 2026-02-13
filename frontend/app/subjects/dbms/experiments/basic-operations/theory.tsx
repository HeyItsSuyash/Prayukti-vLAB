import { Database, Table as TableIcon, Columns, LayoutList } from "lucide-react";

export default function Theory() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-200">
                Theory
            </h2>

            <div className="space-y-12">
                {/* Concept 1: Database */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Database size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">1. Database</h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        A <span className="font-semibold text-gray-900">Database</span> is an organized collection of structured information, or data, typically stored electronically in a computer system. It acts as a container for tables and other objects.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex justify-center">
                        <div className="text-center">
                            <Database size={64} className="mx-auto text-blue-500 mb-2 opacity-80" />
                            <span className="text-sm font-mono text-gray-500">my_database</span>
                        </div>
                    </div>
                </section>

                {/* Concept 2: Table */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <TableIcon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">2. Table</h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        A <span className="font-semibold text-gray-900">Table</span> is a collection of related data held in a table format within a database. It consists of columns (fields) and rows (records).
                    </p>
                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Student_ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Age</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4">101</td>
                                    <td className="px-6 py-4">John Doe</td>
                                    <td className="px-6 py-4">20</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4">102</td>
                                    <td className="px-6 py-4">Jane Smith</td>
                                    <td className="px-6 py-4">22</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Concept 3: Field */}
                    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                <Columns size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">3. Field (Column)</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            A <span className="font-semibold text-gray-900">Field</span> is a unit of data stored in a table. Each column in a table represents a field. For example, "Name" or "Age".
                        </p>
                    </section>

                    {/* Concept 4: Record */}
                    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <LayoutList size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">4. Record (Row)</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            A <span className="font-semibold text-gray-900">Record</span> is a single entry in a table. It represents a set of related data. For example, all information about "John Doe" is one record.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
