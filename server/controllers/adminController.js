const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const NGO = require("../models/NGO");
const Donation = require("../models/Donation");

// @desc    Admin dashboard summary stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = asyncHandler(async (req, res) => {
  const [totalDonors, totalNGOs, totalDonations, completedDonations, pendingDonations] =
    await Promise.all([
      User.countDocuments({ role: "donor" }),
      User.countDocuments({ role: "ngo" }),
      Donation.countDocuments(),
      Donation.countDocuments({ status: "Completed" }),
      Donation.countDocuments({ status: { $in: ["Pending", "Assigned"] } }),
    ]);

  const categoryBreakdown = await Donation.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const statusBreakdown = await Donation.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  res.json({
    totalDonors,
    totalNGOs,
    totalDonations,
    completedDonations,
    pendingDonations,
    categoryBreakdown,
    statusBreakdown,
  });
});

// @desc    Get all donors
// @route   GET /api/admin/donors
// @access  Private (admin)
const getAllDonors = asyncHandler(async (req, res) => {
  const donors = await User.find({ role: "donor" }).select("-password");
  res.json(donors);
});

// @desc    Get all NGOs (with user info)
// @route   GET /api/admin/ngos
// @access  Private (admin)
const getAllNGOsAdmin = asyncHandler(async (req, res) => {
  const ngos = await NGO.find().populate("user", "name email phone isActive");
  res.json(ngos);
});

// @desc    Get all donations
// @route   GET /api/admin/donations
// @access  Private (admin)
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate({ path: "assignedNGO", populate: { path: "user", select: "name email" } })
    .populate("createdBy", "name email organizationName")
    .sort({ createdAt: -1 });
  res.json(donations);
});

// @desc    Get completed donations
// @route   GET /api/admin/donations/completed
// @access  Private (admin)
const getCompletedDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ status: "Completed" })
    .populate({ path: "assignedNGO", populate: { path: "user", select: "name email" } })
    .populate("createdBy", "name email organizationName")
    .sort({ completedAt: -1 });
  res.json(donations);
});

// @desc    Delete a user (donor or ngo)
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot delete an admin account");
  }

  if (user.role === "ngo") {
    await NGO.findOneAndDelete({ user: user._id });
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});

module.exports = {
  getStats,
  getAllDonors,
  getAllNGOsAdmin,
  getAllDonations,
  getCompletedDonations,
  deleteUser,
};
