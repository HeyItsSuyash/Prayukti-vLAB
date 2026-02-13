"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Database, Table as TableIcon, Trash2, Terminal, Play, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

type DBType = "MySQL" | "Oracle" | "PostgreSQL" | "MS-Access";

interface TableStructure {
    name: string;
    columns: { name: string; type: string }[];
    records: Record<string, string>[];
}

interface DatabaseStructure {
    name: string;
    type: DBType;
    tables: TableStructure[];
}

interface QueryLog {
    id: number;
    timestamp: string;
    query: string;
    type: "CREATE" | "INSERT" | "UPDATE" | "DELETE" | "ERROR" | "INFO";
}

import { WithMode } from "@/lib/labs/modes";

interface BasicOperationsSimulationProps extends WithMode {
    mode?: "LEARNING" | "EXPERIMENTAL" | "EXAM";
}

export default function BasicOperationsSimulation({ mode = "LEARNING" }: BasicOperationsSimulationProps) {
    const isExam = mode === "EXAM";

    // State
    const [selectedDBType, setSelectedDBType] = useState<DBType>("MySQL");
    const [database, setDatabase] = useState<DatabaseStructure | null>(null);
    const [queryLogs, setQueryLogs] = useState<QueryLog[]>([]);
    const [sqlQuery, setSqlQuery] = useState("");

    // Modals/Input State
    const [showCreateDBModal, setShowCreateDBModal] = useState(false);
    const [showCreateTableModal, setShowCreateTableModal] = useState(false);
    const [showInsertModal, setShowInsertModal] = useState(false);
    const [activeTableIndex, setActiveTableIndex] = useState<number>(-1);
    const [editingRecordIndex, setEditingRecordIndex] = useState<number | null>(null);

    // Form Inputs
    const [dbNameInput, setDbNameInput] = useState("");
    const [tableNameInput, setTableNameInput] = useState("");
    const [tableColumnsInput, setTableColumnsInput] = useState("");
    const [recordInput, setRecordInput] = useState<Record<string, string>>({});

    const addLog = (query: string, type: QueryLog["type"]) => {
        const newLog: QueryLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            query,
            type
        };
        setQueryLogs(prev => [newLog, ...prev]);
    };

    // -- SQL Execution Logic (Console) --
    const executeSQL = () => {
        const query = sqlQuery.trim();
        if (!query) return;

        addLog(`EXECUTE: ${query}`, "INFO");
        const lowerQuery = query.toLowerCase();

        try {
            if (lowerQuery.startsWith("create database")) {
                const match = query.match(/create database\s+(\w+)/i);
                if (match) {
                    const dbName = match[1];
                    setDatabase({ name: dbName, type: selectedDBType, tables: [] });
                    addLog(`CREATE DATABASE ${dbName};`, "CREATE");
                }
            }
            else if (lowerQuery.startsWith("create table")) {
                if (!database) throw new Error("No database active.");
                const match = query.match(/create table\s+(\w+)\s*\((.+)\)/i);
                if (!match) throw new Error("Invalid syntax.");

                const tableName = match[1];
                const columns = match[2].split(',').map(c => {
                    const parts = c.trim().split(/\s+/);
                    return { name: parts[0], type: parts.slice(1).join(" ") || "VARCHAR" };
                });

                const newTable: TableStructure = { name: tableName, columns, records: [] };
                setDatabase({ ...database, tables: [...database.tables, newTable] });
                addLog(`CREATE TABLE ${tableName} ...;`, "CREATE");
            }
            else if (lowerQuery.startsWith("insert into")) {
                if (!database) throw new Error("No database active.");
                const match = query.match(/insert into\s+(\w+)\s+values\s*\((.+)\)/i);
                if (!match) throw new Error("Invalid syntax.");

                const tableName = match[1];
                const values = match[2].split(',').map(v => v.trim().replace(/^'|'$/g, ''));

                const tableIdx = database.tables.findIndex(t => t.name === tableName);
                if (tableIdx === -1) throw new Error("Table not found.");

                const table = database.tables[tableIdx];
                if (values.length !== table.columns.length) throw new Error("Column count mismatch.");

                const newRecord: Record<string, string> = {};
                table.columns.forEach((col, idx) => { newRecord[col.name] = values[idx]; });

                const updatedTables = [...database.tables];
                updatedTables[tableIdx].records.push(newRecord);
                setDatabase({ ...database, tables: updatedTables });
                addLog(`INSERT INTO ${tableName} ...;`, "INSERT");
            }
            else {
                addLog("Command not supported in console. Use standard CREATE/INSERT.", "ERROR");
            }
        } catch (e: any) {
            addLog(`Error: ${e.message}`, "ERROR");
        }
        setSqlQuery("");
    };

    // -- CRUD Operations --
    const handleDeleteRecord = (tableIndex: number, recordIndex: number) => {
        if (!database) return;
        if (!confirm("Are you sure you want to delete this record?")) return;

        const updatedTables = [...database.tables];
        const tableName = updatedTables[tableIndex].name;
        updatedTables[tableIndex].records = updatedTables[tableIndex].records.filter((_, idx) => idx !== recordIndex);

        setDatabase({ ...database, tables: updatedTables });
        addLog(`DELETE FROM ${tableName} WHERE ... (Row ${recordIndex + 1});`, "DELETE");
    };

    const handleEditRecordStart = (tableIndex: number, recordIndex: number, record: Record<string, string>) => {
        setActiveTableIndex(tableIndex);
        setEditingRecordIndex(recordIndex);
        setRecordInput({ ...record });
        setShowInsertModal(true);
    };

    const handleSaveRecord = () => {
        if (!database || activeTableIndex === -1) return;
        const table = database.tables[activeTableIndex];
        const updatedTables = [...database.tables];

        if (editingRecordIndex !== null) {
            // Update existing
            const cols = Object.keys(recordInput).join(", ");
            const vals = Object.values(recordInput).map(v => `'${v}'`).join(", ");
            const query = `UPDATE ${table.name} SET (${cols}) = (${vals}) WHERE ...;`;

            updatedTables[activeTableIndex].records[editingRecordIndex] = recordInput;
            addLog(query, "UPDATE");
        } else {
            // Insert new
            const cols = Object.keys(recordInput).join(", ");
            const vals = Object.values(recordInput).map(v => `'${v}'`).join(", ");
            const query = `INSERT INTO ${table.name} (${cols}) VALUES (${vals});`;

            updatedTables[activeTableIndex].records.push(recordInput);
            addLog(query, "INSERT");
        }

        setDatabase({ ...database, tables: updatedTables });
        setRecordInput({});
        setEditingRecordIndex(null);
        setShowInsertModal(false);
    };


    const handleCreateDB = () => {
        if (!dbNameInput.trim()) return;
        setDatabase({ name: dbNameInput, type: selectedDBType, tables: [] });
        addLog(`CREATE DATABASE ${dbNameInput};`, "CREATE");
        setDbNameInput("");
        setShowCreateDBModal(false);
    };

    const handleCreateTable = () => {
        if (!database || !tableNameInput.trim()) return;
        const columns = tableColumnsInput.split(',').map(c => {
            const parts = c.trim().split(/\s+/);
            return { name: parts[0], type: parts[1] || "VARCHAR" };
        });
        const colDef = columns.map(c => `${c.name} ${c.type}`).join(", ");
        const newTable = { name: tableNameInput, columns, records: [] };
        setDatabase({ ...database, tables: [...database.tables, newTable] });
        addLog(`CREATE TABLE ${tableNameInput} (${colDef});`, "CREATE");
        setTableNameInput("");
        setTableColumnsInput("");
        setShowCreateTableModal(false);
    };

    const handleReset = () => {
        setDatabase(null);
        setQueryLogs([]);
        setDbNameInput("");
        setActiveTableIndex(-1);
    };

    return (
        <div className="flex h-screen flex-col bg-gray-100 font-sans overflow-hidden">
            <header className="bg-white border-b shadow-sm z-10 p-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/dbms/1" className="p-2 hover:bg-gray-100 rounded-full"> <ArrowLeft size={18} className="text-gray-600" /> </Link>
                    <h1 className="font-bold text-gray-800">Basic Operations Simulator</h1>
                    <span className="bg-[#f57f17]/10 text-[#f57f17] text-xs px-2 py-1 rounded font-medium border border-[#f57f17]/20">{selectedDBType} Mode</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-600 hover:bg-red-50"> <Trash2 size={14} className="mr-1" /> Reset </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 bg-gray-50 p-6 overflow-auto relative bg-dots-pattern">
                    {!database ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4"> <Database size={48} className="text-[#f57f17]" /> </div>
                            <h2 className="text-xl font-semibold text-gray-600">No Database Active</h2>
                            <div className="flex gap-4">
                                <select
                                    value={selectedDBType}
                                    onChange={(e) => setSelectedDBType(e.target.value as DBType)}
                                    className="p-2 bg-white border rounded-md shadow-sm text-sm outline-none focus:ring-2 focus:ring-[#f57f17]"
                                >
                                    <option value="MySQL">MySQL</option>
                                    <option value="Oracle">Oracle</option>
                                    <option value="PostgreSQL">PostgreSQL</option>
                                    <option value="MS-Access">MS Access</option>
                                </select>
                                <Button onClick={() => setShowCreateDBModal(true)} className="bg-[#d32f2f] hover:bg-[#b71c1c]"> Initialize Database </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="bg-white rounded-xl border-t-4 border-blue-500 shadow-lg overflow-hidden">
                                <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                                    <div className="flex items-center gap-2"> <Database className="text-blue-600" size={20} /> <span className="font-bold text-lg text-blue-900">{database.name}</span> </div>
                                    <Button size="sm" onClick={() => setShowCreateTableModal(true)} className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"> <Plus size={14} className="mr-1" /> Create Table </Button>
                                </div>
                                <div className="p-6 bg-gray-50/50 min-h-[200px]">
                                    {database.tables.length === 0 ? <div className="text-center text-gray-400 py-8 italic">No tables created yet.</div> : (
                                        <div className="grid grid-cols-1 gap-6">
                                            {database.tables.map((table, tIdx) => (
                                                <div key={tIdx} className="bg-white rounded border shadow-sm">
                                                    <div className="px-4 py-2 border-b bg-gray-50 flex justify-between items-center">
                                                        <div className="flex items-center gap-2 font-mono text-sm font-bold text-gray-700"> <TableIcon size={14} /> {table.name} </div>
                                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setActiveTableIndex(tIdx); setEditingRecordIndex(null); setRecordInput({}); setShowInsertModal(true); }}> <Plus size={14} className="text-green-600" /> </Button>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs">
                                                            <thead className="bg-gray-50 text-gray-500">
                                                                <tr>
                                                                    {table.columns.map(c => <th key={c.name} className="px-3 py-2 text-left border-r last:border-r-0 font-medium">{c.name} <span className="text-[10px] text-gray-400">({c.type})</span></th>)}
                                                                    <th className="px-3 py-2 text-right">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y">
                                                                {table.records.map((rec, rIdx) => (
                                                                    <tr key={rIdx} className="hover:bg-blue-50/50 group">
                                                                        {table.columns.map(c => <td key={c.name} className="px-3 py-2 border-r last:border-r-0 text-gray-700">{rec[c.name] || "NULL"}</td>)}
                                                                        <td className="px-3 py-2 text-right flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <button onClick={() => handleEditRecordStart(tIdx, rIdx, rec)} className="p-1 hover:bg-gray-200 rounded text-blue-600"><Edit size={12} /></button>
                                                                            <button onClick={() => handleDeleteRecord(tIdx, rIdx)} className="p-1 hover:bg-red-100 rounded text-red-600"><Trash2 size={12} /></button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                {table.records.length === 0 && <tr><td colSpan={table.columns.length + 1} className="px-3 py-4 text-center text-gray-400 italic">Empty Table</td></tr>}
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
                </main>

                <aside className="w-96 bg-[#1e1e1e] border-l border-gray-700 flex flex-col shrink-0">
                    <div className="flex-1 flex flex-col border-b border-gray-700">
                        <div className="p-3 bg-[#252526] border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2"> <Terminal size={14} className="text-green-400" /> <span className="text-xs font-mono font-bold text-gray-300">SQL Console</span> </div>
                        </div>
                        <div className="flex-1 bg-[#1e1e1e] p-3">
                            <textarea value={sqlQuery} onChange={(e) => setSqlQuery(e.target.value)} placeholder="Type Create/Insert commands here..." className="w-full h-full bg-transparent text-green-400 font-mono text-xs outline-none resize-none placeholder-gray-600" />
                        </div>
                        <div className="bg-[#2d2d2d] p-2 flex justify-end">
                            <Button size="sm" onClick={executeSQL} className="bg-green-700 hover:bg-green-800 text-white text-xs h-7"> <Play size={12} className="mr-1" /> Execute </Button>
                        </div>
                    </div>
                    <div className="h-1/3 flex flex-col border-t-2 border-gray-800 text-gray-300 font-mono text-xs">
                        <div className="p-2 bg-[#252526] border-b border-black flex items-center gap-2"> <span className="font-mono font-bold text-[10px] text-gray-400 uppercase">Activity Log</span> </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px]">
                            {queryLogs.map((log) => (
                                <div key={log.id} className="animate-in slide-in-from-right-5 fade-in duration-300 text-gray-400 border-l border-gray-600 pl-2 leading-tight">
                                    <span className={log.type === "ERROR" ? "text-red-400" : "text-gray-300"}>{log.query}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Modals */}
            {showCreateDBModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Create Database</h3>
                        <input type="text" placeholder="Database Name" value={dbNameInput} onChange={(e) => setDbNameInput(e.target.value)} className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-[#f57f17] outline-none" />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setShowCreateDBModal(false)}>Cancel</Button>
                            <Button className="bg-[#d32f2f]" onClick={handleCreateDB}>Create</Button>
                        </div>
                    </div>
                </div>
            )}
            {showCreateTableModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-2">Create Table</h3>
                        <p className="text-xs text-gray-500 mb-4">In database: {database?.name}</p>
                        <div className="space-y-4">
                            <input type="text" placeholder="Table Name" value={tableNameInput} onChange={(e) => setTableNameInput(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#f57f17] outline-none" />
                            <input type="text" placeholder="Columns: id INT, name VARCHAR..." value={tableColumnsInput} onChange={(e) => setTableColumnsInput(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#f57f17] outline-none" />
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="ghost" onClick={() => setShowCreateTableModal(false)}>Cancel</Button>
                            <Button className="bg-[#d32f2f]" onClick={handleCreateTable}>Execute</Button>
                        </div>
                    </div>
                </div>
            )}
            {showInsertModal && activeTableIndex !== -1 && database && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-2">{editingRecordIndex !== null ? "Edit Record" : "Insert Record"}</h3>
                        <p className="text-xs text-gray-500 mb-4">Table: {database.tables[activeTableIndex].name}</p>
                        <div className="space-y-3">
                            {database.tables[activeTableIndex].columns.map(col => (
                                <div key={col.name}>
                                    <label className="text-xs font-bold text-gray-500 uppercase">{col.name}</label>
                                    <input type="text" placeholder={`Value for ${col.type}`} value={recordInput[col.name] || ""} onChange={(e) => setRecordInput({ ...recordInput, [col.name]: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#f57f17] outline-none" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="ghost" onClick={() => { setShowInsertModal(false); setRecordInput({}); setEditingRecordIndex(null); }}>Cancel</Button>
                            <Button className="bg-[#f57f17]" onClick={handleSaveRecord}>{editingRecordIndex !== null ? "Update" : "Insert"}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
