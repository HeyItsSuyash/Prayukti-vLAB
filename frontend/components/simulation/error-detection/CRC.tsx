"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateCRC, checkCRC } from "@/lib/error-detection-utils";

export default function CRC() {
    const [dataComp, setDataComp] = useState("100100");
    const [divisor, setDivisor] = useState("1101");
    // Updated type to include steps
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<{ codeword: string, remainder: string, quotient: string, appendedData: string, steps: any[] } | null>(null);

    // Transmission
    const [transmittedCodeword, setTransmittedCodeword] = useState("");
    // receiverRemainder removed as it was unused
    const [receiverStatus, setReceiverStatus] = useState("");

    const handleCalculate = () => {
        if (!/^[01]+$/.test(dataComp) || !/^[01]+$/.test(divisor)) return;

        const res = calculateCRC(dataComp, divisor);
        setResult(res);
        setTransmittedCodeword(res.codeword);
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
        const rem = checkCRC(transmittedCodeword, divisor);
        
        if (parseInt(rem, 2) === 0) {
            setReceiverStatus("Data Accepted. Remainder is Zero.");
        } else {
            setReceiverStatus("Error Detected! Remainder is " + rem);
        }
    };

    const handleRetransmit = () => {
        if (!result) return;
        setTransmittedCodeword(result.codeword);
        setReceiverStatus("");
    };

    const isCorrupted = result ? transmittedCodeword !== result.codeword : false;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sender Side (CRC Generator)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Data Word:</label>
                            <Input
                                value={dataComp}
                                onChange={(e) => setDataComp(e.target.value.replace(/[^01]/g, ''))}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Divisor (Generator):</label>
                            <Input
                                value={divisor}
                                onChange={(e) => setDivisor(e.target.value.replace(/[^01]/g, ''))}
                            />
                        </div>
                    </div>
                    <Button onClick={handleCalculate} className="w-full">Generate CRC</Button>

                    {result && (
                        <div className="mt-6 space-y-4">
                            <div className="p-4 bg-gray-50 border rounded font-mono text-sm overflow-x-auto">
                                <h4 className="font-bold mb-2 text-gray-700">Division Process (Step-by-Step)</h4>

                                <div className="flex flex-col items-start leading-relaxed">
                                    <div className="flex">
                                        <span className="mr-2 text-gray-500">{divisor}</span>
                                        <div className="flex flex-col">
                                            <span className="border-b border-black mb-1">{result.quotient}</span>
                                            <span>{result.appendedData}</span>
                                        </div>
                                    </div>

                                    <pre className="mt-2 font-mono whitespace-pre text-xs md:text-sm text-gray-800">
                                        {(() => {
                                            const indent = (n: number) => " ".repeat(n);
                                            let viz = "";
                                            viz += indent(divisor.length + 2) + result.quotient + "\n";
                                            viz += indent(divisor.length + 1) + "_".repeat(result.appendedData.length + 2) + "\n";
                                            viz += divisor + " ) " + result.appendedData + "\n";
                                            result.steps.forEach((step) => {
                                                const currentIndent = step.currentStartIdx;
                                                const operand = step.quotientBit === '1' ? divisor : "0".repeat(divisor.length);
                                                viz += indent(divisor.length + 3 + currentIndent) + operand + "\n";
                                                viz += indent(divisor.length + 3 + currentIndent) + "-".repeat(divisor.length) + "\n";
                                            });
                                            viz += indent(divisor.length + 3 + result.appendedData.length - divisor.length + 1) + result.remainder + " (Remainder)";
                                            return viz;
                                        })()}
                                    </pre>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 border border-blue-100 rounded text-sm">
                                <p><strong>Remainder (CRC):</strong> {result.remainder}</p>
                                <p><strong>Final Codeword (Data + CRC):</strong> {result.codeword}</p>
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
                                    <span className="text-xs font-semibold text-gray-500 mb-1">Data Bits</span>
                                    <span className={`font-mono text-xl tracking-widest ${isCorrupted ? "text-red-500 font-bold" : ""}`}>
                                        {transmittedCodeword.slice(0, transmittedCodeword.length - (divisor.length - 1))}
                                    </span>
                                </div>
                                <div className="flex-none flex flex-col items-center p-3 rounded-md bg-blue-50 border border-blue-200 min-w-[100px]">
                                    <span className="text-xs font-bold text-blue-600 mb-1">CRC (Remainder)</span>
                                    <span className={`font-mono text-xl font-bold ${isCorrupted ? "text-red-600" : "text-blue-700"}`}>
                                        {transmittedCodeword.slice(-(divisor.length - 1))}
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
                        <Button onClick={verify} variant="secondary" className="w-full">Verify CRC</Button>
                        {receiverStatus && (
                            <div className={`p-4 rounded-md font-semibold text-center ${receiverStatus.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                {receiverStatus}
                            </div>
                        )}

                        {receiverStatus.includes("Error") && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm space-y-2">
                                <p className="font-bold text-yellow-800">Error Correction Procedure (ARQ Protocol):</p>
                                <p>CRC detects error but cannot correct it.</p>
                                <p>Action: <strong>Discard Frame & Request Retransmission.</strong></p>
                                <Button onClick={handleRetransmit} className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700">Apply Correction (Retransmit)</Button>
                            </div>
                        )}

                        {receiverStatus && !receiverStatus.includes("Error") && (
                            <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-gray-600">
                                <p className="font-semibold text-gray-800 mb-1">ℹ️ Algorithm Capability:</p>
                                <p><strong>Method:</strong> CRC (Cyclic Redundancy Check) is an <em>Error Detection</em> technique.</p>
                                <p><strong>Correction Strategy:</strong> If an error is found, the standard procedure is to <strong>discard the frame</strong> and request <strong>retransmission</strong> (ARQ Protocol).</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
