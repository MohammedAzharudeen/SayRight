# ⚡ SayRight - Quick Deploy Guide

**Get live in 15 minutes!**

---

## 🎯 Prerequisites (5 min)

1. **Create accounts:**
   - GitHub (code hosting)
   - Railway (backend)
   - Vercel (frontend)
   - Google Analytics (tracking)

2. **Have ready:**
   - Groq API key (you have this)
   - Google Analytics Measurement ID (get from GA)

---

## 🚀 Deploy (10 min)

### **Step 1: Push to GitHub (2 min)**

```bash
cd /Users/mohammedazharudeena/Documents/SayRight

# Initialize git if not done
git init
git add .
git commit -m "Production ready - SayRight v1.0"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/sayright.git
git push -u origin main
```

---

### **Step 2: Deploy Backend - Railway (3 min)**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your `sayright` repository
4. **Configure:**
   - Root Directory: `backend`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Add Variables:**
   - `GROQ_API_KEY` = your_groq_key
   - `FRONTEND_URL` = (leave empty for now)
6. Deploy!
7. **Copy the Railway URL** (e.g., `https://sayright-backend.railway.app`)

---

### **Step 3: Deploy Frontend - Vercel (3 min)**

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your `sayright` repository
4. **Configure:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Variable:**
   - `VITE_API_URL` = your_railway_url (from Step 2)
6. Deploy!
7. **Copy the Vercel URL** (e.g., `https://sayright.vercel.app`)

---

### **Step 4: Update CORS (2 min)**

1. Go back to Railway
2. Add environment variable:
   - `FRONTEND_URL` = your_vercel_url (from Step 3)
3. Railway will auto-redeploy

---

### **Step 5: Add Google Analytics (2 min)**

1. Get Measurement ID from https://analytics.google.com
2. Edit `frontend/index.html`
3. Replace `G-XXXXXXXXXX` with your real ID (2 places)
4. Push changes:

```bash
git add frontend/index.html
git commit -m "Add Google Analytics"
git push
```

Vercel will auto-deploy.

---

## ✅ Test (3 min)

Visit your Vercel URL and test:
- [ ] Generate replies
- [ ] Copy works
- [ ] Regenerate works
- [ ] No errors in console
- [ ] Check GA Realtime (wait 5 min for events)

---

## 🎉 Launch!

**Share with 5 friends and ask:**

> "Did you copy any reply?"

---

## 📊 Monitor

**Google Analytics:**
- `copy_clicked` (KEY METRIC)
- `generate_clicked`

**Target:** 70%+ copy rate

---

## 🐛 Issues?

See **DEPLOYMENT.md** for troubleshooting.

---

**Total time: ~15 minutes** ⚡

**You're live!** 🚀
