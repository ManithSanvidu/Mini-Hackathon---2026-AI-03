const express = require('express');
const router = express.Router();
const FaultReport = require('../models/FaultReport');

// @route   POST /api/seed
// @desc    Seed the database with sample data
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Optional: Clear existing reports
    await FaultReport.deleteMany({});

    const sampleData = [
      {
        fenceId: "Post 12, Galgamuwa",
        district: "Kurunegala",
        damageType: "Fallen Post",
        urgency: "Critical",
        phone: "0711111111",
        status: "Pending"
      },
      {
        fenceId: "Sector B, Ampara",
        district: "Ampara",
        damageType: "Broken Wire",
        urgency: "Medium",
        phone: "0722222222",
        status: "Pending"
      },
      {
        fenceId: "Near Habarana Junction",
        district: "Anuradhapura",
        damageType: "Other",
        urgency: "Medium",
        phone: "0733333333",
        status: "In-Progress"
      },
      {
        fenceId: "Buttala Reserve Border",
        district: "Monaragala",
        damageType: "Elephant Breach",
        urgency: "Critical",
        phone: "0744444444",
        status: "Pending"
      },
      {
        fenceId: "Anuradhapura North, Post 5",
        district: "Anuradhapura",
        damageType: "Overgrown Vegetation",
        urgency: "Low",
        phone: "0755555555",
        status: "Repaired"
      },
      {
        fenceId: "Polonnaruwa East boundary",
        district: "Polonnaruwa",
        damageType: "Fallen Post",
        urgency: "Medium",
        phone: "0766666666",
        status: "Repaired"
      }
    ];

    await FaultReport.insertMany(sampleData);

    return res.status(200).json({ message: "Database seeded successfully", count: sampleData.length });
  } catch (error) {
    console.error('Error seeding database:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
