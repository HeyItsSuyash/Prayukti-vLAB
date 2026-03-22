const Exam = require('../models/Exam');
const ExamSession = require('../models/ExamSession');

// @desc    Create a new exam (Teacher)
// @route   POST /api/exams/create
exports.createExam = async (req, res) => {
    try {
        const { subjectId, experimentId, assignedStudents, durationMinutes, startTime } = req.body;

        const exam = new Exam({
            subjectId,
            experimentId,
            teacherId: req.user.id,
            assignedStudents,
            durationMinutes,
            startTime
        });

        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get exams created by a teacher
// @route   GET /api/exams/teacher
exports.getTeacherExams = async (req, res) => {
    try {
        const exams = await Exam.find({ teacherId: req.user.id }).sort('-createdAt');
        res.json(exams);
    } catch (error) {
        console.error('Error fetching teacher exams:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get exams assigned to a student
// @route   GET /api/exams/student
exports.getStudentExams = async (req, res) => {
    try {
        const exams = await Exam.find({ assignedStudents: req.user.id }).sort('-startTime');

        // Enhance with session info if started
        const enhancedExams = await Promise.all(exams.map(async (exam) => {
            const session = await ExamSession.findOne({ examId: exam._id, studentId: req.user.id });
            return {
                ...exam.toObject(),
                session: session || null
            };
        }));

        res.json(enhancedExams);
    } catch (error) {
        console.error('Error fetching student exams:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a specific exam by ID
// @route   GET /api/exams/:id
exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        // Ensure user is teacher or assigned student
        if (exam.teacherId.toString() !== req.user.id && !exam.assignedStudents.includes(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized for this exam' });
        }

        res.json(exam);
    } catch (error) {
        console.error('Error fetching exam details:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Start an exam session
// @route   POST /api/exams/:id/start
exports.startExamSession = async (req, res) => {
    try {
        const examId = req.params.id;
        const studentId = req.user.id;

        if (!examId || examId === 'undefined') {
            return res.status(400).json({ message: 'Invalid exam ID provided' });
        }

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        if (!exam.assignedStudents.includes(studentId)) {
            return res.status(403).json({ message: 'You are not assigned to this exam' });
        }

        let session = await ExamSession.findOne({ examId, studentId });

        if (session) {
            if (session.status === 'submitted' || session.status === 'time_up') {
                return res.status(400).json({ message: 'Exam already completed' });
            }
            return res.json(session); // Return existing active session
        }

        session = new ExamSession({
            examId,
            studentId,
            status: 'in_progress',
            startTime: new Date(),
            activityLog: ['Exam started']
        });

        await session.save();
        res.status(201).json(session);
    } catch (error) {
        console.error('Error starting session:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Exam ID format' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Track activity (warnings, tab switches)
// @route   POST /api/exams/session/:sessionId/track
exports.trackActivity = async (req, res) => {
    try {
        const { type, logMessage } = req.body; // type: 'warning', 'tab_switch'
        const sessionId = req.params.sessionId;

        const session = await ExamSession.findOne({ _id: sessionId, studentId: req.user.id });
        if (!session) return res.status(404).json({ message: 'Session not found' });

        if (type === 'warning') session.warnings += 1;
        if (type === 'tab_switch') session.tabSwitches += 1;
        if (logMessage) session.activityLog.push(`${new Date().toISOString()} - ${logMessage}`);

        await session.save();
        res.json({ message: 'Activity tracked successfully' });
    } catch (error) {
        console.error('Error tracking activity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit an exam
// @route   POST /api/exams/session/:sessionId/submit
exports.submitExamSession = async (req, res) => {
    try {
        const { isAutoSubmit, submissionData } = req.body;
        const sessionId = req.params.sessionId;

        const session = await ExamSession.findOne({ _id: sessionId, studentId: req.user.id });
        if (!session) return res.status(404).json({ message: 'Session not found' });

        if (session.status === 'submitted' || session.status === 'time_up') {
            return res.status(400).json({ message: 'Already submitted' });
        }

        session.endTime = new Date();
        session.timeSpentSeconds = Math.floor((session.endTime - session.startTime) / 1000);
        session.status = isAutoSubmit ? 'time_up' : 'submitted';
        session.completed = true;
        session.activityLog.push(`Exam ${isAutoSubmit ? 'auto-submitted' : 'submitted'} at ${session.endTime.toISOString()}`);
        if (submissionData) {
            session.submissionData = submissionData;
        }

        await session.save();
        res.json(session);
    } catch (error) {
        console.error('Error submitting exam:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Save (auto-save or manual) an exam session without submitting
// @route   POST /api/exams/session/:sessionId/save
exports.saveExamSession = async (req, res) => {
    try {
        const { submissionData } = req.body;
        const sessionId = req.params.sessionId;

        const session = await ExamSession.findOne({ _id: sessionId, studentId: req.user.id });
        if (!session) return res.status(404).json({ message: 'Session not found' });

        if (session.status === 'submitted' || session.status === 'time_up') {
            return res.status(400).json({ message: 'Already submitted' });
        }

        if (submissionData) {
            session.submissionData = submissionData;
        }

        await session.save();
        res.json({ message: 'Saved successfully' });
    } catch (error) {
        console.error('Error saving exam:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get live progress / report of an exam for the teacher
// @route   GET /api/exams/:id/live
exports.getExamLiveStatus = async (req, res) => {
    try {
        const examId = req.params.id;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: 'Exam not found' });

        if (exam.teacherId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized for this exam' });
        }

        // Fetch all sessions and populate student details
        const sessions = await ExamSession.find({ examId })
            .populate('studentId', 'fullName email _id');

        res.json(sessions);
    } catch (error) {
        console.error('Error fetching live status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
