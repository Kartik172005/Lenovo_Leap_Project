const asyncHandler = require("express-async-handler");
const Donation = require("../models/Donation");
const NGO = require("../models/NGO");
const { getRecommendation } = require("../services/aiAgent");

// @desc    Create a new food donation (Donor only). Runs the AI Food Recommendation Agent.
// @route   POST /api/donations
// @access  Private (donor)
const createDonation = asyncHandler(async (req, res) => {
  const {
    foodName,
    category,
    quantity,
    unit,
    preparationTime,
    expiryTime,
    description,
    pickupAddress,
    latitude,
    longitude,
  } = req.body;

  if (!foodName || !category || !quantity || !expiryTime || !pickupAddress) {
    res.status(400);
    throw new Error("Missing required donation fields");
  }

  const donation = await Donation.create({
    foodName,
    category,
    quantity,
    unit: unit || "kg",
    preparationTime: preparationTime || new Date(),
    expiryTime,
    description,
    pickupAddress,
    latitude,
    longitude,
    imageUrl: req.file ? req.file.path : "",
    createdBy: req.user._id,
  });

  // --- Agentic AI step: autonomously analyze and recommend NGO ---
  const recommendation = await getRecommendation(donation);

  donation.assignedNGO = recommendation.assignedNGO;
  donation.aiPriority = recommendation.priority;
  donation.aiReason = recommendation.reason;
  donation.aiConfidence = recommendation.confidence;
  donation.status = recommendation.assignedNGO ? "Assigned" : "Pending";
  await donation.save();

  const populated = await Donation.findById(donation._id)
    .populate({ path: "assignedNGO", populate: { path: "user", select: "name email" } })
    .populate("createdBy", "name email organizationName");

  res.status(201).json(populated);
});

// @desc    Get donations belonging to the logged-in donor
// @route   GET /api/donations/mine
// @access  Private (donor)
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ createdBy: req.user._id })
    .populate({ path: "assignedNGO", populate: { path: "user", select: "name email" } })
    .sort({ createdAt: -1 });
  res.json(donations);
});

// @desc    Get donations assigned to the logged-in NGO
// @route   GET /api/donations/assigned
// @access  Private (ngo)
const getAssignedDonations = asyncHandler(async (req, res) => {
  const ngoProfile = await NGO.findOne({ user: req.user._id });
  if (!ngoProfile) {
    res.status(404);
    throw new Error("NGO profile not found");
  }

  const donations = await Donation.find({ assignedNGO: ngoProfile._id })
    .populate("createdBy", "name email organizationName phone")
    .sort({ createdAt: -1 });

  res.json(donations);
});

// @desc    Get single donation details
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id)
    .populate({ path: "assignedNGO", populate: { path: "user", select: "name email" } })
    .populate("createdBy", "name email organizationName phone address");

  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }
  res.json(donation);
});

// @desc    NGO accepts a donation
// @route   PUT /api/donations/:id/accept
// @access  Private (ngo)
const acceptDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }
  donation.status = "Accepted";
  await donation.save();
  res.json(donation);
});

// @desc    NGO rejects a donation
// @route   PUT /api/donations/:id/reject
// @access  Private (ngo)
const rejectDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }
  donation.status = "Rejected";
  donation.assignedNGO = null;
  await donation.save();
  res.json(donation);
});

// @desc    NGO marks a donation as completed
// @route   PUT /api/donations/:id/complete
// @access  Private (ngo)
const completeDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    res.status(404);
    throw new Error("Donation not found");
  }
  donation.status = "Completed";
  donation.completedAt = new Date();
  await donation.save();

  if (donation.assignedNGO) {
    await NGO.findByIdAndUpdate(donation.assignedNGO, { $inc: { totalDonationsHandled: 1 } });
  }

  res.json(donation);
});

module.exports = {
  createDonation,
  getMyDonations,
  getAssignedDonations,
  getDonationById,
  acceptDonation,
  rejectDonation,
  completeDonation,
};
