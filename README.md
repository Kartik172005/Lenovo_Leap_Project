# 🌱 Agentic AI Smart Food Waste Management System

A Final Year Computer Science Engineering project that connects restaurants/hotels with NGOs to
donate surplus food. An autonomous **Food Recommendation Agent** analyzes every donation and
automatically recommends the best NGO based on food category, quantity, urgency, and location.

---

## 📁 Project Structure

```
food-waste-app/
├── client/          # React.js + Tailwind CSS frontend
├── server/          # Node.js + Express.js backend (MongoDB, JWT, Cloudinary)
└── ai-service/      # Python FastAPI microservice — the Food Recommendation Agent (OpenAI/Gemini)
```

---

## ⚙️ Tech Stack

| Layer          | Technology                                   |
|----------------|-----------------------------------------------|
| Frontend       | React.js, Tailwind CSS, React Router, Axios   |
| Backend        | Node.js, Express.js                           |
| Database       | MongoDB (Mongoose)                            |
| Auth           | JWT                                           |
| Image Storage  | Cloudinary                                    |
| AI Agent       | Python, FastAPI, OpenAI GPT / Google Gemini   |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB (local install or MongoDB Atlas connection string)
- A free Cloudinary account (for image uploads)
- An OpenAI or Google Gemini API key (optional — the agent has a built-in rule-based fallback
  that works even without an API key)

### 2. Backend Setup (`server/`)

```bash
cd server
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm run dev
```
The API runs at `http://localhost:5000`.

### 3. AI Agent Microservice Setup (`ai-service/`) — optional but recommended

```bash
cd ai-service
python -m venv venv
source venv/bin/activate      # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# edit .env: set AI_PROVIDER=openai (or gemini) and add your API key
uvicorn app:app --reload --port 8000
```
The AI agent runs at `http://localhost:8000`.

> If this service is not running, the Node backend automatically falls back to a built-in,
> deterministic rule-based recommender — so the app still works end-to-end without it.

### 4. Frontend Setup (`client/`)

```bash
cd client
npm install
cp .env.example .env
# edit .env if your API is not on localhost:5000
npm run dev
```
The app runs at `http://localhost:5173`.

---

## 👤 User Roles

- **Admin** — dashboard, manage donors/NGOs, view analytics, delete users
- **Donor** (restaurant/hotel) — add donations, upload images, track status
- **NGO** — view assigned donations, accept/reject/complete pickups

## 🤖 How the AI Agent Works

1. Donor submits a food donation (category, quantity, expiry, pickup location, image).
2. The Node.js backend calls the **Food Recommendation Agent** (Python/FastAPI service).
3. The agent (via GPT/Gemini, or its rule-based fallback) scores every verified NGO on:
   - Food category match
   - Available capacity
   - Distance from the pickup location
   - Urgency based on time remaining until expiry
4. The best-scoring NGO is automatically assigned, along with a priority level and a
   human-readable reason.
5. The NGO can then accept, reject, or complete the donation from their dashboard.

## 🗄️ Database Collections

- **Users** — donors, NGOs (auth), and admins
- **NGO** — extended NGO profile (capacity, service radius, food types accepted)
- **Donations** — food donation records with AI recommendation output

---

## 📌 Notes for Deployment

- Set `NODE_ENV=production` and use a strong `JWT_SECRET` in production.
- Update `CLIENT_URL` in the server `.env` to your deployed frontend URL for CORS.
- Update `VITE_API_BASE_URL` in the client `.env` to your deployed backend URL.
- The `ai-service` can be deployed separately (e.g., Render, Railway) and referenced via
  `AI_SERVICE_URL` in the server `.env`.
