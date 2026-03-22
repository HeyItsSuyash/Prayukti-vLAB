"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, StepForward, RotateCcw, AlertTriangle, Workflow, BookOpen, Activity, Share2, Plus, Link as LinkIcon, Link2Off, Trash2, Send, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const INFINITY = 16;

type RouterId = string;

interface RouterNode {
    id: RouterId;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
}

interface NetworkLink {
    id: string;
    source: RouterId;
    target: RouterId;
    cost: number;
    isActive: boolean;
}

interface RouteEntry {
    destination: RouterId;
    cost: number;
    nextHop: RouterId | '-';
}

type RoutingTable = Record<RouterId, RouteEntry>;

const STARTING_NODES: Record<RouterId, RouterNode> = {
    R1: { id: 'R1', x: 20, y: 30 },
    R2: { id: 'R2', x: 50, y: 20 },
    R3: { id: 'R3', x: 80, y: 30 },
    R4: { id: 'R4', x: 35, y: 70 },
    R5: { id: 'R5', x: 65, y: 70 },
};

const STARTING_LINKS: NetworkLink[] = [
    { id: 'L1', source: 'R1', target: 'R2', cost: 1, isActive: true },
    { id: 'L2', source: 'R2', target: 'R3', cost: 2, isActive: true },
    { id: 'L3', source: 'R1', target: 'R4', cost: 3, isActive: true },
    { id: 'L5', source: 'R2', target: 'R5', cost: 1, isActive: true },
    { id: 'L6', source: 'R4', target: 'R5', cost: 2, isActive: true },
    { id: 'L7', source: 'R3', target: 'R5', cost: 5, isActive: true },
];

export default function DVRSimulation({ labId }: { labId: string }) {
    const [activeTab, setActiveTab] = useState<'simulation' | 'observation' | 'statistics'>('simulation');

    // Dynamic Topology
    const [nodes, setNodes] = useState<Record<RouterId, RouterNode>>(STARTING_NODES);
    const [links, setLinks] = useState<NetworkLink[]>(STARTING_LINKS);

    // Core DVR State
    const [routingTables, setRoutingTables] = useState<Record<RouterId, RoutingTable>>({});
    const [stepCount, setStepCount] = useState(0);
    const [isConverged, setIsConverged] = useState(false);
    const [logs, setLogs] = useState<string[]>(['[SYSTEM] Simulation Initialized...']);

    // Loop Prevention Mechanisms
    const [splitHorizon, setSplitHorizon] = useState(false);
    const [poisonReverse, setPoisonReverse] = useState(false);

    // Interactive Edit Mode
    const [editMode, setEditMode] = useState<'none' | 'addNode' | 'connectNodes' | 'remove'>('none');
    const [connectSource, setConnectSource] = useState<RouterId | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Data Packet Routing
    const [packetSrc, setPacketSrc] = useState<RouterId | ''>('');
    const [packetDst, setPacketDst] = useState<RouterId | ''>('');
    const [activePacket, setActivePacket] = useState<{ path: RouterId[], progress: number } | null>(null);

    // Update Packets Animation
    const [updatePackets, setUpdatePackets] = useState<{ from: RouterId, to: RouterId, progress: number }[]>([]);

    // Stats
    const [stats, setStats] = useState({ totalUpdates: 0, packetsSent: 0 });

    // UI
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedRouter, setSelectedRouter] = useState<RouterId | null>(null);
    const [nextRouterId, setNextRouterId] = useState(6); // R6, R7...

    // Initialization & Recalculation Baseline
    const initializeRoutingTables = useCallback((currentNodes: Record<RouterId, RouterNode>, currentLinks: NetworkLink[]) => {
        const initialTables: Record<RouterId, RoutingTable> = {};
        const routers = Object.keys(currentNodes);

        routers.forEach(router => {
            initialTables[router] = {};
            routers.forEach(dest => {
                if (router === dest) {
                    initialTables[router][dest] = { destination: dest, cost: 0, nextHop: '-' };
                } else {
                    initialTables[router][dest] = { destination: dest, cost: INFINITY, nextHop: '-' };
                }
            });

            currentLinks.forEach(link => {
                if (!link.isActive) return;
                if (link.source === router) initialTables[router][link.target] = { destination: link.target, cost: link.cost, nextHop: link.target };
                else if (link.target === router) initialTables[router][link.source] = { destination: link.source, cost: link.cost, nextHop: link.source };
            });
        });

        setRoutingTables(initialTables);
        setStepCount(0);
        setIsConverged(false);
        setLogs(['[SYSTEM] Tables initialized with direct neighbor metrics.']);
        setIsPlaying(false);
        setActivePacket(null);
        setUpdatePackets([]);
    }, []);

    useEffect(() => {
        initializeRoutingTables(nodes, links);
    }, []); // Only on mount

    // Animation Loops
    useEffect(() => {
        let reqId: number;
        let lastTime = performance.now();

        const updateAnimation = (time: number) => {
            const deltaTime = time - lastTime;
            lastTime = time;

            // Animate distance vector update packets
            setUpdatePackets(prev => {
                if (prev.length === 0) return prev;
                const newPackets = prev.map(p => ({ ...p, progress: p.progress + (deltaTime * 0.002) }));
                return newPackets.filter(p => p.progress < 1);
            });

            // Animate actual data packet
            setActivePacket(prev => {
                if (!prev) return prev;
                const newProgress = prev.progress + (deltaTime * 0.001);
                if (newProgress >= prev.path.length - 1) {
                    setLogs(l => [...l, `[PACKET] Delivered successfully from ${prev.path[0]} to ${prev.path[prev.path.length - 1]} via ${prev.path.join('->')}`]);
                    return null; // done
                }
                return { ...prev, progress: newProgress };
            });

            reqId = requestAnimationFrame(updateAnimation);
        };
        reqId = requestAnimationFrame(updateAnimation);
        return () => cancelAnimationFrame(reqId);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && !isConverged) {
            interval = setInterval(() => {
                performBellmanFordStep();
            }, 1200);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isConverged, nodes, links, routingTables, splitHorizon, poisonReverse]);


    const performBellmanFordStep = () => {
        if (isConverged || Object.keys(routingTables).length === 0) {
            if (isPlaying) setIsPlaying(false);
            return;
        }

        let hasChanges = false;
        const newTables: Record<RouterId, RoutingTable> = JSON.parse(JSON.stringify(routingTables));
        const routers = Object.keys(nodes);
        const newLogs: string[] = [];
        let updatesInThisStep = 0;

        // Visual packets for Vector Exchange
        const newUpdatePackets: typeof updatePackets = [];

        routers.forEach(node => {
            const neighbors: { id: RouterId, cost: number }[] = [];
            links.forEach(link => {
                if (!link.isActive) return;
                if (link.source === node) neighbors.push({ id: link.target, cost: link.cost });
                if (link.target === node) neighbors.push({ id: link.source, cost: link.cost });
            });

            neighbors.forEach(n => {
                newUpdatePackets.push({ from: n.id, to: node, progress: 0 }); // simulate receiving
            });

            routers.forEach(dest => {
                if (node === dest) return;

                const currentEntry = newTables[node][dest];
                let bestCost = INFINITY;
                let bestNextHop: RouterId | '-' = '-';

                neighbors.forEach(neighbor => {
                    const costToNeighbor = neighbor.cost;
                    let neighborCostToDest = routingTables[neighbor.id][dest].cost;

                    // Loop Prevention checks
                    const neighborRouteToDest = routingTables[neighbor.id][dest];
                    if (neighborRouteToDest.nextHop === node) {
                        if (poisonReverse) {
                            neighborCostToDest = INFINITY; // Poison Reverse
                        } else if (splitHorizon) {
                            return; // Split Horizon: Ignore this route entirely
                        }
                    }

                    let totalCost = costToNeighbor + neighborCostToDest;
                    if (totalCost > INFINITY) totalCost = INFINITY;

                    if (totalCost < bestCost) {
                        bestCost = totalCost;
                        bestNextHop = neighbor.id;
                    }
                });

                if (bestCost !== currentEntry.cost || bestNextHop !== currentEntry.nextHop) {
                    newTables[node][dest] = { destination: dest, cost: bestCost, nextHop: bestNextHop };
                    hasChanges = true;
                    updatesInThisStep++;
                    newLogs.push(`[T=${stepCount + 1}] ${node} updated path to ${dest} -> Cost: ${bestCost === INFINITY ? '∞' : bestCost}, Next: ${bestNextHop}`);
                }
            });
        });

        setUpdatePackets(newUpdatePackets);

        if (hasChanges) {
            setRoutingTables(newTables);
            setStepCount(prev => prev + 1);
            setLogs(prev => [...prev, ...newLogs]);
            setStats(s => ({ ...s, totalUpdates: s.totalUpdates + updatesInThisStep }));
        } else {
            setIsConverged(true);
            setIsPlaying(false);
            setLogs(prev => [...prev, `[SYSTEM] Network Converged at Step ${stepCount}. No further optimal paths found.`]);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (editMode !== 'addNode' || !svgRef.current) return;

        const rect = svgRef.current.getBoundingClientRect();
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        const newId = `R${nextRouterId}`;
        setNextRouterId(prev => prev + 1);

        const newNodes = { ...nodes, [newId]: { id: newId, x: xPercent, y: yPercent } };
        setNodes(newNodes);
        initializeRoutingTables(newNodes, links); // Reset on topology change
        setEditMode('none');
    };

    const handleNodeClick = (nodeId: RouterId) => {
        if (editMode === 'remove') {
            const newNodes = { ...nodes };
            delete newNodes[nodeId];
            const newLinks = links.filter(l => l.source !== nodeId && l.target !== nodeId);
            setNodes(newNodes);
            setLinks(newLinks);
            if (selectedRouter === nodeId) setSelectedRouter(null);
            initializeRoutingTables(newNodes, newLinks);
            setEditMode('none');
            return;
        }

        if (editMode === 'connectNodes') {
            if (!connectSource) {
                setConnectSource(nodeId);
            } else if (connectSource !== nodeId) {
                // Connect them
                const cost = Math.floor(Math.random() * 4) + 1; // Random 1-4
                const newLink = { id: `L_${connectSource}_${nodeId}_${Date.now()}`, source: connectSource, target: nodeId, cost, isActive: true };
                const newLinks = [...links, newLink];
                setLinks(newLinks);
                setConnectSource(null);
                initializeRoutingTables(nodes, newLinks);
                setEditMode('none');
            }
            return;
        }

        // View Mode
        setSelectedRouter(nodeId);
    };

    const handleLinkClick = (linkId: string) => {
        if (editMode === 'remove') {
            const newLinks = links.filter(l => l.id !== linkId);
            setLinks(newLinks);
            initializeRoutingTables(nodes, newLinks);
            setEditMode('none');
            return;
        }

        if (editMode === 'none') {
            // Cycle cost 1 -> 5 -> 1 or prompt? Let's cycle 1 -> 5
            setLinks(prev => {
                const newLinks = prev.map(l => {
                    if (l.id === linkId) {
                        return { ...l, cost: l.cost >= 5 ? 1 : l.cost + 1 };
                    }
                    return l;
                });
                // State changed, need to un-converge, but normally cost changes trigger immediate updates in real routers.
                // We'll reset convergence so Bellman Ford runs.
                if (routingTables[nodes[Object.keys(nodes)[0]].id]) {
                    setIsConverged(false);
                    setLogs(l => [...l, `[SYSTEM] Link Metric Changed. Network isolated recalculation triggered.`]);
                }
                return newLinks;
            });
            // Also need to push the new direct cost into routing tables if it's smaller, or just let bellman ford handle it
            // Actually, distance vector relies on the base direct cost matrix. Let's just re-initialize for clean learning:
            setIsConverged(false);
            // Better behavior for simulation: reset tables to base or handle dynamic metric increase (count to infinity!)
            // To properly show distance vector issues, if cost increases, we DON'T re-initialize. We update tables.
            setRoutingTables(prev => {
                const newT = JSON.parse(JSON.stringify(prev));
                const targetL = links.find(l => l.id === linkId);
                if (targetL) {
                    // Note: direct link cost relies on Bellman ford inspecting active links. 
                    // If we don't reinit, next step sees new cost!
                }
                return newT;
            });
        }
    };

    const breakLink = (linkId: string) => {
        setLinks(prev => prev.map(l => l.id === linkId ? { ...l, isActive: false } : l));
        setIsConverged(false);
        setLogs(l => [...l, `[SYSTEM] Link ${linkId} failed. Network unstable.`]);
    };

    const setupCountToInfinity = () => {
        // Standard CN scenario: R1 - R2 - R3. Break R2-R3.
        const scenarioNodes: Record<RouterId, RouterNode> = {
            R1: { id: 'R1', x: 20, y: 50 },
            R2: { id: 'R2', x: 50, y: 50 },
            R3: { id: 'R3', x: 80, y: 50 },
        };
        const scenarioLinks: NetworkLink[] = [
            { id: 'L1', source: 'R1', target: 'R2', cost: 1, isActive: true },
            { id: 'L2', source: 'R2', target: 'R3', cost: 1, isActive: true },
        ];

        setNodes(scenarioNodes);
        setLinks(scenarioLinks);
        setSplitHorizon(false);
        setPoisonReverse(false);
        initializeRoutingTables(scenarioNodes, scenarioLinks);

        setLogs([
            '[SYSTEM] Count-To-Infinity Scenario Active.',
            '[SYSTEM] Topology: R1 <-> R2 <-> R3.',
            '[SYSTEM] 1. Click "Auto-Converge".',
            '[SYSTEM] 2. Once Converged, click the "Disconnect R2-R3" button.',
            '[SYSTEM] 3. Observe routing loops.'
        ]);
        setSelectedRouter('R1');
    };

    const sendPacket = () => {
        if (!packetSrc || !packetDst || packetSrc === packetDst || !isConverged) return;

        // Trace shortest path using routing tables
        const path: RouterId[] = [packetSrc];
        let curr = packetSrc;
        let hops = 0;

        while (curr !== packetDst && hops < 20) {
            const next = routingTables[curr][packetDst].nextHop;
            if (next === '-' || next === curr) {
                setLogs(l => [...l, `[PACKET] Route to ${packetDst} unreachable from ${curr}. Dropped.`]);
                return;
            }
            path.push(next);
            curr = next;
            hops++;
        }

        if (curr === packetDst) {
            setActivePacket({ path, progress: 0 });
            setStats(s => ({ ...s, packetsSent: s.packetsSent + 1 }));
            setLogs(l => [...l, `[PACKET] Sending packet ${packetSrc} -> ${packetDst}...`]);
        }
    };

    // Visualization Helpers
    const getCoordinates = (nodeId: RouterId) => {
        const node = nodes[nodeId];
        if (!node) return { x: 0, y: 0 };
        return { x: node.x, y: node.y };
    };

    const getCoordPx = (nodeId: RouterId) => {
        return { x: `${getCoordinates(nodeId).x}%`, y: `${getCoordinates(nodeId).y}%` };
    };

    const getPacketPosition = () => {
        if (!activePacket) return null;
        const { path, progress } = activePacket;
        const segmentIndex = Math.floor(progress);
        const segmentProgress = progress - segmentIndex;

        const startNode = path[segmentIndex];
        const endNode = path[segmentIndex + 1];
        if (!startNode || !endNode) return null;

        const startCoord = getCoordinates(startNode);
        const endCoord = getCoordinates(endNode);

        const x = startCoord.x + (endCoord.x - startCoord.x) * segmentProgress;
        const y = startCoord.y + (endCoord.y - startCoord.y) * segmentProgress;
        return { x: `${x}%`, y: `${y}%` };
    };

    return (
        <div className="flex flex-col h-[800px] bg-slate-50 font-sans rounded-xl overflow-hidden border">
            {/* Header & Main Tabs */}
            <div className="bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Workflow className="text-purple-600" />
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">DVR Simulator</h2>

                    <div className="ml-6 flex items-center bg-slate-100 p-1 rounded-lg">
                        <button className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'simulation' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('simulation')}>Simulation</button>
                        <button className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'observation' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('observation')}>Observation Logger</button>
                        <button className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'statistics' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('statistics')}>Statistics</button>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm" onClick={setupCountToInfinity} className="mr-2 text-amber-600 border-amber-200 hover:bg-amber-50">
                        <AlertTriangle className="w-4 h-4 mr-2" /> Infinity Scenario
                    </Button>
                    <Badge variant={isConverged ? "default" : "outline"} className={isConverged ? 'bg-emerald-500' : 'text-amber-500 border-amber-500'}>
                        {isConverged ? 'Converged' : 'Updating'}
                    </Badge>
                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
                    <Badge variant="outline" className="font-mono text-xs">Iter: {stepCount}</Badge>
                    <Button variant="outline" size="sm" onClick={performBellmanFordStep} disabled={isConverged || isPlaying}>
                        <StepForward className="w-4 h-4 mr-2" /> Step
                    </Button>
                    <Button variant={isPlaying ? "secondary" : "default"} size="sm" onClick={() => setIsPlaying(!isPlaying)} disabled={isConverged}>
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "Pause" : "Auto Run"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => {
                        setNodes(STARTING_NODES);
                        setLinks(STARTING_LINKS);
                        initializeRoutingTables(STARTING_NODES, STARTING_LINKS);
                        setEditMode('none');
                    }}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset Network
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'simulation' && (
                <div className="flex flex-1 overflow-hidden">
                    {/* Main Topology Sub-pane */}
                    <div className="flex-1 relative bg-slate-100 flex flex-col">

                        {/* Editor Toolbar */}
                        <div className="bg-white border-b px-4 py-2 flex items-center justify-between text-sm shadow-sm z-10">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-600 mr-2 flex items-center gap-1"><Settings2 className="w-4 h-4" /> Tools:</span>
                                <Button variant={editMode === 'addNode' ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setEditMode(editMode === 'addNode' ? 'none' : 'addNode')}>
                                    <Plus className="w-3 h-3 mr-1" /> Add Router
                                </Button>
                                <Button variant={editMode === 'connectNodes' ? 'default' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => { setEditMode(editMode === 'connectNodes' ? 'none' : 'connectNodes'); setConnectSource(null); }}>
                                    <LinkIcon className="w-3 h-3 mr-1" /> Connect Routers
                                </Button>
                                <Button variant={editMode === 'remove' ? 'destructive' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setEditMode(editMode === 'remove' ? 'none' : 'remove')}>
                                    <Trash2 className="w-3 h-3 mr-1" /> Remove Element
                                </Button>
                                {editMode !== 'none' && <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">Edit Mode Active</Badge>}
                                {connectSource && <Badge className="ml-2">Select target to connect to {connectSource}</Badge>}
                            </div>

                            <div className="flex items-center gap-4 border-l pl-4">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-xs">
                                    <input type="checkbox" checked={splitHorizon} onChange={(e) => { setSplitHorizon(e.target.checked); setIsConverged(false); }} className="rounded text-purple-600" />
                                    Split Horizon
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-xs">
                                    <input type="checkbox" checked={poisonReverse} onChange={(e) => { setPoisonReverse(e.target.checked); setIsConverged(false); }} className="rounded text-purple-600" disabled={splitHorizon} />
                                    Poison Reverse
                                </label>
                            </div>
                        </div>

                        {/* Interactive Canvas */}
                        <div
                            className={`flex-1 relative overflow-hidden ${editMode === 'addNode' ? 'cursor-crosshair' : ''}`}
                            onClick={handleCanvasClick}
                        >
                            <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-[none]" style={{ zIndex: 0 }}>
                                {/* Connections */}
                                {links.map(link => {
                                    const source = getCoordinates(link.source);
                                    const target = getCoordinates(link.target);
                                    if (!source || !target) return null;

                                    return (
                                        <g key={link.id} className="pointer-events-auto cursor-pointer group" onClick={(e) => { e.stopPropagation(); handleLinkClick(link.id); }}>
                                            <line x1={`${source.x}%`} y1={`${source.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="transparent" strokeWidth="25" />
                                            <line x1={`${source.x}%`} y1={`${source.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke={link.isActive ? "#94a3b8" : "#f87171"} strokeWidth={link.isActive ? "4" : "2"} strokeDasharray={link.isActive ? "none" : "5 5"} className="transition-all duration-300 group-hover:stroke-purple-400" />
                                            {link.isActive && (
                                                <g transform={`translate(calc(${source.x}% / 2 + ${target.x}% / 2), calc(${source.y}% / 2 + ${target.y}% / 2))`}>
                                                    <rect x="-12" y="-12" width="24" height="24" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="2" className="group-hover:stroke-purple-400 transition-colors" />
                                                    <text x="0" y="4" fontSize="12" fontWeight="bold" fill="#64748b" textAnchor="middle" className="group-hover:fill-purple-600 transition-colors">{link.cost}</text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}

                                {/* Update Packets Animation */}
                                {updatePackets.map((pkt, i) => {
                                    const source = getCoordinates(pkt.from);
                                    const target = getCoordinates(pkt.to);
                                    if (!source || !target) return null;
                                    const cx = source.x + (target.x - source.x) * pkt.progress;
                                    const cy = source.y + (target.y - source.y) * pkt.progress;
                                    return (
                                        <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="4" fill="#8b5cf6" opacity={1 - pkt.progress} />
                                    )
                                })}
                            </svg>

                            {/* Data Packet Routing Animation */}
                            {getPacketPosition() && (
                                <div
                                    className="absolute w-4 h-4 bg-emerald-500 rounded-sm shadow-md shadow-emerald-500/50 z-20 border-2 border-white"
                                    style={{ left: getPacketPosition()?.x, top: getPacketPosition()?.y, transform: 'translate(-50%, -50%)' }}
                                />
                            )}

                            {/* Nodes (Routers) */}
                            {Object.values(nodes).map(node => (
                                <div
                                    key={node.id}
                                    className={`absolute z-10 flex flex-col items-center justify-center transition-transform hover:scale-105 ${editMode !== 'none' ? 'cursor-pointer' : 'cursor-pointer'}`}
                                    style={{ left: getCoordPx(node.id).x, top: getCoordPx(node.id).y, transform: 'translate(-50%, -50%)' }}
                                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 ${selectedRouter === node.id ? 'bg-purple-100 border-purple-500' : connectSource === node.id ? 'bg-amber-100 border-amber-500' : 'bg-white border-slate-300'} ${editMode === 'remove' ? 'hover:border-red-500 hover:bg-red-50' : ''}`}>
                                        <Activity className={`w-6 h-6 ${selectedRouter === node.id ? 'text-purple-600' : 'text-slate-500'}`} />
                                    </div>
                                    <Badge variant={selectedRouter === node.id ? 'default' : 'secondary'} className={`mt-2 ${selectedRouter === node.id ? 'bg-purple-600' : ''}`}>
                                        {node.id}
                                    </Badge>
                                </div>
                            ))}

                            {/* Special Link failure button in Infinity mode */}
                            {Object.keys(nodes).length === 3 && nodes['R1'] && nodes['R2'] && nodes['R3'] && links.find(l => l.id === 'L2') && links.find(l => l.id === 'L2')?.isActive && (
                                <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md border-l-4 border-amber-500 max-w-xs z-30">
                                    <p className="text-sm font-bold text-slate-800 mb-2">Infinity Demo</p>
                                    <Button variant="destructive" size="sm" className="w-full text-xs h-7" onClick={() => breakLink('L2')}>
                                        <Link2Off className="w-3 h-3 mr-1" /> Disconnect R2-R3
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Packet Routing Control Strip */}
                        <div className="bg-white border-t px-4 py-3 flex items-center shadow-sm z-10">
                            <span className="font-bold text-slate-700 text-sm flex items-center gap-2 mr-4">
                                <Send className="w-4 h-4 text-emerald-600" /> Send Packet:
                            </span>
                            <select value={packetSrc} onChange={e => setPacketSrc(e.target.value)} className="border rounded-md px-2 py-1 text-sm bg-slate-50 font-mono w-24">
                                <option value="">Source</option>
                                {Object.keys(nodes).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <span className="mx-2 text-slate-400">→</span>
                            <select value={packetDst} onChange={e => setPacketDst(e.target.value)} className="border rounded-md px-2 py-1 text-sm bg-slate-50 font-mono w-24 mr-4">
                                <option value="">Dest</option>
                                {Object.keys(nodes).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={sendPacket} disabled={!isConverged || !packetSrc || !packetDst || activePacket !== null}>
                                Route Packet
                            </Button>
                        </div>
                    </div>

                    {/* Right Panel: Routing Table Inspector */}
                    <div className="w-80 bg-white shadow-xl z-20 flex flex-col relative border-l">
                        {selectedRouter && nodes[selectedRouter] ? (
                            <div className="flex-1 flex flex-col h-full bg-slate-50">
                                <div className="bg-purple-600 text-white p-4 shrink-0 shadow-sm">
                                    <h3 className="font-bold text-lg flex justify-between items-center">
                                        Router {selectedRouter}
                                        <Badge variant="outline" className="text-white border-white/30 text-xs">Table</Badge>
                                    </h3>
                                </div>
                                <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                                    {routingTables[selectedRouter] && (
                                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
                                                    <tr>
                                                        <th className="px-4 py-2">Dest</th>
                                                        <th className="px-4 py-2">Cost</th>
                                                        <th className="px-4 py-2">Next</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {Object.keys(nodes).map(dest => {
                                                        const entry = routingTables[selectedRouter][dest];
                                                        if (!entry) return null;
                                                        const isSelf = dest === selectedRouter;
                                                        return (
                                                            <tr key={dest} className={`hover:bg-slate-50 transition-colors ${isSelf ? 'bg-slate-50 text-slate-400' : ''}`}>
                                                                <td className="px-4 py-2 font-bold">{dest}</td>
                                                                <td className="px-4 py-2 font-mono text-purple-600 font-bold">
                                                                    {entry.cost >= INFINITY ? '∞' : entry.cost}
                                                                </td>
                                                                <td className="px-4 py-2 text-slate-600 font-medium">
                                                                    {entry.nextHop}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-sm text-indigo-900 shadow-inner">
                                        <h4 className="font-bold mb-2 flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Interface Links</h4>
                                        <div className="space-y-2">
                                            {links.filter(l => l.isActive && (l.source === selectedRouter || l.target === selectedRouter)).map(l => {
                                                const neighbor = l.source === selectedRouter ? l.target : l.source;
                                                return (
                                                    <div key={l.id} className="flex justify-between items-center bg-white p-2 rounded border border-indigo-50">
                                                        <span className="font-mono font-bold">{selectedRouter} ↔ {neighbor}</span>
                                                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">Cost: {l.cost}</Badge>
                                                    </div>
                                                )
                                            })}
                                            {links.filter(l => l.isActive && (l.source === selectedRouter || l.target === selectedRouter)).length === 0 && (
                                                <span className="text-slate-400 italic">No active links</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50">
                                <BookOpen className="w-12 h-12 mb-4 text-slate-300" />
                                <p className="font-bold text-slate-500 mb-1">No Router Selected</p>
                                <p className="text-sm">Click a router in the topology to view its exact distance vector routing table.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'observation' && (
                <div className="flex-1 overflow-y-auto bg-slate-100 p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-6 rounded-xl border shadow-md">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Activity className="text-purple-600" /> Event Logger
                            </h3>
                            <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-4 font-mono text-sm shadow-inner overflow-hidden flex flex-col h-[550px]">
                                <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-2 leading-relaxed">
                                    {logs.map((log, i) => {
                                        const isSystem = log.startsWith('[SYSTEM]');
                                        const isUpdate = log.startsWith('[T=');
                                        const isPacket = log.startsWith('[PACKET]');
                                        return (
                                            <div key={i} className={`
                                                ${isSystem ? 'text-emerald-400 font-bold mt-2 mb-1' : ''}
                                                ${isUpdate ? 'text-sky-300 ml-4 border-l-2 border-sky-800 pl-2' : ''}
                                                ${isPacket ? 'text-amber-400 font-bold bg-amber-900/30 p-1 rounded' : ''}
                                            `}>
                                                {log}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'statistics' && (
                <div className="flex-1 bg-slate-100 p-8">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Total Converged Routing Updates</span>
                                <span className="text-5xl font-black text-purple-600">{stats.totalUpdates}</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Total Elapsed Iterations</span>
                                <span className="text-5xl font-black text-blue-600">{stepCount}</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Simulated Data Packets Sent</span>
                                <span className="text-5xl font-black text-emerald-600">{stats.packetsSent}</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Loop Prevention Engine</span>
                                <span className="text-xl font-bold text-slate-700">Split Horizon: {splitHorizon ? <span className="text-emerald-500">ON</span> : <span className="text-red-500">OFF</span>}</span>
                                <span className="text-xl font-bold text-slate-700">Poison Reverse: {poisonReverse ? <span className="text-emerald-500">ON</span> : <span className="text-red-500">OFF</span>}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
