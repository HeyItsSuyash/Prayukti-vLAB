"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Code, Database, Play, RefreshCw, Terminal, Power, Edit3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// --- Types ---
type Student = { RollNo: number; Name: string; Dept: string; Marks: number };
type Lang = 'java' | 'python' | 'cpp';
type Op = 'select' | 'insert' | 'update' | 'delete';

// --- Mock Data ---
const initialStudents: Student[] = [
    { RollNo: 1, Name: "Aarav", Dept: "CSE", Marks: 85 },
    { RollNo: 2, Name: "Vivaan", Dept: "ECE", Marks: 78 },
];

// --- Default Code Snippets ---
const getCodeSnippet = (lang: Lang, op: Op) => {
    const snippets: Record<Lang, Record<Op, string>> = {
        java: {
            select: `// Java JDBC Select
class DbSelect {
  public static void main(String[] args) {
    try {
      // 1. Load Driver
      Class.forName("com.mysql.cj.jdbc.Driver");
      // 2. Connect
      Connection con = DriverManager.getConnection(url, user, pass);
      // 3. Execute
      Statement stmt = con.createStatement();
      ResultSet rs = stmt.executeQuery("SELECT * FROM Student");
      // 4. Process
      while(rs.next()) System.out.println(rs.getString(1));
      // 5. Close
      con.close();
    } catch(Exception e) { System.out.println(e); }
  }
}`,
            insert: `// Java JDBC Insert
import java.sql.*;
class DbInsert {
  public static void main(String[] args) {
    try {
      // 1. Load & 2. Connect
      Class.forName("com.mysql.cj.jdbc.Driver");
      Connection con = DriverManager.getConnection(url, user, pass);
      
      // 3. Execute
      Statement stmt = con.createStatement();
      
      // --- EDIT THE SQL BELOW TO INSERT YOUR OWN DATA ---
      String sql = "INSERT INTO Student VALUES(3, 'Diya', 'IT', 90)";
      int rows = stmt.executeUpdate(sql);
      
      System.out.println(rows + " row inserted");
      con.close();
    } catch(Exception e) {}
  }
}`,
            update: `// Java JDBC Update
import java.sql.*;
class DbUpdate {
  public static void main(String[] args) {
    try {
      Connection con = DriverManager.getConnection(url, user, pass);
      Statement stmt = con.createStatement();
      
      // --- EDIT THE SQL BELOW TO UPDATE DATA ---
      // Try changing Marks=95 to something else!
      String sql = "UPDATE Student SET Marks=95 WHERE RollNo=1";
      int rows = stmt.executeUpdate(sql);
      
      System.out.println("Rows updated: " + rows);
      con.close();
    } catch(Exception e) {}
  }
}`,
            delete: `// Java JDBC Delete
import java.sql.*;
class DbDelete {
  public static void main(String[] args) {
    try {
      Connection con = DriverManager.getConnection(url, user, pass);
      Statement stmt = con.createStatement();
      
      // --- EDIT THE SQL BELOW TO DELETE DATA ---
      String sql = "DELETE FROM Student WHERE RollNo=2";
      int rows = stmt.executeUpdate(sql);
      
      System.out.println("Rows deleted: " + rows);
      con.close();
    } catch(Exception e) {}
  }
}`
        },
        python: {
            select: `# Python SQLite Select
import sqlite3

# 1. Connect
con = sqlite3.connect('example.db')
cur = con.cursor()

# 3. Execute
cur.execute("SELECT * FROM Student")

# 4. Process
rows = cur.fetchall()
for row in rows:
    print(row)

# 5. Close
con.close()`,
            insert: `# Python SQLite Insert
import sqlite3
con = sqlite3.connect('example.db')
cur = con.cursor()

# --- EDIT THE SQL BELOW ---
sql = "INSERT INTO Student VALUES(3, 'Diya', 'IT', 90)"
cur.execute(sql)

con.commit()
print("Row inserted")
con.close()`,
            update: `# Python SQLite Update
import sqlite3
con = sqlite3.connect('example.db')
cur = con.cursor()

# --- EDIT THE SQL BELOW ---
sql = "UPDATE Student SET Marks=95 WHERE RollNo=1"
cur.execute(sql)

con.commit()
print("Update successful")
con.close()`,
            delete: `# Python SQLite Delete
import sqlite3
con = sqlite3.connect('example.db')
cur = con.cursor()

# --- EDIT THE SQL BELOW ---
sql = "DELETE FROM Student WHERE RollNo=2"
cur.execute(sql)

con.commit()
print("Delete successful")
con.close()`
        },
        cpp: {
            select: `// C++ ODBC Select
#include <sql.h>
// Steps 1 & 2: Alloc & Connect
SQLConnect(sqlconn, "DSN", ...);

// 3. Execute
SQLExecDirect(sqlstmt, "SELECT * FROM Student", SQL_NTS);

// 4. Process
while(SQLFetch(sqlstmt) == SQL_SUCCESS) {
    printf("%s", data);
}
// 5. Close
SQLDisconnect(sqlconn);`,
            insert: `// C++ ODBC Insert
#include <sql.h>
SQLConnect(sqlconn, "DSN", ...);

// --- EDIT THE SQL BELOW ---
char* sql = "INSERT INTO Student VALUES(3, 'Diya', 'IT', 90)";
SQLExecDirect(sqlstmt, sql, SQL_NTS);

SQLDisconnect(sqlconn);`,
            update: `// C++ ODBC Update
#include <sql.h>
SQLConnect(sqlconn, "DSN", ...);

// --- EDIT THE SQL BELOW ---
char* sql = "UPDATE Student SET Marks=95 WHERE RollNo=1";
SQLExecDirect(sqlstmt, sql, SQL_NTS);

SQLDisconnect(sqlconn);`,
            delete: `// C++ ODBC Delete
#include <sql.h>
SQLConnect(sqlconn, "DSN", ...);

// --- EDIT THE SQL BELOW ---
char* sql = "DELETE FROM Student WHERE RollNo=2";
SQLExecDirect(sqlstmt, sql, SQL_NTS);

SQLDisconnect(sqlconn);`
        }
    };
    return snippets[lang][op] || "Code not available";
};


import { WithMode } from "@/lib/labs/modes";

interface HostLanguageSimulationProps extends WithMode {
    mode?: "LEARNING" | "EXPERIMENTAL" | "EXAM";
}

export default function HostLanguageSimulation({ mode = "LEARNING" }: HostLanguageSimulationProps) {
    // We can use 'mode' to disable hints or timer in EXAM mode
    const isExam = mode === "EXAM";

    const [lang, setLang] = useState<Lang>('java');
    const [op, setOp] = useState<Op>('select');
    const [step, setStep] = useState<number>(0);
    // 0: Idle, 1: Load, 2: Connect, 3: Execute, 4: Process, 5: Close

    // DB State
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [code, setCode] = useState<string>(getCodeSnippet('java', 'select'));

    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // Update code when lang/op changes
    useEffect(() => {
        setCode(getCodeSnippet(lang, op));
        reset();
    }, [lang, op]);

    const reset = () => {
        setStep(0);
        setIsConnected(false);
        setConsoleOutput([]);
        setStudents(initialStudents); // Reset DB for consistency
    };

    const addLog = (msg: string) => setConsoleOutput(prev => [...prev, msg]);

    const nextStep = () => {
        const next = step + 1;
        setStep(next);

        if (next === 1) addLog(`[${lang.toUpperCase()}] Loading Database Driver...`);
        if (next === 2) {
            setIsConnected(true);
            addLog(`[${lang.toUpperCase()}] Connection Established successfully.`);
        }
        if (next === 3) {
            addLog(`[${lang.toUpperCase()}] Analyzing Code...`);
            executeCustomCode();
        }
        if (next === 4) {
            if (op === 'select') addLog(`[${lang.toUpperCase()}] Processing Result Set...`);
            else addLog(`[${lang.toUpperCase()}] Processing affected rows...`);
        }
        if (next === 5) {
            setIsConnected(false);
            addLog(`[${lang.toUpperCase()}] Connection Closed.`);
        }
    };

    // --- Core Logic: Extract SQL from Code and Execute ---
    const executeCustomCode = () => {
        const sqlRegex = /"(INSERT INTO Student VALUES.*?|UPDATE Student SET.*?|DELETE FROM Student.*?|SELECT .*?)"/i;
        const match = code.match(sqlRegex);

        if (!match) {
            addLog("ERROR: Parsing Failed. Could not find a valid SQL query string in the code.");
            addLog("Hint: Make sure your SQL is inside double quotes like \"INSERT...\"");
            return;
        }

        const sql = match[1]; // The content inside quotes
        addLog(`-> Detected SQL: "${sql}"`);

        try {
            if (sql.toUpperCase().startsWith("INSERT")) {
                const valuesMatch = sql.match(/VALUES\s*\((.*?)\)/i);
                if (valuesMatch) {
                    const params = valuesMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ""));

                    if (params.length === 4) {
                        const newStudent: Student = {
                            RollNo: parseInt(params[0]),
                            Name: params[1],
                            Dept: params[2],
                            Marks: parseInt(params[3])
                        };

                        if (students.some(s => s.RollNo === newStudent.RollNo)) {
                            addLog(`SQL Error: Duplicate Entry for RollNo ${newStudent.RollNo}`);
                        } else {
                            setStudents(prev => [...prev, newStudent]);
                            addLog(`-> Execution Success: Inserted [${newStudent.RollNo}, ${newStudent.Name}]`);
                        }
                    } else {
                        addLog("SQL Error: Argument count mismatch. Expected 4 values.");
                    }
                }
            } else if (sql.toUpperCase().startsWith("UPDATE")) {
                const parts = sql.match(/SET\s+(.*?)\s+WHERE\s+(.*)/i);
                if (parts) {
                    const assignment = parts[1].split('=').map(s => s.trim());
                    const condition = parts[2].split('=').map(s => s.trim());

                    if (assignment.length === 2 && condition.length === 2) {
                        const targetCol = assignment[0];
                        const targetVal = assignment[1].replace(/^['"]|['"]$/g, "");
                        const condCol = condition[0];
                        const condVal = condition[1].replace(/^['"]|['"]$/g, "");

                        let updatedCount = 0;
                        setStudents(prev => prev.map(s => {
                            const isMatch = (s as any)[condCol] == condVal;
                            if (isMatch) {
                                updatedCount++;
                                return { ...s, [targetCol]: isNaN(Number(targetVal)) ? targetVal : Number(targetVal) };
                            }
                            return s;
                        }));

                        if (updatedCount > 0) addLog(`-> Execution Success: Updated ${updatedCount} row(s).`);
                        else addLog(`-> Execution: No rows matched the condition WHERE ${condCol}=${condVal}.`);
                    }
                }
            } else if (sql.toUpperCase().startsWith("DELETE")) {
                const whereMatch = sql.match(/WHERE\s+(.*)/i);
                if (whereMatch) {
                    const condition = whereMatch[1].split('=').map(s => s.trim());
                    if (condition.length === 2) {
                        const condCol = condition[0];
                        const condVal = condition[1].replace(/^['"]|['"]$/g, "");

                        const initialLen = students.length;
                        const newStudents = students.filter(s => (s as any)[condCol] != condVal);

                        if (newStudents.length < initialLen) {
                            setStudents(newStudents);
                            addLog(`-> Execution Success: Deleted ${initialLen - newStudents.length} row(s).`);
                        } else {
                            addLog(`-> Execution: No rows matched WHERE ${condCol}=${condVal}.`);
                        }
                    }
                }
            } else if (sql.toUpperCase().startsWith("SELECT")) {
                addLog("-> Result Set:");
                students.forEach(s => addLog(`   ${s.RollNo} | ${s.Name} | ${s.Dept} | ${s.Marks}`));
            }
        } catch (e) {
            addLog("Simulation Error: Syntax not supported by this mini-parser.");
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-50 text-gray-900 font-sans overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/dbms" className="p-2 hover:bg-gray-100 rounded-full transition-colors"> <ArrowLeft size={18} className="text-gray-600" /> </Link>
                    <h1 className="font-bold text-gray-800">Exp 5: Host Language Interface</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1.5 border border-gray-200">
                        <span className="text-xs text-gray-500 font-medium">LANGUAGE</span>
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value as Lang)}
                            className="bg-transparent text-sm font-bold text-blue-600 focus:outline-none cursor-pointer"
                        >
                            <option value="java">Java (JDBC)</option>
                            <option value="python">Python (DB-API)</option>
                            <option value="cpp">C++ (ODBC)</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1.5 border border-gray-200">
                        <span className="text-xs text-gray-500 font-medium">TEMPLATE</span>
                        <select
                            value={op}
                            onChange={(e) => setOp(e.target.value as Op)}
                            className="bg-transparent text-sm font-bold text-green-600 focus:outline-none cursor-pointer"
                        >
                            <option value="select">SELECT</option>
                            <option value="insert">INSERT</option>
                            <option value="update">UPDATE</option>
                            <option value="delete">DELETE</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Editable IDE */}
                <div className="w-7/12 flex flex-col border-r border-gray-200 bg-white">
                    <div className="p-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center px-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Code size={16} className="text-blue-600" />
                            <span className="font-mono text-gray-700 font-bold">Code Editor</span>
                            <span className="text-xs text-gray-600 bg-white border px-2 py-0.5 rounded">Editable</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={reset}
                                className="text-gray-600 hover:text-gray-900 border-gray-300"
                            >
                                <RefreshCw size={14} className="mr-1" /> Reset
                            </Button>
                            <Button
                                size="sm"
                                disabled={step >= 5}
                                onClick={nextStep}
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm font-bold"
                            >
                                <Play size={14} className="mr-1 fill-current" /> {step === 0 ? "Run Program" : "Next Step"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex flex-col group border-b border-gray-200">
                        {/* Interactive Textarea (Dark Theme for Syntax Feel) */}
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 w-full bg-[#1e1e1e] text-gray-200 font-mono text-sm p-4 resize-none outline-none leading-relaxed selection:bg-blue-500/30"
                            spellCheck="false"
                        />
                        {/* Highlight Overlay Execution Indicator */}
                        {step > 0 && step < 6 && (
                            <div className="absolute bottom-4 right-4 bg-yellow-900/40 text-yellow-400 border border-yellow-500/50 px-4 py-2 rounded-md text-sm font-mono flex items-center gap-2 shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                Executing Step {step}...
                            </div>
                        )}
                    </div>

                    {/* Console */}
                    <div className="h-48 bg-white border-t border-gray-200 flex flex-col">
                        <div className="p-1 px-3 bg-gray-100 text-xs text-gray-600 flex items-center gap-2 border-b border-gray-200">
                            <Terminal size={12} /> Console Output
                        </div>
                        <div className="flex-1 p-3 font-mono text-sm overflow-y-auto space-y-1 bg-black text-gray-300">
                            {consoleOutput.length === 0 && <span className="text-gray-600 italic">// Output will appear here...</span>}
                            {consoleOutput.map((l, i) => (
                                <div key={i} className={`${l.includes("Error") ? "text-red-400" : l.includes("Success") ? "text-green-400" : "text-gray-300"}`}>
                                    {l}
                                </div>
                            ))}
                            {step < 5 && step > 0 && <span className="animate-pulse text-green-500">_</span>}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Database & Status */}
                <div className="w-5/12 flex flex-col bg-gray-50 border-l border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800"><Database size={18} className="text-orange-500" /> Database Server</h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${isConnected ? "bg-green-100 text-green-700 border border-green-300 shadow-sm" : "bg-red-100 text-red-700 border border-red-300"}`}>
                            <Power size={12} /> {isConnected ? "CONNECTED" : "OFFLINE"}
                        </div>
                    </div>

                    <div className="flex-1 p-6 space-y-6 overflow-auto bg-dots-pattern">
                        {/* Table Visualization */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Table: STUDENT</span>
                                <span className="text-xs text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-300">{students.length} rows</span>
                            </div>
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-gray-200">RollNo <span className="text-orange-500 ml-1 text-[10px] tracking-wider">PK</span></th>
                                        <th className="px-4 py-3 border-b border-gray-200">Name</th>
                                        <th className="px-4 py-3 border-b border-gray-200">Dept</th>
                                        <th className="px-4 py-3 border-b border-gray-200">Marks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s.RollNo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                            <td className="px-4 py-3 font-mono text-orange-600 font-bold border-r border-gray-100">{s.RollNo}</td>
                                            <td className="px-4 py-3 border-r border-gray-100">{s.Name}</td>
                                            <td className="px-4 py-3 border-r border-gray-100">{s.Dept}</td>
                                            <td className="px-4 py-3 text-emerald-600 font-medium">{s.Marks}</td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr><td colSpan={4} className="p-8 text-center text-gray-500 italic">Table is empty</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800 space-y-2">
                            <div className="flex items-center gap-2 font-bold text-blue-600 uppercase tracking-wider mb-2">
                                <Edit3 size={14} /> Interactive Instructions
                            </div>
                            <p>1. Select <strong>Language</strong> (Java/Python/Cpp) and <strong>Template</strong> (Insert/Update...).</p>
                            <p>2. <strong>Edit the SQL</strong> inside the Code Editor. You can change strings inside <code>" "</code>.</p>
                            <p className="font-mono bg-white p-1 rounded inline-block border border-blue-200 text-gray-700">"INSERT INTO Student VALUES(99, 'Test', ...)"</p>
                            <p>3. Click <strong>Run Program</strong> to execute your custom code!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
