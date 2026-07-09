const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleCheck");
const {
  getStats,
  getAllDonors,
  getAllNGOsAdmin,
  getAllDonations,
  getCompletedDonations,
  deleteUser,
} = require("../controllers/adminController");

router.use(protect, authorizeRoles("admin"));

router.get("/stats", getStats);
router.get("/donors", getAllDonors);
router.get("/ngos", getAllNGOsAdmin);
router.get("/donations", getAllDonations);
router.get("/donations/completed", getCompletedDonations);
router.delete("/users/:id", deleteUser);

module.exports = router;
