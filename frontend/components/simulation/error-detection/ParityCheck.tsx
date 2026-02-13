"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateParity, ParityType } from "@/lib/error-detection-utils";

export default function ParityCheck() {
    const [dataComp, setDataComp] = useState("1011001");
    const [parityType, setParityType] = useState<ParityType>("even");
    const [result, setResult] = useState<{ parityBit: string, count: number } | null>(null);

    // Transmission
    const [transmittedCodeword, setTransmittedCodeword] = useState("");
    const [receiverStatus, setReceiverStatus] = useState("");

    const handleCalculate = () => {
        if (!/^[01]+$/.test(dataComp)) return;
        const res = calculateParity(dataComp, parityType);
        setResult(res);
        setTransmittedCodeword(dataComp + res.parityBit);
        setReceiverStatus("");
    };

    const handleInjectError = () => {
        if (!transmittedCodeword) return;
        const idx = Math.floor(Math.random() * transmittedCodeword.length);
        const chars = transmittedCodeword.split('');
        chars[idx] = chars[idx] === '1' ? '0' : '1';
        setTransmittedCodeword(chars.join(''));
    };

    const verify = () => {
        const receivedData = transmittedCodeword;
        const count = receivedData.split('').filter(b => b === '1').length;

        let isValid = false;
        if (parityType === 'even') {
            isValid = count % 2 === 0;
        } else {
            isValid = count % 2 !== 0;
        }

        if (isValid) {
            setReceiverStatus(`ACCEPTED. Total 1s: ${count} (${count % 2 === 0 ? "Even" : "Odd"}). Matches ${parityType} parity.`);
        } else {
            setReceiverStatus(`ERROR. Total 1s: ${count} (${count % 2 === 0 ? "Even" : "Odd"}). Violates ${parityType} parity constraint.`);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sender Side (Parity Generator)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Data Word:</label>
                        <Input
                            value={dataComp}
                            onChange={(e) => setDataComp(e.target.value.replace(/[^01]/g, ''))}
                        />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={parityType === 'even'} onChange={() => setParityType('even')} />
                            Even Parity
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={parityType === 'odd'} onChange={() => setParityType('odd')} />
                            Odd Parity
                        </label>
                    </div>
                    <Button onClick={handleCalculate} className="w-full">Generate Parity</Button>

                    {result && (
                        <div className="mt-4 p-3 bg-gray-50 border rounded font-mono text-sm space-y-1">
                            <p>Count of 1s in Data: <strong>{result.count}</strong></p>
                            <p>Mode: {parityType.toUpperCase()} Parity</p>
                            <p>Parity Bit Selected: <span className="font-bold text-blue-600">{result.parityBit}</span></p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Channel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Transmitted Frame:</label>
                            <div className="flex items-stretch gap-2">
                                <div className="flex-grow flex flex-col items-center p-3 rounded-md bg-gray-50 border border-gray-200">
                                    <span className="text-xs font-semibold text-gray-500 mb-1">Data Bits</span>
                                    <span className="font-mono text-xl tracking-widest">{transmittedCodeword.slice(0, -1)}</span>
                                </div>
                                <div className="flex-none flex flex-col items-center p-3 rounded-md bg-blue-50 border border-blue-200 min-w-[80px]">
                                    <span className="text-xs font-bold text-blue-600 mb-1">Parity</span>
                                    <span className="font-mono text-xl font-bold text-blue-700">{transmittedCodeword.slice(-1)}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="destructive" onClick={handleInjectError}>Inject Error</Button>
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Receiver Side</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={verify} variant="secondary" className="w-full">Verify Parity</Button>
                        {receiverStatus && (
                            <div className={`p-4 rounded-md font-semibold text-center ${receiverStatus.includes("ERROR") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                {receiverStatus}
                            </div>
                        )}
                        {receiverStatus.includes("ERROR") && (
                            <p className="text-xs text-center text-gray-500 mt-2">* Parity check can detect odd number of bit errors, but cannot correct them or detect even number of errors.</p>
                        )}

                        <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-gray-600">
                            <p className="font-semibold text-gray-800 mb-1">ℹ️ Algorithm Capability:</p>
                            <p><strong>Method:</strong> Parity Check is a simple <em>Error Detection</em> technique.</p>
                            <p><strong>Correction Strategy:</strong> It can detect single-bit errors but <strong>cannot correct</strong> them. Standard action is to discard and request retransmission.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
