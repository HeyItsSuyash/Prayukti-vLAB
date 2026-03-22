import React from "react";
import dynamic from "next/dynamic";

// Define strict types for the registry
export type LabSubject = "DBMS" | "CN" | "OOPS" | "DLD" | "MPMC" | "C" | "DSA" | "DAA";
export type LabType = "learning" | "experimental";
export type LabDifficulty = "Easy" | "Medium" | "Hard";

export interface LabMetadata {
    title: string;
    description?: string;
    difficulty: LabDifficulty;
    prerequisites?: string[];
    estimatedTime?: string;
    thumbnailUrl?: string; // Icon or Image path
}

export interface LabManifest {
    id: string; // e.g., "dbms-exp-1"
    subject: LabSubject;
    type: LabType;
    metadata: LabMetadata;
    componentId?: string; // For dynamic loading mapping if needed
}

// Unified Registry Data
const Labs: LabManifest[] = [
    // --- C Programming Labs ---
    {
        id: "c-exp-1",
        subject: "C",
        type: "experimental",
        metadata: {
            title: "Sum of Natural Numbers",
            description: "Calculate the sum of first N natural numbers using a loop.",
            difficulty: "Easy",
            thumbnailUrl: "💻"
        }
    },
    {
        id: "c-exp-2",
        subject: "C",
        type: "experimental",
        metadata: {
            title: "Factorial of a Number",
            description: "Recursive implementation of factorial calculation.",
            difficulty: "Easy",
            thumbnailUrl: "💻"
        }
    },

    // --- DSA Labs ---
    {
        id: "dsa-exp-1",
        subject: "DSA",
        type: "experimental",
        metadata: {
            title: "Binary Search Implementation",
            description: "Efficient searching in a sorted array using binary search.",
            difficulty: "Medium",
            thumbnailUrl: "📊"
        }
    },
    {
        id: "dsa-exp-2",
        subject: "DSA",
        type: "experimental",
        metadata: {
            title: "Reverse an Array",
            description: "Algorithm to reverse elements of an array in-place.",
            difficulty: "Easy",
            thumbnailUrl: "📊"
        }
    },

    // --- DBMS Labs ---
    {
        id: "dbms-exp-1",
        subject: "DBMS",
        type: "learning",
        metadata: {
            title: "Introduction to DBMS",
            description: "Basic DDL/DML Operations (Create, Insert, Select)",
            difficulty: "Easy",
            prerequisites: ["None"],
            estimatedTime: "30 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-2",
        subject: "DBMS",
        type: "experimental",
        metadata: {
            title: "Database Application Development",
            description: "Build a Store Management System with Finance & Inventory",
            difficulty: "Medium",
            prerequisites: ["Exp 1"],
            estimatedTime: "45 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-3",
        subject: "DBMS",
        type: "experimental",
        metadata: {
            title: "SQL Queries & Operations",
            description: "Advanced SQL: Joins, Subqueries, Triggers, Views",
            difficulty: "Hard",
            prerequisites: ["Exp 2"],
            estimatedTime: "60 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-4",
        subject: "DBMS",
        type: "learning",
        metadata: {
            title: "Normalization",
            description: "Analyze and Decompose schemas (1NF to 5NF)",
            difficulty: "Hard",
            prerequisites: ["Relational Model"],
            estimatedTime: "40 min",
            thumbnailUrl: "🗄️"
        }
    },
    {
        id: "dbms-exp-5",
        subject: "DBMS",
        type: "experimental",
        metadata: {
            title: "Host Language Interface",
            description: "Embed SQL in Java/Python/C++ Applications",
            difficulty: "Medium",
            prerequisites: ["SQL Basics"],
            estimatedTime: "30 min",
            thumbnailUrl: "🗄️"
        }
    },

    // --- CN Labs ---
    {
        id: "cn-exp-1",
        subject: "CN",
        type: "learning",
        metadata: {
            title: "OSI vs TCP/IP Reference Models",
            description: "Comparative study of OSI 7-layer and TCP/IP 4-layer models.",
            difficulty: "Easy",
            thumbnailUrl: "🌐"
        }
    },
    {
        id: "cn-exp-2",
        subject: "CN",
        type: "experimental",
        metadata: {
            title: "CSMA/CD Protocol Study",
            description: "Interactive simulation of Carrier Sense Multiple Access with Collision Detection.",
            difficulty: "Medium",
            prerequisites: ["cn-exp-1"],
            thumbnailUrl: "🌐"
        }
    },
    {
        id: "cn-exp-3",
        subject: "CN",
        type: "experimental",
        metadata: {
            title: "Token Bus and Token Ring Protocols",
            description: "Study of deterministic channel access using token passing mechanisms.",
            difficulty: "Medium",
            thumbnailUrl: "🌐"
        }
    },
    {
        id: "cn-exp-4",
        subject: "CN",
        type: "experimental",
        metadata: {
            title: "Sliding Window Protocols",
            description: "Visualizing Stop & Wait, Go-Back-N, and Selective Repeat flow control.",
            difficulty: "Hard",
            thumbnailUrl: "🌐"
        }
    },
    {
        id: "cn-exp-5",
        subject: "CN",
        type: "experimental",
        metadata: {
            title: "Cyclic Redundancy Check (CRC)",
            description: "Implement and verify error detection using CRC polynomials.",
            difficulty: "Medium",
            thumbnailUrl: "🌐"
        }
    },

    // --- DLD Labs ---
    {
        id: "dld-exp-1",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Study and Verification of Logic Gates",
            description: "Study of basic logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR).",
            difficulty: "Easy",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-2",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Half Adder and Full Adder",
            description: "Design and verification of Half Adder and Full Adder circuits.",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-3",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Half Subtractor and Full Subtractor",
            description: "Design and verification of Half Subtractor and Full Subtractor circuits.",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-4",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Code Conversion (Binary to Gray & Gray to Binary)",
            description: "Design 4-bit Binary to Gray and Gray to Binary code converters.",
            difficulty: "Hard",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-5",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Combinational Logic Design (SOP & POS)",
            description: "Design and verify combinational logic in SOP and POS forms.",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-6",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Decoder and Encoder Circuits",
            description: "Realization of 2:4 Decoder and 4:2 Encoder circuits.",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-7",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Multiplexer and Demultiplexer",
            description: "Design and verify 4:1 Multiplexer and 1:4 Demultiplexer.",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-8",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Comparators (1-bit & 4-bit)",
            description: "Design 1-bit comparator and study 4-bit comparator (IC 7485).",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-9",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Flip-Flops and Shift Registers",
            description: "Verify SR, D, JK, T Flip-Flops and Shift Registers (SISO, SIPO, PISO, PIPO).",
            difficulty: "Hard",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-10",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Synchronous and Asynchronous Counters",
            description: "Design and verify Asynchronous (Mod-n) and Synchronous counters.",
            difficulty: "Hard",
            thumbnailUrl: "⚡"
        }
    },

    // --- OOPS Labs ---
    {
        id: "oops-exp-1",
        subject: "OOPS",
        type: "learning",
        metadata: {
            title: "Introduction to Classes and Objects",
            description: "Understanding class structure, attributes, methods, and instantiation.",
            difficulty: "Easy",
            thumbnailUrl: "💻"
        }
    },
    {
        id: "oops-exp-2",
        subject: "OOPS",
        type: "learning",
        metadata: {
            title: "Implementation of Inheritance",
            description: "Learn how to establish parent-child relationships between classes.",
            difficulty: "Medium",
            thumbnailUrl: "💻"
        }
    },
    {
        id: "oops-exp-3",
        subject: "OOPS",
        type: "learning",
        metadata: {
            title: "Demonstration of Polymorphism",
            description: "Explore method overriding and overloading concepts.",
            difficulty: "Medium",
            thumbnailUrl: "💻"
        }
    },
    {
        id: "oops-exp-4",
        subject: "OOPS",
        type: "learning",
        metadata: {
            title: "Data Encapsulation and Abstraction",
            description: "Master information hiding and abstract class design.",
            difficulty: "Hard",
            thumbnailUrl: "💻"
        }
    },

    // --- MPMC Labs ---
    {
        id: "mpmc-exp-1",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Decimal Addition & Subtraction",
            description: "Binary Coded Decimal (BCD) arithmetic using DAA instruction.",
            difficulty: "Medium",
            thumbnailUrl: "📟"
        }
    },
    {
        id: "mpmc-exp-2",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Hexadecimal Addition & Subtraction",
            description: "8-bit hexadecimal arithmetic operations.",
            difficulty: "Easy",
            thumbnailUrl: "📟"
        }
    },
    {
        id: "mpmc-exp-3",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Addition & Subtraction of Two BCD Numbers",
            description: "Advanced BCD operations with carry/borrow handling.",
            difficulty: "Hard",
            thumbnailUrl: "📟"
        }
    },
    {
        id: "mpmc-exp-4",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Multiplication & Division of Two 8-bit Numbers",
            description: "Repeated addition and repeated subtraction methods.",
            difficulty: "Medium",
            thumbnailUrl: "📟"
        }
    },
    {
        id: "mpmc-exp-5",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Find Largest & Smallest Number in an Array",
            description: "Array traversal and comparison logic.",
            difficulty: "Medium",
            thumbnailUrl: "📟"
        }
    },
    {
        id: "mpmc-exp-6",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Arrange Array in Ascending Order",
            description: "Bubble sort implementation on 8085.",
            difficulty: "Hard",
            thumbnailUrl: "📟"
        }
    },
    {
        id: "mpmc-exp-7",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Arrange Array in Descending Order",
            description: "Selection/Bubble sort for descending order.",
            difficulty: "Hard",
            thumbnailUrl: "📟"
        }
    },
    {
        id: "mpmc-exp-8",
        subject: "MPMC",
        type: "experimental",
        metadata: {
            title: "Hexadecimal to ASCII & Vice Versa",
            description: "Character encoding and data conversion.",
            difficulty: "Medium",
            thumbnailUrl: "📟"
        }
    },

    // --- DAA Labs ---
    {
        id: "daa-exp-1",
        subject: "DAA",
        type: "experimental",
        metadata: {
            title: "Insertion Sort Time Complexity",
            description: "Analyze the time complexity of Insertion Sort with different input sizes.",
            difficulty: "Medium",
            estimatedTime: "45 min",
            thumbnailUrl: "📊"
        }
    }
];

// Helper Functions
export const getLabs = () => Labs;
export const getLabById = (id: string) => Labs.find(l => l.id === id);
export const getLabsBySubject = (subject: LabSubject) => Labs.filter(l => l.subject === subject);
