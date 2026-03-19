"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, RotateCcw, HelpCircle, CheckCircle2, Info, BookOpen, ListChecks, FileText, ClipboardCopy, Download, Beaker } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Intel8085 } from "@/lib/mpmc/8085-cpu";
import { Assembler } from "@/lib/mpmc/assembler";
import { TrainerKit } from "@/components/simulation/mpmc/TrainerKit";
import { updateLabProgress } from "@/lib/progress-utils";

// Types for 8085 State
interface Registers {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    H: number;
    L: number;
}

interface Flags {
    S: boolean;
    Z: boolean;
    AC: boolean;
    P: boolean;
    CY: boolean;
}

const calculateParity = (num: number) => {
    let count = 0;
    for (let i = 0; i < 8; i++) {
        if ((num >> i) & 1) count++;
    }
    return count % 2 === 0;
};

const LAB_DATA: Record<string, any> = {
    "mpmc-exp-1": {
        title: "Decimal Arithmetic (8085)",
        modes: ["Addition", "Subtraction"],
        content: {
            "Addition": {
                aim: "To perform BCD (Binary Coded Decimal) addition of two 8-bit numbers using 8085 microprocessor.",
                theory: "BCD addition requires special handling because binary addition of two BCD digits can result in a value greater than 9 or a carry to the next nibble. The DAA instruction automatically corrects the result into a valid BCD format by checking AC and CY flags.",
                algorithm: [
                    "Initialize HL pair with 2000H.",
                    "Load first BCD number into Accumulator.",
                    "Increment HL to 2001H.",
                    "Add second BCD number to Accumulator.",
                    "Execute DAA to adjust result to BCD.",
                    "Store result at 2002H and Halt."
                ],
                instructions_asm: "LXI H, 2000H\nMOV A, M\nINX H\nADD M\nDAA\nSTA 2002H\nHLT",
                instructions: (m: any) => [
                    { label: "LXI H, 2000H", description: "Loading HL pair with address 2000H", execute: (s: any) => ({ ...s, H: 0x20, L: 0x00 }) },
                    { label: "MOV A, M", description: "Moving content of memory [2000] to A", execute: (s: any, mem: any) => ({ ...s, A: mem["2000"] }) },
                    { label: "INX H", description: "Incrementing HL pair to 2001H", execute: (s: any) => ({ ...s, L: (s.L + 1) & 0xFF }) },
                    {
                        label: "ADD M", description: "Adding content of memory [2001] to A", execute: (s: any, mem: any) => {
                            const val1 = s.A;
                            const val2 = mem["2001"];
                            const sum = val1 + val2;
                            const ac = ((val1 & 0x0F) + (val2 & 0x0F)) > 0x0F;
                            return {
                                newState: { ...s, A: sum & 0xFF },
                                newFlags: { S: (sum & 0x80) !== 0, Z: (sum & 0xFF) === 0, AC: ac, P: calculateParity(sum & 0xFF), CY: sum > 0xFF }
                            };
                        }
                    },
                    {
                        label: "DAA", description: "Decimal Adjust Accumulator", execute: (s: any, mem: any, f: any) => {
                            let res = s.A;
                            let cy = f.CY;
                            let ac = f.AC;
                            if ((res & 0x0F) > 9 || ac) { res += 6; ac = true; }
                            if ((res >> 4) > 9 || cy) { res += 0x60; cy = true; }
                            return {
                                newState: { ...s, A: res & 0xFF },
                                newFlags: { ...f, S: (res & 0x80) !== 0, Z: (res & 0xFF) === 0, AC: ac, P: calculateParity(res & 0xFF), CY: cy || res > 0xFF }
                            };
                        }
                    },
                    { label: "STA 2002H", description: "Storing result in memory [2002]", execute: (s: any) => ({ ...s, memUpdate: { "2002": s.A } }) },
                    { label: "HLT", description: "Halt Execution", execute: (s: any) => s }
                ]
            },
            "Subtraction": {
                aim: "To perform BCD subtraction of two 8-bit numbers using 10's complement method.",
                theory: "BCD subtraction in 8085 is typically performed using 9's or 10's complement of the subtrahend. For 10's complement: Subtract the number from 99H and add 1, then add this to the minuend and apply BCD correction.",
                algorithm: [
                    "Load 99H into Accumulator.",
                    "Subtract subtrahend to get 9's complement.",
                    "Add 01H to get 10's complement.",
                    "Add minuend to the result.",
                    "Execute DAA for BCD correction.",
                    "Store result and Halt."
                ],
                instructions_asm: "MVI A, 99H\nLXI H, 2001H\nSUB M\nADI 01H\nLXI H, 2000H\nADD M\nDAA\nSTA 2002H\nHLT",
                instructions: (m: any) => [
                    { label: "MVI A, 99H", description: "Load 99H for complement calculation", execute: (s: any) => ({ ...s, A: 0x99 }) },
                    { label: "LXI H, 2001H", description: "Point to subtrahend", execute: (s: any) => ({ ...s, H: 0x20, L: 0x01 }) },
                    { label: "SUB M", description: "A = 99H - [2001] (9's complement)", execute: (s: any, mem: any) => ({ ...s, A: (s.A - mem["2001"]) & 0xFF }) },
                    { label: "ADI 01H", description: "Add 1 to get 10's complement", execute: (s: any) => ({ ...s, A: (s.A + 1) & 0xFF }) },
                    { label: "LXI H, 2000H", description: "Point to minuend", execute: (s: any) => ({ ...s, H: 0x20, L: 0x00 }) },
                    { label: "ADD M", description: "Add minuend to 10's complement", execute: (s: any, mem: any) => ({ ...s, A: (s.A + mem["2000"]) & 0xFF }) },
                    {
                        label: "DAA", description: "BCD Correction", execute: (s: any, mem: any, f: any) => {
                            let res = s.A;
                            if ((res & 0x0F) > 9) res += 6;
                            if ((res >> 4) > 9) res += 0x60;
                            return { newState: { ...s, A: res & 0xFF }, newFlags: { ...f, CY: res > 0xFF } };
                        }
                    },
                    { label: "STA 2002H", description: "Store Result", execute: (s: any) => ({ ...s, memUpdate: { "2002": s.A } }) },
                    { label: "HLT", description: "Halt", execute: (s: any) => s }
                ]
            }
        },
        viva: [
            { q: "What is the primary purpose of the DAA instruction?", options: ["Multiply", "Convert and Adjust BCD", "Decrement", "Divide"], answer: 1 },
            { q: "Which flags affect DAA?", options: ["S, Z", "P, CY", "AC, CY", "All flags"], answer: 2 }
        ]
    },
    "mpmc-exp-2": {
        title: "Hexadecimal Arithmetic (8085)",
        modes: ["Addition", "Subtraction"],
        content: {
            "Addition": {
                aim: "To perform Hexadecimal addition of two 8-bit numbers using 8085 microprocessor.",
                theory: "Hexadecimal addition in 8085 is a straight binary addition of two 8-bit values. The result is stored in the accumulator, and the carry flag is set if the sum exceeds 255 (FFH). This experiment demonstrates basic data transfer and arithmetic instructions.",
                algorithm: [
                    "Initialize HL pair with 2000H.",
                    "Load first Hex number into Accumulator.",
                    "Load second Hex number into a register or point using HL.",
                    "Add the two numbers.",
                    "Store the result at 2002H and Halt."
                ],
                instructions_asm: "LDA 2000H\nMOV B, A\nLDA 2001H\nADD B\nSTA 2002H\nHLT",
                instructions: (m: any) => [
                    { label: "LDA 2000H", description: "Loading first number from 2000H to A", execute: (s: any, mem: any) => ({ ...s, A: mem["2000"] }) },
                    { label: "MOV B, A", description: "Moving first number to B register", execute: (s: any) => ({ ...s, B: s.A }) },
                    { label: "LDA 2001H", description: "Loading second number from 2001H to A", execute: (s: any, mem: any) => ({ ...s, A: mem["2001"] }) },
                    {
                        label: "ADD B", description: "Adding B to Accumulator", execute: (s: any) => {
                            const val1 = s.A;
                            const val2 = s.B;
                            const sum = val1 + val2;
                            const ac = ((val1 & 0x0F) + (val2 & 0x0F)) > 0x0F;
                            return {
                                newState: { ...s, A: sum & 0xFF },
                                newFlags: { S: (sum & 0x80) !== 0, Z: (sum & 0xFF) === 0, AC: ac, P: calculateParity(sum & 0xFF), CY: sum > 0xFF }
                            };
                        }
                    },
                    { label: "STA 2002H", description: "Storing result in memory [2002]", execute: (s: any) => ({ ...s, memUpdate: { "2002": s.A } }) },
                    { label: "HLT", description: "Halt execution", execute: (s: any) => s }
                ]
            },
            "Subtraction": {
                aim: "To perform Hexadecimal subtraction of two 8-bit numbers.",
                theory: "Hexadecimal subtraction in 8085 is performed using 2's complement logic. When SUB is executed, the subtrahend is complemented and added to the minuend. The Carry Flag (CY) acts as a Borrow flag, being set if the minuend is smaller than the subtrahend.",
                algorithm: [
                    "Load minuend into Accumulator from 2000H.",
                    "Load subtrahend into register B from 2001H.",
                    "Subtract B from A using SUB instruction.",
                    "Store results in 2002H and Halt."
                ],
                instructions_asm: "LDA 2000H\nMOV B, A\nLDA 2001H\nSUB B\nSTA 2002H\nHLT",
                instructions: (m: any) => [
                    { label: "LDA 2000H", description: "Loading minuend from 2000H", execute: (s: any, mem: any) => ({ ...s, A: mem["2000"] }) },
                    { label: "MOV B, A", description: "Moving minuend to B", execute: (s: any) => ({ ...s, B: s.A }) },
                    { label: "LDA 2001H", description: "Loading subtrahend from 2001H", execute: (s: any, mem: any) => ({ ...s, A: mem["2001"] }) },
                    {
                        label: "SUB B", description: "Subtracting B from Accumulator", execute: (s: any) => {
                            const val1 = s.A;
                            const val2 = s.B;
                            const diff = val1 - val2;
                            const ac = ((val1 & 0x0F) - (val2 & 0x0F)) < 0;
                            return {
                                newState: { ...s, A: diff & 0xFF },
                                newFlags: { S: (diff & 0x80) !== 0, Z: (diff & 0xFF) === 0, AC: ac, P: calculateParity(diff & 0xFF), CY: diff < 0 }
                            };
                        }
                    },
                    { label: "STA 2002H", description: "Storing result in memory [2002]", execute: (s: any) => ({ ...s, memUpdate: { "2002": s.A } }) },
                    { label: "HLT", description: "Halt execution", execute: (s: any) => s }
                ]
            }
        },
        viva: [
            { q: "How many bits are represented by a single hexadecimal digit?", options: ["2 bits", "4 bits", "8 bits", "16 bits"], answer: 1 },
            { q: "What is the maximum hexadecimal value that can be stored in an 8-bit register?", options: ["99H", "F0H", "FFH", "FFFH"], answer: 2 },
            { q: "During hex addition, when is the Carry Flag (CY) set?", options: ["Result is zero", "Result exceeds FFH", "Carry from bit 3 to 4", "Result is negative"], answer: 1 }
        ]
    },
    "mpmc-exp-3": {
        title: "BCD Arithmetic (8085)",
        modes: ["Addition", "Subtraction"],
        content: {
            "Addition": {
                aim: "To perform BCD addition of two 8-bit numbers using 8085 microprocessor.",
                theory: "BCD addition requires adjustment if the sum of any two digits is greater than 9 or there is a carry. The DAA instruction corrects the binary result into valid BCD by adding 6 to the nibble(s) that need correction.",
                algorithm: [
                    "Point HL pair to 2000H.",
                    "Load first BCD operand into Accumulator.",
                    "Add second BCD operand from memory address 2001H.",
                    "Execute DAA instruction for BCD correction.",
                    "Store result at 2002H and Halt."
                ],
                instructions_asm: "LXI H, 2000H\nMOV A, M\nINX H\nADD M\nDAA\nSTA 2002H\nHLT",
                instructions: (m: any) => [
                    { label: "LXI H, 2000H", description: "Loading HL pair with address 2000H", execute: (s: any) => ({ ...s, H: 0x20, L: 0x00 }) },
                    { label: "MOV A, M", description: "Moving content of memory [2000] to A", execute: (s: any, mem: any) => ({ ...s, A: mem["2000"] }) },
                    { label: "INX H", description: "Incrementing HL pair to 2001H", execute: (s: any) => ({ ...s, L: (s.L + 1) & 0xFF }) },
                    {
                        label: "ADD M", description: "Adding content of memory [2001] to A", execute: (s: any, mem: any) => {
                            const val1 = s.A;
                            const val2 = mem["2001"];
                            const sum = val1 + val2;
                            const ac = ((val1 & 0x0F) + (val2 & 0x0F)) > 0x0F;
                            return {
                                newState: { ...s, A: sum & 0xFF },
                                newFlags: { S: (sum & 0x80) !== 0, Z: (sum & 0xFF) === 0, AC: ac, P: calculateParity(sum & 0xFF), CY: sum > 0xFF }
                            };
                        }
                    },
                    {
                        label: "DAA", description: "Decimal Adjust Accumulator", execute: (s: any, mem: any, f: any) => {
                            let res = s.A;
                            let cy = f.CY;
                            let ac = f.AC;
                            if ((res & 0x0F) > 9 || ac) { res += 6; ac = true; }
                            if ((res >> 4) > 9 || cy) { res += 0x60; cy = true; }
                            return {
                                newState: { ...s, A: res & 0xFF },
                                newFlags: { ...f, S: (res & 0x80) !== 0, Z: (res & 0xFF) === 0, AC: ac, P: calculateParity(res & 0xFF), CY: cy || res > 0xFF }
                            };
                        }
                    },
                    { label: "STA 2002H", description: "Storing result in memory [2002]", execute: (s: any) => ({ ...s, memUpdate: { "2002": s.A } }) },
                    { label: "HLT", description: "Halt Execution", execute: (s: any) => s }
                ]
            },
            "Subtraction": {
                aim: "To perform BCD subtraction of two 8-bit numbers using 10's complement logic.",
                theory: "In 8085, BCD subtraction is often done by taking the 10's complement of the subtrahend and adding it to the minuend, followed by DAA correction. 10's complement is 9's complement + 1.",
                algorithm: [
                    "Load 99H to Accumulator for subtraction from minuend/subtrahend.",
                    "Perform SUB to get 9's complement of subtrahend.",
                    "Add 01H to get 10's complement.",
                    "Add minuend to the result.",
                    "Apply DAA for final BCD correction and Halt."
                ],
                instructions_asm: "MVI A, 99H\nLXI H, 2001H\nSUB M\nADI 01H\nLXI H, 2000H\nADD M\nDAA\nSTA 2002H\nHLT",
                instructions: (m: any) => [
                    { label: "MVI A, 99H", description: "Loading 99H for complement calculation", execute: (s: any) => ({ ...s, A: 0x99 }) },
                    { label: "LXI H, 2001H", description: "Point to subtrahend address 2001H", execute: (s: any) => ({ ...s, H: 0x20, L: 0x01 }) },
                    { label: "SUB M", description: "A = 99H - [2001] (9's complement)", execute: (s: any, mem: any) => ({ ...s, A: (s.A - mem["2001"]) & 0xFF }) },
                    { label: "ADI 01H", description: "Adding 1 to get 10's complement", execute: (s: any) => ({ ...s, A: (s.A + 1) & 0xFF }) },
                    { label: "LXI H, 2000H", description: "Point to minuend address 2000H", execute: (s: any) => ({ ...s, H: 0x20, L: 0x00 }) },
                    { label: "ADD M", description: "Add minuend to 10's complement", execute: (s: any, mem: any) => ({ ...s, A: (s.A + mem["2000"]) & 0xFF }) },
                    {
                        label: "DAA", description: "BCD Correction after addition", execute: (s: any, mem: any, f: any) => {
                            let res = s.A;
                            if ((res & 0x0F) > 9) res += 6;
                            if ((res >> 4) > 9) res += 0x60;
                            return { newState: { ...s, A: res & 0xFF }, newFlags: { ...f, CY: res > 0xFF } };
                        }
                    },
                    { label: "STA 2002H", description: "Storing Result in [2002]", execute: (s: any) => ({ ...s, memUpdate: { "2002": s.A } }) },
                    { label: "HLT", description: "Halt program", execute: (s: any) => s }
                ]
            }
        },
        viva: [
            { q: "What is the 10's complement of 25H in BCD?", options: ["75H", "74H", "76H", "80H"], answer: 0 },
            { q: "Which instruction is used for decimal adjustment?", options: ["ADI", "DAA", "XCHG", "STC"], answer: 1 }
        ]
    },
    "mpmc-exp-4": {
        title: "Multiplication & Division (8085)",
        modes: ["Multiplication", "Division"],
        content: {
            "Multiplication": {
                aim: "To multiply two 8-bit numbers using repeated addition.",
                theory: "Multiplication is performed by adding the multiplicand for 'multiplier' number of times.",
                algorithm: ["Initialize result=0", "Loop multiplier times", "Add multiplicand", "Decrement counter", "Store result"],
                instructions_asm: "LXI H, 2000H\nMOV B, M\nINX H\nMOV C, M\nXRA A\nLOOP: ADD B\nDCR C\nJNZ LOOP\nSTA 2002H\nHLT",
                instructions: (m: any) => [
                    { step: 1, inst: "LXI H, 2000H", desc: "Point to first number (Multiplicand)" },
                    { step: 2, inst: "MOV B, M", desc: "B = " + (m[0x2000] || 0).toString(16).toUpperCase() + "H" },
                    { step: 3, inst: "INX H", desc: "Point to second number (Multiplier)" },
                    { step: 4, inst: "MOV C, M", desc: "C (Counter) = " + (m[0x2001] || 0).toString(16).toUpperCase() + "H" },
                    { step: 5, inst: "XRA A", desc: "Accumulator = 00H" },
                    { step: 6, inst: "LOOP: ADD B", desc: "A = A + B (Repeated Addition)" },
                    { step: 7, inst: "DCR C", desc: "Decrement loop counter C" },
                    { step: 8, inst: "JNZ LOOP", desc: "If C != 0, jump back to LOOP" },
                    { step: 9, inst: "STA 2002H", desc: "Store Product at 2002H" },
                    { step: 10, inst: "HLT", desc: "Stop execution" }
                ]
            },
            "Division": {
                aim: "To divide two 8-bit numbers using repeated subtraction.",
                theory: "Division is performed by subtracting the divisor from the dividend repeatedly until the remainder is less than the divisor. The count of subtractions is the Quotient.",
                algorithm: ["Load Dividend and Divisor", "Compare Dividend with Divisor", "If < go to END", "Subtract Divisor", "Increment Quotient", "Repeat", "END: Store results"],
                instructions_asm: "LXI H, 2000H\nMOV A, M\nINX H\nMOV B, M\nMVI C, 00H\nLOOP: CMP B\nJC DONE\nSUB B\nINR C\nJMP LOOP\nDONE: STA 2002H\nMOV A, C\nSTA 2003H\nHLT",
                instructions: (m: any) => [
                    { step: 1, inst: "LXI H, 2000H", desc: "Point to data" },
                    { step: 2, inst: "MOV A, M", desc: "A (Dividend) = " + (m[0x2000] || 0).toString(16).toUpperCase() + "H" },
                    { step: 3, inst: "INX H", desc: "Move to Divisor" },
                    { step: 4, inst: "MOV B, M", desc: "B (Divisor) = " + (m[0x2001] || 0).toString(16).toUpperCase() + "H" },
                    { step: 5, inst: "MVI C, 00H", desc: "Initialize C (Quotient) = 00H" },
                    { step: 6, inst: "LOOP: CMP B", desc: "Compare A with B" },
                    { step: 7, inst: "JC DONE", desc: "If A < B (Carry set), we are done" },
                    { step: 8, inst: "SUB B", desc: "A = A - B (Repeated Subtraction)" },
                    { step: 9, inst: "INR C", desc: "Increment Quotient count" },
                    { step: 10, inst: "JMP LOOP", desc: "Subtract again" },
                    { step: 11, inst: "DONE: STA 2002H", desc: "Store Remainder (A) at 2002H" },
                    { step: 12, inst: "MOV A, C", desc: "Move Quotient to A" },
                    { step: 13, inst: "STA 2003H", desc: "Store Quotient at 2003H" },
                    { step: 14, inst: "HLT", desc: "Stop execution" }
                ]
            }
        },
        viva: [
            { q: "Which method is used for multiplication in 8085?", options: ["Direct Instruction", "Repeated Addition", "Booth's Algorithm", "Shift and Add"], answer: 1 },
            { q: "In division, the number of successful subtractions is the:", options: ["Remainder", "Divisor", "Quotient", "Dividend"], answer: 2 },
            { q: "What is the purpose of the JMP instruction?", options: ["Jump if Zero", "Unconditional Jump", "Call Subroutine", "Halt"], answer: 1 }
        ]
    }
};

export default function MPMCSimulator({
    labId,
    initialData,
    readonly = false
}: {
    labId: string;
    initialData?: { asmCode?: string };
    readonly?: boolean;
}) {
    const lab = LAB_DATA[labId] || LAB_DATA["mpmc-exp-1"];

    const [cpu] = useState(new Intel8085());
    const [asmCode, setAsmCode] = useState(initialData?.asmCode || "");

    // Listen for exam state requests from parent iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'REQUEST_EXAM_STATE') {
                window.postMessage({
                    type: 'EXAM_STATE_RESPONSE',
                    payload: { type: 'MPMC', asmCode }
                }, '*');
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [asmCode]);

    const [isRunning, setIsRunning] = useState(false);
    const [runSpeed, setRunSpeed] = useState(100); // ms delay
    const [binary, setBinary] = useState<number[]>([]);

    const [mode, setMode] = useState<string>(lab.modes[0]);
    const [registers, setRegisters] = useState(cpu.registers);
    const [flags, setFlags] = useState(cpu.flags);
    const [memory, setMemory] = useState<Uint8Array>(cpu.memory);

    const [step, setStep] = useState(0);

    const defaultTab = readonly ? "simulation" : "info";
    const [activeTab, setActiveTab] = useState<"info" | "simulation" | "table" | "viva" | "kit">(defaultTab);
    const [isExamMode, setIsExamMode] = useState(readonly);

    // Safely check URL params on client-side to avoid SSR hydration mismatch
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search.includes('mode=exam')) {
            if (!readonly) setActiveTab("simulation");
            setIsExamMode(true);
        }
    }, [readonly]);
    const [feedback, setFeedback] = useState<string>("Explore the 'Experiment Info' tab to understand the objectives.");
    const [history, setHistory] = useState<any[]>([]);
    const [lastChanged, setLastChanged] = useState<{ registers: string[], flags: string[], memory: number[] }>({
        registers: [], flags: [], memory: []
    });

    const handleAssemble = () => {
        const result = Assembler.assemble(asmCode);
        if (result.success) {
            cpu.reset();
            result.hex.forEach((b: number, i: number) => cpu.writeByte(i, b));
            setBinary(result.hex);
            syncCPU();
            setFeedback("Program assembled and loaded to memory 0000H.");
        } else {
            setFeedback(`Assembly Error: ${result.error}`);
        }
    };

    const isRunningRef = useRef(false);

    const syncCPU = useCallback(() => {
        setRegisters({ ...cpu.registers });
        setFlags({ ...cpu.flags });
        setMemory(new Uint8Array(cpu.memory));
    }, [cpu]);

    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    const handleStep = useCallback(() => {
        if (cpu.isHalted) return;

        const prevRegs = { ...cpu.registers };
        const prevFlags = { ...cpu.flags };

        const result = cpu.step();
        syncCPU();

        // Calculate changes for highlighting
        const changedRegs = Object.keys(cpu.registers).filter(k => (cpu.registers as any)[k] !== (prevRegs as any)[k]);
        const changedFlags = Object.keys(cpu.flags).filter(k => (cpu.flags as any)[k] !== (prevFlags as any)[k]);
        setLastChanged({ registers: changedRegs, flags: changedFlags, memory: [] });

        setHistory(prev => [...prev, {
            step: prev.length + 1,
            instruction: result.mnemonic,
            ...cpu.registers,
            flags: { ...cpu.flags },
            pc: result.pc
        }]);

        setFeedback(`Executed: ${result.mnemonic}`);
    }, [cpu, syncCPU]);

    const handleRun = async () => {
        if (isRunning) return;
        setIsRunning(true);
        isRunningRef.current = true;

        while (!cpu.isHalted && isRunningRef.current) {
            handleStep();
            const delay = Math.max(10, 1000 - runSpeed * 9.9);
            await new Promise(r => setTimeout(r, delay));
        }
        setIsRunning(false);
    };

    const reset = useCallback(() => {
        isRunningRef.current = false;
        setIsRunning(false);
        cpu.reset();
        syncCPU();
        setStep(0);
        setHistory([]);
        setLastChanged({ registers: [], flags: [], memory: [] });
        setFeedback("Program Reset. Load memory or use Editor.");

        if (!lab || !lab.modes) return;

        // Initial data setup for labs
        const addr1 = 0x2000;
        const addr2 = 0x2001;

        let val1 = 0x00;
        let val2 = 0x00;

        if (labId.includes("1")) {
            val1 = mode === "Addition" ? 0x45 : 0x82;
            val2 = mode === "Addition" ? 0x38 : 0x1B;
        } else if (labId.includes("2")) {
            val1 = mode === "Addition" ? 0xA2 : 0xA2;
            val2 = mode === "Addition" ? 0x1B : 0x1B;
        } else if (labId.includes("3")) {
            val1 = mode === "Addition" ? 0x28 : 0x75;
            val2 = mode === "Addition" ? 0x19 : 0x26;
        } else if (labId.includes("4")) {
            val1 = mode === "Multiplication" ? 0x05 : 0x0F;
            val2 = mode === "Multiplication" ? 0x03 : 0x03;
        }

        cpu.writeByte(addr1, val1);
        cpu.writeByte(addr2, val2);
        syncCPU();
    }, [cpu, labId, mode, syncCPU, lab]);

    // Reset state and mode when ID changes
    useEffect(() => {
        if (lab && lab.modes && lab.modes.length > 0) {
            setMode(lab.modes[0]);
            reset();
            // Initial progress: 30% for attending the lab
            updateLabProgress("mpmc", labId, 30);
        }
    }, [labId, lab, reset]);


    const [vivaIndex, setVivaIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [vivaFinished, setVivaFinished] = useState(false);
    const vivaQuestions = lab.viva;

    const handleVivaAnswer = (index: number) => {
        const currentQuestion = vivaQuestions[vivaIndex];
        if (currentQuestion && index === currentQuestion.answer) {
            setScore(prev => prev + 1);
        }
        if (vivaIndex < vivaQuestions.length - 1) {
            setVivaIndex(prev => prev + 1);
        } else {
            setVivaFinished(true);
        }
    };

    return (
        <div className="bg-gray-50 flex flex-col h-full overflow-hidden">
            <header className="bg-white border-b shadow-sm p-4 shrink-0">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-[#2e7d32]">{lab.title} Simulator</h1>
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-1 flex-wrap gap-1">
                        {[
                            { id: "info", label: "Experiment Info", icon: Info },
                            { id: "simulation", label: "Simulator", icon: Play },
                            { id: "table", label: "Observation Table", icon: FileText },
                            { id: "viva", label: "Viva Quiz", icon: HelpCircle }
                        ].filter(tab => {
                            if (isExamMode && (tab.id === "info" || tab.id === "table" || tab.id === "viva")) {
                                return false;
                            }
                            return true;
                        }).map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-[#2e7d32] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1 overflow-y-auto">
                {activeTab === "info" && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white p-1 rounded-xl shadow-sm border flex gap-1">
                                {lab.modes.map((m: string) => (
                                    <button
                                        key={m}
                                        onClick={() => { setMode(m); reset(); }}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === m ? "bg-[#2e7d32] text-white shadow-md scale-105" : "text-gray-500 hover:bg-gray-50"}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-green-100 shadow-sm">
                                <CardHeader className="bg-green-50/50">
                                    <CardTitle className="flex items-center gap-2 text-[#2e7d32]">
                                        <Beaker className="h-5 w-5" /> Aim
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-gray-700 leading-relaxed">{lab.content[mode].aim}</p>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100 shadow-sm">
                                <CardHeader className="bg-blue-50/50">
                                    <CardTitle className="flex items-center gap-2 text-blue-700">
                                        <BookOpen className="h-5 w-5" /> Theory
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <p className="text-sm text-gray-700 leading-relaxed">{lab.content[mode].theory}</p>
                                </CardContent>
                            </Card>

                            <Card className="border-orange-100 shadow-sm">
                                <CardHeader className="bg-orange-50/50">
                                    <CardTitle className="flex items-center gap-2 text-orange-700">
                                        <ListChecks className="h-5 w-5" /> Algorithm
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <ul className="space-y-2">
                                        {lab.content[mode].algorithm.map((s: string, i: number) => (
                                            <li key={i} className="text-sm text-gray-700 flex gap-3">
                                                <span className="font-bold text-orange-500">{i + 1}.</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-purple-100 shadow-sm">
                                <CardHeader className="bg-purple-50/50">
                                    <CardTitle className="flex items-center gap-2 text-purple-700">
                                        <FileText className="h-5 w-5" /> Procedure
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <ul className="space-y-2">
                                        {[
                                            "Select the 'Simulation' tab to view the programmer's model.",
                                            "Use the 'Step' button to execute instructions one by one.",
                                            "Monitor the 'Instruction Explanation' panel for real-time pedagogical feedback.",
                                            "Watch the 'Registers' and 'Flags' panels for visual highlights during execution.",
                                            "Switch to the 'Observation Table' tab to see recorded trace."
                                        ].map((step, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" /> {step}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center pt-4 pb-12">
                            <Button onClick={() => setActiveTab("simulation")} className="bg-[#2e7d32] hover:bg-[#1b5e20] px-8">
                                Go to Simulation <Play className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === "simulation" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-12">
                        {/* Assembly Code Panel */}
                        <div className="lg:col-span-4 space-y-4">
                            <Card className="h-fit border-[#2e7d32]/20 overflow-hidden shadow-md">
                                <CardHeader className="bg-[#2e7d32]/5 py-3 flex flex-row items-center justify-between">
                                    <CardTitle className="text-xs font-bold flex items-center gap-2">
                                        <Play className="h-3.5 w-3.5 text-[#2e7d32]" /> Assembly Editor
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        {/* Show Save button only in exam mode, but not readonly */}
                                        {!readonly && isExamMode && (
                                            <Button onClick={() => {
                                                window.parent.postMessage({
                                                    type: 'SAVE_EXAM_STATE',
                                                    payload: { type: 'MPMC', asmCode }
                                                }, '*');
                                                setFeedback("Code saved successfully.");
                                            }} size="sm" variant="outline" className="h-7 text-[10px] text-blue-600 border-blue-600/20 hover:bg-blue-50">
                                                SAVE
                                            </Button>
                                        )}
                                        {!readonly && (
                                            <Button onClick={handleAssemble} size="sm" variant="ghost" className="h-7 text-[10px] text-[#2e7d32] border border-[#2e7d32]/20">
                                                ASSEMBLE & LOAD
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <textarea
                                        value={asmCode}
                                        onChange={(e) => setAsmCode(e.target.value)}
                                        readOnly={readonly}
                                        placeholder="; Type your 8085 code here\nMVI A, 45H\nMVI B, 38H\nADD B\nSTA 2002H\nHLT"
                                        className="w-full h-[300px] p-4 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none"
                                    />
                                    <div className="p-3 bg-gray-800 text-white font-mono text-[11px] min-h-[40px] flex items-center border-t border-gray-700">
                                        {feedback}
                                    </div>
                                    <div className="p-4 bg-gray-50 border-t space-y-4">
                                        <div className="flex gap-2">
                                            <Button onClick={handleStep} disabled={cpu.isHalted || isRunning} size="sm" className="flex-1 bg-[#2e7d32] hover:bg-[#1b5e20] text-xs h-9">
                                                <SkipForward className="h-3.5 w-3.5 mr-1" /> Step
                                            </Button>
                                            <Button onClick={handleRun} disabled={cpu.isHalted || isRunning} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs h-9">
                                                <Play className="h-3.5 w-3.5 mr-1" /> Run
                                            </Button>
                                            <Button onClick={reset} variant="outline" size="sm" className="flex-1 text-xs h-9">
                                                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-200 bg-blue-50/10">
                                <CardHeader className="py-2 px-3 border-b bg-blue-50/30">
                                    <CardTitle className="text-[10px] font-bold text-blue-800">Local Memory Peek (0000H - 0007H)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3">
                                    <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                                        {Array.from({ length: 8 }).map((_, i) => {
                                            const val = memory[i] || 0;
                                            return (
                                                <div key={i} className="flex flex-col items-center p-1 bg-white border rounded">
                                                    <span className="text-[7px] text-gray-400">000{i}</span>
                                                    <span className="text-blue-700 font-bold">{val.toString(16).toUpperCase().padStart(2, "0")}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Professional Trainer Kit Interior */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <TrainerKit cpu={cpu} onSync={syncCPU} />

                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <Info className="h-5 w-5 text-[#2e7d32]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Hardware Simulation Mode</p>
                                        <p className="text-[10px] text-gray-500 font-medium italic">Keypad and Keyboard shortcuts are active. Click to focus Trainer Kit if unresponsive.</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setAsmCode(lab.content[mode].instructions_asm || "")}
                                        variant="outline"
                                        size="sm"
                                        className="text-[10px] h-8"
                                    >
                                        Load Sample
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "table" && (
                    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-5 duration-500 pb-12">
                        <Card className="border-gray-200 shadow-lg overflow-hidden">
                            <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between py-4">
                                <div>
                                    <CardTitle className="text-lg font-bold text-gray-800">Observation Table</CardTitle>
                                    <CardDescription>Live trace of register states and flags after each instruction</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => {
                                        const headers = "Step | Instruction | A | H | L | S | Z | AC | P | CY\n";
                                        const rows = history.map(h => `${h.step} | ${h.instruction} | ${h.A}H | ${h.H}H | ${h.L}H | ${h.flags.S ? 1 : 0} | ${h.flags.Z ? 1 : 0} | ${h.flags.AC ? 1 : 0} | ${h.flags.P ? 1 : 0} | ${h.flags.CY ? 1 : 0}`).join('\n');
                                        navigator.clipboard.writeText(headers + rows);
                                        setFeedback("Observation table copied to clipboard!");
                                    }}>
                                        <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
                                    </Button>
                                    <Button variant="outline" size="sm" className="hidden sm:flex">
                                        <Download className="h-4 w-4 mr-2" /> Export CSV
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full text-sm text-left font-mono">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-[11px] font-bold">
                                        <tr>
                                            <th className="px-4 py-3 border-r">Step</th>
                                            <th className="px-4 py-3 border-r min-w-[120px]">Instruction</th>
                                            <th className="px-4 py-3 border-r text-center">A</th>
                                            <th className="px-4 py-3 border-r text-center">H</th>
                                            <th className="px-4 py-3 border-r text-center">L</th>
                                            <th className="px-4 py-3 text-center border-b" colSpan={5}>Flags (S Z AC P CY)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {history.length > 0 ? history.map((row, i) => (
                                            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-4 py-3 border-r text-gray-400 text-xs">{row.step}</td>
                                                <td className="px-4 py-3 border-r font-bold text-blue-800">{row.instruction}</td>
                                                <td className="px-4 py-3 border-r text-center font-bold">{row.A}H</td>
                                                <td className="px-4 py-3 border-r text-center">{row.H}H</td>
                                                <td className="px-4 py-3 border-r text-center">{row.L}H</td>
                                                <td className="px-2 py-3 text-center w-8 text-xs">{row.flags.S ? "1" : "0"}</td>
                                                <td className="px-2 py-3 text-center w-8 text-xs">{row.flags.Z ? "1" : "0"}</td>
                                                <td className="px-2 py-3 text-center w-8 text-xs border-x bg-gray-50/50">{row.flags.AC ? "1" : "0"}</td>
                                                <td className="px-2 py-3 text-center w-8 text-xs">{row.flags.P ? "1" : "0"}</td>
                                                <td className="px-2 py-3 text-center w-8 text-xs text-red-600 font-bold">{row.flags.CY ? "1" : "0"}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={10} className="px-4 py-12 text-center text-gray-400 italic font-sans text-sm">
                                                    No execution data yet. Start simulation to generate observations.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "viva" && (
                    <div className="max-w-2xl mx-auto py-12 pb-24">
                        {!vivaFinished ? (
                            <Card className="border-[#2e7d32]/20 shadow-xl overflow-hidden">
                                <div className="h-2 bg-gray-100">
                                    <div className="h-full bg-[#2e7d32] transition-all" style={{ width: `${((vivaIndex + 1) / vivaQuestions.length) * 100}%` }} />
                                </div>
                                <CardHeader className="bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-[#2e7d32] uppercase tracking-wider">Question {vivaIndex + 1} of {vivaQuestions.length}</span>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <HelpCircle className="h-3 w-3 mr-1" /> Help available
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg text-gray-800">{vivaQuestions[vivaIndex]?.q}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-3">
                                    {vivaQuestions[vivaIndex]?.options.map((opt: string, i: number) => (
                                        <button
                                            key={i}
                                            onClick={() => handleVivaAnswer(i)}
                                            className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#2e7d32] hover:bg-green-50 transition-all font-medium group flex justify-between items-center"
                                        >
                                            <span>{opt}</span>
                                            <div className="w-6 h-6 rounded-full border border-gray-300 group-hover:border-[#2e7d32] transition-colors" />
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-2xl overflow-hidden text-center py-12 px-6">
                                <div className="mb-6 flex justify-center">
                                    {score > 1 ? (
                                        <div className="bg-green-100 p-4 rounded-full">
                                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                                        </div>
                                    ) : (
                                        <div className="bg-orange-100 p-4 rounded-full">
                                            <CheckCircle2 className="h-16 w-16 text-orange-600" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-3xl font-black text-gray-800 mb-2">Quiz Completed!</h2>
                                <p className="text-gray-500 mb-8">You scored <span className="text-[#2e7d32] font-bold">{score}</span> out of {vivaQuestions.length}</p>
                                <div className="flex gap-4 justify-center">
                                    <Button onClick={() => { setVivaFinished(false); setVivaIndex(0); setScore(0); }} variant="outline">
                                        Retake Quiz
                                    </Button>
                                    <Button onClick={() => setActiveTab("simulation")} className="bg-[#2e7d32] hover:bg-[#1b5e20]">
                                        Back to Simulation
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
