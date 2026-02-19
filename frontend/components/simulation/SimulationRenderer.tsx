"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamic imports with ssr: false to prevent hydration mismatch and server errors
const OSISimulation = dynamic(() => import("@/components/simulation/cn/OSISimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const CSMASimulation = dynamic(() => import("@/components/simulation/cn/CSMASimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const TokenProtocolsSimulation = dynamic(() => import("@/components/simulation/cn/TokenProtocolsSimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const SlidingWindowSimulation = dynamic(() => import("@/components/simulation/cn/SlidingWindowSimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const CircuitCanvas = dynamic(() => import("@/components/simulation/dld/CircuitCanvas"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const OOPSCompiler = dynamic(() => import("@/components/simulation/oops/OOPSCompiler"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const BasicOperationsSimulation = dynamic(() => import("@/components/simulation/dbms/BasicOperationsSimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const ApplicationDevelopmentSimulation = dynamic(() => import("@/components/simulation/dbms/ApplicationDevelopmentSimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const SQLQueriesSimulation = dynamic(() => import("@/components/simulation/dbms/SQLQueriesSimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const NormalizationSimulation = dynamic(() => import("@/components/simulation/dbms/NormalizationSimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});
const HostLanguageSimulation = dynamic(() => import("@/components/simulation/dbms/HostLanguageSimulation"), {
    ssr: false,
    loading: () => <LoadingSpinner />
});

const LoadingSpinner = () => (
    <div className="flex h-full w-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading Simulation...</span>
    </div>
);

// Map of registry IDs to Components
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    // CN
    "cn-exp-1": OSISimulation,
    "cn-exp-2": CSMASimulation,
    "cn-exp-3": TokenProtocolsSimulation,
    "cn-exp-4": SlidingWindowSimulation,

    // DLD
    "dld-exp-1": CircuitCanvas,
    "dld-exp-2": CircuitCanvas,
    "dld-exp-3": CircuitCanvas,
    "dld-exp-4": CircuitCanvas,
    "dld-exp-5": CircuitCanvas,
    "dld-exp-6": CircuitCanvas,
    "dld-exp-7": CircuitCanvas,
    "dld-exp-8": CircuitCanvas,
    "dld-exp-9": CircuitCanvas,
    "dld-exp-10": CircuitCanvas,

    // OOPS
    "oops-exp-1": OOPSCompiler,
    "oops-exp-2": OOPSCompiler,
    "oops-exp-3": OOPSCompiler,
    "oops-exp-4": OOPSCompiler,

    // DBMS
    "dbms-exp-1": BasicOperationsSimulation,
    "dbms-exp-2": ApplicationDevelopmentSimulation,
    "dbms-exp-3": SQLQueriesSimulation,
    "dbms-exp-4": NormalizationSimulation,
    "dbms-exp-5": HostLanguageSimulation,
};

export default function SimulationRenderer({ labId }: { labId: string }) {
    const Component = COMPONENT_MAP[labId];

    if (!Component) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
                <p>Simulation component not found for ID: {labId}</p>
            </div>
        );
    }

    return <Component practicalId={labId} />;
}
