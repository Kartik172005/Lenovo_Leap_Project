const axios = require("axios");
const NGO = require("../models/NGO");

/**
 * Haversine distance in km between two lat/lng points.
 */
function distanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => v === null || v === undefined)) {
    return null;
  }
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Determine priority based on how soon the food expires.
 */
function computePriority(expiryTime) {
  const hoursLeft = (new Date(expiryTime) - new Date()) / (1000 * 60 * 60);
  if (hoursLeft <= 3) return "High";
  if (hoursLeft <= 8) return "Medium";
  return "Low";
}

/**
 * Rule-based fallback recommender (runs entirely inside Node, no external API needed).
 * This guarantees the "Food Recommendation Agent" always returns a result even if
 * the Python/GPT/Gemini microservice is offline.
 */
async function ruleBasedRecommend(donation) {
  const ngos = await NGO.find({ isVerified: true }).populate("user", "name email");

  if (!ngos.length) {
    return {
      assignedNGO: null,
      priority: computePriority(donation.expiryTime),
      reason: "No verified NGOs are currently registered in the system.",
      confidence: 0,
    };
  }

  const priority = computePriority(donation.expiryTime);

  // Score each NGO: closer distance + accepts the food category + enough capacity = higher score
  const scored = ngos.map((ngo) => {
    const dist = distanceKm(donation.latitude, donation.longitude, ngo.latitude, ngo.longitude);
    const withinRadius = dist === null ? true : dist <= ngo.serviceRadiusKm;
    const acceptsCategory =
      !ngo.foodTypesAccepted.length || ngo.foodTypesAccepted.includes(donation.category);
    const hasCapacity = donation.quantity <= ngo.capacityPerDay;

    let score = 0;
    if (acceptsCategory) score += 40;
    if (hasCapacity) score += 30;
    if (withinRadius) score += 20;
    if (dist !== null) score += Math.max(0, 10 - dist / 5); // closer = more points

    return { ngo, dist, score, acceptsCategory, hasCapacity, withinRadius };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  const reasonParts = [];
  if (best.acceptsCategory) reasonParts.push(`accepts "${donation.category}" food`);
  if (best.hasCapacity) reasonParts.push("has sufficient capacity");
  if (best.dist !== null) reasonParts.push(`is ${best.dist.toFixed(1)} km from pickup location`);

  const reason = best.ngo
    ? `${best.ngo.ngoName} was selected because it ${reasonParts.join(", ")}.`
    : "No suitable NGO found matching the donation criteria.";

  return {
    assignedNGO: best.ngo ? best.ngo._id : null,
    priority,
    reason,
    confidence: Math.min(100, Math.round(best.score)),
  };
}

/**
 * Main entry point: Food Recommendation Agent.
 * Tries the external Python (GPT/Gemini powered) AI microservice first.
 * Falls back to the rule-based recommender if the service is unavailable.
 */
async function getRecommendation(donation) {
  const aiServiceUrl = process.env.AI_SERVICE_URL;

  if (aiServiceUrl) {
    try {
      const ngos = await NGO.find({ isVerified: true }).populate("user", "name email");
      const payload = {
        donation: {
          foodName: donation.foodName,
          category: donation.category,
          quantity: donation.quantity,
          unit: donation.unit,
          expiryTime: donation.expiryTime,
          preparationTime: donation.preparationTime,
          latitude: donation.latitude,
          longitude: donation.longitude,
        },
        ngos: ngos.map((n) => ({
          id: n._id.toString(),
          name: n.ngoName,
          capacityPerDay: n.capacityPerDay,
          foodTypesAccepted: n.foodTypesAccepted,
          serviceRadiusKm: n.serviceRadiusKm,
          latitude: n.latitude,
          longitude: n.longitude,
        })),
      };

      const { data } = await axios.post(aiServiceUrl, payload, { timeout: 6000 });

      return {
        assignedNGO: data.recommended_ngo_id || null,
        priority: data.priority || computePriority(donation.expiryTime),
        reason: data.reason || "Recommended by AI agent.",
        confidence: data.confidence ?? null,
      };
    } catch (err) {
      console.warn("AI microservice unavailable, using rule-based fallback:", err.message);
      return ruleBasedRecommend(donation);
    }
  }

  return ruleBasedRecommend(donation);
}

module.exports = { getRecommendation, distanceKm, computePriority };
