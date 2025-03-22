const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {
        // Get token from headers
        const token = req.header("Authorization")?.split(' ')[1];


        if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;