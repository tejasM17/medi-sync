# Medi-Sync: AI Multi-Agent Triage System

Medi-Sync is an intelligent medical triage platform that uses a multi-agent AI pipeline to analyze patient symptoms, perform medical research, and generate structured clinical reports. It combines a high-performance **Python AI Engine** with a modern **React Frontend** for real-time clinical decision support.

## 🚀 Key Features

- **Multi-Agent Pipeline:** Collaboration between Researcher, Reflection, and Triage agents.
- **Real-Time Monitoring:** Live "Thinking" logs streamed from agents to the dashboard via SSE.
- **Structured Clinical Reports:** Professional medical assessments (REP-XXXX) with urgency levels.
- **Dynamic Research:** Automatic searching of medical guidelines (Mayo Clinic, WHO, etc.).
- **Responsive Dashboard:** Modern UI for doctors to manage cases and view deep-dive analysis.

---

## 🏗️ Architecture & Repositories

The system consists of two primary components:

1.  **Frontend (React/Vite):** [https://github.com/tejasM17/medi-sync](https://github.com/tejasM17/medi-sync)
    - Modern dashboard for visualizing cases and AI logs.
    - Connects to Python AI Service for real-time data.
2.  **AI Backend (Python/FastAPI):** [https://github.com/SharathKumar-M/ai-agent](https://github.com/SharathKumar-M/ai-agent)
    - Orchestrates the Multi-Agent system (LangChain & Google Gemini).
    - Handles SSE log streaming and structured report generation.

---

## 🛠️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Setup AI Backend (Python)
```bash
# Clone the repository
git clone https://github.com/SharathKumar-M/ai-agent.git
cd ai-agent

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install fastapi uvicorn requests langchain-google-genai pydantic python-dotenv duckduckgo-search

# Create .env file
echo "GOOGLE_API_KEY=your_gemini_api_key_here" > .env

# Run the server
python main.py
```
*Backend will be live at: `http://localhost:8000`*

---

### 2. Setup Frontend (React)
```bash
# Clone the repository
git clone https://github.com/tejasM17/medi-sync.git
cd medi-sync/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*Frontend will be live at: `http://localhost:5173`*

---

### 3. Setup Node.js Middleware (Optional/Data Persistence)
If you require MongoDB persistence for permanent case storage:
```bash
cd medi-sync/backend
npm install
# Configure MONGO_URI in .env
npm run dev
```
*Middleware will be live at: `http://localhost:5000`*

---

## 📡 API Map (Python Backend)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/incoming-patient` | Submit a new case (triggers AI agents) |
| `GET` | `/api/ai-logs` | SSE Stream for live agent thinking logs |
| `GET` | `/api/incoming-patient` | Fetch all patient case history |
| `GET` | `/api/reports/{id}` | Get structured professional clinical report |

---

## 🧠 The Multi-Agent Workflow

1.  **Submission:** Patient symptoms are sent to the pipeline.
2.  **Researcher Agent:** Searches the web for clinical guidelines and red flags.
3.  **Reflection Agent:** Self-critiques the research to ensure accuracy and medical safety.
4.  **Triage Officer:** Makes the final decision on Urgency (High/Medium/Low) and provides guidance.
5.  **Output:** A structured report is generated and displayed on the doctor's dashboard.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
