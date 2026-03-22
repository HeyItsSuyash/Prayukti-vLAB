"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Play, Pause, RotateCcw, Monitor, Zap, Server,
    Send, CheckCircle2, XCircle, Info, Activity, Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Packet {
    id: string;
    seq: number;
    status: "in-transit" | "acked" | "lost" | "error";
    type: "data" | "ack";
    progress: number;
}

export default function SelectiveRepeatSimulation() {
    // Basic Config
    const [numFrames, setNumFrames] = useState(16);
    const [windowSize, setWindowSize] = useState(4);
    const [timeoutDuration, setTimeoutDuration] = useState(12000);
    const [simSpeed, setSimSpeed] = useState(1);
    const [lossProb, setLossProb] = useState(0);
    const [ackLossProb, setAckLossProb] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Observation Summary Tracking
    const [bufferedCount, setBufferedCount] = useState(0);
    const [lossLog, setLossLog] = useState<{ seq: number, type: 'Data' | 'ACK', reason: string, id: string }[]>([]);

    // Modes & Manual Control
    const [learningMode, setLearningMode] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'simulation' | 'observation'>('simulation');
    const [isWaitingForStep, setIsWaitingForStep] = useState(false);
    const [stepMessage, setStepMessage] = useState<string | null>(null);
    const [manualDropSeq, setManualDropSeq] = useState<string>("0");
    const [manualDropAckSeq, setManualDropAckSeq] = useState<string>("0");

    // Dynamic State
    const [packets, setPackets] = useState<Packet[]>([]);

    // Sender Status
    const [senderBase, setSenderBase] = useState(0);
    const [nextSeqToSend, setNextSeqToSend] = useState(0);
    const [senderAcked, setSenderAcked] = useState<number[]>([]);
    const [senderTimers, setSenderTimers] = useState<Record<number, number>>({});
    const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});

    // Receiver Status
    const [receiverBase, setReceiverBase] = useState(0);
    const [receiverBuffered, setReceiverBuffered] = useState<number[]>([]);

    // Logs and Stats
    const [log, setLog] = useState<{ msg: string, type: 'info' | 'error' | 'success' | 'warn' }[]>([]);
    const [totalSent, setTotalSent] = useState(0);
    const [totalReceived, setTotalReceived] = useState(0);
    const [retransmissions, setRetransmissions] = useState(0);
    const [lostFramesCount, setLostFramesCount] = useState(0);

    const timerRef = useRef<Record<number, NodeJS.Timeout>>({});
    const logHistoryRef = useRef<Set<string>>(new Set());

    const addLog = useCallback((msg: string, type: 'info' | 'error' | 'success' | 'warn' = 'info') => {
        setLog(prev => [{ msg, type }, ...prev].slice(0, 30));
    }, []);

    const triggerStepWait = useCallback((msg: string) => {
        if (!learningMode) return;
        setStepMessage(msg);
        setIsWaitingForStep(true);
    }, [learningMode]);

    const nextSimStep = useCallback(() => {
        setIsWaitingForStep(false);
        setStepMessage(null);
    }, []);

    // Auto Learning Mode Timer
    useEffect(() => {
        if (learningMode && isWaitingForStep) {
            const t = setTimeout(() => {
                nextSimStep();
            }, 1800); // 1.8 seconds pause to read
            return () => clearTimeout(t);
        }
    }, [learningMode, isWaitingForStep, nextSimStep]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setIsWaitingForStep(false);
        setStepMessage(null);
        setPackets([]);
        setSenderBase(0);
        setNextSeqToSend(0);
        setSenderAcked([]);
        setSenderTimers({});
        setReceiverBase(0);
        setReceiverBuffered([]);
        setTotalSent(0);
        setTotalReceived(0);
        setRetransmissions(0);
        setLostFramesCount(0);
        setBufferedCount(0);
        setLossLog([]);
        setLog([{ msg: "Simulation Reset. Ready.", type: 'info' }]);
        logHistoryRef.current.clear();
        Object.values(timerRef.current).forEach(clearTimeout);
        timerRef.current = {};
    }, []);

    useEffect(() => {
        reset();
    }, [windowSize, numFrames, timeoutDuration, reset, learningMode]);

    const handleTimeout = useCallback((seq: number) => {
        addLog(`Timeout occurred. Frame ${seq} retransmitted.`, 'error');
        setRetransmissions(prev => prev + 1);
        setPackets(prev => prev.filter(p => !(p.seq === seq && p.type === "data" && p.status === "in-transit")));
        triggerStepWait(`Timeout! Frame ${seq} timer expired. Sender immediately retransmits Frame ${seq}.`);
        sendPacket(seq, true);
    }, [addLog, triggerStepWait]);

    const sendPacket = useCallback((seq: number, isRetransmit = false) => {
        const isLost = Math.random() < (lossProb / 100);
        const newPacket: Packet = {
            id: `${seq}-${Date.now()}-${Math.random()}`,
            seq,
            status: isLost ? "lost" : "in-transit",
            type: "data",
            progress: 0
        };

        setPackets(prev => [...prev, newPacket]);
        setTotalSent(prev => prev + 1);
        setSenderTimers(prev => ({ ...prev, [seq]: Date.now() }));
        // Initialize the visual timer
        setActiveTimers(prev => ({ ...prev, [seq]: timeoutDuration }));

        if (isLost) {
            setLostFramesCount(prev => prev + 1);
            setLossLog(prev => [...prev, { seq, type: 'Data', reason: 'Random Probability', id: newPacket.id }]);
        }

        if (isRetransmit) {
            addLog(`Timeout occurred. Frame ${seq} retransmitted.`, 'warn');
        } else {
            addLog(`Frame ${seq} sent`, 'info');
            triggerStepWait(`Sender explicitly transmits Frame ${seq} over the channel.`);
        }

        // We no longer use a separate setTimeout for handleTimeout.
        // Instead, we will check if activeTimers[seq] === 0 in the main loop.

    }, [lossProb, timeoutDuration, addLog, triggerStepWait]);

    const sendAck = useCallback((seq: number) => {
        const isLost = Math.random() < ((lossProb + ackLossProb) / 100); // Combining or just using ackLossProb?
        // User asked for "ACK Loss" control specifically. I'll use ackLossProb.
        const isAckLost = Math.random() < (ackLossProb / 100);

        const ackPacket: Packet = {
            id: `ack-${seq}-${Date.now()}-${Math.random()}`,
            seq,
            status: isAckLost ? "lost" : "in-transit",
            type: "ack",
            progress: 100
        };
        setPackets(prev => [...prev, ackPacket]);

        if (isAckLost) {
            addLog(`ACK ${seq} lost in channel.`, 'error');
            setLossLog(prev => [...prev, { seq, type: 'ACK', reason: 'Random Probability', id: ackPacket.id }]);
        }
    }, [ackLossProb, addLog]);

    const handleDataArrival = useCallback((seq: number) => {
        setTotalReceived(prev => prev + 1);

        if (seq < receiverBase || receiverBuffered.includes(seq)) {
            addLog(`Received duplicate Frame ${seq}. Resending ACK.`, 'warn');
            sendAck(seq);
            triggerStepWait(`Frame ${seq} arrived safely but was a duplicate. Resending ACK.`);
            return;
        }

        addLog(`Frame ${seq} received. Sending ACK ${seq}.`, 'success');
        sendAck(seq);

        if (seq === receiverBase) {
            setReceiverBuffered(prev => {
                const newBuffered = [...prev, seq].sort((a, b) => a - b);
                let newBase = receiverBase;
                while (newBuffered.includes(newBase)) {
                    newBase++;
                }
                setReceiverBase(newBase);
                addLog(`Receiver window slides to ${newBase}`, 'info');
                triggerStepWait(`Frame ${seq} arrived in order. Receiver explicitly accepts and slides expectation window to ${newBase}.`);
                return newBuffered.filter(n => n >= newBase);
            });
        } else {
            setReceiverBuffered(prev => [...prev, seq].sort((a, b) => a - b));
            setBufferedCount(prev => prev + 1);
            addLog(`Receiver buffers Frame ${seq}`, 'warn');
            triggerStepWait(`Frame ${seq} arrived BEFORE Frame ${receiverBase}! Receiver explicitly buffers Frame ${seq} instead of discarding it.`);
        }
    }, [receiverBase, receiverBuffered, sendAck, addLog, triggerStepWait]);

    const handleAckArrival = useCallback((seq: number) => {
        addLog(`ACK ${seq} received by sender.`, 'success');
        triggerStepWait(`ACK ${seq} arrived. Frame ${seq} is now securely acknowledged.`);

        if (timerRef.current[seq]) {
            clearTimeout(timerRef.current[seq]);
            delete timerRef.current[seq];
        }
        setActiveTimers(prev => {
            const next = { ...prev };
            delete next[seq];
            return next;
        });

        setSenderAcked(prev => {
            if (prev.includes(seq)) return prev;
            const newAcked = [...prev, seq].sort((a, b) => a - b);

            if (seq === senderBase) {
                let newBase = senderBase;
                while (newAcked.includes(newBase)) newBase++;
                setSenderBase(newBase);
                addLog(`Sender window slides to ${newBase}`, 'info');
            }
            return newAcked;
        });
    }, [senderBase, addLog, triggerStepWait]);

    useEffect(() => {
        if (!isRunning || isWaitingForStep) return;

        const interval = setInterval(() => {
            setPackets(prev => {
                const next = prev.map(p => ({
                    ...p,
                    progress: p.type === 'data' ? p.progress + (1.2 * simSpeed) : p.progress - (1.2 * simSpeed)
                }));

                next.forEach(p => {
                    if (p.status === "in-transit") {
                        if (p.type === "data" && p.progress >= 100) {
                            handleDataArrival(p.seq);
                            p.status = "acked";
                        } else if (p.type === "ack" && p.progress <= 0) {
                            handleAckArrival(p.seq);
                            p.status = "acked";
                        }
                    } else if (p.status === "lost") {
                        const disappearPoint = p.type === "data" ? 50 : 50;
                        const haspassedPoint = p.type === "data" ? p.progress >= disappearPoint : p.progress <= disappearPoint;

                        if (haspassedPoint) {
                            if (!logHistoryRef.current.has(`lost-${p.id}`)) {
                                logHistoryRef.current.add(`lost-${p.id}`);
                                addLog(`${p.type === 'data' ? `Frame ${p.seq} lost in transmission.` : `ACK ${p.seq} lost in channel.`}`, 'error');
                                triggerStepWait(`${p.type === 'data' ? `Frame ${p.seq}` : `ACK ${p.seq}`} was maliciously lost in transmission.`);
                            }
                            p.status = "error";
                        }
                    }
                });

                return next.filter(p => p.status !== "error" && p.status !== "acked");
            });

            setActiveTimers(prev => {
                const next = { ...prev };
                let changed = false;
                for (const seqKey in next) {
                    const seq = parseInt(seqKey, 10);
                    if (next[seq] > 0) {
                        next[seq] = Math.max(0, next[seq] - (50 * simSpeed));
                        changed = true;

                        // If it just hit zero, trigger timeout
                        if (next[seq] === 0) {
                            handleTimeout(seq);
                        }
                    }
                }
                return changed ? next : prev;
            });

            if (nextSeqToSend < senderBase + windowSize && nextSeqToSend < numFrames && isRunning && !isWaitingForStep) {
                sendPacket(nextSeqToSend);
                setNextSeqToSend(prev => prev + 1);
            }

            if (senderBase >= numFrames) {
                setIsRunning(false);
                addLog(`All ${numFrames} frames successfully sent and acknowledged!`, 'success');
            }

        }, 50);

        return () => clearInterval(interval);
    }, [isRunning, isWaitingForStep, simSpeed, nextSeqToSend, senderBase, windowSize, numFrames, sendPacket, handleDataArrival, handleAckArrival, addLog, triggerStepWait]);

    const manualInjectLoss = () => {
        if (!isRunning) return;
        const seqToDrop = parseInt(manualDropSeq, 10);

        const targetPacket = packets.find(p => p.seq === seqToDrop && p.type === "data" && p.status === "in-transit");
        if (targetPacket) {
            setPackets(prev => prev.map(p => p.id === targetPacket.id ? { ...p, status: "lost" } : p));
            addLog(`Frame ${targetPacket.seq} manually dropped.`, 'error');
            setLostFramesCount(count => count + 1);
            setLossLog(prev => [...prev, { seq: targetPacket.seq, type: 'Data', reason: 'Manual Injection', id: targetPacket.id }]);
        }
    };

    const manualInjectAckLoss = () => {
        if (!isRunning) return;
        const seqToDrop = parseInt(manualDropAckSeq, 10);

        const targetPacket = packets.find(p => p.seq === seqToDrop && p.type === "ack" && p.status === "in-transit");
        if (targetPacket) {
            setPackets(prev => prev.map(p => p.id === targetPacket.id ? { ...p, status: "lost" } : p));
            addLog(`ACK ${targetPacket.seq} manually dropped.`, 'error');
            // We usually don't increment lostFramesCount for ACKs, but we log the loss
            setLossLog(prev => [...prev, { seq: targetPacket.seq, type: 'ACK', reason: 'Manual Injection', id: targetPacket.id }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
            {/* Header Tabs */}
            <div className="flex bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] sticky top-0 z-50">
                {["Simulation", "Observation"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase() as any)}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === tab.toLowerCase()
                            ? "border-blue-600 text-blue-700 bg-blue-50/50"
                            : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                {activeTab === 'simulation' && (
                    <div className="max-w-[1600px] mx-auto flex flex-col gap-6 h-full">
                        {/* 1. TOP CONTROL PANEL */}
                        <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-6 z-20">
                            {/* Row 1: Primary Controls & Configuration */}
                            <div className="flex items-center justify-between gap-6 flex-wrap xl:flex-nowrap">
                                {/* Left Side: Simulation Controls */}
                                <div className="flex items-center gap-4">
                                    <Button onClick={() => setIsRunning(!isRunning)} className={`h-11 px-8 rounded-xl text-xs font-black uppercase tracking-[0.15em] ${isRunning ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"} text-white transition-all shadow-lg active:scale-95`}>
                                        {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />} {isRunning ? "Pause" : "Start Simulation"}
                                    </Button>
                                    <Button onClick={reset} variant="outline" className="h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all">
                                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                                    </Button>

                                    <div className="h-10 w-px bg-slate-200 mx-2" />

                                    {/* Learning Mode Toggle */}
                                    <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
                                        <Label htmlFor="learning-mode" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer">Learning Mode</Label>
                                        <button
                                            id="learning-mode"
                                            onClick={() => setLearningMode(!learningMode)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none ${learningMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                                        >
                                            <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${learningMode ? 'translate-x-2' : '-translate-x-2'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Center: Sliders Config Group */}
                                <div className="flex-1 flex items-center justify-center gap-6 px-4">
                                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            <span>Speed</span>
                                            <span className="text-blue-600">{simSpeed}x</span>
                                        </div>
                                        <Slider value={[simSpeed * 10]} min={5} max={30} step={5} onValueChange={(v) => setSimSpeed(v[0]! / 10)} className="w-full" />
                                    </div>

                                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            <span>Window Size</span>
                                            <span className="text-emerald-600">{windowSize}</span>
                                        </div>
                                        <Slider value={[windowSize]} min={1} max={8} step={1} onValueChange={(v) => setWindowSize(v[0]!)} className="w-full" />
                                    </div>

                                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            <span>Total Frames</span>
                                            <span className="text-indigo-600">{numFrames}</span>
                                        </div>
                                        <Slider value={[numFrames]} min={4} max={32} step={4} onValueChange={(v) => setNumFrames(v[0]!)} className="w-full" />
                                    </div>

                                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            <span>Timeout</span>
                                            <span className="text-rose-600">{timeoutDuration / 1000}s</span>
                                        </div>
                                        <Slider value={[timeoutDuration]} min={2000} max={20000} step={1000} onValueChange={(v) => setTimeoutDuration(v[0]!)} className="w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Error Injection Controls */}
                            <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-auto">
                                <div className="flex items-center gap-8">
                                    {/* Automatic Loss Sliders */}
                                    <div className="flex gap-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-1 min-w-[100px]">
                                                <div className="flex justify-between items-center text-[9px] font-black text-rose-400 uppercase tracking-tighter">
                                                    <span>Pkt Loss</span>
                                                    <span>{lossProb}%</span>
                                                </div>
                                                <Slider value={[lossProb]} min={0} max={50} step={5} onValueChange={(v) => setLossProb(v[0]!)} className="w-24 h-4" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-1 min-w-[100px]">
                                                <div className="flex justify-between items-center text-[9px] font-black text-amber-500 uppercase tracking-tighter">
                                                    <span>ACK Loss</span>
                                                    <span>{ackLossProb}%</span>
                                                </div>
                                                <Slider value={[ackLossProb]} min={0} max={50} step={5} onValueChange={(v) => setAckLossProb(v[0]!)} className="w-24 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-6 w-px bg-slate-200" />

                                    {/* Manual Injection */}
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Manual Inject:</span>
                                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                            <Select value={manualDropSeq} onValueChange={setManualDropSeq}>
                                                <SelectTrigger className="h-7 w-16 text-[10px] font-bold bg-white">
                                                    <SelectValue placeholder="Seq" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({ length: numFrames }).map((_, i) => (
                                                        <SelectItem key={i} value={i.toString()}>F{i}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" onClick={manualInjectLoss} disabled={!isRunning} variant="destructive" className="h-7 text-[9px] font-bold uppercase tracking-wider px-3">
                                                Drop Frame
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                            <Select value={manualDropAckSeq} onValueChange={setManualDropAckSeq}>
                                                <SelectTrigger className="h-7 w-16 text-[10px] font-bold bg-white">
                                                    <SelectValue placeholder="Ack" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({ length: numFrames }).map((_, i) => (
                                                        <SelectItem key={i} value={i.toString()}>A{i}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" onClick={manualInjectAckLoss} disabled={!isRunning} variant="destructive" className="h-7 text-[9px] font-bold uppercase tracking-wider bg-rose-700 hover:bg-rose-800 px-3">
                                                Drop ACK
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                                    Configuration Mode
                                </div>
                            </div>
                        </div>

                        {/* 2. MAIN HORIZONTAL SIMULATION ARCHITECTURE */}
                        <div className="flex-1 flex gap-4 p-4 overflow-hidden relative isolate">

                            {/* SENDER PANEL */}
                            <div className="w-[30%] bg-white rounded-3xl border border-blue-100 shadow-lg p-5 flex flex-col relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl"><Laptop size={28} /></div>
                                    <div>
                                        <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Sender Client</h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Base: {senderBase} | Win: {windowSize}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2 content-start justify-start flex-1 relative p-1 overflow-y-auto custom-scrollbar">
                                    {Array.from({ length: numFrames }).map((_, i) => {
                                        const isAcked = senderAcked.includes(i);
                                        const isInFlight = i >= senderBase && i < nextSeqToSend && !isAcked;
                                        const hasTimer = isInFlight && activeTimers[i] !== undefined;
                                        return (
                                            <div key={`s-${i}`} className="flex flex-col items-center gap-1">
                                                <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black border-2 transition-all shadow-sm
                                        ${isAcked ? 'bg-emerald-500 border-emerald-600 text-white' :
                                                        isInFlight ? 'bg-amber-400 border-amber-500 text-amber-900' :
                                                            'bg-slate-100 border-slate-200 text-slate-400'
                                                    } 
                                        ${i >= senderBase && i < senderBase + windowSize && !isAcked ? 'ring-2 ring-blue-300 ring-offset-1' : ''}
                                    `}>
                                                    {i}
                                                </div>
                                                {hasTimer && (
                                                    <div className="text-[9px] font-bold text-rose-600 bg-rose-100 px-1 rounded">
                                                        {Math.ceil(activeTimers[i] / 1000)}s
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* NETWORK CHANNEL */}
                            <div className="flex-1 relative flex flex-col justify-center border-y border-dashed border-slate-300 bg-slate-100/50 my-6 rounded-[2rem]">
                                <div className="absolute top-2 w-full text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Transmission Channel</div>

                                {packets.map(p => {
                                    const isLost = p.status === 'lost' || p.status === 'error';
                                    const isData = p.type === 'data';

                                    return (
                                        <div key={p.id} className={`absolute transition-all duration-[50ms] ease-linear z-20`}
                                            style={{
                                                left: `${p.progress}%`,
                                                top: isData ? '40%' : '60%',
                                                transform: `translate(-50%, -50%) scale(${isLost ? 0.7 : 1})`,
                                                opacity: isLost && p.status === 'error' ? 0 : 1
                                            }}>
                                            <div className={`px-2 py-1 rounded-lg flex items-center gap-1 shadow-md border-2
                                     ${isLost ? 'bg-rose-100 border-rose-500 text-rose-700 animate-pulse' :
                                                    isData ? 'bg-blue-600 border-blue-700 text-white' :
                                                        'bg-emerald-500 border-emerald-600 text-white'}`}>
                                                {isData ? <Send className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                                <span className="text-[9px] font-bold uppercase">{isData ? `F${p.seq}` : `A${p.seq}`}</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Event Explanation Banner overlay in the center of the channel */}
                                {learningMode && isWaitingForStep && stepMessage && (
                                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-30 flex justify-center pointer-events-none">
                                        <div className="bg-blue-900/90 text-white p-4 rounded-2xl shadow-2xl border border-blue-500/50 backdrop-blur-sm max-w-sm w-full animate-in fade-in zoom-in duration-200">
                                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-blue-300 mb-1 flex items-center gap-2">
                                                <Info size={12} /> Education Analysis
                                            </h4>
                                            <p className="text-sm font-medium leading-tight">{stepMessage}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RECEIVER PANEL */}
                            <div className="w-[30%] bg-white rounded-3xl border border-emerald-100 shadow-lg p-5 flex flex-col relative">
                                <div className="flex items-center gap-3 mb-4 justify-end">
                                    <div className="text-right">
                                        <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Receiver Server</h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Base: {receiverBase} | Buf: {windowSize}</p>
                                    </div>
                                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl"><Server size={28} /></div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2 content-start justify-end flex-1 relative p-1 overflow-y-auto custom-scrollbar">
                                    {Array.from({ length: numFrames }).map((_, i) => {
                                        const isDelivered = i < receiverBase;
                                        const isBuffered = receiverBuffered.includes(i);
                                        const inWindow = i >= receiverBase && i < receiverBase + windowSize;
                                        return (
                                            <div key={`r-${i}`} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black border-2 transition-all shadow-sm relative
                                     ${isDelivered ? 'bg-emerald-500 border-emerald-600 text-white' :
                                                    isBuffered ? 'bg-blue-500 border-blue-600 text-white' :
                                                        inWindow ? 'bg-emerald-50 border-emerald-200 text-emerald-600 border-dashed' :
                                                            'bg-slate-100 border-slate-200 text-slate-400'
                                                }
                                 `}>
                                                {i}
                                                {isBuffered && <Badge className="absolute -top-2 hover:bg-transparent -left-1 bg-amber-500 text-white leading-none h-4 px-1 text-[8px] p-0 font-bold border-2 border-white shadow-sm">BUF</Badge>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 3. BOTTOM INFO PANELS */}
                        <div className="h-[200px] flex gap-4 px-4 pb-4 shrink-0">

                            {/* Stats */}
                            <div className="w-[40%] bg-slate-900 rounded-3xl p-5 flex flex-col justify-center text-white shadow-md">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                                    <Activity size={14} className="text-emerald-400" /> Real-Time Statistics
                                </h4>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 text-center border-r border-slate-700"><p className="text-[9px] uppercase font-bold text-blue-400">Total Sent</p><p className="text-2xl font-mono font-black">{totalSent}</p></div>
                                    <div className="flex-1 text-center border-r border-slate-700"><p className="text-[9px] uppercase font-bold text-emerald-400">Delivered</p><p className="text-2xl font-mono font-black">{receiverBase}</p></div>
                                    <div className="flex-1 text-center border-r border-slate-700"><p className="text-[9px] uppercase font-bold text-rose-400">Lost Frames</p><p className="text-2xl font-mono font-black">{lostFramesCount}</p></div>
                                    <div className="flex-1 text-center border-r border-slate-700"><p className="text-[9px] uppercase font-bold text-amber-400">Retries</p><p className="text-2xl font-mono font-black">{retransmissions}</p></div>
                                    <div className="flex-1 bg-blue-600/20 rounded-xl p-2 text-center border border-blue-500/30">
                                        <p className="text-[9px] uppercase font-bold text-blue-200">Throughput</p>
                                        <p className="text-2xl font-mono font-black">{totalSent > 0 ? ((receiverBase / totalSent) * 100).toFixed(0) : 0}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Event Log Pipeline */}
                            <div className="w-[60%] bg-white rounded-3xl border border-slate-200 shadow-sm p-4 flex flex-col">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b pb-2 flex items-center gap-2">
                                    <Info size={14} className="text-blue-500" /> Event Console
                                </h3>
                                <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar text-xs font-mono">
                                    {log.map((entry, idx) => (
                                        <div key={idx} className="flex gap-2 p-1 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded">
                                            <span className={`shrink-0 w-2 h-2 mt-1 rounded-full ${entry.type === 'error' ? 'bg-rose-500' : entry.type === 'success' ? 'bg-emerald-500' : entry.type === 'warn' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                                            <span className={`${entry.type === 'error' ? 'text-rose-700' : entry.type === 'success' ? 'text-emerald-700' : entry.type === 'warn' ? 'text-amber-700' : 'text-slate-700'}`}>{entry.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === 'observation' && (
                    <div className="max-w-[1200px] mx-auto space-y-8 p-4 md:p-8">
                        {/* Summary Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Frames Sent", value: totalSent, icon: Send, color: "blue" },
                                { label: "Delivered Successfully", value: receiverBase, icon: CheckCircle2, color: "emerald" },
                                { label: "Frames Buffered", value: bufferedCount, icon: Server, color: "amber" },
                                { label: "Retransmissions", value: retransmissions, icon: RotateCcw, color: "rose" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-2">
                                    <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl mb-2`}><stat.icon size={24} /></div>
                                    <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Detailed Loss Log */}
                            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden flex flex-col">
                                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <XCircle className="text-rose-500" size={18} /> Detailed Loss Log
                                    </h3>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter text-rose-500">{lossLog.length} Drops</Badge>
                                </div>
                                <div className="flex-1 overflow-auto max-h-[400px] custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50">
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sequence</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                                <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {lossLog.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-8 py-12 text-center text-xs font-bold text-slate-400 italic">No packet loss recorded yet.</td>
                                                </tr>
                                            ) : (
                                                lossLog.map((log, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-4 font-black text-slate-700">{log.type === 'Data' ? 'Frame' : 'ACK'} {log.seq}</td>
                                                        <td className="px-4 py-4">
                                                            <Badge className={log.type === 'Data' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}>{log.type}</Badge>
                                                        </td>
                                                        <td className="px-4 py-4 text-xs font-bold text-slate-500">{log.reason}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
