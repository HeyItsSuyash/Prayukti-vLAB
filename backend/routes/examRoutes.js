const express = require('express');
const router = express.Router();
const {
    createExam,
    getTeacherExams,
    getStudentExams,
    getExamById,
    startExamSession,
    submitExamSession,
    saveExamSession,
    trackActivity,
    getExamLiveStatus
} = require('../controllers/examController');
const { protect, teacher } = require('../middleware/authMiddleware');

// Teacher Routes
router.post('/create', protect, teacher, createExam);
router.get('/teacher', protect, teacher, getTeacherExams);

// Student Routes
router.get('/student', protect, getStudentExams);

// Mixed/Session Routes
router.get('/:id/live', protect, teacher, getExamLiveStatus);
router.post('/session/:sessionId/track', protect, trackActivity);
router.post('/session/:sessionId/submit', protect, submitExamSession);
router.post('/session/:sessionId/save', protect, saveExamSession);
router.post('/:id/start', protect, startExamSession);
router.get('/:id', protect, getExamById);

module.exports = router;
