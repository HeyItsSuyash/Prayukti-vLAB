"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Intel8085 } from "@/lib/mpmc/8085-cpu";
import {
    Activity,
    Database,
    Hash,
    Cpu,
    ChevronRight,
    Terminal,
    HelpCircle,
    Monitor
} from "lucide-react";
import { OpcodeGuide } from "./OpcodeGuide";

interface TrainerKitProps {
    cpu: Intel8085;
    onSync: () => void;
}

type KitMode = "IDLE" | "ADDRESS_SET" | "WRITE" | "EXEC_ADDR" | "EXAMINE_REG";

export const TrainerKit: React.FC<TrainerKitProps> = ({ cpu, onSync }) => {
    const [mode, setMode] = useState<KitMode>("IDLE");
    const [currentAddress, setCurrentAddress] = useState(0x0000);
    const [selectedRegister, setSelectedRegister] = useState<string | null>(null);
    const [buffer, setBuffer] = useState("");
    const [feedback, setFeedback] = useState("8085 READY. PRESS 'M' (Examine Memory), 'R' (Examine Register), or 'G' (Go).");
    const [isRunning, setIsRunning] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const stopRef = useRef(false);

    const sync = useCallback(() => {
        onSync();
    }, [onSync]);

    const handleStep = useCallback(() => {
        if (cpu.isHalted) {
            setFeedback("HALTED. RESET TO CONTINUE.");
            return;
        }
        const result = cpu.step();
        sync();
        setFeedback(`STEP: ${result.mnemonic} @ ${result.pc.toString(16).toUpperCase().padStart(4, "0")}H`);
    }, [cpu, sync]);

    const handleRun = useCallback(async (startAddr: number) => {
        if (isRunning) return;
        cpu.registers.PC = startAddr;
        cpu.isHalted = false;
        setIsRunning(true);
        stopRef.current = false;
        setMode("IDLE");
        setFeedback(`RUNNING...`);

        try {
            let opsSinceYield = 0;
            while (!cpu.isHalted && !stopRef.current) {
                cpu.step();
                opsSinceYield++;

                if (opsSinceYield >= 100) {
                    sync();
                    await new Promise(r => setTimeout(r, 0));
                    opsSinceYield = 0;
                }
            }
        } catch (e: any) {
            setFeedback(`ERROR: ${e.message}`);
        }

        setIsRunning(false);
        sync();
        setFeedback(cpu.isHalted ? `HALTED @ ${cpu.registers.PC.toString(16).toUpperCase().padStart(4, "0")}H` : "STOPPED.");
    }, [cpu, isRunning, sync]);

    const handleReset = useCallback(() => {
        stopRef.current = true;
        cpu.reset();
        setMode("IDLE");
        setCurrentAddress(0x0000);
        setBuffer("");
        setSelectedRegister(null);
        setFeedback("8085 RESET.");
        sync();
    }, [cpu, sync]);

    const handleKeyDown = useCallback((e: KeyboardEvent | React.KeyboardEvent) => {
        // FOCUS SAFETY: Don't trigger shortcuts if user is typing in an input or textarea
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
            return;
        }

        // Prevent default browser shortcuts that we use
        if (["F5", "F7", "F8", "ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
            e.preventDefault();
        }

        const key = e.key.toUpperCase();

        // Global Reset
        if (key === "F1" || (e.ctrlKey && key === "R")) {
            handleReset();
            return;
        }

        if (key === "ESCAPE") {
            setMode("IDLE");
            setBuffer("");
            setFeedback("IDLE. READY.");
            return;
        }

        // State Machine
        switch (mode) {
            case "IDLE":
                if (key === "M" || key === "A" || key === ".") {
                    setMode("ADDRESS_SET");
                    setBuffer("");
                    setFeedback("SET ADDRESS: TYPE 4 HEX DIGITS");
                } else if (key === "R") {
                    setMode("EXAMINE_REG");
                    setBuffer("");
                    setSelectedRegister("A");
                    setFeedback("EXAMINE REGISTER: A");
                } else if (key === "G" || key === ":") {
                    setMode("EXEC_ADDR");
                    setBuffer("");
                    setFeedback("GO TO: TYPE START ADDRESS");
                } else if (key === "S" || key === "F7") {
                    handleStep();
                } else if (key === "F5") {
                    handleRun(currentAddress);
                }
                break;

            case "ADDRESS_SET":
                if (/^[0-9A-F]$/.test(key)) {
                    if (buffer.length < 4) setBuffer(prev => prev + key);
                } else if (key === "BACKSPACE") {
                    setBuffer(prev => prev.slice(0, -1));
                } else if (key === "ENTER" || key === ",") {
                    const addr = parseInt(buffer.padStart(4, "0"), 16);
                    setCurrentAddress(addr);
                    setMode("WRITE");
                    setBuffer("");
                    setFeedback(`MEMORY @ ${addr.toString(16).toUpperCase().padStart(4, "0")}H`);
                    sync();
                }
                break;

            case "WRITE":
                if (/^[0-9A-F]$/.test(key)) {
                    if (buffer.length < 2) setBuffer(prev => prev + key);
                } else if (key === "BACKSPACE") {
                    setBuffer(prev => prev.slice(0, -1));
                } else if (key === "ENTER" || key === "ARROWDOWN") {
                    // NEXT (Increment address)
                    const val = parseInt(buffer || cpu.readByte(currentAddress).toString(16), 16);
                    cpu.writeByte(currentAddress, val);
                    const nextAddr = (currentAddress + 1) & 0xFFFF;
                    setCurrentAddress(nextAddr);
                    setBuffer("");
                    setFeedback(`MEMORY @ ${nextAddr.toString(16).toUpperCase().padStart(4, "0")}H`);
                    sync();
                } else if (key === "," || key === "ARROWUP") {
                    // PREVIOUS (Decrement address)
                    const val = parseInt(buffer || cpu.readByte(currentAddress).toString(16), 16);
                    cpu.writeByte(currentAddress, val);
                    const prevAddr = (currentAddress - 1) & 0xFFFF;
                    setCurrentAddress(prevAddr);
                    setBuffer("");
                    setFeedback(`MEMORY @ ${prevAddr.toString(16).toUpperCase().padStart(4, "0")}H`);
                    sync();
                } else if (key === "M") {
                    setMode("ADDRESS_SET");
                    setBuffer("");
                }
                break;

            case "EXAMINE_REG":
                const regKeys: Record<string, string> = {
                    'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'H': 'H', 'L': 'L'
                };

                // If we have a buffer, numeric/hex keys are always digits
                if (buffer.length > 0 && /^[0-9A-F]$/.test(key)) {
                    const maxLen = (selectedRegister === "PC" || selectedRegister === "SP") ? 4 : 2;
                    if (buffer.length < maxLen) setBuffer(prev => prev + key);
                    return;
                }

                // Otherwise, check for register selection or digits
                if (regKeys[key]) {
                    setSelectedRegister(regKeys[key]);
                    setBuffer("");
                    setFeedback(`REGISTER ${key}`);
                } else if (key === "S") {
                    setSelectedRegister("SP");
                    setBuffer("");
                    setFeedback(`SP`);
                } else if (key === "P") {
                    setSelectedRegister("PC");
                    setBuffer("");
                    setFeedback(`PC`);
                } else if (/^[0-9A-F]$/.test(key)) {
                    // First digit starts the buffer
                    setBuffer(key);
                } else if (key === "ENTER" || key === "ARROWDOWN") {
                    // NEXT REG (Cycle A -> B -> C -> D -> E -> H -> L -> PC -> SP)
                    if (buffer) {
                        const val = parseInt(buffer, 16);
                        if (selectedRegister === "PC") cpu.registers.PC = val;
                        else if (selectedRegister === "SP") cpu.registers.SP = val;
                        else (cpu.registers as any)[selectedRegister!] = val & 0xFF;
                        setBuffer("");
                        sync();
                    }

                    const nextRegMap: Record<string, string> = {
                        'A': 'B', 'B': 'C', 'C': 'D', 'D': 'E', 'E': 'H', 'H': 'L', 'L': 'PC', 'PC': 'SP', 'SP': 'A'
                    };
                    const next = nextRegMap[selectedRegister || 'A'] || 'A';
                    setSelectedRegister(next);
                    setFeedback(`REGISTER ${next}`);
                } else if (key === "ARROWUP") {
                    // PREV REG
                    const prevRegMap: Record<string, string> = {
                        'B': 'A', 'C': 'B', 'D': 'C', 'E': 'D', 'H': 'E', 'L': 'H', 'PC': 'L', 'SP': 'PC', 'A': 'SP'
                    };
                    const prev = prevRegMap[selectedRegister || 'A'] || 'A';
                    setSelectedRegister(prev);
                    setFeedback(`REGISTER ${prev}`);
                }
                break;

            case "EXEC_ADDR":
                if (/^[0-9A-F]$/.test(key)) {
                    if (buffer.length < 4) setBuffer(prev => prev + key);
                } else if (key === "BACKSPACE") {
                    setBuffer(prev => prev.slice(0, -1));
                } else if (key === "ENTER") {
                    const addr = parseInt(buffer.padStart(4, "0"), 16);
                    handleRun(addr);
                }
                break;
        }
    }, [mode, buffer, cpu, currentAddress, isRunning, sync, handleStep, handleRun, handleReset, selectedRegister]);

    const handleIOExamine = () => {
        setFeedback("I/O PORTS: Port 00H-FFH support (Read only in simulator)");
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Display Helper Logic
    const displayAddressHex = (() => {
        if (mode === "ADDRESS_SET" || mode === "EXEC_ADDR") return buffer.padStart(4, " ");
        if (mode === "EXAMINE_REG") {
            if (selectedRegister === "PC") return "P C ";
            if (selectedRegister === "SP") return "S P ";
            return "   " + (selectedRegister || " ");
        }
        return currentAddress.toString(16).toUpperCase().padStart(4, "0");
    })();

    const displayDataHex = (() => {
        if (mode === "WRITE") return buffer.padStart(2, " ");
        if (mode === "EXAMINE_REG" && selectedRegister) {
            if (buffer) {
                if (selectedRegister === "PC" || selectedRegister === "SP") return buffer.slice(-4).padStart(4, " "); // Show typed bits
                return buffer.padStart(2, " ");
            }
            const val = selectedRegister === "PC" ? cpu.registers.PC :
                selectedRegister === "SP" ? cpu.registers.SP :
                    (cpu.registers as any)[selectedRegister];
            return val.toString(16).toUpperCase().padStart(selectedRegister === "PC" || selectedRegister === "SP" ? 4 : 2, "0");
        }
        return cpu.readByte(currentAddress).toString(16).toUpperCase().padStart(2, "0");
    })();

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="trainer-panel p-6 rounded-3xl border-4 border-slate-900 shadow-2xl relative overflow-hidden ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-[#2e7d32]/50 transition-all"
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">
                {/* Header Area */}
                <div className="flex justify-between items-start border-b border-[#222] pb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-400 tracking-tighter">MP-8085 / VLAB-T01</h2>
                            {isFocused && (
                                <div className="flex items-center gap-1 bg-[#2e7d32]/20 px-2 py-0.5 rounded border border-[#2e7d32]/30">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
                                    <span className="text-[8px] font-bold text-[#39ff14] uppercase">Keyboard Active</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-red-500 animate-pulse shadow-[0_0_8px_#f00]" : "bg-red-900"}`} />
                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{isRunning ? "RUNNING" : "READY"}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowGuide(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#222] hover:bg-[#333] border border-[#444] rounded text-slate-400 text-[10px] font-bold transition-all active:scale-95"
                        >
                            <HelpCircle className="h-3.5 w-3.5" /> OPCODE GUIDE
                        </button>
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Advanced Microprocessor</span>
                            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest">Training Environment</span>
                        </div>
                    </div>
                </div>

                {showGuide && <OpcodeGuide onClose={() => setShowGuide(false)} />}

                {/* Display Console */}
                <div className="bg-[#050505] p-8 rounded-2xl border-b-8 border-r-8 border-black/40 mb-8 shadow-2xl flex justify-center gap-16 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none" />
                    {/* Address LED */}
                    <div className="space-y-3 z-10">
                        <div className="text-[11px] text-slate-700 font-black uppercase tracking-[0.2em] text-center">Address / Register</div>
                        <HexDisplay value={displayAddressHex} length={displayAddressHex.length} size="lg" />
                    </div>
                    {/* Data LED */}
                    <div className="space-y-3 z-10">
                        <div className="text-[11px] text-slate-800 font-black uppercase tracking-[0.2em] text-center">Data / Value</div>
                        <HexDisplay value={displayAddressHex.length > 4 ? displayDataHex.slice(-4) : displayDataHex} length={2} size="lg" />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left: Registers and Flags */}
                    <div className="col-span-8 space-y-6">
                        <div className="bg-[#0a0a0a] p-5 rounded-2xl border border-white/5 shadow-xl">
                            <div className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Cpu className="h-3 w-3 text-red-900" /> Internal Processor State
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {['A', 'B', 'C', 'D', 'E', 'H', 'L'].map(reg => (
                                    <StatBox
                                        key={reg}
                                        label={reg}
                                        val={cpu.registers[reg as keyof typeof cpu.registers]}
                                        active={selectedRegister === reg}
                                    />
                                ))}
                                <StatBox
                                    label="M (HL)"
                                    val={cpu.readByte(cpu.getHL())}
                                    active={false}
                                />
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end gap-6">
                                <div className="flex gap-6">
                                    <RegisterPair label="PC" h={cpu.registers.PC >> 8} l={cpu.registers.PC & 0xFF} activeH={selectedRegister === "PC"} activeL={selectedRegister === "PC"} />
                                    <RegisterPair label="SP" h={cpu.registers.SP >> 8} l={cpu.registers.SP & 0xFF} activeH={selectedRegister === "SP"} activeL={selectedRegister === "SP"} />
                                </div>

                                <div className="flex bg-black/40 p-3 rounded-xl border border-white/5 gap-6 items-center px-6">
                                    {Object.entries(cpu.flags).map(([f, v]) => (
                                        <FlagLED key={f} label={f} status={v} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status & Feedback */}
                        <div className="bg-black/60 border border-white/5 p-4 rounded-xl flex items-center gap-3 shadow-inner">
                            <Terminal className="h-4 w-4 text-emerald-900" />
                            <span className="text-xs text-emerald-500/80 font-mono tracking-tight truncate uppercase">{feedback}</span>
                        </div>

                        {/* Keyboard Help */}
                        <div className="grid grid-cols-4 gap-3">
                            <KeyHelp k="M" t="SET ADDR" desc="Exm Mem" />
                            <KeyHelp k="R" t="SET REG" desc="Exm Reg" />
                            <KeyHelp k="G" t="EXECUTE" desc="Go" />
                            <KeyHelp k="S" k2="F7" t="STEP" desc="Next Inst" />
                            <KeyHelp k="F5" t="RUN" desc="Auto Mode" />
                            <KeyHelp k="ENT" k2="↓" t="INCR" desc="Next Loc" />
                            <KeyHelp k="." k2="↑" t="DECR" desc="Prev Loc" />
                            <KeyHelp k="ESC" t="RESET" desc="Warm Start" />
                        </div>

                        {/* Memory Trace Panel */}
                        <div className="bg-[#050505] p-3 rounded border border-[#222]">
                            <div className="text-[10px] text-slate-700 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Hash className="h-3 w-3" /> Memory Peek (PC Range)
                            </div>
                            <div className="grid grid-cols-8 gap-1">
                                {Array.from({ length: 16 }).map((_, i) => {
                                    const addr = (cpu.registers.PC - 4 + i) & 0xFFFF;
                                    const val = cpu.readByte(addr);
                                    const isPC = addr === cpu.registers.PC;
                                    return (
                                        <div key={addr} className={`flex flex-col items-center p-1 rounded border ${isPC ? "bg-red-900/40 border-red-500/50" : "bg-black border-[#111]"}`}>
                                            <span className="text-[7px] text-slate-800 font-bold">{addr.toString(16).toUpperCase().padStart(4, "0")}</span>
                                            <span className={`text-[11px] font-bold ${isPC ? "text-red-500" : "text-slate-600"}`}>{val.toString(16).toUpperCase().padStart(2, "0")}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Keypad */}
                    <div className="col-span-4 bg-[#1a1a1a] p-4 rounded border border-[#333] shadow-lg">
                        <div className="grid grid-cols-4 gap-2">
                            {['C', 'D', 'E', 'F', '8', '9', 'A', 'B', '4', '5', '6', '7', '0', '1', '2', '3'].map(k => (
                                <button
                                    key={k}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleKeyDown({ key: k, preventDefault: () => { } } as any);
                                    }}
                                    className="h-10 bg-[#333] hover:bg-[#444] text-slate-200 rounded font-black border-b-2 border-black active:translate-y-0.5 transition-all text-sm"
                                >
                                    {k}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <button onClick={(e) => { e.stopPropagation(); handleKeyDown({ key: 'ENTER', preventDefault: () => { } } as any); }} className="h-10 bg-[#444] hover:bg-[#555] text-white rounded font-bold text-xs">NEXT</button>
                            <button onClick={(e) => { e.stopPropagation(); handleKeyDown({ key: 'M', preventDefault: () => { } } as any); }} className="h-10 bg-[#444] hover:bg-[#555] text-white rounded font-bold text-xs">EXM MEM</button>
                            <button onClick={(e) => { e.stopPropagation(); handleKeyDown({ key: 'G', preventDefault: () => { } } as any); }} className="h-10 bg-[#cc3333] hover:bg-[#dd4444] text-white rounded font-bold text-xs">EXEC</button>
                            <button onClick={(e) => { e.stopPropagation(); handleKeyDown({ key: 'ESCAPE', preventDefault: () => { } } as any); }} className="h-10 bg-[#222] hover:bg-[#333] text-gray-400 rounded font-bold text-xs">RESET</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Authentic 8-bit Seven Segment Display Segment mapping
 * Based on common cathode/anode patterns
 */
const SevenSegment = ({ val, active = true, size = "md" }: { val: string, active?: boolean, size?: "sm" | "md" | "lg" }) => {
    // Map hex digit to segments (a, b, c, d, e, f, g)
    const segments: Record<string, boolean[]> = {
        '0': [true, true, true, true, true, true, false],
        '1': [false, true, true, false, false, false, false],
        '2': [true, true, false, true, true, false, true],
        '3': [true, true, true, true, false, false, true],
        '4': [false, true, true, false, false, true, true],
        '5': [true, false, true, true, false, true, true],
        '6': [true, false, true, true, true, true, true],
        '7': [true, true, true, false, false, false, false],
        '8': [true, true, true, true, true, true, true],
        '9': [true, true, true, true, false, true, true],
        'A': [true, true, true, false, true, true, true],
        'B': [false, false, true, true, true, true, true],
        'C': [true, false, false, true, true, true, false],
        'D': [false, true, true, true, true, false, true],
        'E': [true, false, false, true, true, true, true],
        'F': [true, false, false, false, true, true, true],
    };

    const s = segments[val.toUpperCase()] || [false, false, false, false, false, false, true]; // Default to dash or empty
    const scale = size === "sm" ? "scale-75" : size === "lg" ? "scale-125" : "scale-100";

    return (
        <div className={`relative w-8 h-12 inline-block ${scale} ${active ? "text-red-500" : "text-red-950/20"}`}>
            {/* Top (a) */}
            <div className={`absolute top-0 left-1 right-1 h-1 rounded-full transition-colors ${s[0] ? "bg-current shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-current/10"}`} />
            {/* Top Right (b) */}
            <div className={`absolute top-1 right-0 w-1 h-4 rounded-full transition-colors ${s[1] ? "bg-current shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-current/10"}`} />
            {/* Bottom Right (c) */}
            <div className={`absolute bottom-1 right-0 w-1 h-4 rounded-full transition-colors ${s[2] ? "bg-current shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-current/10"}`} />
            {/* Bottom (d) */}
            <div className={`absolute bottom-0 left-1 right-1 h-1 rounded-full transition-colors ${s[3] ? "bg-current shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-current/10"}`} />
            {/* Bottom Left (e) */}
            <div className={`absolute bottom-1 left-0 w-1 h-4 rounded-full transition-colors ${s[4] ? "bg-current shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-current/10"}`} />
            {/* Top Left (f) */}
            <div className={`absolute top-1 left-0 w-1 h-4 rounded-full transition-colors ${s[5] ? "bg-current shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-current/10"}`} />
            {/* Middle (g) */}
            <div className={`absolute top-1/2 left-1 right-1 h-1 -translate-y-1/2 rounded-full transition-colors ${s[6] ? "bg-current shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-current/10"}`} />
        </div>
    );
};

const HexDisplay = ({ value, length = 2, size = "md", active = true }: { value: number | string, length?: number, size?: "sm" | "md" | "lg", active?: boolean }) => {
    const str = (typeof value === "number" ? value.toString(16) : value).toUpperCase().padStart(length, "0");
    return (
        <div className="flex gap-1.5 items-center justify-center p-2 bg-black/80 rounded-lg border border-white/5 shadow-inner">
            {str.split("").map((char, i) => (
                <SevenSegment key={i} val={char} size={size} active={active} />
            ))}
        </div>
    );
};

const StatBox = ({ label, val, active }: { label: string, val: number, active: boolean }) => (
    <div className={`p-2 rounded-xl border border-white/5 transition-all bg-black/40 ${active ? "shadow-[inset_0_0_15px_rgba(239,68,68,0.1)] border-red-500/20" : ""}`}>
        <div className="text-[9px] text-slate-500 font-bold mb-2 uppercase tracking-tight text-center">{label}</div>
        <HexDisplay value={val} length={2} active={active} />
    </div>
);

const RegisterPair = ({ label, h, l, activeH, activeL }: { label: string, h: number, l: number, activeH: boolean, activeL: boolean }) => (
    <div className="space-y-2">
        <div className="text-[10px] text-slate-400 font-black text-center">{label}</div>
        <div className="grid grid-cols-2 gap-2">
            <StatBox label={label[0]} val={h} active={activeH} />
            <StatBox label={label[1]} val={l} active={activeL} />
        </div>
    </div>
);

const FlagLED = ({ label, status }: { label: string, status: boolean }) => (
    <div className="flex flex-col items-center gap-1">
        <div className={`w-3 h-3 rounded-full border-2 border-black/50 transition-all ${status ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-red-950/30"}`} />
        <span className={`text-[9px] font-bold ${status ? "text-red-400" : "text-slate-600"}`}>{label}</span>
    </div>
);

const KeyHelp = ({ k, k2, t, desc }: { k: string, k2?: string, t: string, desc?: string }) => (
    <div className="flex flex-col items-center bg-black/40 p-1.5 rounded border border-white/5 shadow-sm">
        <span className="text-[9px] text-slate-400 font-black tracking-widest">{k}{k2 ? ` / ${k2}` : ''}</span>
        <span className="text-[7px] text-slate-600 font-bold uppercase mt-0.5">{t}</span>
        {desc && <span className="text-[6px] text-slate-800 font-medium">{desc}</span>}
    </div>
);
