import { subDays } from 'date-fns';

export type PerformanceLevel = 'Weak' | 'Average' | 'Good' | 'Excellent';

export interface StudentMetric {
    id: string;
    name: string;
    rollNo: string;
    email: string;
    subject: string;
    practicalsAssigned: number;
    practicalsCompleted: number;
    quizScoreAvg: number; // 0-100
    avgAttempts: number;
    totalTimeSpent: number; // in hours
    lastActive: string; // ISO Date
    status: PerformanceLevel;
    quizTrend: number[]; // Last 5 quiz scores
    completedPracticals: string[]; // IDs
    weakAreas: string[]; // Topic names
}

const subjects = ['Computer Networks', 'OOPs', 'Digital Logic Design'];
const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Rohan', 'Ishaan', 'Kabir', 'Vivaan', 'Ayaan', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Kiara', 'Pari', 'Mira', 'Riya', 'Kavya', 'Noyonika'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Das', 'Nair', 'Mehta', 'Jain', 'Chopra', 'Malhotra', 'Bhatia', 'Saxena'];

const weakAreasList = ['IP Addressing', 'Subnetting', 'Routing Protocols', 'Inheritance', 'Polymorphism', 'Exception Handling', 'Logic Gates', 'K-Maps', 'Flip Flops', 'Counters'];

const generateRandomStudent = (index: number): StudentMetric => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];

    // Weighted random for realistic class distribution
    // 10% Weak, 40% Average, 30% Good, 20% Excellent
    const rand = Math.random();
    let status: PerformanceLevel;
    let completionPct: number;
    let quizScore: number;

    if (rand < 0.1) {
        status = 'Weak';
        completionPct = Math.floor(Math.random() * 40);
        quizScore = Math.floor(Math.random() * 50) + 30;
    } else if (rand < 0.5) {
        status = 'Average';
        completionPct = Math.floor(Math.random() * 30) + 40; // 40-70
        quizScore = Math.floor(Math.random() * 20) + 60;
    } else if (rand < 0.8) {
        status = 'Good';
        completionPct = Math.floor(Math.random() * 20) + 70; // 70-90
        quizScore = Math.floor(Math.random() * 15) + 75;
    } else {
        status = 'Excellent';
        completionPct = Math.floor(Math.random() * 10) + 90; // 90-100
        quizScore = Math.floor(Math.random() * 10) + 90;
    }

    const practicalsAssigned = 10;
    const practicalsCompleted = Math.round((completionPct / 100) * practicalsAssigned);

    // Quiz trend logic mapping to score
    const quizTrend = Array.from({ length: 5 }, () =>
        Math.min(100, Math.max(0, quizScore + Math.floor(Math.random() * 20) - 10))
    );

    const lastActiveDays = Math.floor(Math.random() * 14); // 0-14 days ago

    return {
        id: `stu-${index + 100}`,
        name: `${firstName} ${lastName}`,
        rollNo: `2024${(200 + index).toString()}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@college.edu`,
        subject,
        practicalsAssigned,
        practicalsCompleted,
        quizScoreAvg: Math.round(quizScore),
        avgAttempts: Math.floor(Math.random() * 4) + 1,
        totalTimeSpent: Math.floor(Math.random() * 20) + 5,
        lastActive: subDays(new Date(), lastActiveDays).toISOString(),
        status,
        quizTrend,
        completedPracticals: [], // Identifying specific practicals not needed for this viz
        weakAreas: Array.from({ length: Math.floor(Math.random() * 3) }, () => weakAreasList[Math.floor(Math.random() * weakAreasList.length)])
    };
};

export const generateMockData = (count: number = 50): StudentMetric[] => {
    return Array.from({ length: count }, (_, i) => generateRandomStudent(i));
};

export const MOCK_TEACHER_DATA = generateMockData(60);
