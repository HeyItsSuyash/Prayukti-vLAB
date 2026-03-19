"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Info, Layers, LayoutList, RefreshCw, Table, Network, Share2, Database } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// --- Mock Data: Unified IT Consultant Schema ---
const initialDataUNF = [
    { EmpID: 101, Name: "Alice", ProjID: "P1", ProjName: "App", Role: "Dev", City: "NY", Phone: "111, 222", Skill: "Java, SQL" },
    { EmpID: 102, Name: "Bob", ProjID: "P2", ProjName: "Web", Role: "Lead", City: "SF", Phone: "333", Skill: "React" },
    { EmpID: 101, Name: "Alice", ProjID: "P2", ProjName: "Web", Role: "Dev", City: "NY", Phone: "111, 222", Skill: "Java" },
];

import { WithMode } from "@/lib/labs/modes";

interface NormalizationSimulationProps extends WithMode {
    mode?: "LEARNING" | "EXPERIMENTAL" | "EXAM";
    initialData?: any;
    readonly?: boolean;
}

export default function NormalizationSimulation({ mode = "LEARNING", initialData, readonly = false }: NormalizationSimulationProps) {
    const [isExam, setIsExam] = useState(mode === "EXAM");

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search.includes('mode=exam')) {
            setIsExam(true);
        }
    }, []);

    const [step, setStep] = useState<number>(initialData?.step || 0);
    const [logs, setLogs] = useState<string[]>(initialData?.logs || ["Simulation Initialized. Table is in Unnormalized Form (UNF)."]);
    const [showTheory, setShowTheory] = useState<boolean>(true);
    const [feedback, setFeedback] = useState("");

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev]);

    // --- Renderers ---

    // Step 0: Unnormalized Form
    const renderUNF = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2"><Table size={18} /> Unnormalized Form (UNF)</h3>
                <p className="text-sm text-red-700 mb-4">
                    <strong>Context:</strong> IT Consultants assigned to Projects, using specific Skills.
                    <br />
                    <strong>Issue:</strong> Repeating Groups. Note that Alice (101) has multiple Phones and uses multiple Skills on Project P1.
                </p>

                <div className="bg-white border rounded overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-red-100 text-red-900 font-bold">
                            <tr>
                                <th className="p-3 border">EmpID</th>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Phone</th>
                                <th className="p-3 border">ProjID</th>
                                <th className="p-3 border">ProjName</th>
                                <th className="p-3 border">Role</th>
                                <th className="p-3 border">City</th>
                                <th className="p-3 border">Skill</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialDataUNF.map((row, i) => (
                                <tr key={i} className="hover:bg-red-50">
                                    <td className="p-3 border">{row.EmpID}</td>
                                    <td className="p-3 border">{row.Name}</td>
                                    <td className="p-3 border font-mono text-red-600 font-bold">{row.Phone}</td>
                                    <td className="p-3 border">{row.ProjID}</td>
                                    <td className="p-3 border">{row.ProjName}</td>
                                    <td className="p-3 border">{row.Role}</td>
                                    <td className="p-3 border">{row.City}</td>
                                    <td className="p-3 border font-mono text-red-600 font-bold">{row.Skill}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-4 border rounded-lg shadow-sm">
                <h4 className="font-bold text-gray-800 mb-2">Module 1: Functional Dependency Analysis</h4>
                <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 border rounded">
                        <strong>Identified Dependencies:</strong>
                        <ul className="list-disc ml-5 mt-1 space-y-1 text-gray-600">
                            <li><strong>FD:</strong> EmpID &rarr; Name</li>
                            <li><strong>FD:</strong> ProjID &rarr; ProjName</li>
                            <li><strong>FD:</strong> Role &rarr; City (Assumed: Role implies base location)</li>
                            <li><strong>MVD:</strong> EmpID &rarr;&rarr; Phone</li>
                            <li><strong>MVD:</strong> (EmpID, ProjID) &rarr;&rarr; Skill</li>
                        </ul>
                    </div>
                </div>
            </div>

            {!readonly && (
                <div className="flex justify-end">
                    <Button onClick={() => { setStep(1); addLog("Applied 1NF: Flattened repeating groups."); }} className="bg-[#f57f17] hover:bg-orange-700">
                        Next: Normalize to 1NF <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );

    // Step 1: 1NF
    const render1NF = () => {
        // Flattened Data
        // 101 | Alice | 111 | P1 | App | Dev | NY | Java
        // 101 | Alice | 111 | P1 | App | Dev | NY | SQL
        // ... (Cross product of Phones and Skills)
        const data1NF = [
            { id: 101, n: "Alice", ph: "111", pid: "P1", pn: "App", r: "Dev", c: "NY", s: "Java" },
            { id: 101, n: "Alice", ph: "222", pid: "P1", pn: "App", r: "Dev", c: "NY", s: "Java" },
            { id: 101, n: "Alice", ph: "111", pid: "P1", pn: "App", r: "Dev", c: "NY", s: "SQL" },
            { id: 101, n: "Alice", ph: "222", pid: "P1", pn: "App", r: "Dev", c: "NY", s: "SQL" },
            { id: 102, n: "Bob", ph: "333", pid: "P2", pn: "Web", r: "Lead", c: "SF", s: "React" },
        ];

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><LayoutList size={18} /> First Normal Form (1NF)</h3>
                    <p className="text-sm text-blue-700 mb-4">
                        <strong>Status:</strong> Atomic Values.
                        <br />
                        <strong>Issue:</strong> Massive Redundancy! Alice's data repeated 4 times due to Phone x Skill combinations.
                    </p>

                    <div className="bg-white border rounded overflow-hidden max-h-60 overflow-y-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-blue-100 text-blue-900 font-bold sticky top-0">
                                <tr>
                                    <th className="p-2 border">EmpID</th>
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">Phone</th>
                                    <th className="p-2 border">ProjID</th>
                                    <th className="p-2 border">ProjName</th>
                                    <th className="p-2 border">Role</th>
                                    <th className="p-2 border">City</th>
                                    <th className="p-2 border">Skill</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data1NF.map((row, i) => (
                                    <tr key={i} className="hover:bg-blue-50">
                                        <td className="p-2 border">{row.id}</td>
                                        <td className="p-2 border">{row.n}</td>
                                        <td className="p-2 border">{row.ph}</td>
                                        <td className="p-2 border">{row.pid}</td>
                                        <td className="p-2 border">{row.pn}</td>
                                        <td className="p-2 border">{row.r}</td>
                                        <td className="p-2 border">{row.c}</td>
                                        <td className="p-2 border">{row.s}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-orange-50 p-4 border border-orange-200 rounded-lg shadow-sm">
                    <h4 className="font-bold text-orange-800 mb-2">Module 2: 2NF Analysis</h4>
                    <p className="text-sm text-orange-800 mb-2">
                        <strong>Composite Key:</strong> (EmpID, ProjID, Phone, Skill) - Complex!
                    </p>
                    <ul className="list-disc ml-5 text-sm text-orange-800 space-y-1">
                        <li><strong>Partial Dep:</strong> EmpID &rarr; Name</li>
                        <li><strong>Partial Dep:</strong> ProjID &rarr; ProjName</li>
                        <li><strong>Action:</strong> Extract Master Tables.</li>
                    </ul>
                </div>

                {!readonly && (
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft size={16} className="mr-2" /> Back</Button>
                        <Button onClick={() => { setStep(2); addLog("Applied 2NF: Extracted Employee & Project Tables."); }} className="bg-[#f57f17] hover:bg-orange-700">
                            Decompose to 2NF <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    // Step 2: 2NF
    const render2NF = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2"><Layers size={18} /> Second Normal Form (2NF)</h3>
                <p className="text-sm text-green-700 mb-4">
                    Partial dependencies removed. Logic remains consistent: Alice is still Employee 101, Project P1 is App.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Table 1 */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Employee Master</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-100"><tr><th className="p-1 border">EmpID</th><th className="p-1 border">Name</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">Alice</td></tr>
                                <tr><td className="p-1 border">102</td><td className="p-1 border">Bob</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Table 2 */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Project Master</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-100"><tr><th className="p-1 border">ProjID</th><th className="p-1 border">Name</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">P1</td><td className="p-1 border">App</td></tr>
                                <tr><td className="p-1 border">P2</td><td className="p-1 border">Web</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Table 3 */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Assignment (Remaining)</h5>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left bg-red-50">
                                <thead className="bg-gray-100"><tr><th className="p-1 border">Emp</th><th className="p-1 border">Ph%</th><th className="p-1 border">Proj</th><th className="p-1 border">Role</th><th className="p-1 border">City</th><th className="p-1 border">Skill</th></tr></thead>
                                <tbody>
                                    <tr><td className="p-1 border">101</td><td className="p-1 border">111</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">NY</td><td className="p-1 border">Java</td></tr>
                                    <tr><td className="p-1 border">101</td><td className="p-1 border">111</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">NY</td><td className="p-1 border">SQL</td></tr>
                                    <tr><td className="p-1 border">101</td><td className="p-1 border">222</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">NY</td><td className="p-1 border">Java</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-purple-50 p-4 border border-purple-200 rounded-lg shadow-sm">
                <h4 className="font-bold text-purple-800 mb-2">Module 3: 3NF (Transitive) Analysis</h4>
                <ul className="list-disc ml-5 text-sm text-purple-800 space-y-1">
                    <li><strong>Transitive Dep:</strong> Role &rarr; City. (Assuming 'Dev' implies 'NY' location for this Org).</li>
                    <li><strong>Action:</strong> Extract Role_Location table.</li>
                </ul>
            </div>

            {!readonly && (
                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft size={16} className="mr-2" /> Back</Button>
                    <Button onClick={() => { setStep(3); addLog("Applied 3NF: Extracted Role Location."); }} className="bg-[#f57f17] hover:bg-orange-700">
                        Decompose to 3NF <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );

    // Step 3: 3NF
    const render3NF = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-pink-50 border border-pink-200 p-4 rounded-lg">
                <h3 className="font-bold text-pink-800 mb-2 flex items-center gap-2"><Network size={18} /> Third Normal Form (3NF)</h3>
                <p className="text-sm text-pink-700 mb-4">
                    Transitive dependencies removed. Data integrity improved.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Table Role */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Role_Location</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-pink-100"><tr><th className="p-1 border">Role</th><th className="p-1 border">City</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">Dev</td><td className="p-1 border">NY</td></tr>
                                <tr><td className="p-1 border">Lead</td><td className="p-1 border">SF</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Assignment Table */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Assignment (Still Redundant!)</h5>
                        <table className="w-full text-xs text-left bg-red-50">
                            <thead className="bg-pink-100">
                                <tr><th className="p-1 border">Emp</th><th className="p-1 border">Phone</th><th className="p-1 border">Proj</th><th className="p-1 border">Role</th><th className="p-1 border">Skill</th></tr>
                            </thead>
                            <tbody>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">111</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">Java</td></tr>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">222</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">Java</td></tr>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">111</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">SQL</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-teal-50 p-4 border border-teal-200 rounded-lg shadow-sm">
                <h4 className="font-bold text-teal-800 mb-2">Module 4: 4NF (MVD) Analysis</h4>
                <ul className="list-disc ml-5 text-sm text-teal-800 space-y-1">
                    <li><strong>MVD:</strong> Emp ID has Phones {`{111, 222}`}.</li>
                    <li><strong>MVD:</strong> Emp ID has Assignments (Proj P1, Skill Java).</li>
                    <li>These are independent! `Emp -&gt;&gt; Phone` vs `Emp -&gt;&gt; (Proj, Skill)`.</li>
                    <li><strong>Action:</strong> Isolate Phone numbers.</li>
                </ul>
            </div>

            {!readonly && (
                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft size={16} className="mr-2" /> Back</Button>
                    <Button onClick={() => { setStep(4); addLog("Applied 4NF: Separated Phones from Assignments."); }} className="bg-[#f57f17] hover:bg-orange-700">
                        Decompose to 4NF <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );

    // Step 4: 4NF
    const render4NF = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                <h3 className="font-bold text-teal-800 mb-2 flex items-center gap-2"><Network size={18} /> Fourth Normal Form (4NF)</h3>
                <p className="text-sm text-teal-700 mb-4">
                    MVDs Removed.
                    We have `Emp_Phone` and `Project_Allocation` separated.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Table 1: Emp_Phone */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Emp_Phone</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-teal-100"><tr><th className="p-1 border">EmpID</th><th className="p-1 border">Phone</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">111</td></tr>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">222</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Table 2: Project_Allocation */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Proj_Allocation (Emp, Proj, Role, Skill)</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-teal-100"><tr><th className="p-1 border">Emp</th><th className="p-1 border">Proj</th><th className="p-1 border">Role</th><th className="p-1 border">Skill</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">Java</td></tr>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">P1</td><td className="p-1 border">Dev</td><td className="p-1 border">SQL</td></tr>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">P2</td><td className="p-1 border">Dev</td><td className="p-1 border">Java</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 p-4 border border-indigo-200 rounded-lg shadow-sm">
                <h4 className="font-bold text-indigo-800 mb-2">Module 5: 5NF (Join Dependency) Analysis</h4>
                <p className="text-sm text-indigo-800 mb-2">
                    Look at `Proj_Allocation`:
                    <br />
                    1. Alice (101) knows <strong>Java</strong>.
                    <br />
                    2. Alice works on <strong>P1</strong>.
                    <br />
                    3. <strong>P1</strong> uses <strong>Java</strong>.
                    <br />
                    Is the relationship `(Emp, Proj, Skill)` capable of being decomposed?
                    If Alice works on P1, and Alice knows Java, and P1 uses Java... does she <strong>necessarily</strong> use Java on P1?
                    If YES, then we have a Join Dependency and we SHOULD decompose to avoid redundancy.
                </p>
            </div>

            {!readonly && (
                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft size={16} className="mr-2" /> Back</Button>
                    <Button onClick={() => { setStep(5); addLog("Applying 5NF: Decomposing Ternary Relationship."); }} className="bg-[#f57f17] hover:bg-orange-700">
                        Decompose to 5NF <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );

    // Step 5: 5NF Analysis
    const render5NF = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2"><Share2 size={18} /> Fifth Normal Form (5NF)</h3>
                <p className="text-sm text-indigo-700 mb-4">
                    <strong>Logic:</strong> We assume validity of the ternary rule (If Emp knows Skill, and Proj needs Skill, and Emp on Proj -&gt; Emp uses Skill on Proj).
                    <br />
                    We decompose `Proj_Allocation` into 3 smaller tables.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Table Emp_Skill */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Emp_Skill (Who knows what)</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-indigo-100"><tr><th className="p-1 border">Emp</th><th className="p-1 border">Skill</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">Java</td></tr>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">SQL</td></tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Table Proj_Skill */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Proj_Skill (What Proj needs)</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-indigo-100"><tr><th className="p-1 border">Proj</th><th className="p-1 border">Skill</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">P1</td><td className="p-1 border">Java</td></tr>
                                <tr><td className="p-1 border">P1</td><td className="p-1 border">SQL</td></tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Table Emp_Proj */}
                    <div className="bg-white border rounded p-2">
                        <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">Emp_Proj (Who is on what)</h5>
                        <table className="w-full text-xs text-left">
                            <thead className="bg-indigo-100"><tr><th className="p-1 border">Emp</th><th className="p-1 border">Proj</th></tr></thead>
                            <tbody>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">P1</td></tr>
                                <tr><td className="p-1 border">101</td><td className="p-1 border">P2</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 p-2 bg-white rounded border text-xs text-gray-600">
                    <strong>Observation:</strong>
                    By storing these 3 simple tables, we avoid listing every combination in the `Proj_Allocation` table.
                    Adding a new skill "Python" for Alice (101) only requires adding 1 row to `Emp_Skill`, instead of adding rows for every Project she is on.
                </div>
            </div>

            <div className="bg-gray-800 text-white p-6 rounded-lg text-center">
                <h2 className="text-2xl font-bold mb-2">Normalization Steps Complete!</h2>
                <p className="text-gray-400 mb-6">Same table context maintained from 1NF to 5NF.</p>
                {!readonly && (
                    <Button onClick={() => { setStep(0); setLogs(["Reset Experiment."]); }} variant="outline" className="text-black border-white hover:bg-gray-100">
                        <RefreshCw size={16} className="mr-2" /> Restart Experiment
                    </Button>
                )}
            </div>

            {!readonly && (
                <div className="flex justify-start">
                    <Button variant="outline" onClick={() => setStep(4)}><ArrowLeft size={16} className="mr-2" /> Back</Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex h-screen flex-col bg-gray-50 font-sans overflow-hidden">
            <header className="bg-white border-b shadow-sm z-10 p-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/dbms" className="p-2 hover:bg-gray-100 rounded-full"> <ArrowLeft size={18} className="text-gray-600" /> </Link>
                    <h1 className="font-bold text-gray-800">Experiment 4: Normalization Analysis</h1>
                </div>
                <div className="flex items-center gap-2">
                    {feedback && <span className="text-xs text-green-600 font-medium mr-2">{feedback}</span>}
                    {isExam && !readonly && (
                        <Button onClick={() => {
                            window.parent.postMessage({ type: 'SAVE_EXAM_STATE', payload: { type: 'DBMS_NORMALIZATION', step, logs } }, '*');
                            setFeedback("Progress saved successfully!");
                            setTimeout(() => setFeedback(""), 3000);
                        }} size="sm" variant="outline" className="h-8 text-xs text-blue-600 border-blue-600/20 hover:bg-blue-50">
                            SAVE PROGRESS
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setShowTheory(!showTheory)} className={showTheory ? "bg-blue-50 text-blue-600" : ""}>
                        <Info size={16} className="mr-2" /> Concepts
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <main className="flex-1 overflow-auto p-6 bg-dots-pattern">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Stage {step + 1}: {["UNF Analysis", "First Normal Form", "Second Normal Form", "Third Normal Form", "Fourth Normal Form", "Fifth Normal Form"][step] || "Complete"}
                                </h2>
                                <p className="text-gray-500 text-sm">Unified Schema Normalization (1NF - 5NF)</p>
                            </div>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4, 5].map(s => (
                                    <div key={s} className={`h-2 w-12 rounded-full transition-colors ${step >= s ? "bg-[#f57f17]" : "bg-gray-200"}`} />
                                ))}
                            </div>
                        </div>

                        {errorComponent ? errorComponent : (
                            <>
                                {step === 0 && renderUNF()}
                                {step === 1 && render1NF()}
                                {step === 2 && render2NF()}
                                {step === 3 && render3NF()}
                                {step === 4 && render4NF()}
                                {step === 5 && render5NF()}
                            </>
                        )}
                    </div>
                </main>

                {/* Sidebar Log */}
                <aside className="w-80 bg-white border-l flex flex-col shrink-0">
                    <div className="p-4 border-b bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
                        <LayoutList size={16} /> Activity Log
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {logs.map((log, i) => (
                            <div key={i} className="text-xs text-gray-600 border-l-2 border-orange-400 pl-2 py-1">
                                {log}
                            </div>
                        ))}
                    </div>
                    {showTheory && (
                        <div className="h-2/5 border-t overflow-y-auto p-4 bg-blue-50">
                            <h4 className="font-bold text-blue-800 text-xs uppercase mb-2">Definitions</h4>
                            <div className="text-xs text-blue-900 space-y-2">
                                <p><strong>1NF:</strong> Atomic values.</p>
                                <p><strong>2NF:</strong> No Partial Dependencies.</p>
                                <p><strong>3NF:</strong> No Transitive Dependencies.</p>
                                <p><strong>4NF:</strong> No Multi-valued Dependencies (MVD).</p>
                                <p><strong>5NF:</strong> No Join Dependencies (JD).</p>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

// Helper
const errorComponent = null;
