import React from 'react';
import { Database, Table, Columns, LayoutList, Server, Network, ShieldCheck, Activity, Cpu } from "lucide-react";

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // index
    explanation?: string;
}

export interface LabResources {
    video?: {
        title: string;
        url: string; // YouTube embed ID or internal path
        description: string;
    };
    notes?: {
        title: string;
        content: React.ReactNode; // Quick revision notes
    };
    quiz?: {
        title: string;
        questions: QuizQuestion[];
    };
    reading?: {
        title: string;
        links: { text: string; url: string }[];
        content?: React.ReactNode;
    };
}

export interface LabContent {
    aim: string;
    theory: React.ReactNode;
    procedure: React.ReactNode;
    resources?: LabResources;
}

export const LAB_CONTENT: Record<string, LabContent> = {
    // =========================================================================
    // DBMS EXPERIMENTS
    // =========================================================================

    "dbms-exp-1": {
        aim: "To demonstrate the installation and basic environment setup of a Database Management System (MySQL/Oracle/PostgreSQL) and perform basic DDL/DML operations (Create Database, Create Table, Insert Record).",
        theory: (
            <div className="space-y-8">
                {/* 1. Introduction */}
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        A <strong>Database Management System (DBMS)</strong> is system software for creating and managing databases. It provides users and programmers with a systematic way to create, retrieve, update, and manage data. It serves as an interface between the database and the end-users or application programs, ensuring that data is consistently organized and remains easily accessible.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Why is it important?</strong> Without a DBMS, managing large amounts of data would be chaotic, insecure, and inefficient. DBMS ensures data integrity, security, and concurrent access.
                        </p>
                    </div>
                </section>

                {/* 2. Key Concepts */}
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">2. Key Concepts & Terminology</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-blue-700">
                                <Database size={20} />
                                <h4 className="font-bold">Database</h4>
                            </div>
                            <p className="text-sm text-gray-600">An organized collection of structured information, or data, typically stored electronically in a computer system.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-green-700">
                                <Table size={20} />
                                <h4 className="font-bold">Table (Relation)</h4>
                            </div>
                            <p className="text-sm text-gray-600">A collection of related data held in a table format within a database. It consists of columns and rows.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-purple-700">
                                <Columns size={20} />
                                <h4 className="font-bold">Attribute (Column)</h4>
                            </div>
                            <p className="text-sm text-gray-600">A specific characteristic or property of a table. Example: `Name`, `Age` in a Student table.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-orange-700">
                                <LayoutList size={20} />
                                <h4 className="font-bold">Tuple (Row/Record)</h4>
                            </div>
                            <p className="text-sm text-gray-600">A single entry in a table representing a set of related data. Example: `(1, "John", 20)`.</p>
                        </div>
                    </div>
                </section>

                {/* 3. SQL Commands Classification */}
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. SQL Command Classification</h3>
                    <p className="text-gray-700 mb-4">SQL (Structured Query Language) commands are grouped into several categories based on their function:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li><strong>DDL (Data Definition Language):</strong> Defines the structure of the database.
                            <ul className="list-circle pl-6 mt-1 text-gray-600">
                                <li><code>CREATE</code>: Creates a new table/database.</li>
                                <li><code>ALTER</code>: Modifies an existing database structure.</li>
                                <li><code>DROP</code>: Deletes a table/database.</li>
                                <li><code>TRUNCATE</code>: Removes all records but keeps the structure.</li>
                            </ul>
                        </li>
                        <li><strong>DML (Data Manipulation Language):</strong> Manages data within tables.
                            <ul className="list-circle pl-6 mt-1 text-gray-600">
                                <li><code>INSERT</code>: Adds new rows.</li>
                                <li><code>UPDATE</code>: Modifies existing rows.</li>
                                <li><code>DELETE</code>: Removes specific rows.</li>
                            </ul>
                        </li>
                        <li><strong>DQL (Data Query Language):</strong> Retrieves data.
                            <ul className="list-circle pl-6 mt-1 text-gray-600">
                                <li><code>SELECT</code>: Fetches data from the database.</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                {/* 4. Advantages & Disadvantages */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-green-800 mb-2 uppercase tracking-wide text-sm">Advantages</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li><strong>Reduced Data Redundancy:</strong> Minimizes duplicate data.</li>
                            <li><strong>Data Integrity:</strong> Ensures accuracy and consistency.</li>
                            <li><strong>Data Security:</strong> Control access to data.</li>
                            <li><strong>Better Data Sharing:</strong> Multiple users can access data simultaneously.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 mb-2 uppercase tracking-wide text-sm">Disadvantages</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            <li><strong>Cost:</strong> High initial setup and maintenance cost.</li>
                            <li><strong>Complexity:</strong> Requires skilled personnel to manage.</li>
                            <li><strong>Performance:</strong> Can be slower than file systems for simple tasks.</li>
                        </ul>
                    </div>
                </section>

                {/* 5. Summary */}
                <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Summary</h3>
                    <p className="text-gray-700 text-sm">
                        In this experiment, we set up a DBMS environment and explored the fundamental building blocks of a database: Tables, Columns, and Rows. We learned that DDL commands build the skeleton (structure), while DML commands add the flesh (data). Mastering these basic commands is the first step toward becoming a database administrator or developer.
                    </p>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Initialize Environment</h4>
                        <p className="text-sm text-gray-600">Select your preferred DBMS flavor (MySQL/PostgreSQL) from the top menu to start the virtual server instance.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Define Database</h4>
                        <p className="text-sm text-gray-600">Type <code>CREATE DATABASE University;</code> in the console and execute it.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Create Schema</h4>
                        <p className="text-sm text-gray-600">Create a Student table: <code>CREATE TABLE Student (ID INT, Name VARCHAR(50), Age INT);</code></p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">4</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Populate Data</h4>
                        <p className="text-sm text-gray-600">Insert a record: <code>INSERT INTO Student VALUES (1, &apos;Alice&apos;, 20);</code> and verify with <code>SELECT * FROM Student;</code>.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "Introduction to DBMS",
                url: "https://www.youtube.com/embed/T7AXcewlGV4", // Mock URL
                description: "A comprehensive overview of Database Management Systems, their architecture, and applications."
            },
            notes: {
                title: "DBMS Fundamentals",
                content: (
                    <div className="space-y-4">
                        <p><strong>Database:</strong> An organized collection of structured information, or data, typically stored electronically in a computer system.</p>
                        <p><strong>DBMS:</strong> Software that handles the storage, retrieval, and updating of data in a computer system.</p>
                        <ul className="list-disc pl-5">
                            <li><strong>DDL (Data Definition Language):</strong> CREATE, ALTER, DROP (Structure)</li>
                            <li><strong>DML (Data Manipulation Language):</strong> SELECT, INSERT, UPDATE, DELETE (Data)</li>
                        </ul>
                    </div>
                )
            },
            quiz: {
                title: "DBMS Basics Quiz",
                questions: [
                    {
                        id: 1,
                        question: "What does DBMS stand for?",
                        options: ["Data Base Manage System", "Database Management System", "Data Basic Management Software", "Database Model System"],
                        correctAnswer: 1,
                        explanation: "DBMS stands for Database Management System."
                    },
                    {
                        id: 2,
                        question: "Which command is used to create a new table?",
                        options: ["ADD TABLE", "NEW TABLE", "CREATE TABLE", "MAKE TABLE"],
                        correctAnswer: 2,
                        explanation: "CREATE TABLE is the standard SQL command for defining a new table."
                    },
                    {
                        id: 3,
                        question: "INSERT command is an example of:",
                        options: ["DDL", "DML", "DCL", "TCL"],
                        correctAnswer: 1,
                        explanation: "INSERT is a Data Manipulation Language (DML) command used to add records."
                    }
                ]
            },
            reading: {
                title: "Further Reading",
                links: [
                    { text: "Oracle - What is a Database?", url: "https://www.oracle.com/database/what-is-database/" },
                    { text: "MySQL Documentation", url: "https://dev.mysql.com/doc/" }
                ]
            }
        }
    },

    "dbms-exp-2": {
        aim: "To design and develop a database application for a Store, Vendor, or Finance Management System. This simulation focuses on schema design, data entry forms, and transactional integrity.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        A **Database Application** is a computer program whose primary purpose is to enter and retrieve information from a computerized database. While DBMS is the backend engine, the Application is the frontend interface that users interact with.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Application Components</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li><strong>User Interface (UI):</strong> Forms for data entry and reports for viewing data.</li>
                        <li><strong>Application Logic:</strong> Validations and business rules (e.g., "Cannot sell more items than in stock").</li>
                        <li><strong>Backend Database:</strong> Tables that store the persistent data.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">3. Case Study: Components</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-2">Store Management</h4>
                            <ul className="text-xs text-blue-700 list-disc pl-4 space-y-1">
                                <li><strong>Tables:</strong> Products, Inventory, Sales</li>
                                <li><strong>Goal:</strong> Track stock levels and daily sales.</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h4 className="font-bold text-green-800 mb-2">Vendor Management</h4>
                            <ul className="text-xs text-green-700 list-disc pl-4 space-y-1">
                                <li><strong>Tables:</strong> Vendors, PurchaseOrders, Supplies</li>
                                <li><strong>Goal:</strong> Manage supplier relationships and orders.</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h4 className="font-bold text-purple-800 mb-2">Finance Management</h4>
                            <ul className="text-xs text-purple-700 list-disc pl-4 space-y-1">
                                <li><strong>Tables:</strong> Accounts, Transactions, Ledger</li>
                                <li><strong>Goal:</strong> Track income, expenses, and balance.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">4. Summary</h3>
                    <p className="text-gray-700 text-sm">
                        Building a database application requires understanding the "Business Logic" of the domain. In this experiment, you will see how a high-level action like "Sell Item" translates into multiple low-level SQL operations (Insert into Sales, Update Inventory).
                    </p>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Select Module</h4>
                        <p className="text-sm text-gray-600">Choose the system you want to simulate (Store, Vendor, or Finance).</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Master Data Entry</h4>
                        <p className="text-sm text-gray-600">Use the forms to add base data (e.g., Create new Products in Store).</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Process Transactions</h4>
                        <p className="text-sm text-gray-600">Perform actions like "Generate Bill" and observe how the underlying tables change automatically.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "Building Database Applications",
                url: "https://www.youtube.com/embed/Et51253018",
                description: "Learn how to connect a frontend application to a database backend."
            },
            notes: {
                title: "Application Architecture",
                content: (
                    <div className="space-y-4">
                        <p><strong>Two-Tier Architecture:</strong> Client directly communicates with the Database.</p>
                        <p><strong>Three-Tier Architecture:</strong> Client &harr; Application Server &harr; Database.</p>
                        <ul className="list-disc pl-5">
                            <li><strong>Presentation Layer:</strong> User Interface (UI)</li>
                            <li><strong>Business Logic Layer:</strong> Validations & Rules</li>
                            <li><strong>Data Access Layer:</strong> SQL Queries</li>
                        </ul>
                    </div>
                )
            },
            quiz: {
                title: "Application Design Quiz",
                questions: [
                    {
                        id: 1,
                        question: "Which layer interacts directly with the user?",
                        options: ["Data Layer", "Business Logic Layer", "Presentation Layer", "Database Layer"],
                        correctAnswer: 2,
                        explanation: "The Presentation Layer (UI) is the interface for the end-user."
                    },
                    {
                        id: 2,
                        question: "In a Store Management System, 'Stock' is best represented as a:",
                        options: ["Table", "Row", "Column", "Trigger"],
                        correctAnswer: 0,
                        explanation: "Stock/Inventory is an entity, so it should be a Table."
                    }
                ]
            }
        }
    },

    "dbms-exp-3": {
        aim: "To demonstrate advanced SQL operations including Joins, Subqueries, Triggers, Views, and PL/SQL blocks.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Beyond simple storage and retrieval, SQL provides powerful tools for combining data from multiple sources and automating database logic.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Joins (Combining Data)</h3>
                    <p className="text-gray-700 mb-2">Joins allow you to retrieve data from two or more tables based on a logical relationship between them.</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                        <li><strong>INNER JOIN:</strong> Returns records that have matching values in both tables.</li>
                        <li><strong>LEFT (OUTER) JOIN:</strong> Returns all records from the left table, and the matched records from the right table.</li>
                        <li><strong>RIGHT (OUTER) JOIN:</strong> Returns all records from the right table, and the matched records from the left table.</li>
                        <li><strong>FULL JOIN:</strong> Returns all records when there is a match in either left or right table.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Advanced Objects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-bold text-gray-800">Views</h4>
                            <p className="text-xs text-gray-600 mt-1">Virtual tables based on the result-set of an SQL statement. Used to simplify complex queries or restrict access to sensitive data.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-bold text-gray-800">Triggers</h4>
                            <p className="text-xs text-gray-600 mt-1">Special stored procedures that are automatically executed (fired) when an event (INSERT, UPDATE, DELETE) occurs in the database.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">4. Summary</h3>
                    <p className="text-gray-700 text-sm">
                        Joins are essential for specific reporting needs in relational databases where data is normalized (spread across tables). Triggers ensure data integrity by enforcing rules automatically at the database level.
                    </p>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Execute Joins</h4>
                        <p className="text-sm text-gray-600">Select &apos;Employee&apos; and &apos;Department&apos; tables and run an Inner Join to see employees with their department names.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Define Trigger</h4>
                        <p className="text-sm text-gray-600">Set up an &apos;Audit Trigger&apos; that logs any salary update to a separate history table.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "SQL Joins Explained",
                url: "https://www.youtube.com/embed/9yeOI0_165M",
                description: "Visualizing Inner, Left, Right, and Full Outer Joins with Venn diagrams."
            },
            notes: {
                title: "Advanced SQL Concepts",
                content: (
                    <div className="space-y-4">
                        <p><strong>JOIN:</strong> Combines rows from two or more tables based on a related column.</p>
                        <p><strong>View:</strong> A virtual table based on the result-set of an SQL statement.</p>
                        <p><strong>Trigger:</strong> A procedural code that is automatically executed in response to certain events on a particular table.</p>
                    </div>
                )
            },
            quiz: {
                title: "SQL Joins Quiz",
                questions: [
                    {
                        id: 1,
                        question: "Which JOIN returns all records from the Left table and matched records from the Right?",
                        options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"],
                        correctAnswer: 2,
                        explanation: "LEFT JOIN returns all records from the left table matched with right."
                    },
                    {
                        id: 2,
                        question: "A Trigger can execute BEFORE or AFTER which events?",
                        options: ["SELECT", "INSERT, UPDATE, DELETE", "CREATE, DROP", "GRANT, REVOKE"],
                        correctAnswer: 1,
                        explanation: "Triggers are typically fired on DML events: INSERT, UPDATE, DELETE."
                    }
                ]
            }
        }
    },

    "dbms-exp-4": {
        aim: "To analyze and decompose schemas for Normalization (1NF to 5NF) to reduce redundancy.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        <strong>Normalization</strong> is a systematic approach of decomposing tables to eliminate data redundancy (repetition) and undesirable characteristics like Insertion, Update, and Deletion Anomalies.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">2. Normal Forms</h3>
                    <div className="space-y-4">
                        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                            <h4 className="font-bold text-red-900">First Normal Form (1NF)</h4>
                            <p className="text-sm text-red-800">
                                <strong>Rule:</strong> Each column must contain atomic values (single value, not a list).<br />
                                <strong>Fix:</strong> Create a separate row for each value or separate table.
                            </p>
                        </div>
                        <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                            <h4 className="font-bold text-orange-900">Second Normal Form (2NF)</h4>
                            <p className="text-sm text-orange-800">
                                <strong>Rule:</strong> Must be in 1NF + No Partial Dependency (All non-key attributes must depend on the *entire* primary key).<br />
                                <strong>Fix:</strong> Move partial dependent data to a new table.
                            </p>
                        </div>
                        <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
                            <h4 className="font-bold text-yellow-900">Third Normal Form (3NF)</h4>
                            <p className="text-sm text-yellow-800">
                                <strong>Rule:</strong> Must be in 2NF + No Transitive Dependency (Non-key attributes should not depend on other non-key attributes).<br />
                                <strong>Fix:</strong> Move transitive data to a new table.
                            </p>
                        </div>
                        <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                            <h4 className="font-bold text-green-900">BCNF (Boyce-Codd Normal Form)</h4>
                            <p className="text-sm text-green-800">
                                <strong>Rule:</strong> A stricter version of 3NF. For every functional dependency X &rarr; Y, X must be a super key.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Summary</h3>
                    <p className="text-gray-700 text-sm">
                        Calculated normalization is a trade-off. While higher normal forms reduce redundancy, they often require more Joins which can slow down read performance. 3NF is usually considered sufficient for most business applications.
                    </p>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Identify Violations</h4>
                        <p className="text-sm text-gray-600">Look at the raw un-normalized table and identify multi-valued attributes (Violation of 1NF) or partial dependencies.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Decompose</h4>
                        <p className="text-sm text-gray-600">Use the split tool to break the table into two, selecting the appropriate Primary and Foreign keys.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Verify</h4>
                        <p className="text-sm text-gray-600">Check if the resulting tables satisfy the next Normal Form conditions.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "Normalization in DBMS",
                url: "https://www.youtube.com/embed/UrYXOV_ZHE",
                description: "Understanding 1NF, 2NF, 3NF, and BCNF with examples."
            },
            notes: {
                title: "Normalization Quick Guide",
                content: (
                    <div className="space-y-4">
                        <ul className="list-disc pl-5">
                            <li><strong>1NF:</strong> Atomic values.</li>
                            <li><strong>2NF:</strong> No Partial Dependency.</li>
                            <li><strong>3NF:</strong> No Transitive Dependency.</li>
                            <li><strong>BCNF:</strong> For X &rarr; Y, X must be a super key.</li>
                        </ul>
                    </div>
                )
            },
            quiz: {
                title: "Normalization Quiz",
                questions: [
                    {
                        id: 1,
                        question: "If A->B and B->C, then A->C is an example of:",
                        options: ["Partial Dependency", "Transitive Dependency", "Functional Dependency", "Multi-valued Dependency"],
                        correctAnswer: 1,
                        explanation: "Transitive dependency occurs when a non-prime attribute depends on another non-prime attribute."
                    },
                    {
                        id: 2,
                        question: "Which form eliminates failing 1NF?",
                        options: ["2NF", "3NF", "1NF", "BCNF"],
                        correctAnswer: 2,
                        explanation: "1NF handles atomicity."
                    }
                ]
            }
        }
    },

    "dbms-exp-5": {
        aim: "To implement Host Language Interface by embedding SQL within a high-level programming language.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        SQL is a query language, not a programming language. To build complete applications, we need to embed SQL inside a **Host Language** like C++, Java, or Python. This allows us to combine the data manipulation power of SQL with the logic and UI capabilities of the host language.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Working Principle</h3>
                    <p className="text-gray-700 mb-4">The interaction typically happens via an API or Driver (e.g., JDBC for Java, ODBC for C++, PyODBC for Python).</p>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center bg-gray-50 p-6 rounded-lg">
                        <div className="p-3 bg-white border border-gray-300 rounded text-center w-32 font-bold">Application (Java/Python)</div>
                        <div className="text-gray-400">&rarr; API Call &rarr;</div>
                        <div className="p-3 bg-blue-100 border border-blue-300 rounded text-center w-32 font-bold text-blue-900">Driver (JDBC/ODBC)</div>
                        <div className="text-gray-400">&rarr; SQL &rarr;</div>
                        <div className="p-3 bg-green-100 border border-green-300 rounded text-center w-32 font-bold text-green-900">DBMS Engine</div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Key Steps</h3>
                    <ul className="list-decimal pl-6 space-y-2 text-gray-700">
                        <li><strong>Import Driver:</strong> Load the library that talks to the DB.</li>
                        <li><strong>Establish Connection:</strong> Provide URL, Username, Password.</li>
                        <li><strong>Create Statement:</strong> Prepare the SQL query string.</li>
                        <li><strong>Execute Query:</strong> Send the query to the DBMS.</li>
                        <li><strong>Process Result:</strong> Loop through the returned rows (ResultSet).</li>
                        <li><strong>Close Connection:</strong> Release resources.</li>
                    </ul>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Setup Code</h4>
                        <p className="text-sm text-gray-600">Select the language (Java/Python) and see the boilerplate connection code.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Embed SQL</h4>
                        <p className="text-sm text-gray-600">Write a SELECT query inside the code string variable.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Run</h4>
                        <p className="text-sm text-gray-600">Compile and run the code to see the data fetched from the database printed on the console.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "JDBC Tutorial",
                url: "https://www.youtube.com/embed/2i4t-SL1CVU",
                description: "Connecting Java applications to a Database using JDBC."
            },
            notes: {
                title: "Connectivity Steps",
                content: (
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Load Driver Class</li>
                        <li>Create Connection</li>
                        <li>Create Statement</li>
                        <li>Execute Query</li>
                        <li>Process ResultSet</li>
                        <li>Close Connection</li>
                    </ol>
                )
            },
            quiz: {
                title: "Connectivity Quiz",
                questions: [
                    {
                        id: 1,
                        question: "What does JDBC stand for?",
                        options: ["Java Database Connectivity", "Java Data Control", "Joint Database Connector", "Java Data Connect"],
                        correctAnswer: 0,
                        explanation: "JDBC stands for Java Database Connectivity."
                    },
                    {
                        id: 2,
                        question: "Which interface is used to execute SQL queries?",
                        options: ["Connection", "Statement", "ResultSet", "Driver"],
                        correctAnswer: 1,
                        explanation: "The Statement interface is used to execute static SQL statements."
                    }
                ]
            }
        }
    },

    // =========================================================================
    // COMPUTER NETWORKS EXPERIMENTS
    // =========================================================================

    "cn-exp-1": {
        aim: "To study and compare the OSI (Open Systems Interconnection) reference model and the TCP/IP (Transmission Control Protocol/Internet Protocol) model.",
        theory: (
            <div className="space-y-8">
                {/* Intro */}
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Network models describe how data flows from one computer to another. The **OSI Model** is a conceptual framework that standardizes the functions of a communication system into seven abstraction layers. The **TCP/IP Model** is a more practical, condensed version that powers the modern Internet.
                    </p>
                </section>

                {/* Layers Comparison */}
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">2. Layer Comparison</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-600 border border-gray-200">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 border-b">OSI Model (7 Layers)</th>
                                    <th className="px-6 py-3 border-b">TCP/IP Model (4 Layers)</th>
                                    <th className="px-6 py-3 border-b">Function / Protocol</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">7. Application</td>
                                    <td className="px-6 py-2 row-span-3 align-middle bg-blue-50 border-white border-b">Application</td>
                                    <td className="px-6 py-2">User Interface, Email, File Transfer (HTTP, FTP, SMTP)</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">6. Presentation</td>
                                    <td className="px-6 py-2">Data formatting, Encryption</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">5. Session</td>
                                    <td className="px-6 py-2">Session management</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">4. Transport</td>
                                    <td className="px-6 py-2 bg-green-50">Transport</td>
                                    <td className="px-6 py-2">End-to-end delivery, Error recovery (TCP, UDP)</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">3. Network</td>
                                    <td className="px-6 py-2 bg-yellow-50">Internet</td>
                                    <td className="px-6 py-2">Logical addressing, Routing (IP, ICMP)</td>
                                </tr>
                                <tr className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">2. Data Link</td>
                                    <td className="px-6 py-2 bg-red-50">Network Access</td>
                                    <td className="px-6 py-2">Physical addressing (MAC), Framing</td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">1. Physical</td>
                                    <td className="px-6 py-2 bg-red-50">Network Access</td>
                                    <td className="px-6 py-2">Bits, Cables, Voltages</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Summary</h3>
                    <p className="text-gray-700 text-sm">
                        While OSI is excellent for teaching and understanding network architecture due to its detailed modularity, TCP/IP is the model that actually connects the world. OSI distinguishes clearly between Service, Interface, and Protocol; TCP/IP blurs these lines for efficiency.
                    </p>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Explore Layers</h4>
                        <p className="text-sm text-gray-600">Click on each layer in the OSI stack to see its specific PDU (Protocol Data Unit) and function.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Encapsulation Animation</h4>
                        <p className="text-sm text-gray-600">Start the packet flow simulation to see how data is wrapped with headers (Encapsulation) as it goes down and unwrapped (Decapsulation) as it goes up.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "OSI Model Explained",
                url: "https://www.youtube.com/embed/nFxmSA0lSjY",
                description: "A deep dive into the 7 layers of the OSI model."
            },
            notes: {
                title: "OSI Mnemonics",
                content: (
                    <div className="space-y-4">
                        <p><strong>P</strong>lease <strong>D</strong>o <strong>N</strong>ot <strong>T</strong>hrow <strong>S</strong>ausage <strong>P</strong>izza <strong>A</strong>way</p>
                        <ul className="list-decimal pl-5">
                            <li><strong>P</strong>hysical</li>
                            <li><strong>D</strong>ata Link</li>
                            <li><strong>N</strong>etwork</li>
                            <li><strong>T</strong>ransport</li>
                            <li><strong>S</strong>ession</li>
                            <li><strong>P</strong>resentation</li>
                            <li><strong>A</strong>pplication</li>
                        </ul>
                    </div>
                )
            },
            quiz: {
                title: "OSI Layers Quiz",
                questions: [
                    {
                        id: 1,
                        question: "Which layer is responsible for Routing?",
                        options: ["Data Link", "Network", "Transport", "Session"],
                        correctAnswer: 1,
                        explanation: "The Network layer handles logical addressing and routing."
                    },
                    {
                        id: 2,
                        question: "HTTP operates at which layer?",
                        options: ["Application", "Presentation", "Session", "Transport"],
                        correctAnswer: 0,
                        explanation: "HTTP is an Application Layer protocol."
                    }
                ]
            }
        }
    },

    "cn-exp-2": {
        aim: "To demonstrate the working of CSMA/CD (Carrier Sense Multiple Access with Collision Detection) protocol.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        **CSMA/CD** is a Media Access Control (MAC) protocol used in early Ethernet networks to manage data transmission on a shared channel (like a coaxial cable). It ensures that multiple computers can share the same wire without garbling each other&apos;s data.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Working Principle</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                        <li><strong>Carrier Sense (Listen before talking):</strong> The station listens to the channel. If it is idle, it transmits. If busy, it waits.</li>
                        <li><strong>Multiple Access (Anyone can talk):</strong> Multiple stations share the same link.</li>
                        <li><strong>Collision Detection (Stop if interrupted):</strong> While transmitting, the station monitors the link. If it detects a signal interference (collision), it stops immediately.</li>
                        <li><strong>Jamming Signal:</strong> The detecting station sends a high-frequency jamming signal to inform all other stations of the collision.</li>
                        <li><strong>Backoff:</strong> Stations wait for a random amount of time (determined by specific algorithms like Binary Exponential Backoff) before trying again.</li>
                    </ol>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Mathematical Concept</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-gray-800 mb-2">
                            Minimum Frame Size &ge; 2 * Propagation Delay * Bandwidth
                        </p>
                        <p className="text-xs text-gray-600">
                            This condition is crucial. If a frame is too small, a sender might finish transmitting before the collision signal reaches it, leading it to believe the transmission was successful when it wasn&apos;t.
                        </p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">4. Disadvantages</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li>Performance degrades heavily as network load increases.</li>
                        <li>Not suitable for long-distance networks due to propagation delay limitations.</li>
                        <li>Replaced by full-duplex switched Ethernet in modern networks.</li>
                    </ul>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Setup Network</h4>
                        <p className="text-sm text-gray-600">Add 4-5 nodes to the shared bus.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Simulate Collision</h4>
                        <p className="text-sm text-gray-600">Command two nodes to send data at the exact same time.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Observe Backoff</h4>
                        <p className="text-sm text-gray-600">Watch the nodes enter a &quot;waiting&quot; state with random timers before attempting to resend.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "CSMA/CD Animation",
                url: "https://www.youtube.com/embed/Pj-q6r4RTA0",
                description: "Visualizing Collision Detection and Backoff in Ethernet."
            },
            notes: {
                title: "CSMA/CD Steps",
                content: (
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Listen to Channel (Carrier Sense)</li>
                        <li>If Idle, Transmit</li>
                        <li>If Busy, Wait</li>
                        <li>If Collision, Send Jam Signal</li>
                        <li>Wait for Random Time (Backoff)</li>
                        <li>Retry</li>
                    </ol>
                )
            },
            quiz: {
                title: "CSMA/CD Quiz",
                questions: [
                    {
                        id: 1,
                        question: "What does CD stand for in CSMA/CD?",
                        options: ["Collision Domain", "Collision Detection", "Carrier Domain", "Carrier Detection"],
                        correctAnswer: 1,
                        explanation: "Collision Detection."
                    },
                    {
                        id: 2,
                        question: "Which algorithm is used for retransmission scheduling?",
                        options: ["Round Robin", "Binary Exponential Backoff", "Shortest Job First", "FIFO"],
                        correctAnswer: 1,
                        explanation: "Binary Exponential Backoff is used to count down a random time slot."
                    }
                ]
            }
        }
    },

    "cn-exp-3": {
        aim: "To study Token Bus and Token Ring protocols.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Unlike CSMA/CD which is random (probabilistic), Token Passing protocols are **deterministic**. They use a special control frame called a **Token** that circulates around the network. Only the station holding the token can transmit.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">2. Protocol Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-indigo-200 bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-bold text-indigo-900 mb-2">Token Ring (IEEE 802.5)</h4>
                            <ul className="list-disc pl-4 space-y-1 text-sm text-indigo-800">
                                <li><strong>Topology:</strong> Physical Ring.</li>
                                <li><strong>Mechanism:</strong> Token passes from neighbor to neighbor.</li>
                                <li><strong>Priority:</strong> Supports priority bits for QoS.</li>
                            </ul>
                        </div>
                        <div className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
                            <h4 className="font-bold text-amber-900 mb-2">Token Bus (IEEE 802.4)</h4>
                            <ul className="list-disc pl-4 space-y-1 text-sm text-amber-800">
                                <li><strong>Topology:</strong> Physical Bus, Logical Ring.</li>
                                <li><strong>Mechanism:</strong> Token passes to the station with the next lower numeric address.</li>
                                <li><strong>Use Case:</strong> Industrial automation (MAP).</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Advantages</h3>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        <li><strong>Collision Free:</strong> Since only one token exists, collisions are impossible.</li>
                        <li><strong>Fairness:</strong> Every station gets a guaranteed chance to transmit.</li>
                        <li><strong>Real-time capable:</strong> Maximum wait time is predictable.</li>
                    </ul>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Select Topology</h4>
                        <p className="text-sm text-gray-600">Choose Token Ring or Token Bus mode.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Track Token</h4>
                        <p className="text-sm text-gray-600">Observe the token (highlighted packet) moving sequentially.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Transmit</h4>
                        <p className="text-sm text-gray-600">Queue a message at Node A. Notice it waits until it receives the token to start sending.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "Token Ring vs Token Bus",
                url: "https://www.youtube.com/embed/pE4Ys57F268",
                description: "Comparing deterministic MAC protocols."
            },
            notes: {
                title: "Token Passing Mechanism",
                content: (
                    <div className="space-y-4">
                        <p><strong>Token:</strong> A special bit pattern (3 bytes) that circulates the ring.</p>
                        <ul className="list-disc pl-5">
                            <li><strong>Free Token:</strong> Can be captured by a station to transmit data.</li>
                            <li><strong>Busy Token:</strong> Carries data and cannot be used by others.</li>
                            <li><strong>Monitor Station:</strong> Ensures token is not lost or circulating endlessly.</li>
                        </ul>
                    </div>
                )
            },
            quiz: {
                title: "Token Protocols Quiz",
                questions: [
                    {
                        id: 1,
                        question: "Token Ring is standardized as:",
                        options: ["IEEE 802.3", "IEEE 802.5", "IEEE 802.11", "IEEE 802.4"],
                        correctAnswer: 1,
                        explanation: "IEEE 802.5 defines Token Ring."
                    },
                    {
                        id: 2,
                        question: "Which station can transmit data?",
                        options: ["Any station", "Station with highest priority", "Station holding the token", "Master station"],
                        correctAnswer: 2,
                        explanation: "Only the station holding the token allows transmission."
                    }
                ]
            }
        }
    },

    "cn-exp-4": {
        aim: "To visualize Sliding Window Protocols (Stop & Wait, Go-Back-N, Selective Repeat).",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Flow control protocols enable reliable data transfer between a sender and receiver. They ensure the sender does not overwhelm the receiver and that lost frames are retransmitted.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">2. Protocol Types</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h4 className="font-bold text-blue-600">Stop-and-Wait ARQ</h4>
                            <p className="text-sm text-gray-600 mt-1">Sender sends one frame, stops, and waits for ACK. Very inefficient for long distances (high propagation delay).</p>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h4 className="font-bold text-indigo-600">Go-Back-N (GBN)</h4>
                            <p className="text-sm text-gray-600 mt-1">Sender sends up to N frames (Window Size). If Frame X is lost, Receiver discards all subsequent frames. Sender retransmits everything from X.</p>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <h4 className="font-bold text-green-600">Selective Repeat (SR)</h4>
                            <p className="text-sm text-gray-600 mt-1">Receiver accepts out-of-order frames and buffers them. Sender **only** retransmits the lost Frame X. Most efficient but complex.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Mathematical Efficiency</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-gray-800">
                            Efficiency (&eta;) = N / (1 + 2a)
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            Where <strong>N</strong> is Window Size and <strong>a</strong> is (Propagation Time / Transmission Time). GBN and SR utilize the bandwidth much better than Stop-and-Wait because multiple frames are in flight simultaneously.
                        </p>
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Configure Window</h4>
                        <p className="text-sm text-gray-600">Set Window Size (N=4). Select Protocol (e.g., GBN).</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Inject Error</h4>
                        <p className="text-sm text-gray-600">While simulation runs, click &quot;Kill Packet 2&quot;.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Observe Recovery</h4>
                        <p className="text-sm text-gray-600">See GBN resend 2, 3, 4. Then switch to Selective Repeat and see it resend ONLY 2.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "Sliding Window Protocols",
                url: "https://www.youtube.com/embed/QD3-4lG7jlw",
                description: "Stop & Wait, Go-Back-N, and Selective Repeat visualized."
            },
            notes: {
                title: "Protocol Comparison",
                content: (
                    <table className="min-w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Protocol</th>
                                <th className="border p-2">Sender Window</th>
                                <th className="border p-2">Receiver Window</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border p-2">Stop-and-Wait</td>
                                <td className="border p-2">1</td>
                                <td className="border p-2">1</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Go-Back-N</td>
                                <td className="border p-2">N</td>
                                <td className="border p-2">1</td>
                            </tr>
                            <tr>
                                <td className="border p-2">Selective Repeat</td>
                                <td className="border p-2">N</td>
                                <td className="border p-2">N</td>
                            </tr>
                        </tbody>
                    </table>
                )
            },
            quiz: {
                title: "Sliding Window Quiz",
                questions: [
                    {
                        id: 1,
                        question: "In Go-Back-N, if the window size is N, the sender can send how many frames without ACK?",
                        options: ["1", "N", "N-1", "Infinite"],
                        correctAnswer: 1,
                        explanation: "The sender can have up to N unacknowledged frames in flight."
                    },
                    {
                        id: 2,
                        question: "Which protocol requires sorting at the receiver?",
                        options: ["Stop-and-Wait", "Go-Back-N", "Selective Repeat", "None"],
                        correctAnswer: 2,
                        explanation: "Selective Repeat accepts out-of-order frames, requiring a buffer to sort them."
                    }
                ]
            }
        }
    },

    "cn-exp-5": {
        aim: "To demonstrate Error Detection using Cyclic Redundancy Check (CRC).",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Data can get corrupted during transmission due to noise. **CRC** is a robust error-detection technique using polynomial division. It is widely used in Ethernet, Wi-Fi, and ATM.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Working Principle</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                        <li>Both sender and receiver agree on a **Generator Polynomial** (Divisor).</li>
                        <li>Sender appends 0s to the Data unit (equal to degree of generator).</li>
                        <li>Sender divides the augmented data by the generator (Binary Division).</li>
                        <li>The **Remainder** (CRC) is appended to the original data and sent.</li>
                        <li>Receiver divides the received data by the same generator.</li>
                        <li>If Remainder is **0**, data is correct. If non-zero, error detected.</li>
                    </ol>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Example</h3>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm leading-relaxed">
                        Data: 1101<br />
                        Generator: 1011<br /><br />
                        1. Append 3 zeros: 1101000<br />
                        2. Divide 1101000 by 1011<br />
                        3. Remainder = 001<br />
                        4. Send: 1101001
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Enter Data</h4>
                        <p className="text-sm text-gray-600">Input a binary string (e.g., 101101).</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Choose Divisor</h4>
                        <p className="text-sm text-gray-600">Select CRC-8 or CRC-32 polynomial.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0 font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Calculate</h4>
                        <p className="text-sm text-gray-600">Click generate to see the step-by-step binary division animation.</p>
                    </div>
                </div>
            </div>
        ),
        resources: {
            video: {
                title: "CRC Error Detection",
                url: "https://www.youtube.com/embed/A9g6rTPm19I",
                description: "How Cyclic Redundancy Check uses polynomial division to detect errors."
            },
            notes: {
                title: "CRC Steps",
                content: (
                    <div className="space-y-4">
                        <ul className="list-disc pl-5">
                            <li><strong>Generator:</strong> A binary string representing the divisor.</li>
                            <li><strong>Augmentation:</strong> Add (Degree of Generator) zeros to data.</li>
                            <li><strong>Division:</strong> Perform XOR division.</li>
                            <li><strong>CRC:</strong> The remainder is the CRC Code.</li>
                            <li><strong>Check:</strong> Receiver divides by same generator. Remainder 0 = Success.</li>
                        </ul>
                    </div>
                )
            },
            quiz: {
                title: "Error Detection Quiz",
                questions: [
                    {
                        id: 1,
                        question: "CRC stands for:",
                        options: ["Cyclic Redundancy Code", "Cyclic Redundancy Check", "Code Redundancy Check", "Cyclic Repetition Check"],
                        correctAnswer: 1,
                        explanation: "Cyclic Redundancy Check."
                    },
                    {
                        id: 2,
                        question: "Which operation is used in CRC division?",
                        options: ["AND", "OR", "XOR", "NOT"],
                        correctAnswer: 2,
                        explanation: "CRC uses modulo-2 arithmetic, which is equivalent to XOR."
                    }
                ]
            }
        }
    },

    // =========================================================================
    // DLD EXPERIMENTS (EXISTING PLACEHOLDERS KEPT)
    // =========================================================================
    "dld-exp-1": {
        aim: "To verify the truth tables of various Logic Gates.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Logic gates are the basic building blocks of any digital system. They are electronic circuits having one or more than one input and only one output. The relationship between the input and the output is based on a certain logic.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Basic Gates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold text-blue-600 mb-2">AND Gate</h4>
                            <p className="text-sm text-gray-600">Output is HIGH (1) only if all inputs are HIGH.</p>
                            <code className="block mt-2 font-bold text-black">Y = A . B</code>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold text-blue-600 mb-2">OR Gate</h4>
                            <p className="text-sm text-gray-600">Output is HIGH (1) if at least one input is HIGH.</p>
                            <code className="block mt-2 font-bold text-black">Y = A + B</code>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold text-blue-600 mb-2">NOT Gate</h4>
                            <p className="text-sm text-gray-600">Inverts the input. HIGH becomes LOW and vice versa.</p>
                            <code className="block mt-2 font-bold text-black">Y = A'</code>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Universal Gates</h3>
                    <p className="text-gray-700 mb-4">NAND and NOR gates are called universal gates because they can be used to implement any other logic function.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h4 className="font-bold text-red-600">NAND Gate</h4>
                            <p className="text-sm text-gray-600">Complement of AND gate.</p>
                            <code className="block mt-1">Y = (A . B)'</code>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <h4 className="font-bold text-red-600">NOR Gate</h4>
                            <p className="text-sm text-gray-600">Complement of OR gate.</p>
                            <code className="block mt-1">Y = (A + B)'</code>
                        </div>
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <p className="text-gray-700">Select a logic gate from the menu.</p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <p className="text-gray-700">Toggle the inputs A and B to observe the output Y.</p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <p className="text-gray-700">Fill the truth table based on your observations.</p>
                </div>
            </div>
        ),
        resources: {
            video: { title: "Logic Gates Explained", url: "https://www.youtube.com/embed/95kv5BF2Z9E", description: "Basic, Universal and Special gates overview." },
            quiz: {
                title: "Logic Gates Quiz",
                questions: [
                    { id: 1, question: "Which gate is called the Universal Gate?", options: ["AND", "OR", "NAND", "XOR"], correctAnswer: 2, explanation: "NAND and NOR are universal gates." },
                    { id: 2, question: "In XOR gate, if inputs are 1 and 1, output is:", options: ["0", "1", "High", "Z"], correctAnswer: 0, explanation: "XOR output is high only for different inputs." }
                ]
            }
        }
    },

    "dld-exp-2": {
        aim: "Design and Implementation of Half Adder and Full Adder.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Half Adder</h3>
                    <p className="text-gray-700 leading-relaxed">
                        A Half Adder is a combinational circuit that performs the addition of two binary bits. It has two inputs (A, B) and two outputs (Sum, Carry).
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mt-4 font-mono">
                        Sum = A ⊕ B (XOR)<br />
                        Carry = A · B (AND)
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Full Adder</h3>
                    <p className="text-gray-700 leading-relaxed">
                        A Full Adder adds three binary bits: two operands (A, B) and a carry bit (Cin) from a previous stage.
                    </p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg mt-4 font-mono text-sm leading-relaxed">
                        Sum = A ⊕ B ⊕ Cin<br />
                        C-out = (A · B) + (Cin · (A ⊕ B))
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full font-bold w-8 h-8 flex items-center justify-center">1</div>
                    <p className="text-gray-700">Connect inputs A and B for Half Adder.</p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full font-bold w-8 h-8 flex items-center justify-center">2</div>
                    <p className="text-gray-700">Apply inputs to the Full Adder including the Cin.</p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full font-bold w-8 h-8 flex items-center justify-center">3</div>
                    <p className="text-gray-700">Verify the Sum and Carry outputs against the truth table.</p>
                </div>
            </div>
        ),
        resources: {
            video: { title: "Adders Tutorial", url: "https://www.youtube.com/embed/vOjt9Z1JkSc", description: "Learn how to build Half and Full Adders." },
            quiz: {
                title: "Adders Quiz",
                questions: [
                    { id: 1, question: "How many XOR gates are needed for a Full Adder?", options: ["1", "2", "3", "0"], correctAnswer: 1, explanation: "A full adder can be built using two half adders, each using one XOR." }
                ]
            }
        }
    },

    "dld-exp-3": {
        aim: "Design and Implementation of Half Subtractor and Full Subtractor.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Half Subtractor</h3>
                    <p className="text-gray-700">Performs subtraction of two bits (A - B). Higher bit is Minuend, second is Subtrahend.</p>
                    <div className="bg-gray-50 p-4 rounded-lg font-mono">
                        Difference = A ⊕ B<br />
                        Borrow = A' · B
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Full Subtractor</h3>
                    <p className="text-gray-700">Subtracts B from A considering a borrow (Bin) from the previous stage.</p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm leading-relaxed">
                        Difference = A ⊕ B ⊕ Bin<br />
                        Borrow-out = (A' · B) + (Bin · (A ⊕ B)')
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-700">1. Setup inputs A, B, and Bin.</p>
                <p className="text-gray-700">2. Observe Difference and Borrow outputs.</p>
                <p className="text-gray-700">3. Verify with the standard truth table.</p>
            </div>
        ),
        resources: {
            video: { title: "Subtractors Explained", url: "https://www.youtube.com/embed/K841t21XvXU", description: "Visualizing binary subtraction circuits." }
        }
    },

    "dld-exp-4": {
        aim: "Design of 4-bit Binary to Gray Code Converter.",
        theory: (
            <div className="space-y-8">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Binary vs Gray Code</h3>
                    <p className="text-gray-700 leading-relaxed">
                        Gray code is a non-weighted binary code in which two successive values differ in only one bit. It is widely used in error correction in digital communications.
                    </p>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Conversion Logic</h3>
                    <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500">
                        <ul className="space-y-2 font-mono text-sm">
                            <li>G3 = B3 (MSB remains same)</li>
                            <li>G2 = B3 ⊕ B2</li>
                            <li>G1 = B2 ⊕ B1</li>
                            <li>G0 = B1 ⊕ B0</li>
                        </ul>
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Apply 4-bit binary input B3 B2 B1 B0.</li>
                    <li>Pass the inputs through XOR gates as per the conversion logic.</li>
                    <li>Verify the resulting Gray code G3 G2 G1 G0.</li>
                </ol>
            </div>
        ),
        resources: {
            video: { title: "Code Converters", url: "https://www.youtube.com/embed/Lbe3M-9K07M", description: "Logic for Binary to Gray conversion." }
        }
    },

    // =========================================================================
    // OOPS EXPERIMENTS (EXISTING PLACEHOLDERS KEPT)
    // =========================================================================
    "oops-exp-1": {
        aim: "To understand the basics of Classes and Objects.",
        theory: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Class</h3>
                    <p className="text-gray-700">A class is a user-defined data type that acts as a blueprint for creating objects. It contains data members and member functions.</p>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Object</h3>
                    <p className="text-gray-700">An object is an instance of a class. When a class is defined, no memory is allocated but when it is instantiated (i.e. an object is created) memory is allocated.</p>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Example (C++)</h3>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm leading-relaxed">
                        class Student &#123;<br />
                        &nbsp;&nbsp;public:<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;string name;<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;void display() &#123; cout &lt;&lt; name; &#125;<br />
                        &#125;;<br /><br />
                        Student s1; // Object creation
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p>1. Define a class with specific attributes.</p>
                <p>2. Create multiple objects of that class.</p>
                <p>3. Access members using the dot (.) operator.</p>
            </div>
        )
    },

    "oops-exp-2": {
        aim: "Implementation of Inheritance.",
        theory: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Concept</h3>
                    <p className="text-gray-700">Inheritance is the capability of one class to derive properties and characteristics from another class. It promotes <strong>Reusability</strong>.</p>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Types</h3>
                    <ul className="list-disc pl-6 text-gray-700">
                        <li>Single Inheritance</li>
                        <li>Multiple Inheritance</li>
                        <li>Multilevel Inheritance</li>
                        <li>Hierarchical Inheritance</li>
                    </ul>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p>1. Create a Base class (Parent).</p>
                <p>2. Create a Derived class (Child) using the inheritance syntax.</p>
                <p>3. Verify that the Child object can access Parent members.</p>
            </div>
        )
    },

    "oops-exp-3": {
        aim: "Demonstration of Polymorphism.",
        theory: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Definition</h3>
                    <p className="text-gray-700">Polymorphism means "many forms". It allows objects of different classes to be treated as objects of a common superclass.</p>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Types</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold">Compile-time</h4>
                            <p className="text-xs">Function Overloading, Operator Overloading.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold">Runtime</h4>
                            <p className="text-xs">Virtual Functions (Method Overriding).</p>
                        </div>
                    </div>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p>1. Implement method overriding in a class hierarchy.</p>
                <p>2. Use a base class pointer to call derived class methods.</p>
            </div>
        )
    },

    "oops-exp-4": {
        aim: "Data Encapsulation and Abstraction.",
        theory: (
            <div className="space-y-6">
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Encapsulation</h3>
                    <p className="text-gray-700">Binding data and functions together into a single unit (Class). It hides the data from direct access (Data Hiding).</p>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Abstraction</h3>
                    <p className="text-gray-700">Displaying only essential information and hiding the implementation details. Achieved using Header files and Abstract classes.</p>
                </section>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p>1. Use private access specifiers for data members.</p>
                <p>2. Provide public getter and setter methods.</p>
            </div>
        )
    },

};
