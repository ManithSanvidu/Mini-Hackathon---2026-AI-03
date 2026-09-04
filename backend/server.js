require('dotenv').config();
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
