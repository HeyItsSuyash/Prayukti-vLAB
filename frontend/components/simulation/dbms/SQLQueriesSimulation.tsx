"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calculator, Database, FileText, Layers, Play, Settings, Table, Terminal, Activity, Info, Code, Plus, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Types ---
type ModuleId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Student { rollNo: number; name: string; dept: string; marks: number; }
interface Course { courseId: string; courseName: string; dept: string; }
interface Enrollment { rollNo: number; courseId: string; }
interface ViewObject { name: string; cutoff: number; }
interface TriggerObject { name: string; type: string; table: string; status: "Active" | "Inactive"; }

// --- Predefined Data ---
const initialStudents: Student[] = [
    { rollNo: 101, name: "Aarav", dept: "CSE", marks: 85 },
    { rollNo: 102, name: "Vivaan", dept: "ECE", marks: 72 },
    { rollNo: 103, name: "Aditya", dept: "CSE", marks: 90 },
    { rollNo: 104, name: "Vihaan", dept: "ME", marks: 65 },
    { rollNo: 105, name: "Arjun", dept: "CSE", marks: 88 },
];

const initialCourses: Course[] = [
    { courseId: "CS101", courseName: "DBMS", dept: "CSE" },
    { courseId: "EC201", courseName: "Basic Electronics", dept: "ECE" },
    { courseId: "ME301", courseName: "Thermodynamics", dept: "ME" },
    { courseId: "CS102", courseName: "Data Structures", dept: "CSE" },
];

const initialEnrollments: Enrollment[] = [
    { rollNo: 101, courseId: "CS101" },
    { rollNo: 101, courseId: "CS102" },
    { rollNo: 102, courseId: "EC201" },
    { rollNo: 103, courseId: "CS101" },
    { rollNo: 106, courseId: "ME301" }, // Extra enrollment for Right Join demo (assuming student 106 might not exist in initial list unless added)
];

import { WithMode } from "@/lib/labs/modes";

interface SQLQueriesSimulationProps extends WithMode {
    mode?: "LEARNING" | "EXPERIMENTAL" | "EXAM";
}

export default function SQLQueriesSimulation({ mode = "LEARNING" }: SQLQueriesSimulationProps) {
    const isExam = mode === "EXAM";

    const [activeModule, setActiveModule] = useState<ModuleId>(1);
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [courses] = useState<Course[]>(initialCourses);
    const [enrollments] = useState<Enrollment[]>(initialEnrollments);

    // -- Module State --

    // Mod 1: Logical
    const [mod1Filter, setMod1Filter] = useState("ALL"); // ALL, CSE, MARKS_GT_80, LIKE_A, BETWEEN
    const [mod1CustomQuery, setMod1CustomQuery] = useState(""); // For "Live" execution

    // Mod 2: Functions
    const [mod2Func, setMod2Func] = useState("COUNT");
    const [mod2Result, setMod2Result] = useState<any>(null);

    // Module 3 State (Dynamic)
    const [mod3Selection, setMod3Selection] = useState<{ type: 'DEPT' | 'MARKS' | 'ALL', value: string | number }>({ type: 'DEPT', value: 'CSE' });
    const [mod3ProjectionColumns, setMod3ProjectionColumns] = useState<string[]>(["name", "marks"]); // Default columns for Projection

    // Module 4 State
    const [joinType, setJoinType] = useState("LEFT");

    // Module 5 State
    const [cutoff, setCutoff] = useState("85");

    // Mod 6: PL/SQL
    const [plsqlCode, setPlsqlCode] = useState("DECLARE\n  v_msg VARCHAR(50);\nBEGIN\n  v_msg := 'Hello PL/SQL';\n  DBMS_OUTPUT.PUT_LINE(v_msg);\nEND;");
    const [plsqlOutput, setPlsqlOutput] = useState("");

    // Mod 7: Transactions
    const [mod7TxStatus, setMod7TxStatus] = useState<"IDLE" | "ACTIVE">("IDLE");
    const [mod7Logs, setMod7Logs] = useState<string[]>([]);

    // Mod 8: Advanced (Views/Triggers)
    const [createdViews, setCreatedViews] = useState<ViewObject[]>([]);
    const [createdTriggers, setCreatedTriggers] = useState<TriggerObject[]>([]);
    const [viewNameInput, setViewNameInput] = useState("TopStudents");
    const [viewCutoffInput, setViewCutoffInput] = useState("80");

    // Mod 9: Forms
    const [formRollNo, setFormRollNo] = useState("");
    const [formName, setFormName] = useState("");
    const [formDept, setFormDept] = useState("CSE");
    const [formMarks, setFormMarks] = useState("");

    // Console
    const [sqlQuery, setSqlQuery] = useState("");
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p]);

    // --- Parser Engine ---
    const executeConsoleQuery = () => {
        if (!sqlQuery.trim()) return;
        addLog(`EXECUTE: ${sqlQuery}`);
        const q = sqlQuery.trim().replace(/\s+/g, " "); // Normalize spaces
        const lowerQ = q.toLowerCase();

        // 1. Mod 1: Filters
        // e.g., SELECT * FROM STUDENT WHERE Dept = 'CSE'
        const whereDeptMatch = lowerQ.match(/where dept\s*=\s*'(\w+)'/);
        if (whereDeptMatch) {
            setActiveModule(1);
            setMod1Filter("CUSTOM_DEPT");
            setMod1CustomQuery(whereDeptMatch[1].toUpperCase()); // Store 'CSE', 'ECE' etc.
            addLog(`Result: Filtered by Dept = '${whereDeptMatch[1].toUpperCase()}'`);
            return;
        }

        // e.g., SELECT * FROM STUDENT WHERE Marks > 80
        const whereMarksMatch = lowerQ.match(/where marks\s*>\s*(\d+)/);
        if (whereMarksMatch) {
            setActiveModule(1);
            setMod1Filter("CUSTOM_MARKS");
            setMod1CustomQuery(whereMarksMatch[1]);
            addLog(`Result: Filtered by Marks > ${whereMarksMatch[1]}`);
            return;
        }

        // Module 2: JS Functions
        if (lowerQ.includes("count") || lowerQ.includes("avg") || lowerQ.includes("max") || lowerQ.includes("min") || lowerQ.includes("upper") || lowerQ.includes("lower") || lowerQ.includes("length")) {
            setActiveModule(2);
            if (lowerQ.includes("count")) { setMod2Func("COUNT"); setMod2Result(students.length); }
            else if (lowerQ.includes("avg")) { setMod2Func("AVG"); setMod2Result((students.reduce((a, b) => a + b.marks, 0) / students.length).toFixed(1)); }
            else if (lowerQ.includes("max")) { setMod2Func("MAX"); setMod2Result(Math.max(...students.map(s => s.marks))); }
            else if (lowerQ.includes("min")) { setMod2Func("MIN"); setMod2Result(Math.min(...students.map(s => s.marks))); }
            else if (lowerQ.includes("upper")) { setMod2Func("UPPER"); setMod2Result("'EXPERIMENT'"); }
            else if (lowerQ.includes("lower")) { setMod2Func("LOWER"); setMod2Result("'experiment'"); }
            else if (lowerQ.includes("length")) { setMod2Func("LENGTH"); setMod2Result(10); }

            addLog(`Executed Function: ${q}`);
            return;
        }

        // Module 3: Relational Algebra (Selection & Projection)
        if (lowerQ.includes("sigma") || lowerQ.includes("selection") || (lowerQ.includes("select *") && lowerQ.includes("where"))) {
            setActiveModule(3);

            // Extract WHERE clause
            if (lowerQ.includes("where")) {
                const wherePart = q.substring(lowerQ.indexOf("where") + 5).trim();
                if (wherePart.toLowerCase().includes("dept")) {
                    const match = wherePart.match(/['"](\w+)['"]/);
                    if (match) {
                        setMod3Selection({ type: 'DEPT', value: match[1] });
                        addLog(`Visualizing Selection: Dept = '${match[1]}'`);
                    }
                } else if (wherePart.toLowerCase().includes("marks")) {
                    const numMatch = wherePart.match(/>\s*(\d+)/);
                    if (numMatch) {
                        setMod3Selection({ type: 'MARKS', value: parseInt(numMatch[1]) });
                        addLog(`Visualizing Selection: Marks > ${numMatch[1]}`);
                    }
                }
            } else {
                addLog("Visualizing Selection (Sigma)");
            }
            return;
        }

        // Module 3: Projection (SELECT col1, col2 ...)
        if (lowerQ.startsWith("select") && !lowerQ.includes("*") && !lowerQ.includes("count") && !lowerQ.includes("avg") && !lowerQ.includes("join")) {
            setActiveModule(3);
            const fromIndex = lowerQ.indexOf("from");
            if (fromIndex !== -1) {
                const colsPart = q.substring(6, fromIndex).split(",");
                const cleanCols = colsPart.map(c => c.trim().toLowerCase()).filter(c => ["rollno", "name", "dept", "marks"].includes(c));
                if (cleanCols.length > 0) {
                    setMod3ProjectionColumns(cleanCols);
                    addLog(`Visualizing Projection: ${cleanCols.join(", ")}`);
                }
            }
            return;
        }

        // 2. Mod 4: Joins
        // e.g., ... LEFT JOIN ...
        if (lowerQ.includes("left join")) {
            setActiveModule(4);
            setJoinType("LEFT");
            addLog("Result: Switched to LEFT JOIN visualizer.");
            return;
        }
        if (lowerQ.includes("right join")) {
            setActiveModule(4);
            setJoinType("RIGHT");
            addLog("Result: Switched to RIGHT JOIN visualizer.");
            return;
        }
        if (lowerQ.includes("inner join")) {
            setActiveModule(4);
            setJoinType("INNER");
            addLog("Result: Switched to INNER JOIN visualizer.");
            return;
        }

        // 3. Mod 5: Subqueries (Dynamic Cutoff)
        // e.g., ... WHERE Marks > (SELECT ... ) -- we assume user inputs simplified number in simulation or we parse the outer query cutoff
        // Let's simplified: if they type a query like the subquery example with a number
        const subQueryMatch = lowerQ.match(/where marks >\s*(\d+)/);
        if (activeModule === 5 && subQueryMatch) {
            setCutoff(subQueryMatch[1]);
            addLog(`Result: Subquery Cutoff updated to ${subQueryMatch[1]}`);
            return;
        }

        // 4. Mod 8: Create View
        // e.g., CREATE VIEW X AS ... WHERE Marks > Y
        const createViewMatch = lowerQ.match(/create view (\w+) as .* marks > (\d+)/);
        if (createViewMatch) {
            setActiveModule(8);
            const vName = createViewMatch?.[1] || "View_X";
            const vCutoff = parseInt(createViewMatch?.[2]) || 80;
            if (!createdViews.find(v => v.name === vName)) {
                setCreatedViews([...createdViews, { name: vName, cutoff: vCutoff }]);
            }
            addLog(`SUCCESS: View '${vName}' created with cutoff ${vCutoff}.`);
            return;
        }

        // Fallback
        if (lowerQ.startsWith("insert into student")) {
            addLog("Info: Use Module 9 Form for persistent inserts.");
        } else {
            addLog("Result: Command executed (Visual Only / No State Change detected).");
        }
    };

    // --- Join Logic ---
    const getJoinData = () => {
        let result: any[] = [];

        if (joinType === "INNER") {
            // Only matches
            result = enrollments.map(e => {
                const s = students.find(st => st.rollNo === e.rollNo);
                if (s) return { ...s, courseId: e.courseId };
                return null;
            }).filter(Boolean);
        } else if (joinType === "LEFT") {
            // All Students, Match or Null Course
            result = students.map(s => {
                const e = enrollments.find(en => en.rollNo === s.rollNo);
                return { ...s, courseId: e ? e.courseId : "NULL" };
            });
        } else if (joinType === "RIGHT") {
            // All Enrollments, Match or Null Student
            result = enrollments.map(e => {
                const s = students.find(st => st.rollNo === e.rollNo);
                return {
                    rollNo: e.rollNo,
                    courseId: e.courseId,
                    name: s ? s.name : "NULL",
                    dept: s ? s.dept : "NULL"
                };
            });
        }
        return result;
    };

    // --- Handlers ---
    const submitForm = () => {
        if (!formRollNo || !formName || !formMarks) {
            addLog("Error: Missing fields");
            return;
        }
        const newStudent = {
            rollNo: parseInt(formRollNo),
            name: formName,
            dept: formDept,
            marks: parseInt(formMarks)
        };
        setStudents([...students, newStudent]);
        addLog(`INSERT INTO STUDENT VALUES (${newStudent.rollNo}, '${newStudent.name}', '${newStudent.dept}', ${newStudent.marks})`);
        setSqlQuery(`INSERT INTO STUDENT VALUES (${newStudent.rollNo}, '${newStudent.name}', '${newStudent.dept}', ${newStudent.marks})`);

        // Trigger Check
        const activeTrigger = createdTriggers.find(t => t.status === "Active" && t.table === "Student" && t.type === "INSERT");
        if (activeTrigger) {
            addLog(`TRIGGER '${activeTrigger.name}' FIRED: Captured new insertion.`);
        }

        // Reset
        setFormRollNo("");
        setFormName("");
        setFormMarks("");
        alert("Record inserted successfully!");
    };

    const renderModuleContent = () => {
        switch (activeModule) {
            case 1: // Logical & Operators
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><Settings size={18} className="text-blue-600" /> Logical & SQL Operators</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Button size="sm" variant={mod1Filter === "ALL" ? "default" : "outline"} onClick={() => { setMod1Filter("ALL"); setSqlQuery("SELECT * FROM STUDENT"); }}>SELECT *</Button>
                                <Button size="sm" variant={mod1Filter === "CSE" ? "default" : "outline"} onClick={() => { setMod1Filter("CSE"); setSqlQuery("SELECT * FROM STUDENT WHERE Dept = 'CSE'"); }}>Dept='CSE'</Button>
                                <Button size="sm" variant={mod1Filter === "MARKS_GT_80" ? "default" : "outline"} onClick={() => { setMod1Filter("MARKS_GT_80"); setSqlQuery("SELECT * FROM STUDENT WHERE Marks > 80"); }}>Marks {">"} 80</Button>
                                <Button size="sm" variant={mod1Filter === "LIKE_A" ? "default" : "outline"} onClick={() => { setMod1Filter("LIKE_A"); setSqlQuery("SELECT * FROM STUDENT WHERE Name LIKE 'A%'"); }}>Name LIKE 'A%'</Button>
                            </div>

                            {/* Live Feedback Message */}
                            {mod1Filter === "CUSTOM_DEPT" && <div className="text-xs bg-blue-50 text-blue-700 p-2 mb-2 rounded">Displaying Students with Dept = <strong>{mod1CustomQuery}</strong></div>}
                            {mod1Filter === "CUSTOM_MARKS" && <div className="text-xs bg-blue-50 text-blue-700 p-2 mb-2 rounded">Displaying Students with Marks {">"} <strong>{mod1CustomQuery}</strong></div>}

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse border">
                                    <thead className="bg-gray-100">
                                        <tr><th className="border p-2">RollNo</th><th className="border p-2">Name</th><th className="border p-2">Dept</th><th className="border p-2">Marks</th></tr>
                                    </thead>
                                    <tbody>
                                        {students.filter(s => {
                                            if (mod1Filter === "CSE") return s.dept === "CSE";
                                            if (mod1Filter === "MARKS_GT_80") return s.marks > 80;
                                            if (mod1Filter === "LIKE_A") return s.name.startsWith("A");
                                            if (mod1Filter === "BETWEEN") return s.marks >= 70 && s.marks <= 90;
                                            if (mod1Filter === "CUSTOM_DEPT") return s.dept === mod1CustomQuery;
                                            if (mod1Filter === "CUSTOM_MARKS") return s.marks > parseInt(mod1CustomQuery);
                                            return true;
                                        }).map(s => (
                                            <tr key={s.rollNo} className="hover:bg-blue-50">
                                                <td className="border p-2">{s.rollNo}</td><td className="border p-2">{s.name}</td><td className="border p-2">{s.dept}</td><td className="border p-2">{s.marks}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Functions (Restored)
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><Calculator size={18} className="text-orange-600" /> SQL Functions</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Aggregate Functions</label>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button size="sm" onClick={() => { setMod2Func("COUNT"); setMod2Result(students.length); setSqlQuery("SELECT COUNT(*) FROM STUDENT"); }}>COUNT</Button>
                                        <Button size="sm" onClick={() => { setMod2Func("AVG"); setMod2Result((students.reduce((a, b) => a + b.marks, 0) / students.length).toFixed(1)); setSqlQuery("SELECT AVG(Marks) FROM STUDENT"); }}>AVG</Button>
                                        <Button size="sm" onClick={() => { setMod2Func("MAX"); setMod2Result(Math.max(...students.map(s => s.marks))); setSqlQuery("SELECT MAX(Marks) FROM STUDENT"); }}>MAX</Button>
                                        <Button size="sm" onClick={() => { setMod2Func("MIN"); setMod2Result(Math.min(...students.map(s => s.marks))); setSqlQuery("SELECT MIN(Marks) FROM STUDENT"); }}>MIN</Button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Scalar Functions</label>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button size="sm" onClick={() => { setMod2Func("UPPER"); setMod2Result("'EXPERIMENT'"); setSqlQuery("SELECT UPPER('Experiment') FROM DUAL"); }}>UPPER</Button>
                                        <Button size="sm" onClick={() => { setMod2Func("LOWER"); setMod2Result("'experiment'"); setSqlQuery("SELECT LOWER('Experiment') FROM DUAL"); }}>LOWER</Button>
                                        <Button size="sm" onClick={() => { setMod2Func("LENGTH"); setMod2Result(10); setSqlQuery("SELECT LENGTH('Experiment') FROM DUAL"); }}>LENGTH</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 border rounded text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Result: {mod2Func}</div>
                                <div className="text-2xl font-mono font-bold text-gray-800">{mod2Result !== null ? mod2Result : "-"}</div>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Relational (Dynamic)
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><Layers size={18} className="text-purple-600" /> Relational Algebra</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border p-4 rounded hover:border-purple-300 cursor-pointer transition-all" onClick={() => { setMod3Selection({ type: 'DEPT', value: 'CSE' }); setSqlQuery("SELECT * FROM STUDENT WHERE Dept='CSE'"); }}>
                                    <h4 className="font-mono font-bold text-purple-700 mb-2">Selection (σ)</h4>
                                    <p className="text-xs text-gray-500 mb-2">σ {mod3Selection.type === 'DEPT' ? `Dept='${mod3Selection.value}'` : `Marks > ${mod3Selection.value}`}(STUDENT)</p>
                                    <div className="bg-purple-50 p-2 rounded text-xs space-y-1 h-32 overflow-y-auto">
                                        <div className="flex justify-between border-b pb-1 font-bold"><span>Roll</span><span>Name</span><span>Dept</span></div>
                                        {students.filter(s => {
                                            if (mod3Selection.type === 'DEPT') return s.dept === mod3Selection.value;
                                            if (mod3Selection.type === 'MARKS') return s.marks > (mod3Selection.value as number);
                                            return true;
                                        }).map(s => (
                                            <div key={s.rollNo} className="flex justify-between font-mono"><span>{s.rollNo}</span><span>{s.name}</span><span>{s.dept}</span></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="border p-4 rounded hover:border-purple-300 cursor-pointer transition-all" onClick={() => { setMod3ProjectionColumns(["name", "marks"]); setSqlQuery("SELECT Name, Marks FROM STUDENT"); }}>
                                    <h4 className="font-mono font-bold text-purple-700 mb-2">Projection (π)</h4>
                                    <p className="text-xs text-gray-500 mb-2">π {mod3ProjectionColumns.join(', ')}(STUDENT)</p>
                                    <div className="bg-purple-50 p-2 rounded text-xs space-y-1 h-32 overflow-y-auto">
                                        <div className="flex justify-between border-b pb-1 font-bold">
                                            {mod3ProjectionColumns.map(c => <span key={c} className="capitalize">{c}</span>)}
                                        </div>
                                        {students.slice(0, 5).map(s => (
                                            <div key={s.rollNo} className="flex justify-between font-mono">
                                                {mod3ProjectionColumns.map(col => <span key={col}>{s[col as keyof typeof s]}</span>)}
                                            </div>
                                        ))}
                                        <div className="text-center text-gray-400">...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Joins (Enhanced Logic)
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><Table size={18} className="text-green-600" /> Joins Visualizer</h3>

                            <div className="flex flex-col gap-6">
                                {/* Source Tables */}
                                <div className="grid grid-cols-2 gap-6 pb-4 border-b">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-1">Table: Student (Left)</h4>
                                        <div className="bg-white border rounded overflow-hidden h-32 overflow-y-auto">
                                            <table className="w-full text-[10px]">
                                                <thead className="bg-gray-100"><tr><th className="p-1 border text-left">Roll</th><th className="p-1 border text-left">Name</th></tr></thead>
                                                <tbody>
                                                    {students.map(s => <tr key={s.rollNo}><td className="p-1 border">{s.rollNo}</td><td className="p-1 border">{s.name}</td></tr>)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-1">Table: Enrollment (Right)</h4>
                                        <div className="bg-white border rounded overflow-hidden h-32 overflow-y-auto">
                                            <table className="w-full text-[10px]">
                                                <thead className="bg-gray-100"><tr><th className="p-1 border text-left">Roll</th><th className="p-1 border text-left">CID</th></tr></thead>
                                                <tbody>
                                                    {enrollments.map((e, i) => <tr key={i}><td className="p-1 border">{e.rollNo}</td><td className="p-1 border">{e.courseId}</td></tr>)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex gap-2 justify-center">
                                    <Button size="sm" variant={joinType === "INNER" ? "default" : "outline"} onClick={() => { setJoinType("INNER"); setSqlQuery("SELECT ... FROM Student INNER JOIN Enrollment ..."); }}>Inner Join</Button>
                                    <Button size="sm" variant={joinType === "LEFT" ? "default" : "outline"} onClick={() => { setJoinType("LEFT"); setSqlQuery("SELECT ... FROM Student LEFT JOIN Enrollment ..."); }}>Left Join</Button>
                                    <Button size="sm" variant={joinType === "RIGHT" ? "default" : "outline"} onClick={() => { setJoinType("RIGHT"); setSqlQuery("SELECT ... FROM Student RIGHT JOIN Enrollment ..."); }}>Right Join</Button>
                                </div>

                                {/* Result Table */}
                                <div className="bg-green-50 border rounded p-4">
                                    <h4 className="text-xs font-bold uppercase text-green-800 mb-2">Output Result ({joinType} JOIN)</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs bg-white border">
                                            <thead className="bg-gray-100"><tr><th className="p-2 border">RollNo</th><th className="p-2 border">Name</th><th className="p-2 border">CourseID</th></tr></thead>
                                            <tbody>
                                                {getJoinData().map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="p-2 border">{row.rollNo}</td>
                                                        <td className="p-2 border">{row.name === "NULL" ? <span className="text-red-400 italic">NULL</span> : row.name}</td>
                                                        <td className="p-2 border">{row.courseId === "NULL" ? <span className="text-red-400 italic">NULL</span> : row.courseId}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5: // Subqueries (Fixed Cutoff)
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><Terminal size={18} className="text-indigo-600" /> Subqueries</h3>
                            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded">
                                <span className="text-sm font-bold">Cutoff Score:</span>
                                <input type="number" value={cutoff} onChange={(e) => { setCutoff(e.target.value); setSqlQuery(`SELECT * FROM STUDENT WHERE Marks > ${e.target.value}`); }} className="w-20 p-1 border rounded text-xs" />
                            </div>

                            <div className="bg-indigo-50 p-4 rounded mb-4">
                                <h4 className="font-bold text-xs uppercase text-indigo-800 mb-2">Step 1: Inner Query (Find Cutoff)</h4>
                                <code className="block bg-white p-2 rounded border border-indigo-200 text-xs mb-2">SELECT AVG(Marks) FROM STUDENT; -- (Avg is fixed at 80 for demo) OR SELECT {cutoff} FROM DUAL</code>
                                <p className="text-xs text-gray-700">Dynamic Cutoff Value: <strong>{cutoff}</strong></p>
                            </div>

                            <div className="bg-green-50 p-4 rounded mb-4">
                                <h4 className="font-bold text-xs uppercase text-green-800 mb-2">Step 2: Outer Query (Filter Students)</h4>
                                <code className="block bg-white p-2 rounded border border-green-200 text-xs mb-2">SELECT Name, Marks FROM STUDENT WHERE Marks &gt; {cutoff};</code>

                                <div className="bg-white border rounded mt-3">
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-100"><tr><th className="p-2 border">Name</th><th className="p-2 border">Marks</th></tr></thead>
                                        <tbody>
                                            {students.filter(s => s.marks > parseInt(cutoff)).map(s => (
                                                <tr key={s.rollNo}><td className="p-2 border">{s.name}</td><td className="p-2 border bg-green-100 font-bold">{s.marks}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6: // PL/SQL
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><FileText size={18} className="text-teal-600" /> PL/SQL</h3>
                            <textarea
                                value={plsqlCode}
                                onChange={(e) => setPlsqlCode(e.target.value)}
                                className="w-full h-32 p-2 font-mono text-xs border rounded bg-gray-50 resize-none outline-none mb-2"
                            />
                            <Button size="sm" onClick={() => { setPlsqlOutput("Procedure executed successfully.\nHello PL/SQL"); }}>Run</Button>
                            <div className="mt-2 w-full h-32 p-2 font-mono text-xs border rounded bg-black text-green-400 overflow-auto whitespace-pre-wrap">{plsqlOutput}</div>
                        </div>
                    </div>
                );
            case 7: // Transactions
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><Activity size={18} className="text-red-600" /> Transaction Control</h3>
                            <div className="flex gap-4 items-center">
                                <Button size="sm" disabled={mod7TxStatus === "ACTIVE"} onClick={() => { setMod7TxStatus("ACTIVE"); setMod7Logs(p => [...p, "BEGIN TRANSACTION"]); }}>Start</Button>
                                <Button size="sm" variant="destructive" disabled={mod7TxStatus !== "ACTIVE"} onClick={() => { setMod7TxStatus("IDLE"); setMod7Logs(p => [...p, "ROLLBACK"]); }}>Rollback</Button>
                                <Button size="sm" className="bg-green-600" disabled={mod7TxStatus !== "ACTIVE"} onClick={() => { setMod7TxStatus("IDLE"); setMod7Logs(p => [...p, "COMMIT"]); }}>Commit</Button>
                            </div>
                            <div className="mt-4 bg-black text-green-400 font-mono text-xs p-4 rounded h-32 overflow-y-auto">
                                {mod7Logs.map((l, i) => <div key={i}>{">"} {l}</div>)}
                            </div>
                        </div>
                    </div>
                );
            case 8: // Advanced (Views & Triggers with proper Metadata)
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><BookOpen size={18} className="text-pink-600" /> Advanced Concepts</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Helper Panel */}
                                <div className="space-y-4">
                                    <div className="border p-4 rounded bg-pink-50 text-sm">
                                        <h4 className="font-bold text-pink-800 text-sm mb-2">Create View</h4>
                                        <div className="grid grid-cols-2 gap-2 mb-2 px-1">
                                            <input type="text" placeholder="Name" value={viewNameInput} onChange={(e) => setViewNameInput(e.target.value)} className="border rounded p-1 text-xs" />
                                            <input type="number" placeholder="Cutoff" value={viewCutoffInput} onChange={(e) => setViewCutoffInput(e.target.value)} className="border rounded p-1 text-xs" />
                                        </div>
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => {
                                            const vName = viewNameInput || "View_Custom";
                                            const vCutoff = parseInt(viewCutoffInput) || 80;
                                            setSqlQuery(`CREATE VIEW ${vName} AS SELECT Name, Marks FROM Student WHERE Marks > ${vCutoff}`);
                                            if (!createdViews.find(v => v.name === vName)) setCreatedViews([...createdViews, { name: vName, cutoff: vCutoff }]);
                                            addLog(`SUCCESS: View '${vName}' created.`);
                                        }}>Create View</Button>
                                    </div>
                                    <div className="border p-4 rounded bg-blue-50 text-sm">
                                        <h4 className="font-bold text-blue-800 text-sm mb-2">Create Trigger</h4>
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => {
                                            setSqlQuery("CREATE TRIGGER AuditLog ... ");
                                            if (!createdTriggers.find(t => t.name === "AuditLog")) setCreatedTriggers([...createdTriggers, { name: "AuditLog", type: "INSERT", table: "Student", status: "Active" }]);
                                            addLog("SUCCESS: Trigger Attached.");
                                        }}>Attatch Audit Log</Button>
                                    </div>
                                </div>

                                {/* Object Browser */}
                                <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-inner h-full">
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-2"><Database size={14} /> Schema Browser</h4>

                                    {/* Views List */}
                                    {createdViews.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="text-[10px] font-bold text-pink-700 mb-1 uppercase">Views</h5>
                                            <div className="space-y-1">
                                                {createdViews.map((view, i) => (
                                                    <div key={i} className="flex items-center justify-between text-xs bg-pink-50 p-2 rounded border border-pink-100">
                                                        <span>{view.name} <span className="text-gray-400 text-[10px]">(Marks &gt; {view.cutoff})</span></span>
                                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-pink-200" onClick={() => {
                                                            setSqlQuery(`SELECT * FROM ${view.name}`);
                                                            addLog(`Displaying Content of View: ${view.name}`);
                                                            alert(`View '${view.name}' Content:\n\n` + students.filter(s => s.marks > view.cutoff).map(s => `${s.name} (${s.marks})`).join("\n"));
                                                        }}> <Eye size={12} /> </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Triggers List */}
                                    {createdTriggers.length > 0 && (
                                        <div>
                                            <h5 className="text-[10px] font-bold text-blue-700 mb-1 uppercase">Triggers</h5>
                                            <div className="space-y-1">
                                                {createdTriggers.map((trig, i) => (
                                                    <div key={i} className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded border border-blue-100">
                                                        <span>{trig.name}</span>
                                                        <span className="text-[10px] text-blue-600 italic">{trig.status}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {createdViews.length === 0 && createdTriggers.length === 0 && <div className="text-center text-gray-400 text-xs italic py-10">No objects.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 9: // Forms
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h3 className="font-bold mb-3 flex items-center gap-2"><Table size={18} className="text-gray-600" /> Data Entry</h3>
                            <div className="max-w-md bg-gray-50 p-6 rounded border space-y-3">
                                <div><label className="text-xs font-bold text-gray-500">Roll No</label><input type="number" value={formRollNo} onChange={(e) => setFormRollNo(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="106" /></div>
                                <div><label className="text-xs font-bold text-gray-500">Name</label><input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Name" /></div>
                                <div><label className="text-xs font-bold text-gray-500">Marks</label><input type="number" value={formMarks} onChange={(e) => setFormMarks(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="85" /></div>
                                <div className="pt-2"><Button size="sm" className="w-full bg-[#f57f17] hover:bg-orange-700" onClick={submitForm}>Submit</Button></div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-50 font-sans overflow-hidden">
            <header className="bg-white border-b shadow-sm z-10 p-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/dbms/3" className="p-2 hover:bg-gray-100 rounded-full"> <ArrowLeft size={18} className="text-gray-600" /> </Link>
                    <h1 className="font-bold text-gray-800">Experiment 3: SQL Operations</h1>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <nav className="w-64 bg-white border-r flex flex-col overflow-y-auto shrink-0">
                    {[
                        { id: 1, label: "Logical & Operators", icon: Settings },
                        { id: 2, label: "SQL Functions", icon: Calculator },
                        { id: 3, label: "Relational Algebra", icon: Layers },
                        { id: 4, label: "Joins, Left/Right", icon: Table },
                        { id: 5, label: "Subqueries", icon: Terminal },
                        { id: 6, label: "PL/SQL", icon: FileText },
                        { id: 7, label: "Transactions", icon: Activity },
                        { id: 8, label: "Views & Triggers", icon: BookOpen },
                        { id: 9, label: "Forms & Reports", icon: Table },
                    ].map((m) => (
                        <button key={m.id} onClick={() => setActiveModule(m.id as ModuleId)} className={`p-4 text-left border-b hover:bg-gray-50 flex items-center gap-3 transition-colors ${activeModule === m.id ? "bg-orange-50 text-orange-700 border-l-4 border-l-orange-500" : "text-gray-600"}`}>
                            <m.icon size={18} /> <span className="font-medium text-sm">{m.label}</span>
                        </button>
                    ))}
                </nav>

                <main className="flex-1 overflow-auto p-6 relative bg-dots-pattern">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {renderModuleContent()}
                    </div>
                </main>

                <aside className="w-96 bg-[#1e1e1e] border-l border-gray-700 flex flex-col shrink-0">
                    <div className="h-1/2 flex flex-col border-b border-gray-700">
                        <div className="p-3 bg-[#252526] border-b border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2"> <Code size={14} className="text-green-400" /> <span className="text-xs font-mono font-bold text-gray-300">Live Query Editor</span> </div>
                        </div>
                        <div className="flex-1 bg-[#1e1e1e] p-3">
                            <textarea
                                value={sqlQuery}
                                onChange={(e) => setSqlQuery(e.target.value)}
                                placeholder="-- Type your SQL query here --"
                                className="w-full h-full bg-transparent text-green-400 font-mono text-xs outline-none resize-none placeholder-gray-600"
                                spellCheck={false}
                            />
                        </div>
                        <div className="bg-[#2d2d2d] p-2 flex justify-end">
                            <Button size="sm" onClick={executeConsoleQuery} className="bg-green-700 hover:bg-green-800 text-white text-xs h-7"> <Play size={12} className="mr-1" /> Execute </Button>
                        </div>
                    </div>

                    <div className="h-1/2 flex flex-col border-t-2 border-gray-800 text-gray-300 font-mono text-xs">
                        <div className="p-2 bg-[#252526] border-b border-black flex items-center gap-2"> <Terminal size={14} /> <span className="font-mono font-bold text-[10px] text-gray-400 uppercase">Activity Log</span> </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[10px]">
                            {logs.map((log, i) => <div key={i} className="text-gray-400 border-l border-orange-500 pl-2 leading-tight"><span className="text-gray-300">{log}</span></div>)}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
