import { useState } from "react";
import { Database, Plus, Table as TableIcon, Trash2, Check, AlertCircle } from "lucide-react";

type DBType = "MySQL" | "Oracle" | "PostgreSQL" | "MS-Access";

interface TableStructure {
    name: string;
    columns: { name: string; type: string }[];
}

interface DatabaseStructure {
    name: string;
    type: DBType;
    tables: TableStructure[];
}

export default function Simulation() {
    const [selectedDBType, setSelectedDBType] = useState<DBType>("MySQL");
    const [database, setDatabase] = useState<DatabaseStructure | null>(null);
    const [showCreateDBModal, setShowCreateDBModal] = useState(false);
    const [showCreateTableModal, setShowCreateTableModal] = useState(false);

    // Form states
    const [dbNameInput, setDbNameInput] = useState("");
    const [tableNameInput, setTableNameInput] = useState("");
    const [tableColumnsInput, setTableColumnsInput] = useState(""); // Simplified: comma separated for now

    const handleCreateDB = () => {
        if (!dbNameInput.trim()) return;
        setDatabase({
            name: dbNameInput,
            type: selectedDBType,
            tables: []
        });
        setDbNameInput("");
        setShowCreateDBModal(false);
    };

    const handleCreateTable = () => {
        if (!database || !tableNameInput.trim()) return;

        // Parse columns from simple text for simulation
        const columns = tableColumnsInput.split(',').map(c => {
            const parts = c.trim().split(' ');
            return { name: parts[0] || "col", type: parts[1] || "VARCHAR" };
        });

        const newTable: TableStructure = {
            name: tableNameInput,
            columns: columns.length > 0 && columns[0].name !== "" ? columns : [{ name: "id", type: "INT" }]
        };

        setDatabase({
            ...database,
            tables: [...database.tables, newTable]
        });

        setTableNameInput("");
        setTableColumnsInput("");
        setShowCreateTableModal(false);
    };

    const handleReset = () => {
        setDatabase(null);
        setDbNameInput("");
        setTableNameInput("");
        setTableColumnsInput("");
    };

    return (
        <div className="flex h-full flex-col md:flex-row bg-gray-50 h-[calc(100vh-140px)]">
            {/* Control Panel */}
            <div className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0 z-10 shadow-sm">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Configuration</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Database Environment</label>
                    <select
                        value={selectedDBType}
                        onChange={(e) => setSelectedDBType(e.target.value as DBType)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent outline-none bg-white font-mono text-sm"
                        disabled={!!database}
                    >
                        <option value="MySQL">MySQL</option>
                        <option value="Oracle">Oracle Database</option>
                        <option value="PostgreSQL">PostgreSQL</option>
                        <option value="MS-Access">MS Access</option>
                    </select>
                    {database && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <AlertCircle size={12} />
                            Reset to change environment
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Operations</h3>

                    <button
                        onClick={() => setShowCreateDBModal(true)}
                        disabled={!!database}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${!!database
                                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#2ecc71] hover:text-[#2ecc71] shadow-sm active:scale-95"
                            }`}
                    >
                        <span className="font-medium">Create Database</span>
                        <Database size={18} />
                    </button>

                    <button
                        onClick={() => setShowCreateTableModal(true)}
                        disabled={!database}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${!database
                                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#2ecc71] hover:text-[#2ecc71] shadow-sm active:scale-95"
                            }`}
                    >
                        <span className="font-medium">Create Table</span>
                        <TableIcon size={18} />
                    </button>

                    <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors mt-8"
                    >
                        <Trash2 size={16} />
                        Reset Simulation
                    </button>
                </div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 p-8 overflow-auto relative bg-dots-pattern">
                {!database ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Database size={64} className="mb-4 opacity-20" />
                        <p className="text-lg">No Database Created</p>
                        <p className="text-sm">Select an environment and create a database to start.</p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
                        {/* Database Container */}
                        <div className="bg-white rounded-xl border-2 border-blue-500 shadow-xl overflow-hidden mb-8">
                            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Database className="text-blue-600" size={24} />
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{database.name}</h2>
                                        <p className="text-xs text-blue-600 font-mono">[{database.type} Instance]</p>
                                    </div>
                                </div>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                                    ACTIVE
                                </span>
                            </div>

                            {/* Tables Container */}
                            <div className="p-8 min-h-[300px] bg-gray-50/50">
                                {database.tables.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                        <p className="text-gray-500 mb-2">Database is empty</p>
                                        <button
                                            onClick={() => setShowCreateTableModal(true)}
                                            className="text-blue-500 hover:underline text-sm font-medium"
                                        >
                                            + Create a table
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {database.tables.map((table, idx) => (
                                            <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="px-4 py-3 border-b border-gray-100 grid grid-flow-col justify-between items-center bg-gray-50 rounded-t-lg">
                                                    <div className="flex items-center gap-2">
                                                        <TableIcon size={16} className="text-gray-500" />
                                                        <span className="font-bold text-gray-800">{table.name}</span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <table className="w-full text-xs">
                                                        <thead>
                                                            <tr className="text-left text-gray-500">
                                                                <th className="pb-2 font-medium">Field</th>
                                                                <th className="pb-2 font-medium">Type</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-700">
                                                            {table.columns.map((col, cIdx) => (
                                                                <tr key={cIdx} className="border-t border-gray-50">
                                                                    <td className="py-1.5 font-mono">{col.name}</td>
                                                                    <td className="py-1.5 text-gray-400">{col.type}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateDBModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold mb-4">Create Database</h3>
                        <input
                            type="text"
                            placeholder="Enter Database Name (e.g. UniversityDB)"
                            value={dbNameInput}
                            onChange={(e) => setDbNameInput(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4 focus:ring-2 focus:ring-[#2ecc71] outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowCreateDBModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateDB}
                                className="px-4 py-2 bg-[#2ecc71] text-white rounded hover:bg-[#27ae60]"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateTableModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold mb-4">Create Table</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Table Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Students"
                                    value={tableNameInput}
                                    onChange={(e) => setTableNameInput(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2ecc71] outline-none"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Columns (Name Type, ...)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ID INT, Name VARCHAR"
                                    value={tableColumnsInput}
                                    onChange={(e) => setTableColumnsInput(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#2ecc71] outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Separate columns with commas.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowCreateTableModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTable}
                                className="px-4 py-2 bg-[#2ecc71] text-white rounded hover:bg-[#27ae60]"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
