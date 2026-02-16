export const quizQuestions = [
    {
        question: "Which of the following is an Error Correction Code?",
        options: [
            "Parity Check",
            "CRC",
            "Checksum",
            "Hamming Code"
        ],
        answer: 3 // Index of correct option (Hamming Code)
    },
    {
        question: "In even parity, if the data is 1010, what is the parity bit?",
        options: [
            "0",
            "1",
            "10",
            "11"
        ],
        answer: 0 // 1010 has two 1s (even), so parity bit is 0
    },
    {
        question: "CRC stands for:",
        options: [
            "Cyclic Redundancy Code",
            "Cyclic Redundancy Check",
            "Code Redundancy Check",
            "Cyclic Repeat Check"
        ],
        answer: 1
    },
    {
        question: "Which error detection method involves 1's complement arithmetic?",
        options: [
            "Simple Parity",
            "Two-dimensional Parity",
            "CRC",
            "Checksum"
        ],
        answer: 3
    },
    {
        question: "If the Hamming Syndrome is 0, what does it indicate?",
        options: [
            "Single bit error at position 0",
            "No error detected",
            "Multiple bit errors",
            "Parity bit error only"
        ],
        answer: 1
    }
];
