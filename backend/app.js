const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const FaultReport = require('./models/FaultReport');
const app = express();
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: origins }));
app.use(express.json());
// Vercel invokes this exported app directly instead of starting server.js.
// CORS runs first so browser clients can read startup failure responses.
if (process.env.VERCEL) app.use(require('./middleware/vercelDatabase'));
app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'unavailable', db: connected ? 'connected' : 'disconnected' });
});
app.get('/api/stats', async (req, res) => {
  try {
    const [activeFaults, fencesRepaired, fences] = await Promise.all([
      FaultReport.countDocuments({ status: { $ne: 'Repaired' } }),
      FaultReport.countDocuments({ status: 'Repaired' }),
      FaultReport.distinct('fenceId', { fenceId: { $nin: ['', null] } })
    ]);
    res.json({ activeFaults, fencesRepaired, monitoredFences: fences.length });
  } catch {
    res.status(503).json({ message: 'Statistics are temporarily unavailable.' });
  }
});
app.use('/api/faults', require('./routes/faults'));
app.use('/api/auth', require('./routes/auth'));
// Seeding is deliberately not exposed over HTTP.
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.status === 400 ? 'Invalid request body.' : 'Internal Server Error' });
});
module.exports = app;
