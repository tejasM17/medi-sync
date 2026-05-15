# Medi-Sync

**Autonomous AI Healthcare Triage System**  
A multi-agent autonomous pipeline that reads patient emails, triages urgency, generates reports, and notifies doctors — built for real-world impact.

---

## 🚀 Project Overview

**Medi-Sync** is an intelligent healthcare triage system that automatically processes incoming patient emails using multiple AI agents. It prioritizes emergencies, generates professional medical reports (PDF), and allows doctors to review and send reports back to patients directly from the dashboard.

**Perfect for Hackathon (Omium Multi-Agent Track)** — Webhook-driven, Multi-Agent, Tool-calling, Async workflow, Observability ready.

### Key Features
- Patient email intake via Webhook
- Multi-Agent AI System (Researcher + Triage Officer + Report Generator)
- Real-time urgency classification (Emergency / Urgent / Routine)
- Automatic PDF Report Generation
- Doctor Dashboard (Grok-inspired UI)
- One-click "Send Report to Patient" via EmailJS (Free)
- Full observability (ready for Omium SDK tracing)

---

## 🛠 Tech Stack

### Backend
- **Node.js + Express**
- **MongoDB Atlas** (Mongoose)
- **BullMQ + Redis** (Async Queue)
- **EmailJS** (Free email delivery)

### Frontend
- **React + Vite**
- **Tailwind CSS**
- **Lucide Icons + Framer Motion**

---

## 📁 Project Structure

```
medi-sync/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite Dashboard
└── README.md
```


---

## ⚡ Quick Setup

### 1. Clone the Repository
```bash
git clone https://github.com/tejasM17/medi-sync.git
cd medi-sync
```

### 2. Backend Setup
```
cd backend
npm install

# Create .env file (see .env.example)
cp .env.example .env
```

Important .env variables:

MONGO_URI (MongoDB Atlas)
EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY

```
npm run dev
```
Backend runs on http://localhost:5000

### 3. Frontend Setup

```
cd ../frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000


🎯 How to Test (Demo Flow)

Start both Backend & Frontend
Go to Doctor Dashboard
Click "Simulate Patient Email"
Check Backend console → AI Agents will process
Refresh Dashboard → See new case
Doctor can view report and send to patient


🔮 Future Enhancements

PDF Report Generation
Multi-Agent AI with LangGraph
Omium SDK Tracing (Bonus Points)
Real Email Webhook Integration
Doctor Authentication


Built for Hackathon — Multi-Agent · Autonomy · Real Side Effects
Team ZENITH | May 2026