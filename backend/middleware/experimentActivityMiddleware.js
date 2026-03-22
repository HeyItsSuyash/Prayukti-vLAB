const ExperimentActivity = require('../models/ExperimentActivity');

// In-memory map to track session start times for students
// Key: student_id, Value: timestamp (ms)
const sessionTimeMap = new Map();

/**
 * Middleware to track every experiment run by a student.
 * Never blocks the main code execution flow.
 */
exports.trackExperimentRun = async (req, res, next) => {
    try {
        // Extract student_id from decoded JWT (req.user is typically set by auth middleware)
        const student_id = req.user?.id || req.user?.userId;
        const { experiment_id, experiment_name } = req.body;

        // Skip tracking silently if essential IDs are missing
        if (!student_id || !experiment_id) {
            return next();
        }

        // Calculate time spent using in-memory timer
        let timeSpentIncrement = 0;
        const now = Date.now();
        
        if (sessionTimeMap.has(student_id)) {
            const startTime = sessionTimeMap.get(student_id);
            // Convert ms to minutes
            timeSpentIncrement = (now - startTime) / 60000;
        }
        
        // Reset/Start the timer for this student's next run
        sessionTimeMap.set(student_id, now);

        // Perform non-blocking upsert
        // We use findOneAndUpdate to ensure we create the record if it doesn't exist (upsert)
        // and increment the run_count and time_spent in one atomic operation.
        ExperimentActivity.findOneAndUpdate(
            { student_id, experiment_id },
            {
                $inc: { 
                    run_count: 1,
                    time_spent: timeSpentIncrement
                },
                $set: { 
                    last_run_at: new Date(), 
                    result_generated: true, 
                    experiment_name 
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).catch(err => {
            console.error("[ACTIVITY TRACKING ERROR]: Failed to update ExperimentActivity:", err.message);
        });

        // Always call next immediately - database operation is handled in background task (mostly)
        // Note: findOneAndUpdate returns a Query object, calling it without await or then/catch 
        // won't execute it, but we used .catch() which triggers execution.
        next();

    } catch (err) {
        // Log errors silently and ensure code execution proceeds
        console.error("[ACTIVITY TRACKING CRASH]:", err.message);
        next();
    }
};
