# 🎯 SayRight

**AI-powered reply assistant that sounds like you**

Generate 3 natural, human-like message replies with explanations in under 3 seconds.

**Version 1.0** - Production Ready ✅

---

## ✨ Features

- 💬 **Reply Mode** - Generate replies to messages you received
- ✏️ **Rephrase Mode** - Improve your own messages
- 🎭 **5 Tones** - Friendly, Caring, Funny, Flirty, Professional
- ⚡ **Keyboard Shortcuts** - ⌘Enter to generate, ⌘1/2/3 to copy
- 🎯 **Smart Recommendations** - First reply marked as "Best"
- 📊 **Confidence Bars** - Visual hierarchy for each reply
- 🔄 **Regenerate** - Get different options instantly

---

## 🚀 Quick Start

### 1. Get Groq API Key
- Go to https://console.groq.com
- Sign up (free)
- Create API key

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key" > .env
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open Browser
Visit http://localhost:5173

---

## 📁 Project Structure

```
SayRight/
├── backend/          # FastAPI server
│   ├── main.py      # All backend code
│   ├── .env         # GROQ_API_KEY
│   └── requirements.txt
├── frontend/        # React app
│   └── src/App.jsx  # All frontend code
├── PLAN.md          # Complete development plan
└── README.md        # This file
```

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Python + FastAPI
- **AI:** Groq API (llama-3.3-70b-versatile)
- **Deploy:** Vercel + Railway

---

## 📖 Documentation

- **SETUP.md** - Local development setup
- **DEPLOYMENT.md** - Production deployment guide
- **QUICK_DEPLOY.md** - Fast 15-min deploy guide

---

## 🐛 Troubleshooting

**Backend won't start**
→ Check GROQ_API_KEY in .env

**Frontend can't connect**
→ Make sure backend is running on port 8000

**Slow responses**
→ Check internet connection (Groq is usually 1-2s)

---

## 💰 Cost

- **Development:** Free (Groq free tier)
- **Production:** ~₹500-1000/month (100 users)

---

## 📝 Version

**v1.0** - March 23, 2026

---

**Built with ❤️ to make conversations easier**
