"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateChecksum } from "@/lib/error-detection-utils";

export default function Checksum() {
    const [dataComp, setDataComp] = useState("10011001111000100010");
    const [result, setResult] = useState<{ sum: string, checksum: string, segments: string[], wrappedSum: string, initialSum: number } | null>(null);

    // Transmission
    const [transmittedCodeword, setTransmittedCodeword] = useState("");
    const [receiverStatus, setReceiverStatus] = useState("");

    const handleCalculate = () => {
        if (!/^[01]+$/.test(dataComp)) return;

        const res = calculateChecksum(dataComp);
        setResult(res);
        setTransmittedCodeword(res.segments.join('') + res.checksum);
        setReceiverStatus("");
    };

    const handleInjectError = () => {
        if (!transmittedCodeword) return;
        const idx = Math.floor(Math.random() * transmittedCodeword.length);
        const chars = transmittedCodeword.split('');
        chars[idx] = chars[idx] === '1' ? '0' : '1';
        setTransmittedCodeword(chars.join(''));
        setReceiverStatus("");
    };

    const verify = () => {
        // Calculate checksum of received data
        // If sum of all segments (including checksum) is all 1s (0 in 1s comp).
        // Reuse util? The util calculates Checksum for data.

        // Receiver logic: split received data into segments (last one is checksum)
        // Add all.

        const k = 8; // Assuming 8-bit segments for simplicity, consistent with the utility
        const segments = [];
        for (let i = 0; i < transmittedCodeword.length; i += k) {
            segments.push(transmittedCodeword.substring(i, i + k));
        }

        // Add
        let sum = 0;
        segments.forEach(s => sum += parseInt(s, 2));

        // Wrap
        let wrapped = sum;
        while (wrapped > (2 ** k - 1)) { // Check if sum exceeds k-bit capacity
            wrapped = (wrapped & (2 ** k - 1)) + (wrapped >> k);
        }

        const bin = wrapped.toString(2).padStart(k, '0');
        // Complement
        const comp = bin.split('').map(b => b === '1' ? '0' : '1').join('');

        if (parseInt(comp, 2) === 0) {
            setReceiverStatus(`ACCEPTED. Sum: ${bin} -> Complement: ${comp} (All 0s)`);
        } else {
            setReceiverStatus(`REJECTED. Sum: ${bin} -> Complement: ${comp} (Non-zero)`);
        }
    };

    const handleRetransmit = () => {
        if (!result) return;
        setTransmittedCodeword(result.segments.join('') + result.checksum);
        setReceiverStatus("");
    };

    const isCorrupted = result ? transmittedCodeword !== (result.segments.join('') + result.checksum) : false;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sender Side (Checksum Generator)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Data Word:</label>
                        <Input
                            value={dataComp}
                            onChange={(e) => setDataComp(e.target.value.replace(/[^01]/g, ''))}
                            placeholder="Enter binary string (min 8 bits recommended)"
                        />
                    </div>
                    <Button onClick={handleCalculate} className="w-full">Generate Checksum</Button>

                    {result && (
                        <div className="mt-4 space-y-3 font-mono text-sm">
                            <div className="bg-gray-50 border rounded p-3">
                                <p className="font-bold text-gray-700">Calculation Steps:</p>
                                <div className="ml-4 mt-2 space-y-1">
                                    <p>1. Divide data into 8-bit segments:</p>
                                    <div className="flex gap-2 flex-wrap text-blue-600">
                                        {result.segments.map((s, i) => <span key={i} className="bg-blue-50 px-1 border border-blue-200">{s}</span>)}
                                    </div>
                                    <div className="border-t my-2 w-32"></div>
                                    <p>2. Sum (Decimal): {result.initialSum}</p>
                                    <p>3. Wrapped Sum (1&apos;s Compl. Add): {parseInt(result.wrappedSum, 2)} ({result.wrappedSum})</p>
                                    <p>4. Checksum (Complement): <span className="font-bold text-red-600">{result.checksum}</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Channel
                            {isCorrupted && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200">Frame Corrupted</span>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Transmitted Frame:</label>
                            <div className="flex items-stretch gap-2">
                                <div className="flex-grow flex flex-col items-center p-3 rounded-md bg-gray-50 border border-gray-200">
                                    <span className="text-xs font-semibold text-gray-500 mb-1">Data Segments</span>
                                    <span className={`font-mono text-xl tracking-widest break-all ${isCorrupted ? "text-red-500 font-bold" : ""}`}>
                                        {transmittedCodeword.slice(0, -8)}
                                    </span>
                                </div>
                                <div className="flex-none flex flex-col items-center p-3 rounded-md bg-blue-50 border border-blue-200 min-w-[100px]">
                                    <span className="text-xs font-bold text-blue-600 mb-1">Checksum</span>
                                    <span className={`font-mono text-xl font-bold ${isCorrupted ? "text-red-600" : "text-blue-700"}`}>
                                        {transmittedCodeword.slice(-8)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="destructive" onClick={handleInjectError}>Inject Error (Random Bit Flip)</Button>
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Receiver Side</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={verify} variant="secondary" className="w-full">Verify Checksum</Button>
                        {receiverStatus && (
                            <div className={`p-4 rounded-md font-semibold text-center ${receiverStatus.includes("REJECTED") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                {receiverStatus}
                            </div>
                        )}

                        {receiverStatus.includes("REJECTED") && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm space-y-2">
                                <p className="font-bold text-yellow-800">Standard Protocol Action:</p>
                                <p>Checksum is for Error Detection only. It cannot correct the error bit.</p>
                                <p>Action: <strong>Discard Frame & Request Retransmission.</strong></p>
                                <Button onClick={handleRetransmit} className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700">Simulate Retransmission</Button>
                            </div>
                        )}

                        {receiverStatus && !receiverStatus.includes("REJECTED") && (
                            <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-gray-600">
                                <p className="font-semibold text-gray-800 mb-1">ℹ️ Algorithm Capability:</p>
                                <p><strong>Method:</strong> Checksum is an <em>Error Detection</em> technique.</p>
                                <p><strong>Correction Strategy:</strong> If the checksum check fails, the receiver <strong>discards the frame</strong> and requests <strong>retransmission</strong>.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
