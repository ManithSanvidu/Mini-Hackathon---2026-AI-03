const connectDB = require('../config/db');

module.exports = async function vercelDatabase(req, res, next) {
  const required = ['MONGO_URI', 'JWT_SECRET', 'OFFICER_REGISTRATION_CODE', 'CORS_ORIGINS'];
  if (required.some(name => !process.env[name])) {
    return res.status(503).json({ message: 'Backend environment is not configured.' });
  }
  try {
    await connectDB();
    next();
  } catch {
    return res.status(503).json({ message: 'Database is temporarily unavailable.' });
  }
};
