/**
 * FenceGuard LK — Sample Fault Report Seed Data
 * For use during development / hackathon demo testing.
 *
 * Run with:  node seed/seedFaults.js  (after wiring up your DB connection)
 */

const seedFaults = [
  {
    fenceId: "FG-001",
    district: "Kurunegala",
    landmark: "Galgamuwa Forest Reserve Entry Gate",
    damageType: "Broken Wire",
    urgency: "High",
    phone: "0712345678",
    status: "Pending",
    imageUrl: "",
  },
  {
    fenceId: "FG-002",
    district: "Ampara",
    landmark: "Near Ampara Tank Spillway, Uhana Road",
    damageType: "Elephant Damage",
    urgency: "Critical",
    phone: "0778901234",
    status: "In-Progress",
    imageUrl: "",
  },
  {
    fenceId: "FG-003",
    district: "Matale",
    landmark: "Habarana Junction, Minneriya Road km 4",
    damageType: "Fallen Tree",
    urgency: "Critical",
    phone: "0763456789",
    status: "Pending",
    imageUrl: "",
  },
  {
    fenceId: "FG-004",
    district: "Monaragala",
    landmark: "Monaragala–Wellawaya Road, Bibile Turn",
    damageType: "Power Failure",
    urgency: "Medium",
    phone: "0754567890",
    status: "Repaired",
    imageUrl: "",
  },
  {
    fenceId: "FG-005",
    district: "Polonnaruwa",
    landmark: "Polonnaruwa Ancient Park South Boundary",
    damageType: "Broken Post",
    urgency: "High",
    phone: "0725678901",
    status: "In-Progress",
    imageUrl: "",
  },
  {
    fenceId: "FG-006",
    district: "Hambantota",
    landmark: "Bundala National Park West Gate",
    damageType: "Wire Tampering",
    urgency: "Medium",
    phone: "0706789012",
    status: "Repaired",
    imageUrl: "",
  },
];

module.exports = seedFaults;
