# 🌱 Agentic AI Smart Food Waste Management System

A Final Year Computer Science Engineering project that connects restaurants/hotels with NGOs to donate surplus food using AI.

## 📁 Project Structure

```text
food-waste-app/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
└── ai-service/      # Python FastAPI AI service
```

## 🚀 Technologies

- React.js
- Node.js
- Express.js
- MongoDB Atlas
- Tailwind CSS
- FastAPI
- JWT Authentication
- Cloudinary

## ▶️ Run the Project

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## 📌 Features

- User Authentication
- Food Donation Management
- NGO Dashboard
- Admin Dashboard
- AI-Based NGO Recommendation
- MongoDB Atlas Database