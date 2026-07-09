const mongoose = require("mongoose");

// Extended profile for users with role "ngo"
const ngoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    ngoName: { type: String, required: true },
    registrationNumber: { type: String, default: "" },
    capacityPerDay: { type: Number, default: 50 }, // in kg or meals
    foodTypesAccepted: {
      type: [String],
      default: ["Veg", "Non-Veg", "Bakery", "Packaged", "Cooked"],
    },
    serviceRadiusKm: { type: Number, default: 10 },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    address: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    totalDonationsHandled: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NGO", ngoSchema);
