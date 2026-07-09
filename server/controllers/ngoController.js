const asyncHandler = require("express-async-handler");
const NGO = require("../models/NGO");

// @desc    Get all verified NGOs (public listing, e.g. for About/Home page)
// @route   GET /api/ngos
// @access  Public
const getAllNGOs = asyncHandler(async (req, res) => {
  const ngos = await NGO.find().populate("user", "name email phone");
  res.json(ngos);
});

// @desc    Get logged-in NGO's own profile
// @route   GET /api/ngos/me
// @access  Private (ngo)
const getMyNGOProfile = asyncHandler(async (req, res) => {
  const ngo = await NGO.findOne({ user: req.user._id }).populate("user", "name email phone");
  if (!ngo) {
    res.status(404);
    throw new Error("NGO profile not found");
  }
  res.json(ngo);
});

module.exports = { getAllNGOs, getMyNGOProfile };
