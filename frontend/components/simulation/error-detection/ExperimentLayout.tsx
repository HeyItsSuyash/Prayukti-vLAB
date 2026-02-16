"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizQuestions } from "@/data/error-detection-quiz";

type Tab = 'aim' | 'theory' | 'simulation' | 'procedure' | 'quiz';

interface ExperimentLayoutProps {
    children: React.ReactNode;
}

export default function ExperimentLayout({ children }: ExperimentLayoutProps) {
    const [activeTab, setActiveTab] = useState<Tab>('aim');
    const [quizScore, setQuizScore] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});

    const handleQuizSubmit = () => {
        let score = 0;
        quizQuestions.forEach((q, idx) => {
            if (userAnswers[idx] === q.answer) {
                score++;
            }
        });
        setQuizScore(score);
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <header className="mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-primary">Error Detection and Correction Algorithms</h1>
                <p className="text-muted-foreground">Subject: Computer Networks | Experiment: 1</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Navigation Sidebar */}
                <nav className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
                    <Button
                        variant={activeTab === 'aim' ? "default" : "outline"}
                        onClick={() => setActiveTab('aim')}
                        className="justify-start"
                    >
                        Aim
                    </Button>
                    <Button
                        variant={activeTab === 'theory' ? "default" : "outline"}
                        onClick={() => setActiveTab('theory')}
                        className="justify-start"
                    >
                        Theory
                    </Button>
                    <Button
                        variant={activeTab === 'simulation' ? "default" : "outline"}
                        onClick={() => setActiveTab('simulation')}
                        className="justify-start"
                    >
                        Simulation
                    </Button>
                    <Button
                        variant={activeTab === 'procedure' ? "default" : "outline"}
                        onClick={() => setActiveTab('procedure')}
                        className="justify-start"
                    >
                        Procedure
                    </Button>
                    <Button
                        variant={activeTab === 'quiz' ? "default" : "outline"}
                        onClick={() => setActiveTab('quiz')}
                        className="justify-start"
                    >
                        Quiz / Viva
                    </Button>
                </nav>

                {/* Content Area */}
                <main className="flex-1 min-h-[500px]">
                    {activeTab === 'aim' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Aim</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg">
                                    To implement and study various error detection and correction techniques used in data communication:
                                </p>
                                <ul className="list-disc ml-6 mt-4 space-y-2">
                                    <li>Parity Check (Even and Odd)</li>
                                    <li>Checksum</li>
                                    <li>Cyclic Redundancy Check (CRC)</li>
                                    <li>Hamming Code (Error Correction)</li>
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'theory' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Theory</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <section>
                                    <h3 className="font-semibold text-lg">1. Parity Check</h3>
                                    <p className="text-gray-700">The simplest error detection scheme. It appends a single bit (parity bit) to the data block purely to make the total number of 1s either even (Even Parity) or odd (Odd Parity). It can detect single-bit errors but cannot correct them or detect 2-bit errors.</p>
                                </section>
                                <section>
                                    <h3 className="font-semibold text-lg">2. Checksum</h3>
                                    <p className="text-gray-700">Used widely in network protocols like IP, TCP, and UDP. It divides data into segments, performs 1s complement addition, and the complement of the result is stored as the checksum. The receiver repeats the addition; if the result is all 0s (in 1s complement logic, result should be all 1s before complementing), the data is valid.</p>
                                </section>
                                <section>
                                    <h3 className="font-semibold text-lg">3. CRC (Cyclic Redundancy Check)</h3>
                                    <p className="text-gray-700">A robust error detection method based on binary division. A generator polynomial is used to divide the data. The remainder is appended to the data. The receiver divides the received data by the same polynomial; if the remainder is zero, the data is accepted.</p>
                                </section>
                                <section>
                                    <h3 className="font-semibold text-lg">4. Hamming Code</h3>
                                    <p className="text-gray-700">A linear error-correcting code. It uses redundant bits placed at positions corresponding to powers of 2 (1, 2, 4, 8...). It can detect and correct single-bit errors by calculating syndrome bits.</p>
                                </section>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'procedure' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Procedure</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="list-decimal ml-6 space-y-2">
                                    <li>Select the algorithm you wish to simulate from the tabs in the Simulation section.</li>
                                    <li>Enter the binary data (e.g., 101101).</li>
                                    <li>For specific algorithms like CRC, enter the Generator Polynomial.</li>
                                    <li>Click &quot;Calculate&quot; or &quot;Send&quot; to see the encoding process.</li>
                                    <li>You can optionally inject an error into the transmitted data to test the detection/correction mechanism.</li>
                                    <li>Observe the receiver&apos;s verification steps and the final Result.</li>
                                </ol>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'quiz' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Quiz / Viva</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {quizQuestions.map((q, qImg) => (
                                        <div key={qImg} className="border p-4 rounded-lg">
                                            <p className="font-medium mb-3">{qImg + 1}. {q.question}</p>
                                            <div className="space-y-2">
                                                {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name={`question-${qImg}`}
                                                            id={`q${qImg}-opt${optIdx}`}
                                                            disabled={quizScore !== null}
                                                            onChange={() => setUserAnswers(prev => ({ ...prev, [qImg]: optIdx }))}
                                                        />
                                                        <label htmlFor={`q${qImg}-opt${optIdx}`} className={
                                                            quizScore !== null && q.answer === optIdx ? "text-green-600 font-bold" :
                                                                quizScore !== null && userAnswers[qImg] === optIdx && userAnswers[qImg] !== q.answer ? "text-red-600 line-through" : ""
                                                        }>{opt}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-4">
                                        {quizScore === null ? (
                                            <Button onClick={handleQuizSubmit}>Submit Answers</Button>
                                        ) : (
                                            <div className="text-xl font-bold">
                                                Your Score: {quizScore} / {quizQuestions.length}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'simulation' && (
                        <div className="w-full">
                            {children}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
