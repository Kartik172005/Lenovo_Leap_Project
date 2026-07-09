const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true },
    category: {
      type: String,
      enum: ["Veg", "Non-Veg", "Bakery", "Packaged", "Cooked", "Other"],
      required: true,
    },
    quantity: { type: Number, required: true }, // in kg / number of meals
    unit: { type: String, enum: ["kg", "meals", "items"], default: "kg" },
    preparationTime: { type: Date, required: true },
    expiryTime: { type: Date, required: true },
    description: { type: String, default: "" },
    pickupAddress: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    imageUrl: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Assigned", "Accepted", "Rejected", "Completed", "Expired"],
      default: "Pending",
    },

    // AI Agent output
    assignedNGO: { type: mongoose.Schema.Types.ObjectId, ref: "NGO", default: null },
    aiPriority: { type: String, enum: ["High", "Medium", "Low", null], default: null },
    aiReason: { type: String, default: "" },
    aiConfidence: { type: Number, default: null },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
