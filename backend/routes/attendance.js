const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AttendanceLog = require('../models/AttendanceLog');
const ExperimentActivity = require('../models/ExperimentActivity');
const TeacherAlert = require('../models/TeacherAlert');
const User = require('../models/User');
const Experiment = require('../models/Experiment');
const attendanceMiddleware = require('../middleware/attendanceMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const weakStudentService = require('../services/weakStudentService');
const alertService = require('../services/alertService');

// 1. POST /logout - Auth: student
router.post('/logout', protect, attendanceMiddleware.onLogout);

// 2. GET /analytics - Auth: teacher or admin
router.get('/analytics', protect, authorize('teacher', 'admin'), async (req, res) => {
    try {
        const { range = 'daily', date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        
        let startDate, endDate;
        if (range === 'daily') {
            startDate = new Date(targetDate.setHours(0, 0, 0, 0));
            endDate = new Date(targetDate.setHours(23, 59, 59, 999));
        } else if (range === 'weekly') {
            const day = targetDate.getDay();
            const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1); // Monday
            startDate = new Date(targetDate.setDate(diff));
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000 + 86399999);
        } else { // monthly
            startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
            endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        // Metrics — always re-compute "today" freshly for daily range
        let queryStart = startDate;
        let queryEnd = endDate;
        if (range === 'daily') {
            queryStart = new Date();
            queryStart.setHours(0, 0, 0, 0);
            queryEnd = new Date(queryStart);
            queryEnd.setDate(queryEnd.getDate() + 1);
        }

        // Debug: timezone info
        console.log('[ANALYTICS] Server time:', new Date().toString());
        console.log('[ANALYTICS] UTC offset (mins):', new Date().getTimezoneOffset());
        console.log('[ANALYTICS] Today range:', queryStart.toISOString(), 'to', queryEnd.toISOString());

        const presentCount = await AttendanceLog.countDocuments({
            login_time: { $gte: queryStart, $lt: queryEnd }
        });

        const totalStudents = await User.countDocuments({ role: 'student' });
        const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

        console.log('[ANALYTICS] presentCount:', presentCount);
        console.log('[ANALYTICS] totalStudents:', totalStudents);
        console.log('[ANALYTICS] attendanceRate:', attendanceRate);

        const totalExps = await Experiment.countDocuments();
        const completedExpsStudents = await ExperimentActivity.distinct('student_id', {
            result_generated: true
        }).then(res => res.length);
        const experimentCompletionRate = totalStudents > 0 ? (completedExpsStudents / totalStudents) * 100 : 0;

        const avgLabTime = await AttendanceLog.aggregate([
            { $match: { login_time: { $gte: queryStart, $lt: queryEnd }, session_duration: { $gt: 0 } } },
            { $group: { _id: null, avgDuration: { $avg: "$session_duration" } } }
        ]);
        const average_lab_time_minutes = avgLabTime.length > 0 ? avgLabTime[0].avgDuration : 0;

        // At risk students
        const students = await User.find({ role: 'student' });
        const atRiskStudents = [];
        for (const student of students) {
            const risk = await weakStudentService.computeStudentRisk(student._id);
            if (risk.risk_status === "At Risk") {
                atRiskStudents.push({
                    student_id: student._id,
                    name: student.fullName,
                    roll_number: student.rollNo,
                    risk_status: risk.risk_status
                });
            }
        }

        res.json({
            total_students: totalStudents,
            present_count: presentCount,
            attendance_rate_percent: attendanceRate.toString(),
            experiment_completion_rate: experimentCompletionRate.toFixed(1),
            average_lab_time_minutes: average_lab_time_minutes.toFixed(1),
            at_risk_students: atRiskStudents
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching analytics" });
    }
});

// 3. GET /report - Auth: teacher or admin
router.get('/report', protect, authorize('teacher', 'admin'), async (req, res) => {
    try {
        const { month } = req.query; // YYYY-MM
        const targetMonth = month ? new Date(month + '-01') : new Date();
        const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
        const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

        const students = await User.find({ role: 'student' });
        const report = [];

        for (const student of students) {
            const risk = await weakStudentService.computeStudentRisk(student._id);
            const experimentsCompleted = await ExperimentActivity.countDocuments({
                student_id: student._id,
                result_generated: true,
                last_run_at: { $gte: startOfMonth, $lte: endOfMonth }
            });

            report.push({
                student_name: student.fullName,
                roll_number: student.rollNo,
                attendance_percentage: risk.attendance_percentage.toFixed(1),
                experiments_completed: experimentsCompleted,
                average_time_spent: risk.average_lab_time_minutes.toFixed(1),
                risk_status: risk.risk_status
            });
        }

        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating report" });
    }
});

// 4. GET /alerts - Auth: teacher or admin
router.get('/alerts', protect, authorize('teacher', 'admin'), async (req, res) => {
    try {
        const alerts = await TeacherAlert.find({ resolved: false })
            .populate('student_id', 'fullName rollNo')
            .sort({ created_at: -1 });
        res.json(alerts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching alerts" });
    }
});

// 5. PATCH /alerts/:id/resolve - Auth: teacher or admin
router.patch('/alerts/:id/resolve', protect, authorize('teacher', 'admin'), async (req, res) => {
    try {
        const updatedAlert = await alertService.resolveAlert(req.params.id);
        res.json(updatedAlert);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error resolving alert" });
    }
});

// 6. GET /student/:student_id - Auth: own student or teacher/admin
router.get('/student/:student_id', protect, async (req, res) => {
    try {
        const { student_id } = req.params;
        
        // Ownership or Role check
        if (req.user.id !== student_id && !['teacher', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: "Not authorized to view this student's data" });
        }

        const riskSummary = await weakStudentService.computeStudentRisk(student_id);
        const recentSessions = await AttendanceLog.find({ student_id })
            .sort({ login_time: -1 })
            .limit(10);
        const experimentActivity = await ExperimentActivity.find({ student_id })
            .sort({ last_run_at: -1 });

        res.json({
            risk_summary: riskSummary,
            logs: recentSessions,
            experiment_activity: experimentActivity
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching student data" });
    }
});

// 7. POST /log-lab - Auth: student
router.post('/log-lab', protect, async (req, res) => {
    try {
        const { subject, labId } = req.body;
        const student_id = req.user.id;
        const logId = req.user.attendance_log_id;

        // Map subject slug to official names and IDs
        const subjectMap = {
            'DSA': { id: 'BCS-301', name: 'Data Structures and Algorithms' },
            'CN': { id: 'BCS-502', name: 'Computer Networks' },
            'DLD': { id: 'BCS-303', name: 'Digital Logic & Design' },
            'DBMS': { id: 'BCS-404', name: 'Database Management System' },
            'OOPS': { id: 'BCS-405', name: 'Object Oriented Programming' },
            'MPMC': { id: 'BCS-506', name: 'Microprocessor and Microcontroller' },
            'C': { id: 'BCS-107', name: 'C Programming Lab' },
            'DAA': { id: 'BCS-408', name: 'Design and Analysis of Algorithms' }
        };

        const target = subjectMap[subject.toUpperCase()] || { id: 'BCS-000', name: 'Unknown' };
        
        // Find existing log for this session
        let log = await AttendanceLog.findById(logId);
        
        if (!log) {
            // Fallback: search for latest active log for this student if token is missing ID
            log = await AttendanceLog.findOne({ student_id, logout_time: null }).sort({ login_time: -1 });
        }

        if (log) {
            // Update existing log
            let currentIds = log.subject_id === 'BCS-000' ? [] : log.subject_id.split(', ');
            let currentNames = log.subject_name === 'None' ? [] : log.subject_name.split(', ');

            // Only add if not already present
            if (!currentIds.includes(target.id)) {
                currentIds.push(target.id);
                currentNames.push(target.name);
            }

            log.subject_id = currentIds.length > 0 ? currentIds.join(', ') : target.id;
            log.subject_name = currentNames.length > 0 ? currentNames.join(', ') : target.name;
            log.lab_id = labId; // Keep the latest lab_id
            
            await log.save();
            return res.status(200).json({ message: "Attendance updated", log });
        } else {
            // If no active log, create a new one (as a fallback)
            const newLog = new AttendanceLog({
                student_id,
                student_email: req.user.email,
                subject_id: target.id,
                subject_name: target.name,
                lab_id: labId,
                login_time: new Date(),
                date: new Date().toISOString().split('T')[0],
                status: "in_progress"
            });
            await newLog.save();
            return res.status(201).json({ message: "New lab attendance logged", log: newLog });
        }
    } catch (err) {
        console.error("[ATTENDANCE] log-lab error:", err.message);
        res.status(500).json({ message: "Failed to log lab attendance" });
    }
});

module.exports = router;
