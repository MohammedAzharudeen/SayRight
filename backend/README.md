# SayRight Backend

## Setup (5 minutes)

### 1. Get Groq API Key
1. Go to https://console.groq.com
2. Sign up (free)
3. Create API key
4. Copy the key

### 2. Install Dependencies

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=your_actual_key_here
```

### 4. Run Server

```bash
uvicorn main:app --reload
```

Server will start at: http://localhost:8000

### 5. Test It

```bash
curl -X POST http://localhost:8000/api/generate-reply \
  -H "Content-Type: application/json" \
  -d '{"message": "What are you doing?", "tone": "FRIENDLY"}'
```

You should see 3 reply suggestions!

---

## API Endpoints

### GET /
Health check

### POST /api/generate-reply
Generate reply suggestions

**Request:**
```json
{
  "message": "Why don't you get angry at me?",
  "tone": "CARING"
}
```

**Response:**
```json
{
  "replies": [
    {
      "text": "I don't get angry because I understand you.",
      "reason": "Shows emotional maturity"
    },
    ...
  ],
  "processing_time": 1.2
}
```

**Tones:** FRIENDLY, CARING, FUNNY, FLIRTY, PROFESSIONAL

---

## Troubleshooting

**"Unauthorized" error**
→ Check your GROQ_API_KEY in .env

**"Module not found"**
→ Make sure venv is activated and dependencies are installed

**Slow responses**
→ Groq should be 1-2s. Check internet connection
