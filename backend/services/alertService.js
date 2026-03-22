const AttendanceLog = require('../models/AttendanceLog');
const Experiment = require('../models/Experiment');
const ExperimentActivity = require('../models/ExperimentActivity');
const TeacherAlert = require('../models/TeacherAlert');

/**
 * Service to handle automated alerts for teachers based on student activity.
 */

/**
 * checkAndCreateAlerts
 * Checks for low attendance, missed experiments, and short sessions.
 */
exports.checkAndCreateAlerts = async (student_id, session_duration) => {
    try {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        // Setup date range for "today" to deduplicate alerts
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        /**
         * Deduplication helper: Check if an unresolved alert of the same type 
         * was already created for this student today.
         */
        const alertExistsToday = async (type) => {
            return await TeacherAlert.findOne({
                student_id,
                alert_type: type,
                resolved: false,
                created_at: { $gte: todayStart, $lt: todayEnd }
            });
        };

        // a) Attendance check (current month)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
        const endOfMonthStr = endOfMonth.toISOString().split('T')[0];

        const attendanceCount = await AttendanceLog.countDocuments({
            student_id,
            date: { $gte: startOfMonthStr, $lte: endOfMonthStr }
        });
        
        const attendance_percentage = (attendanceCount / 26) * 100;

        if (attendance_percentage < 50 && !(await alertExistsToday('LOW_ATTENDANCE'))) {
            await TeacherAlert.create({
                student_id,
                alert_type: 'LOW_ATTENDANCE',
                message: `Student attendance is ${attendance_percentage.toFixed(1)}% this month`
            });
        }

        // b) Missed experiments check
        const totalExperiments = await Experiment.countDocuments();
        const attemptedExperiments = await ExperimentActivity.distinct('experiment_id', { student_id });
        const missed = totalExperiments - attemptedExperiments.length;

        if (missed >= 3 && !(await alertExistsToday('MISSED_EXPERIMENTS'))) {
            await TeacherAlert.create({
                student_id,
                alert_type: 'MISSED_EXPERIMENTS',
                message: `Student has not attempted ${missed} experiments`
            });
        }

        // c) Short session check
        if (session_duration < 2 && !(await alertExistsToday('SHORT_SESSION'))) {
            await TeacherAlert.create({
                student_id,
                alert_type: 'SHORT_SESSION',
                message: `Student login session was only ${session_duration.toFixed(1)} minutes`
            });
        }

    } catch (err) {
        console.error("[ALERT SERVICE ERROR]:", err.message);
    }
};

/**
 * resolveAlert
 * Marks an alert as resolved.
 */
exports.resolveAlert = async (alert_id) => {
    try {
        const alert = await TeacherAlert.findByIdAndUpdate(
            alert_id, 
            { resolved: true }, 
            { new: true }
        );
        return alert;
    } catch (err) {
        console.error("[ALERT SERVICE ERROR]: Failed to resolve alert:", err.message);
        throw err;
    }
};
