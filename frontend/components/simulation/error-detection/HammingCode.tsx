"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateHamming, checkHamming, HammingStep, HammingResult, HammingReceiverResult, SyndromeStep } from "@/lib/error-detection-utils";

export default function HammingCode() {
    const [dataComp, setDataComp] = useState("1011");
    // Updated result types
    const [result, setResult] = useState<HammingResult | null>(null);

    // Transmission
    const [transmittedCodeword, setTransmittedCodeword] = useState("");
    const [receiverResult, setReceiverResult] = useState<HammingReceiverResult | null>(null);

    const handleCalculate = () => {
        if (!/^[01]+$/.test(dataComp)) return;
        const res = calculateHamming(dataComp);
        setResult(res);
        setTransmittedCodeword(res.encoded);
        setReceiverResult(null);
    };

    const handleInjectError = () => {
        if (!transmittedCodeword) return;
        const idx = Math.floor(Math.random() * transmittedCodeword.length);
        const chars = transmittedCodeword.split('');
        chars[idx] = chars[idx] === '1' ? '0' : '1';
        setTransmittedCodeword(chars.join(''));
        setReceiverResult(null);
    };

    const verify = () => {
        const res = checkHamming(transmittedCodeword);
        setReceiverResult(res);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sender Side (Hamming Encoder)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Data Bits:</label>
                        <Input
                            value={dataComp}
                            onChange={(e) => setDataComp(e.target.value.replace(/[^01]/g, ''))}
                        />
                    </div>
                    <Button onClick={handleCalculate} className="w-full">Generate Hamming Code</Button>

                    {result && (
                        <div className="mt-4 space-y-3">
                            <div className="p-3 bg-gray-50 border rounded text-sm">
                                <p><strong>Encoded Data (with Parity):</strong> <span className="font-mono font-bold text-lg">{result.encoded}</span></p>
                                <p className="text-xs text-gray-500 mt-1">Number of parity bits (r): {result.r}</p>
                            </div>

                            <div className="text-sm border rounded p-2">
                                <p className="font-semibold mb-2">Parity Calculation Steps:</p>
                                <ul className="space-y-1">
                                    {result.steps && result.steps.map((step: HammingStep, idx: number) => (
                                        <li key={step.pPos || idx}>
                                            P{step.pPos}: Checks bits at {Array.isArray(step.coveredBits) ? step.coveredBits.join(', ') : ''} &rarr; Parity = {step.parityValue}
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                            <Input value={transmittedCodeword} readOnly className="font-mono text-lg tracking-widest" />
                        </div>
                        <Button variant="destructive" onClick={handleInjectError}>Inject Single Bit Error</Button>
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Receiver Side (Decoder & Correction)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Received Frame:</label>
                            <div className="font-mono text-lg bg-gray-100 p-2 rounded tracking-widest text-center">
                                {transmittedCodeword}
                            </div>
                        </div>

                        <Button onClick={verify} variant="secondary" className="w-full">Check & Correct Error</Button>

                        {receiverResult && (
                            <div className="mt-4 space-y-4">
                                <div className={`p-4 rounded-md text-center border ${receiverResult.errorPosition === 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200"}`}>
                                    <h4 className="font-bold text-lg">
                                        {receiverResult.errorPosition === 0
                                            ? "No Error Detected"
                                            : `Error Detected at Position ${receiverResult.errorPosition}`
                                        }
                                    </h4>
                                </div>

                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 font-semibold">
                                            <tr>
                                                <th className="p-2">Parity Check</th>
                                                <th className="p-2">Checked Bits (1s count)</th>
                                                <th className="p-2">Status</th>
                                                <th className="p-2">Syndrome Val</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {receiverResult.syndromeSteps.map((step: SyndromeStep) => (
                                                <tr key={step.pPos} className="border-t">
                                                    <td className="p-2">P{step.pPos} Check</td>
                                                    <td className="p-2">{step.count} (1s)</td>
                                                    <td className={`p-2 font-bold ${step.status === 'Fail' ? 'text-red-600' : 'text-green-600'}`}>{step.status}</td>
                                                    <td className="p-2">{step.status === 'Fail' ? step.pPos : 0}</td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-50 font-bold border-t">
                                                <td colSpan={3} className="p-2 text-right">Sum (Error Position):</td>
                                                <td className="p-2 text-red-600">{receiverResult.errorPosition}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {receiverResult.errorPosition > 0 && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm space-y-2">
                                        <p className="font-bold text-yellow-800">Correction Process:</p>
                                        <p>1. The calculated Error Position is <strong>{receiverResult.errorPosition}</strong>.</p>
                                        <p>2. The bit at index {receiverResult.errorPosition} is flipped to correct the data.</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span>Corrected Data:</span>
                                            <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-yellow-300">
                                                {receiverResult.corrected}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {receiverResult && (
                            <div className="mt-4 p-3 bg-gray-50 border rounded text-xs text-gray-600">
                                <p className="font-semibold text-gray-800 mb-1">ℹ️ Algorithm Capability:</p>
                                <p><strong>Method:</strong> Hamming Code is an <em>Error Correction</em> technique.</p>
                                <p><strong>Correction Strategy:</strong> It can <strong>detect</strong> up to 2-bit errors and <strong>correct</strong> single-bit errors automatically using parity checks (Syndrome).</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
