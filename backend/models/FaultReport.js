const mongoose = require('mongoose');

const faultReportSchema = new mongoose.Schema({
  fenceId: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    required: true,
  },
  damageType: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'Critical'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^07\d{8}$/, 'Please fill a valid Sri Lankan phone number'],
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Repaired'],
    default: 'Pending',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FaultReport', faultReportSchema);
