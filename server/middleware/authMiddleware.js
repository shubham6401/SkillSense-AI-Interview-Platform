const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        let authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No authorization token provided. Please log in.",
            });
        }

        let token = authHeader;
        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }

        if (!token) {
            return res.status(401).json({
                message: "Malformed authorization token.",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret"
        );

        // Normalize id / _id / userId across the whole application
        const userId = decoded.id || decoded._id || decoded.userId;
        req.user = {
            ...decoded,
            id: userId,
            _id: userId,
            userId: userId,
            role: decoded.role || "candidate",
        };

        next();
    } catch (e) {
        console.warn("JWT Authentication check failed:", e.message);
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Your session has expired. Please log in again.",
            });
        }
        return res.status(401).json({
            message: "Invalid authorization token. Please log in again.",
        });
    }
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Requires one of these roles: ${roles.join(", ")}`,
            });
        }
        next();
    };
};

protect.protect = protect;
protect.requireRole = requireRole;

module.exports = protect;
