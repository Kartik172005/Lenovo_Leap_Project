"""
FastAPI microservice exposing the Food Recommendation Agent.

Run with:
    uvicorn app:app --reload --port 8000

The Node.js backend calls POST /recommend with the donation + list of NGOs,
and receives back the recommended NGO id, priority and reason.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv

from recommender import get_recommendation

load_dotenv()

app = FastAPI(title="Food Recommendation Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class DonationIn(BaseModel):
    foodName: str
    category: str
    quantity: float
    unit: Optional[str] = "kg"
    expiryTime: str
    preparationTime: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class NGOIn(BaseModel):
    id: str
    name: str
    capacityPerDay: float
    foodTypesAccepted: List[str] = []
    serviceRadiusKm: float = 10
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class RecommendRequest(BaseModel):
    donation: DonationIn
    ngos: List[NGOIn]


@app.get("/")
def root():
    return {"service": "Food Recommendation Agent", "status": "running"}


@app.post("/recommend")
def recommend(payload: RecommendRequest):
    donation = payload.donation.model_dump()
    ngos = [n.model_dump() for n in payload.ngos]
    result = get_recommendation(donation, ngos)
    return result
