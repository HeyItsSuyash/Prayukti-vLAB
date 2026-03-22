const AttendanceLog = require('../models/AttendanceLog');
const SuspiciousActivity = require('../models/SuspiciousActivity');
const ExperimentActivity = require('../models/ExperimentActivity');
const alertService = require('../services/alertService');

/**
 * Attendance Middleware
 */

// 1. onLogin
exports.onLogin = async (req, res, next) => {
    console.log('[ATTENDANCE] onLogin fired for:', res.locals.userId);
    try {
        const student_id = res.locals.userId;
        if (!student_id) {
            return next(); // Should be set by auth controller
        }
        const student_email = res.locals.userEmail;

        const ip_address = req.ip || req.headers['x-forwarded-for'];
        const today = new Date().toISOString().split('T')[0];

        if (process.env.MOCK_AUTH === 'true') {
            console.log('[ATTENDANCE] MOCK_AUTH enabled. Skipping log save for:', student_email);
            res.locals.attendance_log_id = "mock_log_" + Date.now();
            return next();
        }

        const log = new AttendanceLog({
            student_id,
            student_email,
            login_time: new Date(),
            logout_time: null,
            session_duration: 0,
            ip_address,
            date: today
        });

        await log.save();
        console.log('ATTENDANCE log saved', log._id);
        res.locals.attendance_log_id = log._id;
        
        next();
    } catch (err) {
        console.error('[ATTENDANCE] onLogin failed:', err.message);
        next(); // always continue even if attendance fails
    }
};

// 2. onLogout
exports.onLogout = async (req, res) => {
  try {
    const raw_id = req.user?.id || req.user?._id || req.user?.userId;
    console.log('[ATTENDANCE DEBUG] onLogout raw student_id from token:', raw_id);

    if (!raw_id) {
      console.log('[ATTENDANCE DEBUG] No student_id found in req.user');
      return res.json({ message: 'Logged out' });
    }

    const mongoose = require('mongoose');
    let student_id;
    try {
        student_id = new mongoose.Types.ObjectId(raw_id);
    } catch (e) {
        console.log('[ATTENDANCE DEBUG] Invalid student_id format:', raw_id);
        return res.json({ message: 'Logged out' });
    }

    const logId = req.user?.attendance_log_id;
    let log;
    if (logId) {
        log = await AttendanceLog.findById(logId);
    }

    if (!log && student_id) {
        log = await AttendanceLog.findOne({
          student_id: student_id,
          logout_time: null
        }).sort({ login_time: -1 });
    }

    if (log) {
      const now = new Date();
      const duration = Math.round(((now - new Date(log.login_time)) / 60000) * 10) / 10;
      
      // Calculate status based on duration and activity_score
      const activity_score = log.activity_score || 0;
      let status = "present";
      if (duration < 2) {
          status = "absent";
      } else if (activity_score < 20) {
          status = "inactive";
      }

      await AttendanceLog.updateOne(
        { _id: log._id },
        { 
          $set: { 
            logout_time: now, 
            session_duration: duration,
            status: status
            session_duration: duration 
          } 
        }
      );
      
      console.log(`[ATTENDANCE] Logout recorded for ${log._id}, duration: ${duration}m`);
      
      // Perform suspicious activity check in background
      checkSuspiciousActivity(log).catch(err => console.error("Suspicious check failed:", err.message));

      // Trigger automated alerts based on this session
      alertService.checkAndCreateAlerts(student_id, duration).catch(err => console.error("Alert check failed:", err.message));

      return res.json({ 
        message: 'Logged out successfully',
        session_duration: duration
      });
    } else {
      console.log(`[ATTENDANCE] No open session found for student ${student_id}`);
      return res.json({ message: 'Logged out' });
    }

  } catch (err) {
    console.error('[ATTENDANCE] onLogout error:', err.message);
    return res.json({ message: 'Logged out' });
  }
};

// 3. checkSuspiciousActivity
async function checkSuspiciousActivity(log) {
    try {
        const { student_id, session_duration, ip_address, date } = log;
        
        // A. Short session
        if (session_duration < 2) {
            await new SuspiciousActivity({
                student_id,
                reason: 'SHORT_SESSION',
                ip_address
            }).save();
        }

        // B. Concurrent login (same IP, different session still open)
        const concurrentCount = await AttendanceLog.countDocuments({
            _id: { $ne: log._id },
            ip_address,
            logout_time: null
        });

        if (concurrentCount > 0) {
            await new SuspiciousActivity({
                student_id,
                reason: 'CONCURRENT_LOGIN',
                ip_address
            }).save();
        }

        // C. Short session AND no ExperimentActivity today
        if (session_duration < 2) {
            const activityToday = await ExperimentActivity.findOne({
                student_id,
                last_run_at: {
                    $gte: new Date(date),
                    $lt: new Date(new Date(date).getTime() + 86400000)
                }
            });

            if (!activityToday) {
                await new SuspiciousActivity({
                    student_id,
                    reason: 'NO_EXPERIMENT_RUN',
                    ip_address
                }).save();
            }
        }
    } catch (err) {
        console.error("Error checking suspicious activity:", err);
    }
}
