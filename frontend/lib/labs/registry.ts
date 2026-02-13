// Define strict types for the registry
export type LabSubject = "DBMS" | "CN" | "OOPS" | "DLD";
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
            description: "Master the fundamentals of digital electronics, logic gates, and circuit design.",
            difficulty: "Easy",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-2",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Design and Implementation of Half Adder and Full Adder",
            description: "Construct combinational circuits to perform addition.",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-3",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Design and Implementation of Half Subtractor and Full Subtractor",
            description: "Construct combinational circuits to perform subtraction.",
            difficulty: "Medium",
            thumbnailUrl: "⚡"
        }
    },
    {
        id: "dld-exp-4",
        subject: "DLD",
        type: "experimental",
        metadata: {
            title: "Design of 4-bit Binary to Gray Code Converter",
            description: "Learn code conversion techniques using logic gates.",
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
    }
];

// Helper Functions
export const getLabs = () => Labs;
export const getLabById = (id: string) => Labs.find(l => l.id === id);
export const getLabsBySubject = (subject: LabSubject) => Labs.filter(l => l.subject === subject);
