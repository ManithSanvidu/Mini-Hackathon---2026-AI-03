const express = require('express');
const router = express.Router();
const FaultReport = require('../models/FaultReport');

// @route   POST /api/faults
// @desc    Submit a new fault report
// @access  Public
router.post('/', async (req, res) => {
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

module.exports = router;
