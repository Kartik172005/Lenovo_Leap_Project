const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const authorizeRoles = require("../middleware/roleCheck");
const { getAllNGOs, getMyNGOProfile } = require("../controllers/ngoController");

router.get("/", getAllNGOs);
router.get("/me", protect, authorizeRoles("ngo"), getMyNGOProfile);

module.exports = router;
