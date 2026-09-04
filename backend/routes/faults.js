const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authenticate, requireRole } = require('../middleware/auth');
const FaultReport = require('../models/FaultReport');

// Public map data deliberately excludes reporter contact details and photos.
router.get('/map', async (req, res) => {
  try {
    const reports = await FaultReport.find({ status: { $ne: 'Repaired' } })
      .select('_id fenceId district damageType urgency status createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json(reports);
  } catch {
    res.status(503).json({ message: 'Map reports are temporarily unavailable.' });
  }
});

// @route   POST /api/faults
// @desc    Submit a new fault report
// @access  Authenticated
router.post('/', authenticate, async (req, res) => {
  try {
    // Extract fields from req.body
    const { fenceId, district, damageType, urgency, phone, imageUrl } = req.body;

    // Basic server-side validation
    if (!district || !damageType || !urgency || !phone) {
      return res.status(400).json({
        message: 'Please provide all required fields: district, damageType, urgency, and phone',
      });
    }

    // Additional phone number validation as an extra safeguard
    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: 'Invalid Sri Lankan phone number format.',
      });
    }

    // Create a new FaultReport instance
    const newReport = new FaultReport({
      fenceId,
      district,
      damageType,
      urgency,
      phone,
      imageUrl: imageUrl || '',
    });

    // Save to the database
    const savedReport = await newReport.save();

    // Return success response with saved document
    return res.status(201).json(savedReport);

  } catch (error) {
    console.error('Error in POST /api/faults:', error);
    // Catch Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // General server error
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @route   GET /api/faults
// @desc    Get all fault reports
// @access  Authenticated
router.get('/', authenticate, requireRole('Officer'), async (req, res) => {
  try {
    const { status, district, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (district) query.district = district;
    if (search) {
      query.fenceId = { $regex: search, $options: 'i' };
    }

    // Fetch reports from MongoDB and sort by createdAt descending (newest first)
    const reports = await FaultReport.find(query).sort({ createdAt: -1 });

    // Define urgency weight for sorting (Critical first, then Medium, then Low)
    const urgencyWeight = { 'Critical': 3, 'Medium': 2, 'Low': 1 };

    // Sort in memory by urgency (descending)
    // Since javascript sort is stable in V8 (Node 11+), it will preserve the createdAt sorting for items with same urgency
    reports.sort((a, b) => {
      const weightA = urgencyWeight[a.urgency] || 0;
      const weightB = urgencyWeight[b.urgency] || 0;
      return weightB - weightA;
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error in GET /api/faults:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @route   PATCH /api/faults/:id/status
// @desc    Update fault report status
// @access  Officer
router.patch('/:id/status', authenticate, requireRole('Officer'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid report ID' });
    const { status } = req.body;
    if (!['Pending', 'In-Progress', 'Repaired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updatedReport = await FaultReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    return res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error in PATCH /api/faults/:id/status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
