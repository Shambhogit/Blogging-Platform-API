const jwt = require("jsonwebtoken");
const JWT_SECRET = 'yereyerepausatuladetopaisa';

async function userAuthenticationMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, error: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
}

module.exports = userAuthenticationMiddleware;
