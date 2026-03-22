const AttendanceLog = require('../models/AttendanceLog');
const Experiment = require('../models/Experiment');
const ExperimentActivity = require('../models/ExperimentActivity');

/**
 * Service to identify students who may need extra help.
 */

/**
 * computeStudentRisk
 * Calculates attendance, completion, and session duration to determine risk profile.
 */
exports.computeStudentRisk = async (student_id) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
        const endOfMonthStr = endOfMonth.toISOString().split('T')[0];

        // 1. Attendance percentage (current month)
        const attendanceCount = await AttendanceLog.countDocuments({
            student_id,
            date: { $gte: startOfMonthStr, $lte: endOfMonthStr }
        });
        const attendance_percentage = (attendanceCount / 26) * 100;

        // 2. Experiment completion percentage
        const totalExperiments = await Experiment.countDocuments();
        const attemptedExperiments = await ExperimentActivity.distinct('experiment_id', { student_id });
        const experiment_completion_percentage = (totalExperiments > 0) 
            ? (attemptedExperiments.length / totalExperiments) * 100 
            : 0;

        // 3. Average lab time (minutes)
        const logsWithDuration = await AttendanceLog.find({ 
            student_id, 
            session_duration: { $gt: 0 } 
        });
        
        let average_lab_time_minutes = 0;
        if (logsWithDuration.length > 0) {
            const totalDuration = logsWithDuration.reduce((sum, log) => sum + (log.session_duration || 0), 0);
            average_lab_time_minutes = totalDuration / logsWithDuration.length;
        }

        // 4. Determine risk_status
        // Matrix:
        // "At Risk" -> attendance < 60 AND completion < 50 AND avg_time < 10
        // "Needs Attention" -> ANY ONE of: attendance < 60 OR completion < 50 OR avg_time < 10
        // "Good Standing" -> none of the above
        
        let risk_status = "Good Standing";
        
        const isLowAttendance = attendance_percentage < 60;
        const isLowCompletion = experiment_completion_percentage < 50;
        const isLowTime = average_lab_time_minutes < 10;

        if (isLowAttendance && isLowCompletion && isLowTime) {
            risk_status = "At Risk";
        } else if (isLowAttendance || isLowCompletion || isLowTime) {
            risk_status = "Needs Attention";
        }

        return {
            attendance_percentage,
            experiment_completion_percentage,
            average_lab_time_minutes,
            risk_status
        };

    } catch (err) {
        console.error("[WEAK STUDENT SERVICE ERROR]:", err.message);
        throw err;
    }
};
