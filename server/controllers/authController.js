const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const NGO = require("../models/NGO");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user (donor, ngo, or admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    organizationName,
    latitude,
    longitude,
    // NGO-specific fields
    ngoName,
    registrationNumber,
    capacityPerDay,
    foodTypesAccepted,
    serviceRadiusKm,
  } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "donor",
    phone,
    address,
    organizationName,
    latitude,
    longitude,
  });

  // If registering as NGO, also create the NGO profile document
  if (user.role === "ngo") {
    await NGO.create({
      user: user._id,
      ngoName: ngoName || organizationName || name,
      registrationNumber,
      capacityPerDay: capacityPerDay || 50,
      foodTypesAccepted: foodTypesAccepted || ["Veg", "Non-Veg", "Bakery", "Packaged", "Cooked"],
      serviceRadiusKm: serviceRadiusKm || 10,
      latitude,
      longitude,
      address,
    });
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account has been deactivated");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get current logged-in user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  let ngoProfile = null;
  if (user.role === "ngo") {
    ngoProfile = await NGO.findOne({ user: user._id });
  }
  res.json({ ...user.toObject(), ngoProfile });
});

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const fields = ["name", "phone", "address", "organizationName", "latitude", "longitude", "avatarUrl"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) user[f] = req.body[f];
  });

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();

  // Sync NGO profile fields if applicable
  if (user.role === "ngo") {
    const ngoFields = ["ngoName", "capacityPerDay", "foodTypesAccepted", "serviceRadiusKm", "latitude", "longitude", "address"];
    const ngoUpdate = {};
    ngoFields.forEach((f) => {
      if (req.body[f] !== undefined) ngoUpdate[f] = req.body[f];
    });
    if (Object.keys(ngoUpdate).length) {
      await NGO.findOneAndUpdate({ user: user._id }, ngoUpdate, { new: true });
    }
  }

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    phone: updated.phone,
    address: updated.address,
    organizationName: updated.organizationName,
  });
});

module.exports = { registerUser, loginUser, getProfile, updateProfile };
