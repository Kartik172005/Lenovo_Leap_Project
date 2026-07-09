const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleCheck");
const upload = require("../middleware/upload");
const {
  createDonation,
  getMyDonations,
  getAssignedDonations,
  getDonationById,
  acceptDonation,
  rejectDonation,
  completeDonation,
} = require("../controllers/donationController");

router.post("/", protect, authorizeRoles("donor"), upload.single("image"), createDonation);
router.get("/mine", protect, authorizeRoles("donor"), getMyDonations);
router.get("/assigned", protect, authorizeRoles("ngo"), getAssignedDonations);
router.get("/:id", protect, getDonationById);
router.put("/:id/accept", protect, authorizeRoles("ngo"), acceptDonation);
router.put("/:id/reject", protect, authorizeRoles("ngo"), rejectDonation);
router.put("/:id/complete", protect, authorizeRoles("ngo"), completeDonation);

module.exports = router;
