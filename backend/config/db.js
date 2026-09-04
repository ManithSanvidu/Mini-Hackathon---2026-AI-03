const mongoose = require('mongoose');

let connectionPromise;

// Reuse the connection across warm function requests and concurrent cold starts.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI');
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    }).finally(() => { connectionPromise = undefined; });
  }
  return connectionPromise;
};

module.exports = connectDB;
