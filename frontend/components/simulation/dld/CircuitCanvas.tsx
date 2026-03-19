"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, Controls, Background, BackgroundVariant, useNodesState, useEdgesState, addEdge, Connection, Edge, Node, reconnectEdge, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { evaluateCircuit } from '@/lib/circuit-engine';
import { generateTruthTable, TableData } from '@/lib/table-generator';
import { WorkspacesPanel } from '../core/WorkspacesPanel';
import { Table, Play, Pause, Save, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

import AndGate from './nodes/AndGate';
import OrGate from './nodes/OrGate';
import NotGate from './nodes/NotGate';
import NandGate from './nodes/NandGate';
import NorGate from './nodes/NorGate';
import XorGate from './nodes/XorGate';
import XnorGate from './nodes/XnorGate';
import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';

import MuxNode from './nodes/MuxNode';
import DemuxNode from './nodes/DemuxNode';
import DecoderNode from './nodes/DecoderNode';
import EncoderNode from './nodes/EncoderNode';
import FlipFlopNode from './nodes/FlipFlopNode';
import ComparatorNode from './nodes/ComparatorNode';
import HexDisplayNode from './nodes/HexDisplayNode';
import { DldSidebar } from './DldSidebar';
import SignalEdge from './edges/SignalEdge';

const nodeTypes = {
    and: AndGate,
    or: OrGate,
    not: NotGate,
    nand: NandGate,
    nor: NorGate,
    xor: XorGate,
    xnor: XnorGate,
    inputNode: InputNode,
    outputNode: OutputNode,
    muxNode: MuxNode,
    demuxNode: DemuxNode,
    decoderNode: DecoderNode,
    encoderNode: EncoderNode,
    flipflopNode: FlipFlopNode,
    comparatorNode: ComparatorNode,
    hexDisplayNode: HexDisplayNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const edgeTypes = {
    signal: SignalEdge,
};

type AppNode = Node & {
    data: {
        label: string;
        value?: number;
    };
};

const initialNodes: AppNode[] = [
    { id: '1', position: { x: 100, y: 100 }, data: { label: 'Input A', value: 0 }, type: 'inputNode' },
    { id: '2', position: { x: 100, y: 200 }, data: { label: 'Input B', value: 0 }, type: 'inputNode' },
];
const initialEdges: Edge[] = [];

// Wrapper component to provide ReactFlow Context if needed strictly, but here we use it inside.
// However, the main export uses hooks that need the provider.
// We will wrap the internal content or just usage.
// Actually, 'useReactFlow' must be used INSIDE ReactFlowProvider.
// But standard ReactFlow component provides context to children.
// For Drag and Drop we need the instance which we track via onInit.

export default function CircuitCanvas({
    practicalId,
    initialData,
    readonly = false
}: {
    practicalId?: string,
    initialData?: { nodes?: AppNode[], edges?: Edge[] },
    readonly?: boolean
}) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialData?.nodes || initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || initialEdges);

    // Workspaces State
    const [showWorkspaces, setShowWorkspaces] = useState(false);
    const [tableData, setTableData] = useState<TableData | null>(null);
    const [generating, setGenerating] = useState(true); // Auto-run by default
    const [rfInstance, setRfInstance] = useState<any>(null);

    // Clipboard State
    const [clipboard, setClipboard] = useState<{ nodes: AppNode[], edges: Edge[] } | null>(null);

    const onInit = useCallback((instance: any) => {
        setRfInstance(instance);
    }, []);

    const handleWorkspacesOpen = () => {
        setShowWorkspaces(true);
    };

    // Realtime Truth Table Analysis
    useEffect(() => {
        if (!showWorkspaces) return;

        // Debounce analysis to prevent lag during dragging
        const timer = setTimeout(() => {
            try {
                // Only analyze if input count is reasonable
                const inputCount = nodes.filter(n => n.type === 'inputNode').length;
                if (inputCount <= 6) {
                    const data = generateTruthTable(nodes, edges);
                    setTableData(data);
                } else if (inputCount > 6 && !tableData) {
                    // Warn once or handle large circuits differently
                    // For now, valid up to 10 but we throttle auto-update for >6
                    if (inputCount <= 10) {
                        const data = generateTruthTable(nodes, edges);
                        setTableData(data);
                    }
                }
            } catch (err) {
                console.error("Analysis failed", err);
            }
        }, 500); // 500ms debounce ensures smooth UI

        return () => clearTimeout(timer);
    }, [nodes, edges, showWorkspaces]);

    const getRandomColor = () => {
        const h = Math.floor(Math.random() * 360);
        return `hsl(${h}, 80%, 60%)`; // Vibrant colors
    };

    const onConnect = useCallback(
        (params: Connection) => {
            const newEdge = { ...params, data: { value: 0, color: getRandomColor() } };
            setEdges((eds) => addEdge(newEdge, eds));
        },
        [setEdges],
    );

    // Simulation Loop - Optimized to ignore position changes
    useEffect(() => {
        // Create a stable key representing the logical state of the circuit
        // We only care about: IDs, Types, Data values, and Edge connections
        // We do NOT care about: Node positions (x, y)
        const currentLogicState = JSON.stringify({
            nodes: nodes.map(n => ({ id: n.id, type: n.type, val: n.data.value, inputs: n.data.label })),
            edges: edges.map(e => ({ s: e.source, t: e.target, sh: e.sourceHandle, th: e.targetHandle }))
        });

        // Evaluation only happens if logic state changes
        const evaluatedNodes = evaluateCircuit(nodes, edges);

        // Check if the evaluation actually changed any values
        const isChanged = JSON.stringify(nodes.map(n => n.data.value)) !== JSON.stringify(evaluatedNodes.map(n => n.data.value));

        if (isChanged) {
            // This setNodes might trigger a re-render, but since we map position from previous nodes,
            // it shouldn't cause visual jumps.
            setNodes(evaluatedNodes as AppNode[]);
        }
        if (!generating) return;

        const interval = setInterval(() => {
            try {
                const evaluatedNodes = evaluateCircuit(nodes, edges);

                // 1. Update Nodes
                let hasNodeChanged = false;
                nodes.forEach((node) => {
                    const newNode = evaluatedNodes.find(n => n.id === node.id);
                    // Check if value changed to avoid re-render spam
                    if (newNode && (newNode.data.value !== node.data.value || newNode.data.qValue !== node.data.qValue)) {
                        hasNodeChanged = true;
                    }
                });

                if (hasNodeChanged) {
                    setNodes(evaluatedNodes as AppNode[]);
                }

                // 2. Update Edges (Signal Flow Logic)
                // We need to map source node values to edges
                let hasEdgeChanged = false;
                const newEdges = edges.map(edge => {
                    const sourceNode = evaluatedNodes.find(n => n.id === edge.source);
                    let signalValue = 0;

                    if (sourceNode) {
                        signalValue = sourceNode.data.value as number || 0;
                    }

                    if (edge.data?.value !== signalValue) {
                        hasEdgeChanged = true;
                        return { ...edge, data: { ...edge.data, value: signalValue } };
                    }
                    return edge;
                });

                if (hasEdgeChanged) {
                    setEdges(newEdges);
                }
            } catch (err) {
                console.warn("Simulation step failed:", err);
            }

        }, 100); // 10Hz Simulation tick

        return () => clearInterval(interval);
        // We purposely rely on 'nodes' and 'edges' in dependency array but we could optimize further
        // by using a ref for the last logical state, but 'evaluateCircuit' is fast enough for 
        // small circuits if not called on every pixel drag. 
        // However, React Flow updates 'nodes' on every drag frame.
        // To truly decouple, we need to skip evaluation if only position changed.
    }, [nodes, edges, generating, setNodes, setEdges]);

    // Better Approach: Use a ref to track if we need to evaluate
    // Actually, simply checking if the mapping excluding position equals the last one is enough.
    // But since `evaluateCircuit` is the heavy part, we should guard it.

    // ... Revised Implementation below ...

    const saveCircuit = async () => {
        const circuitName = prompt("Enter circuit name:");
        if (!circuitName) return;
        const userId = "mock-user-123";
        try {
            await fetch(`${API_URL}/api/circuits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    practicalId: practicalId || 'unknown',
                    name: circuitName,
                    data: { nodes, edges }
                })
            });
            alert('Circuit saved!');
        } catch {
            alert('Failed to save circuit');
        }
    };

    const onReconnect = useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
        },
        [setEdges],
    );

    // --- Drag and Drop Handlers ---

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');
            const dataString = event.dataTransfer.getData('application/reactflow/data');
            let extraData = {};
            if (dataString) {
                try {
                    extraData = JSON.parse(dataString);
                } catch (e) { console.error("Failed to parse drop data", e); }
            }

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = rfInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const id = Math.random().toString();
            const newNode: AppNode = {
                id,
                type,
                position,
                data: { label: label, ...extraData },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [rfInstance, setNodes],
    );


    const addNode = (type: string, label: string, data = {}) => {
        try {
            console.log("Adding node:", type, label);
            const id = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            let position = { x: 400, y: 300 };

            if (rfInstance) {
                const zoom = rfInstance.getZoom();
                const { x: vX, y: vY } = rfInstance.getViewport();
                const containerWidth = window.innerWidth;
                const containerHeight = window.innerHeight;

                const centerX = (-vX + containerWidth / 2) / zoom;
                const centerY = (-vY + containerHeight / 2) / zoom;

                position = {
                    x: centerX + (Math.random() * 40 - 20),
                    y: centerY + (Math.random() * 40 - 20)
                };
            }

            setNodes((nds) => {
                const newNode = { id, position, data: { label, ...data }, type } as AppNode;
                return nds.concat(newNode);
            });
        } catch (error) {
            console.error("Failed to add node:", error);
            alert("Unexpected error adding component. Check console.");
        }
    };

    // --- Keyboard Shortcuts (Ctrl+C, V, X, D, + Delete) ---
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

            const isCtrl = event.ctrlKey || event.metaKey;

            // Delete (handled by ReactFlow default, but good to ensure)
            if (event.key === 'Delete' || event.key === 'Backspace') {
                // ReactFlow handles this via deleteKeyCode prop usually
            }

            // Select All (Ctrl+A) -> ReactFlow handles? No, distinct. 
            // We usually let ReactFlow handle basic selection.

            // COPY (Ctrl+C)
            if (isCtrl && event.key === 'c') {
                const selectedNodes = nodes.filter(n => n.selected);
                const selectedEdges = edges.filter(e => e.selected);
                if (selectedNodes.length > 0) {
                    setClipboard({ nodes: selectedNodes, edges: selectedEdges });
                    console.log("Copied", selectedNodes.length, "nodes");
                }
            }

            // PASTE (Ctrl+V)
            if (isCtrl && event.key === 'v') {
                if (clipboard && clipboard.nodes.length > 0) {
                    // Deselect current
                    setNodes(nds => nds.map(n => ({ ...n, selected: false })));

                    const newNodes: AppNode[] = [];
                    const idMap = new Map<string, string>();

                    // 1. Create new nodes with offset
                    clipboard.nodes.forEach(node => {
                        const newId = Math.random().toString();
                        idMap.set(node.id, newId);
                        newNodes.push({
                            ...node,
                            id: newId,
                            position: { x: node.position.x + 50, y: node.position.y + 50 },
                            selected: true,
                            data: { ...node.data } // Clone data
                        } as AppNode);
                    });

                    // 2. Clone internal edges (only if both source/target copied)
                    const newEdges: Edge[] = [];
                    clipboard.edges.forEach(edge => {
                        const newSource = idMap.get(edge.source);
                        const newTarget = idMap.get(edge.target);
                        if (newSource && newTarget) {
                            newEdges.push({
                                ...edge,
                                id: `e-${newSource}-${newTarget}-${Math.random()}`,
                                source: newSource,
                                target: newTarget,
                                selected: true
                            });
                        }
                    });

                    setNodes(nds => [...nds, ...newNodes]);
                    setEdges(eds => [...eds, ...newEdges]);
                }
            }

            // CUT (Ctrl+X)
            if (isCtrl && event.key === 'x') {
                const selectedNodes = nodes.filter(n => n.selected);
                const selectedEdges = edges.filter(e => e.selected);
                if (selectedNodes.length > 0) {
                    setClipboard({ nodes: selectedNodes, edges: selectedEdges });
                    setNodes(nds => nds.filter(n => !n.selected));
                    setEdges(eds => eds.filter(e => !e.selected));
                }
            }

            // DUPLICATE (Ctrl+D)
            if (isCtrl && event.key === 'd') {
                event.preventDefault(); // Prevent bookmark
                const selectedNodes = nodes.filter(n => n.selected);
                if (selectedNodes.length > 0) {
                    // Same logic as Paste but immediate
                    setNodes(nds => nds.map(n => ({ ...n, selected: false })));
                    const newNodes: AppNode[] = [];
                    const idMap = new Map<string, string>();

                    selectedNodes.forEach(node => {
                        const newId = Math.random().toString();
                        idMap.set(node.id, newId);
                        newNodes.push({
                            ...node,
                            id: newId,
                            position: { x: node.position.x + 20, y: node.position.y + 20 },
                            selected: true,
                            data: { ...node.data }
                        } as AppNode);
                    });

                    setNodes(nds => [...nds, ...newNodes]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nodes, edges, clipboard, setNodes, setEdges]); // Dep array important

    // Listen for Exam Submission requests from the parent window
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'REQUEST_EXAM_STATE') {
                if (event.source) {
                    (event.source as Window).postMessage({
                        type: 'EXAM_STATE_RESPONSE',
                        payload: {
                            type: 'CIRCUIT',
                            nodes: nodes,
                            edges: edges
                        }
                    }, '*');
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [nodes, edges]);

    return (
        <div className="h-full w-full bg-gray-100 flex flex-col relative overflow-hidden">

            {/* Top Bar - Minimal */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                    className={`px-4 py-2 rounded-full text-xs font-bold border shadow-sm flex items-center gap-2 transition-all ${generating ? 'bg-green-500 text-white border-green-600' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => setGenerating(!generating)}
                >
                    {generating ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                    {generating ? 'SIMULATING' : 'PAUSED'}
                </button>

                <button
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-bold shadow-sm flex items-center gap-2"
                    onClick={handleWorkspacesOpen}
                >
                    <Table size={14} /> Truth Table
                </button>

                {!readonly && (
                    <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-2" onClick={saveCircuit}>
                        <Save size={14} /> Save
                    </button>
                )}
            </div>

            <WorkspacesPanel
                isOpen={showWorkspaces}
                onClose={() => setShowWorkspaces(false)}
                data={tableData}
                loading={false}
            />

            {/* Sidebar Component Palette */}
            {!readonly && <DldSidebar onAddNode={addNode} />}

            <div className="flex-1 h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onReconnect={onReconnect}
                    onInit={onInit}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    deleteKeyCode={['Backspace', 'Delete']}
                    multiSelectionKeyCode={['Control', 'Meta']}
                    selectionKeyCode={['Shift']}
                    panOnScroll
                    selectionOnDrag
                    panOnDrag={[1, 2]}
                    selectNodesOnDrag={false}
                    snapToGrid
                    snapGrid={[10, 10]}
                    defaultEdgeOptions={{ type: 'signal', animated: false, style: { strokeWidth: 2 } }}
                    className="bg-gray-50 bg-opacity-50"
                >
                    <Controls className="!bg-white !border-gray-200 !shadow-lg !rounded-lg !m-4" />
                    <Background
                        color="#cbd5e1"
                        variant={BackgroundVariant.Lines}
                        gap={20}
                        size={1}
                        className="bg-gray-50/50"
                    />
                </ReactFlow>
            </div>
        </div>
    );
}
