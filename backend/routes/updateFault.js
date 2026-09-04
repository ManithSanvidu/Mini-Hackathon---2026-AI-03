const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const FaultReport = require("../models/FaultReport");

const ALLOWED_STATUSES = ["Pending", "In-Progress", "Repaired"];

// PATCH /:id  — update the status of a fault report
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid fault report ID.",
    });
  }

  // 400 — invalid status value
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
    });
  }

  try {
    const updatedFault = await FaultReport.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    // 404 — fault report not found
    if (!updatedFault) {
      return res.status(404).json({ message: "Fault report not found." });
    }

    // 200 — return the full updated document
    return res.status(200).json(updatedFault);
  } catch (err) {
    // 500 — server / database error
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
