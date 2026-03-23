# SayRight Frontend

## Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Frontend will start at: http://localhost:5173

### 3. Build for Production

```bash
npm run build
```

---

## Make Sure Backend is Running

The frontend connects to: `http://localhost:8000`

Make sure your backend is running before testing!

---

## Features

- Text input for messages
- 5 tone options (Friendly, Caring, Funny, Flirty, Professional)
- 3 AI-generated reply suggestions
- Explanation for each reply
- One-click copy
- Regenerate button
- Mobile responsive

---

## Troubleshooting

**"Network Error"**
→ Make sure backend is running on port 8000

**"npm install fails"**
→ Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Styling not working**
→ Make sure Tailwind is properly configured in `tailwind.config.js`
