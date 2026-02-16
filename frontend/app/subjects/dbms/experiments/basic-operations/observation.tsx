"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Observation() {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const questions = [
        {
            id: 1,
            question: "Which of the following acts as a container for tables?",
            options: ["Record", "Field", "Database", "Query"],
            correct: "Database"
        },
        {
            id: 2,
            question: "A single row in a table is also known as a:",
            options: ["Field", "Record", "Attribute", "Schema"],
            correct: "Record"
        },
        {
            id: 3,
            question: "What is the correct hierarchy?",
            options: ["Table > Database > Field", "Database > Table > Field", "Field > Database > Table", "None of the above"],
            correct: "Database > Table > Field"
        }
    ];

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const getScore = () => {
        let score = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct) score++;
        });
        return score;
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-200">
                Observation & Results
            </h2>

            <div className="space-y-8">
                {questions.map((q) => (
                    <div key={q.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-lg font-medium text-gray-900 mb-4">{q.id}. {q.question}</p>
                        <div className="space-y-3">
                            {q.options.map((option) => (
                                <label
                                    key={option}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${answers[q.id] === option
                                            ? "bg-blue-50 border-blue-500 text-blue-700"
                                            : "hover:bg-gray-50 border-gray-200"
                                        } ${submitted && option === q.correct ? "bg-green-50 border-green-500 !text-green-700 font-bold" : ""} ${submitted && answers[q.id] === option && option !== q.correct ? "bg-red-50 border-red-500 text-red-700" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={option}
                                        checked={answers[q.id] === option}
                                        onChange={() => !submitted && setAnswers({ ...answers, [q.id]: option })}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        disabled={submitted}
                                    />
                                    <span>{option}</span>
                                    {submitted && option === q.correct && <CheckCircle2 className="ml-auto text-green-500" size={20} />}
                                    {submitted && answers[q.id] === option && option !== q.correct && <XCircle className="ml-auto text-red-500" size={20} />}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== questions.length}
                        className="w-full py-4 bg-[#2ecc71] text-white rounded-xl font-bold text-lg hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Submit Observations
                    </button>
                ) : (
                    <div className="bg-green-100 border border-green-200 rounded-xl p-8 text-center animate-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold text-green-800 mb-2">Quiz Completed!</h3>
                        <p className="text-green-700 text-lg">
                            You scored <span className="font-bold text-3xl">{getScore()}</span> / {questions.length}
                        </p>
                        <p className="text-sm text-green-600 mt-4">
                            You have successfully explored basic DBMS concepts and operations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
