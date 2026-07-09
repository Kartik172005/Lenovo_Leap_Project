"""
Food Recommendation Agent
--------------------------
This module contains the core "agentic" logic that autonomously analyzes a food
donation and recommends the most suitable NGO, without a human manually choosing one.

It first tries to build a smart, reasoned recommendation using an LLM (OpenAI GPT
or Google Gemini, configurable via AI_PROVIDER). If no API key is configured or the
call fails, it falls back to a deterministic rule-based scoring function so the
agent always returns a usable answer.
"""

import os
import json
import math
from datetime import datetime, timezone

AI_PROVIDER = os.getenv("AI_PROVIDER", "openai").lower()


def haversine_km(lat1, lon1, lat2, lon2):
    if None in (lat1, lon1, lat2, lon2):
        return None
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def compute_priority(expiry_time_iso: str) -> str:
    try:
        expiry = datetime.fromisoformat(expiry_time_iso.replace("Z", "+00:00"))
    except Exception:
        return "Medium"
    now = datetime.now(timezone.utc)
    hours_left = (expiry - now).total_seconds() / 3600
    if hours_left <= 3:
        return "High"
    if hours_left <= 8:
        return "Medium"
    return "Low"


def rule_based_recommend(donation: dict, ngos: list) -> dict:
    """Deterministic fallback: scores each NGO on category match, capacity and distance."""
    if not ngos:
        return {
            "recommended_ngo_id": None,
            "priority": compute_priority(donation["expiryTime"]),
            "reason": "No verified NGOs are currently available in the system.",
            "confidence": 0,
        }

    priority = compute_priority(donation["expiryTime"])
    scored = []

    for ngo in ngos:
        dist = haversine_km(
            donation.get("latitude"), donation.get("longitude"), ngo.get("latitude"), ngo.get("longitude")
        )
        accepts_category = (
            not ngo.get("foodTypesAccepted") or donation["category"] in ngo["foodTypesAccepted"]
        )
        has_capacity = donation["quantity"] <= ngo.get("capacityPerDay", 0)
        within_radius = True if dist is None else dist <= ngo.get("serviceRadiusKm", 10)

        score = 0
        if accepts_category:
            score += 40
        if has_capacity:
            score += 30
        if within_radius:
            score += 20
        if dist is not None:
            score += max(0, 10 - dist / 5)

        scored.append({"ngo": ngo, "dist": dist, "score": score})

    scored.sort(key=lambda x: x["score"], reverse=True)
    best = scored[0]
    ngo = best["ngo"]

    reason_bits = []
    if ngo.get("foodTypesAccepted") and donation["category"] in ngo["foodTypesAccepted"]:
        reason_bits.append(f"accepts {donation['category']} food")
    if donation["quantity"] <= ngo.get("capacityPerDay", 0):
        reason_bits.append("has sufficient capacity")
    if best["dist"] is not None:
        reason_bits.append(f"is {best['dist']:.1f} km from the pickup location")

    reason = f"{ngo['name']} was selected because it " + ", ".join(reason_bits) + "."

    return {
        "recommended_ngo_id": ngo["id"],
        "priority": priority,
        "reason": reason,
        "confidence": round(min(100, best["score"]), 1),
    }


def llm_recommend(donation: dict, ngos: list) -> dict:
    """Ask GPT or Gemini to reason about which NGO is the best fit, returning strict JSON."""
    prompt = f"""
You are the "Food Recommendation Agent" inside a food-waste-donation platform.

A restaurant/hotel just submitted this food donation:
{json.dumps(donation, indent=2)}

Here are the currently verified NGOs available to receive it:
{json.dumps(ngos, indent=2)}

Analyze the food category, quantity, expiry time and pickup location, then decide:
1. Which single NGO (by "id") is the best match.
2. The urgency/priority of this donation: "High", "Medium", or "Low".
3. A short, one-sentence reason for your choice.
4. A confidence score from 0-100.

Respond ONLY with valid JSON in exactly this format, nothing else:
{{"recommended_ngo_id": "<id or null>", "priority": "High|Medium|Low", "reason": "<short reason>", "confidence": <0-100>}}
"""

    if AI_PROVIDER == "gemini":
        import google.generativeai as genai

        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-1.5-flash"))
        response = model.generate_content(prompt)
        text = response.text
    else:
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        text = completion.choices[0].message.content

    cleaned = text.strip().strip("`").replace("json\n", "").strip()
    return json.loads(cleaned)


def get_recommendation(donation: dict, ngos: list) -> dict:
    """Main entry: try LLM reasoning, fall back to deterministic rules on any failure."""
    has_key = (AI_PROVIDER == "openai" and os.getenv("OPENAI_API_KEY")) or (
        AI_PROVIDER == "gemini" and os.getenv("GEMINI_API_KEY")
    )

    if has_key:
        try:
            result = llm_recommend(donation, ngos)
            result.setdefault("priority", compute_priority(donation["expiryTime"]))
            return result
        except Exception as exc:
            print(f"[ai-service] LLM recommendation failed, using rule-based fallback: {exc}")
            return rule_based_recommend(donation, ngos)

    return rule_based_recommend(donation, ngos)
