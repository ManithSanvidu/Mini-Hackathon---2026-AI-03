const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Validate essential environment variables
if (!process.env.MONGO_URI) {
  console.error("Error: Missing MONGO_URI in backend/.env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("Error: Missing JWT_SECRET in backend/.env");
  process.exit(1);
}
if (!process.env.OFFICER_REGISTRATION_CODE) {
  console.error("Error: Missing OFFICER_REGISTRATION_CODE in backend/.env");
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", db: "connected" });
});

// Mount Routes
app.use('/api/faults', require('./routes/faults'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/seed', require('./routes/seed'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
