# 🚀 SayRight - Complete Setup Guide

**Get running locally in 10 minutes!**

For production deployment, see **DEPLOYMENT.md**

---

## ✅ Prerequisites

Before starting, make sure you have:
- Python 3.10+ installed
- Node.js 18+ installed
- A Groq API key (free - get it from https://console.groq.com)

---

## 📋 Step-by-Step Setup

### Step 1: Get Groq API Key (2 minutes)

1. Go to https://console.groq.com
2. Sign up (it's free!)
3. Create an API key
4. Copy the key (you'll need it in Step 3)

---

### Step 2: Setup Backend (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

**Important:** Edit `backend/.env` and add your Groq API key:
```
GROQ_API_KEY=your_actual_groq_key_here
```

```bash
# Start backend server
uvicorn main:app --reload
```

✅ Backend should now be running at http://localhost:8000

---

### Step 3: Setup Frontend (3 minutes)

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should now be running at http://localhost:5173

---

## 🧪 Test It!

1. Open http://localhost:5173 in your browser
2. Type a message like: "What are you doing this weekend?"
3. Select tone: "FRIENDLY"
4. Click "Get Perfect Reply →"
5. You should see 3 reply suggestions!

---

## 🎯 Quick Test Messages

Try these to test different tones:

1. **Emotional (CARING):** "Why don't you get angry at me?"
2. **Casual (FRIENDLY):** "What are you doing this weekend?"
3. **Professional (PROFESSIONAL):** "Can we reschedule tomorrow's meeting?"
4. **Flirty (FLIRTY):** "You looked really good today"
5. **Awkward (CARING):** "I think we should talk about what happened"

---

## 🐛 Troubleshooting

### Backend Issues

**"Unauthorized" error**
→ Check your GROQ_API_KEY in `backend/.env`

**"Module not found"**
→ Make sure virtual environment is activated: `source venv/bin/activate`

**Backend won't start**
→ Make sure port 8000 is not already in use

### Frontend Issues

**"Network Error"**
→ Make sure backend is running on port 8000

**"npm install fails"**
→ Delete `node_modules` and `package-lock.json`, try again

**Blank page**
→ Check browser console for errors

---

## 📁 Project Structure

```
SayRight/
├── backend/
│   ├── main.py              # All backend code
│   ├── .env                 # Your Groq API key (create this!)
│   ├── .env.example         # Template
│   ├── requirements.txt     # Python dependencies
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── README.md
│
├── PLAN.md                  # Complete development plan
├── SETUP.md                 # This file
└── README.md                # Project overview
```

---

## ✅ Success Checklist

- [ ] Groq API key obtained
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] Can generate replies successfully
- [ ] Can copy replies to clipboard
- [ ] Tested with 3-5 different messages

---

## 🚀 Next Steps

Once everything works:

1. **Test thoroughly** - Try 5-10 different messages
2. **Deploy** - Follow deployment guide in PLAN.md
3. **Share with friends** - Get real user feedback
4. **Iterate** - Improve based on feedback

---

## 💡 Tips

- Keep both terminal windows open (backend + frontend)
- If you close terminals, you'll need to restart both servers
- Backend changes require restart (unless using --reload)
- Frontend changes auto-reload in browser

---

**Need help? Check the detailed guides:**
- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
- Complete plan: `PLAN.md`

---

**Ready to launch? Let's go! 🔥**
