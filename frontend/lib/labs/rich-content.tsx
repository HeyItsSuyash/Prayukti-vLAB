import React from 'react';
import { Database, Table, Columns, LayoutList } from "lucide-react";

export interface LabContent {
    aim: string;
    theory: React.ReactNode;
    procedure: React.ReactNode;
}

export const LAB_CONTENT: Record<string, LabContent> = {
    "dbms-exp-1": {
        aim: "To demonstrate the installation and basic environment setup of a Database Management System (MySQL/Oracle/PostgreSQL) and perform basic DDL/DML operations (Create Database, Create Table, Insert Record).",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    A <strong>Database Management System (DBMS)</strong> is software that allows users to define, create, maintain, and control access to the database.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2 text-blue-700">
                            <Database size={20} />
                            <h4 className="font-bold">Database</h4>
                        </div>
                        <p className="text-sm text-gray-600">An organized collection of structured information, acting as a container for tables.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2 text-green-700">
                            <Table size={20} />
                            <h4 className="font-bold">Table</h4>
                        </div>
                        <p className="text-sm text-gray-600">A collection of related data held in a table format (rows and columns).</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center gap-2 mb-2 text-purple-700">
                            <Columns size={20} />
                            <h4 className="font-bold">Field (Column)</h4>
                        </div>
                        <p className="text-sm text-gray-600">A unit of data stored in a table (e.g., Name, Age).</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-2 mb-2 text-orange-700">
                            <LayoutList size={20} />
                            <h4 className="font-bold">Record (Row)</h4>
                        </div>
                        <p className="text-sm text-gray-600">A single entry in a table representing a set of related data.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Select Environment</h4>
                        <p className="text-sm text-gray-600">Choose the database environment (MySQL, Oracle, etc.) from the dropdown.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Create Database</h4>
                        <p className="text-sm text-gray-600">Use the 'Create Database' command to initialize a new DB container.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Create Table</h4>
                        <p className="text-sm text-gray-600">Define a schema (columns and types) and create a table within the database.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">4</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Observe & Verify</h4>
                        <p className="text-sm text-gray-600">Check the visual representation and the generated SQL log.</p>
                    </div>
                </div>
            </div>
        )
    },
    "dbms-exp-2": {
        aim: "To design and develop a database application for a Store, Vendor, or Finance Management System. This simulation focuses on schema design, data entry forms, and transactional integrity.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Database applications serve as the interface between end-users and the database management system. They allow users to perform operations like inserting data (e.g., New Customer), updating records (e.g., Stock Update), and viewing reports without writing raw SQL.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-2">Store Management</h4>
                        <p className="text-xs text-blue-700">Tracks Inventory, Products, and Sales.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h4 className="font-bold text-green-800 mb-2">Vendor Management</h4>
                        <p className="text-xs text-green-700">Manages Suppliers, Purchase Orders, and Deliveries.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h4 className="font-bold text-purple-800 mb-2">Finance Management</h4>
                        <p className="text-xs text-purple-700">Handles Transactions, Ledgers, and Accounts.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Select Mode</h4>
                        <p className="text-sm text-gray-600">Choose between Store, Vendor, or Finance application modes.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Manage Master Data</h4>
                        <p className="text-sm text-gray-600">Use forms to adding new Entities (e.g., Add a new Item to Store, Add a new Vendor).</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Perform Transactions</h4>
                        <p className="text-sm text-gray-600">Execute business logic (e.g., Place an Order) and observe how multiple tables update automatically.</p>
                    </div>
                </div>
            </div>
        )
    },
    "dbms-exp-3": {
        aim: "To demonstrate advanced SQL operations including Joins, Subqueries, Triggers, Views, PL/SQL blocks, and Transaction Control Language (TCL) commands using a visual query builder and execution engine.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Advanced SQL goes beyond basic CRUD to handle complex data relationships and automated logic.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-2">Joins</h4>
                        <p className="text-xs text-blue-700">Combine rows from two or more tables based on a related column between them.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h4 className="font-bold text-purple-800 mb-2">Triggers</h4>
                        <p className="text-xs text-purple-700">Stored procedures that automatically execute (fire) when a specific event occurs.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Explore Modules</h4>
                        <p className="text-sm text-gray-600">Switch between Logical Operators, Functions, Joins, and Advanced Concepts using the sidebar.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Execute Queries</h4>
                        <p className="text-sm text-gray-600">Use the interactive controls or SQL Console to run commands against the mock Student/Enrollment database.</p>
                    </div>
                </div>
            </div>
        )
    },
    "dbms-exp-4": {
        aim: "To strict functional dependencies and normalize a database table into 1NF, 2NF, 3NF, and BCNF through a step-by-step interactive definition.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    <strong>Normalization</strong> is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves breaking down large tables into smaller, related tables.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h4 className="font-bold text-red-800 mb-1">1NF (First Normal Form)</h4>
                        <p className="text-xs text-red-700">Eliminate repeating groups. Ensure atomicity.</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h4 className="font-bold text-orange-800 mb-1">2NF (Second Normal Form)</h4>
                        <p className="text-xs text-orange-700">Eliminate Partial Dependencies (Non-key depends on part of Composite Key).</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <h4 className="font-bold text-yellow-800 mb-1">3NF (Third Normal Form)</h4>
                        <p className="text-xs text-yellow-700">Eliminate Transitive Dependencies (Non-key depends on another Non-key).</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h4 className="font-bold text-green-800 mb-1">BCNF (Boyce-Codd NF)</h4>
                        <p className="text-xs text-green-700">A stricter version of 3NF where every determinant must be a Super Key.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Identify Redundancy</h4>
                        <p className="text-sm text-gray-600">Observe the unnormalized table and identify repeating groups and anomalies.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Decompose Step-by-Step</h4>
                        <p className="text-sm text-gray-600">Apply normalization rules sequentially (1NF &rarr; 2NF &rarr; 3NF) using the simulation tools.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Verify Dependencies</h4>
                        <p className="text-sm text-gray-600">Ensure all functional dependencies are preserved and no data is lost during decomposition.</p>
                    </div>
                </div>
            </div>
        )
    },
    "dbms-exp-5": {
        aim: "To demonstrate the Host Language Interface by embedding SQL commands (SELECT, INSERT, UPDATE, DELETE) within high-level languages like Java, Python, and C++.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    A <strong>Host Language Interface</strong> allows SQL queries to be embedded in procedural programming languages (the "Host" language). This enables applications to interact with the database dynamically.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-2">JDBC (Java)</h4>
                        <p className="text-xs text-blue-700">Java Database Connectivity API for executing SQL in Java.</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <h4 className="font-bold text-yellow-800 mb-2">DB-API (Python)</h4>
                        <p className="text-xs text-yellow-700">Standard database interface for Python.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Select Language</h4>
                        <p className="text-sm text-gray-600">Choose between Java, Python, or C++ syntax.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Edit Code</h4>
                        <p className="text-sm text-gray-600">Modify the embedded SQL string within the code editor.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-full shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-gray-900">Compile & Run</h4>
                        <p className="text-sm text-gray-600">Execute the simulation to see the driver load, connection establish, and query execution.</p>
                    </div>
                </div>
            </div>
        )
    },
    // --- CN Labs ---
    "cn-exp-1": {
        aim: "To study and compare the OSI Reference Model and TCP/IP Model.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    The <strong>OSI (Open Systems Interconnection)</strong> model is a conceptual framework used to describe the functions of a networking system. The <strong>TCP/IP</strong> model is a more practical framework used for the Internet.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-2">OSI Model</h4>
                        <p className="text-xs text-blue-700">7 Layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <h4 className="font-bold text-green-800 mb-2">TCP/IP Model</h4>
                        <p className="text-xs text-green-700">4 Layers: Network Interface, Internet, Transport, Application.</p>
                    </div>
                </div>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Review the layered architecture and understand the function of each layer.</p>
            </div>
        )
    },
    // ... [Content abbreviated for brevity in tool call, but full content will be passed] ...
    "cn-exp-2": {
        aim: "To simulate and understand the CSMA/CD protocol.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    <strong>CSMA/CD (Carrier Sense Multiple Access with Collision Detection)</strong> is a media access control method used most notably in early Ethernet technology.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Interact with the simulation to observe packet collisions and backoff mechanisms.</p>
            </div>
        )
    },
    "cn-exp-3": {
        aim: "To study Token Bus and Token Ring protocols.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Token passing protocols use a token to control access to the transmission medium, preventing collisions.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Observe how the token is passed around the ring/bus and how data is transmitted.</p>
            </div>
        )
    },
    "cn-exp-4": {
        aim: "To visualize Sliding Window Protocols (Stop & Wait, Go-Back-N, Selective Repeat).",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Sliding window protocols are used for reliable data transmission and flow control.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Experiment with different window sizes and error rates.</p>
            </div>
        )
    },

    // --- DLD Labs ---
    "dld-exp-1": {
        aim: "To verify the truth tables of various Logic Gates.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Logic gates are the basic building blocks of any digital system.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Select a gate, apply input combinations, and verify the output LED status.</p>
            </div>
        )
    },
    "dld-exp-2": {
        aim: "To design and implement Half Adder and Full Adder circuits.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Adders are digital circuits that perform addition of numbers.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Connect the gates to form Half/Full Adder circuits and test with inputs.</p>
            </div>
        )
    },
    "dld-exp-3": {
        aim: "To design and implement Half Subtractor and Full Subtractor circuits.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Subtractors are digital circuits that perform subtraction of numbers.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Connect the gates to form Half/Full Subtractor circuits and verify outputs.</p>
            </div>
        )
    },
    "dld-exp-4": {
        aim: "To design a 4-bit Binary to Gray Code Converter.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Code converters are used to translate data from one format to another.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Build the conversion circuit and verify the Gray code output for binary inputs.</p>
            </div>
        )
    },

    // --- OOPS Labs ---
    "oops-exp-1": {
        aim: "To understand the basics of Classes and Objects in C++.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    A Class is a blueprint for creating objects, providing initial values for state and implementations of behavior.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Define a class, create objects, and access members.</p>
            </div>
        )
    },
    "oops-exp-2": {
        aim: "To implement Inheritance in C++.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Inheritance allows a class to derive features from another class.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Create base and derived classes and demonstrate access specifiers.</p>
            </div>
        )
    },
    "oops-exp-3": {
        aim: "To demonstrate Polymorphism (Overloading and Overriding).",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Polymorphism allows objects to be treated as instances of their parent class.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Implement function overloading and virtual functions.</p>
            </div>
        )
    },
    "oops-exp-4": {
        aim: "To understand Data Encapsulation and Abstraction.",
        theory: (
            <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                    Encapsulation bundles data and methods, while abstraction hides complex implementation details.
                </p>
            </div>
        ),
        procedure: (
            <div className="space-y-4">
                <p className="text-gray-600">Use access modifiers (private, public, protected) to control data access.</p>
            </div>
        )
    }
};
