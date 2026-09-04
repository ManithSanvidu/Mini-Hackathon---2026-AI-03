const jwt = require("jsonwebtoken");

/**
 * authenticate
 * Verifies the Bearer JWT in the Authorization header.
 * Attaches decoded payload to req.user on success.
 * Returns 401 if token is missing or invalid.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

/**
 * requireRole(...roles)
 * Factory that returns a middleware allowing only users whose role is in the provided list.
 * Must be used AFTER authenticate.
 * Returns 403 if the user's role is not allowed.
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};

module.exports = { authenticate, requireRole };
