import { ComponentType } from 'react';
import dynamic from "next/dynamic";

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
    component?: ComponentType<any>; // Direct component reference for dynamic imports
}

// Dynamic imports for Simulation Components
// Dynamic imports for Simulation Components
const OSISimulation = dynamic(() => import("@/components/simulation/cn/OSISimulation"), { ssr: false });
const CSMASimulation = dynamic(() => import("@/components/simulation/cn/CSMASimulation"), { ssr: false });
const TokenProtocolsSimulation = dynamic(() => import("@/components/simulation/cn/TokenProtocolsSimulation"), { ssr: false });
const SlidingWindowSimulation = dynamic(() => import("@/components/simulation/cn/SlidingWindowSimulation"), { ssr: false });
const CircuitCanvas = dynamic(() => import("@/components/simulation/dld/CircuitCanvas"), { ssr: false });

const OOPSCompiler = dynamic(() => import("@/components/simulation/oops/OOPSCompiler"), { ssr: false });

const BasicOperationsSimulation = dynamic(() => import("@/components/simulation/dbms/BasicOperationsSimulation"), { ssr: false });
const ApplicationDevelopmentSimulation = dynamic(() => import("@/components/simulation/dbms/ApplicationDevelopmentSimulation"), { ssr: false });
const SQLQueriesSimulation = dynamic(() => import("@/components/simulation/dbms/SQLQueriesSimulation"), { ssr: false });
const NormalizationSimulation = dynamic(() => import("@/components/simulation/dbms/NormalizationSimulation"), { ssr: false });
const HostLanguageSimulation = dynamic(() => import("@/components/simulation/dbms/HostLanguageSimulation"), { ssr: false });

// Unified Registry Data
const Labs: LabManifest[] = [
    // --- DBMS Labs ---
    {
        id: "dbms-exp-1",
        subject: "DBMS",
        type: "learning",
        component: BasicOperationsSimulation,
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
        component: ApplicationDevelopmentSimulation,
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
        component: SQLQueriesSimulation,
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
        component: NormalizationSimulation,
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
        component: HostLanguageSimulation,
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
        component: OSISimulation,
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
        component: CSMASimulation,
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
        component: TokenProtocolsSimulation,
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
        component: SlidingWindowSimulation,
        metadata: {
            title: "Sliding Window Protocols",
            description: "Visualizing Stop & Wait, Go-Back-N, and Selective Repeat flow control.",
            difficulty: "Hard",
            thumbnailUrl: "🌐"
        }
    },

    // --- DLD Labs ---
    {
        id: "dld-exp-1",
        subject: "DLD",
        type: "experimental",
        component: CircuitCanvas,
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
        component: CircuitCanvas,
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
        component: CircuitCanvas,
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
        component: CircuitCanvas,
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
        component: OOPSCompiler,
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
        component: OOPSCompiler,
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
        component: OOPSCompiler,
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
        component: OOPSCompiler,
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
