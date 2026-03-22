const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT and attaches user to request object.
 */
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized to access this route" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        // Attach decoded payload to req.user
        // It contains: { id, email, role, attendance_log_id }
        req.user = decoded;
        
        next();
    } catch (err) {
        console.error("[AUTH MIDDLEWARE ERROR]:", err.message);
        return res.status(401).json({ message: "Token verification failed" });
    }
};

/**
 * Role checking middleware
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};
