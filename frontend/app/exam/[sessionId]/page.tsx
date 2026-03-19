"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Save, ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function ExamSessionEnvironment() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;

    const [session, setSession] = useState<any>(null);
    const [exam, setExam] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [warnings, setWarnings] = useState(0);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Dialog states
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Fetch session and exam data
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const token = localStorage.getItem('token');

                // We fetch the student exams and find this session's parent exam to get details.
                // In a real app we'd have a direct API for the session details. 
                // Let's use the student exams array to find it.
                const res = await fetch(`http://localhost:5000/api/exams/student`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const exams = await res.json();
                    const activeExam = exams.find((e: any) => e.session && e.session._id === sessionId);

                    if (activeExam) {
                        setExam(activeExam);
                        setSession(activeExam.session);
                        setWarnings(activeExam.session.warnings);

                        if (activeExam.session.status === 'submitted' || activeExam.session.status === 'time_up') {
                            setIsFinished(true);
                            return;
                        }

                        // Calculate time left based on startTime and duration
                        const startTime = new Date(activeExam.session.startTime).getTime();
                        const durationMs = activeExam.durationMinutes * 60 * 1000;
                        const endTime = startTime + durationMs;
                        const now = Date.now();

                        if (now >= endTime) {
                            handleAutoSubmit();
                        } else {
                            setTimeLeft(Math.floor((endTime - now) / 1000));
                        }
                    } else {
                        alert("Session not found or not authorized.");
                        router.push('/dashboard/exams');
                    }
                }
            } catch (error) {
                console.error("Error fetching session details:", error);
            }
        };

        fetchSession();
    }, [sessionId]);

    // Anti-cheat API call
    const trackEvent = async (type: string, logMessage: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/exams/session/${sessionId}/track`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type, logMessage })
            });
        } catch (e) {
            console.error("Tracking error", e);
        }
    };

    // Timer countdown effect
    useEffect(() => {
        if (timeLeft === null || isFinished || isSubmitting) return;

        if (timeLeft <= 0) {
            handleAutoSubmit();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev !== null ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isFinished, isSubmitting]);

    // Anti-cheat mechanisms (Visibility & Blur)
    useEffect(() => {
        if (isFinished || isSubmitting || !session) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const newWarnings = warnings + 1;
                setWarnings(newWarnings);
                setWarningMessage(`You have switched tabs or minimized the window. This is warning ${newWarnings}/3.`);
                trackEvent('tab_switch', 'Student switched tabs or minimized the browser');

                if (newWarnings >= 3) {
                    setWarningMessage("You have exceeded the maximum number of warnings. Your exam will now be automatically submitted.");
                    setTimeout(() => {
                        handleAutoSubmit();
                    }, 3000);
                }
            }
        };

        const handleBlur = () => {
            // For strict mode. We count this optionally or count it as the same visibility track
            trackEvent('warning', 'Student lost focus of the exam window');
        };

        const handleContextMenu = (e: Event) => e.preventDefault(); // Disable right click
        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable certain shortcuts if needed
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'p')) {
                e.preventDefault();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [warnings, isFinished, isSubmitting, session]);

    // Reference to the iframe so we can send messages to it
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Passive listener for manual saves triggered from inside the simulator
    useEffect(() => {
        if (!session) return;
        const handleManualSave = async (event: MessageEvent) => {
            if (event.data && event.data.type === 'SAVE_EXAM_STATE') {
                const submissionData = event.data.payload;
                try {
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:5000/api/exams/session/${sessionId}/save`, {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ submissionData })
                    });
                    console.log("Exam state saved manually.");
                } catch (err) {
                    console.error("Failed to manually save exam state:", err);
                }
            }
        };

        window.addEventListener('message', handleManualSave);
        return () => window.removeEventListener('message', handleManualSave);
    }, [session, sessionId]);

    const submitExam = async (isAuto: boolean) => {
        setIsSubmitting(true);
        let submissionData = null;

        // Try to extract the state from the iframe simulator
        try {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                // We create a promise that either resolves with the data from the iframe, or times out
                submissionData = await new Promise((resolve) => {
                    const handleMessage = (event: MessageEvent) => {
                        // Check if it's the response we want
                        if (event.data && event.data.type === 'EXAM_STATE_RESPONSE') {
                            window.removeEventListener('message', handleMessage);
                            resolve(event.data.payload);
                        }
                    };

                    window.addEventListener('message', handleMessage);
                    // Ask the iframe for its state
                    iframeRef.current!.contentWindow!.postMessage({ type: 'REQUEST_EXAM_STATE' }, '*');

                    // Fallback timeout in case the simulator doesn't support this feature yet
                    setTimeout(() => {
                        window.removeEventListener('message', handleMessage);
                        resolve(null);
                    }, 1500);
                });
            }
        } catch (err) {
            console.error("Failed to extract simulator state:", err);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/exams/session/${sessionId}/submit`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isAutoSubmit: isAuto, submissionData })
            });

            if (res.ok) {
                setIsFinished(true);
            } else {
                alert("Failed to submit exam!");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    const handleAutoSubmit = () => {
        submitExam(true);
    };

    const handleManualSubmit = () => {
        setShowSubmitConfirm(false);
        submitExam(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Save className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Exam Submitted</h1>
                    <p className="text-gray-500">Your practical examination has been successfully recorded and submitted to your teacher.</p>
                    <Button className="w-full mt-4" onClick={() => router.push('/dashboard/exams')}>
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    if (!session || !exam) return <div className="p-8">Initializing secure environment...</div>;

    const isUrgent = timeLeft !== null && timeLeft < 300; // < 5 mins

    const getSubjectRoute = (subjectName: string) => {
        const lower = subjectName.toLowerCase();
        if (lower.includes('network') || lower.includes('cn')) return 'cn';
        if (lower.includes('oop') || lower.includes('object')) return 'oops';
        if (lower.includes('digital') || lower.includes('logic') || lower.includes('dld')) return 'dld';
        if (lower.includes('microprocessor') || lower.includes('microcontroller') || lower.includes('mpmc')) return 'mpmc';
        if (lower.includes('database') || lower.includes('dbms')) return 'dbms';
        return 'dld'; // Default fallback
    };

    const subjectRoute = getSubjectRoute(exam.subjectId);
    // Clean experiment string to just numbers if possible, or use as is
    const expMatch = exam.experimentId.match(/\d+/);
    const expRoute = expMatch ? Number(expMatch[0]).toString() : exam.experimentId;

    // Final embedded simulation URL
    const labUrl = `/dashboard/${subjectRoute}/${expRoute}/simulation?mode=exam`;

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-900 overflow-hidden select-none">
            {/* Top Bar - High Contrast */}
            <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 font-bold px-3 py-1 rounded text-white text-sm">
                        EXAM MODE
                    </div>
                    <div>
                        <h1 className="text-white font-semibold">{exam.subjectId}</h1>
                        <div className="text-slate-400 text-xs">{exam.experimentId}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xl font-bold ${isUrgent ? 'bg-red-950/50 text-red-500 border border-red-900/50 animate-pulse' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                        <Clock className="w-5 h-5" />
                        {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                    </div>

                    <Button variant="destructive" onClick={() => setShowSubmitConfirm(true)} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Finish Exam"}
                    </Button>
                </div>
            </div>

            {/* Main Content Area - Renders the Lab inside an IFrame to isolate it */}
            <div className="flex-1 w-full h-full relative bg-white">
                <iframe
                    ref={iframeRef}
                    src={labUrl}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    title="Practical Lab Environment"
                />

                {/* Fullscreen Warning Overlay during blur/submit */}
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="text-xl font-bold flex items-center gap-3">
                            <span className="animate-spin text-indigo-600">↻</span> Processing submission...
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}

            <Dialog open={!!warningMessage} onOpenChange={() => setWarningMessage(null)}>
                <DialogContent className="sm:max-w-md border-red-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <ShieldAlert className="w-6 h-6" /> Security Warning
                        </DialogTitle>
                        <DialogDescription className="pt-3 text-base text-gray-700">
                            {warningMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={() => setWarningMessage(null)}>Acknowledge</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to finish?</DialogTitle>
                        <DialogDescription>
                            This will submit your current progress. You cannot resume the exam once submitted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleManualSubmit}>Yes, Submit Exam</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
