from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import time
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SayRight API")

# CORS - Configure for both local and production
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Build allowed origins list
allowed_origins = [
    "http://localhost:5173",  # Local development
]

# Add production frontend URL if set
if FRONTEND_URL and FRONTEND_URL != "http://localhost:5173":
    allowed_origins.append(FRONTEND_URL)

# Also allow the specific Vercel URL
allowed_origins.append("https://say-right.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Models
class ReplyRequest(BaseModel):
    message: str
    tone: str
    mode: str = "reply"  # "reply" or "rephrase"

class Reply(BaseModel):
    text: str
    reason: str

class ReplyResponse(BaseModel):
    replies: list[Reply]
    processing_time: float

# System prompt (human, not AI-polished)
SYSTEM_PROMPT = """You are a human conversation expert helping someone reply to a message.

Your job is to write replies that feel like real messages someone would actually send in chat.

Rules:
- Sound natural and human (not perfect, not robotic)
- Keep replies SHORT (1-2 sentences max)
- Match the requested tone exactly
- Write like WhatsApp/Instagram messages
- It's okay to be slightly informal

Behavior:
- Don't sound like a therapist or advisor
- Don't over-explain
- Be subtle when needed
- Assume people know each other unless message says otherwise
- If message has emotion → prioritize empathy over cleverness

STRICTLY AVOID:
- "I understand your concern"
- "I appreciate your message"
- "Thank you for sharing"
- Anything overly formal or robotic

Generate 3 DISTINCT replies:
- One direct
- One soft/playful
- One emotionally thoughtful

Also give a short 1-line reason for each.

Return ONLY valid JSON."""

# Tone-specific guidance with examples
TONE_GUIDANCE = {
    "FRIENDLY": {
        "desc": "warm, casual, approachable - like chatting with a friend",
        "style": "Use casual language, contractions (I'm, you're), be relaxed"
    },
    "CARING": {
        "desc": "empathetic, supportive, emotionally aware - show you care",
        "style": "Be gentle, understanding, show empathy and emotional support"
    },
    "FUNNY": {
        "desc": "light-hearted, humorous, playful - make them smile",
        "style": "Use humor, light jokes, playful language, maybe emojis"
    },
    "FLIRTY": {
        "desc": "playful, charming, subtly romantic - keep it classy",
        "style": "Be playful, teasing, use subtle compliments, maybe wink emoji"
    },
    "PROFESSIONAL": {
        "desc": "polite, clear, respectful - work-appropriate",
        "style": "Formal language, no contractions, be respectful and clear"
    }
}

# Improved prompt (distinct, high-quality replies)
def create_prompt(message: str, tone: str, mode: str = "reply") -> str:
    import random
    tone_info = TONE_GUIDANCE.get(tone, {"desc": "natural", "style": "be natural"})
    seed = random.randint(1000, 9999)  # Add randomness
    
    if mode == "rephrase":
        # Rephrase mode - improve/rewrite the message itself
        return f"""[Request #{seed}]
Original Message: "{message}"
Required Tone: {tone.upper()}

TONE DEFINITION FOR {tone.upper()}:
- Description: {tone_info['desc']}
- Writing Style: {tone_info['style']}

TASK: REPHRASE this message in {tone.upper()} tone.

CRITICAL INSTRUCTIONS:
1. Keep the CORE meaning and key information
2. Apply {tone.upper()} tone to make it better
3. You can adjust length to make it sound natural (shorter or longer is OK)
4. Remove unnecessary words but keep important details
5. Generate 3 DIFFERENT ways to express the same idea
6. Make it sound natural like real WhatsApp/Instagram messages
7. Focus on making it BETTER, not just different

IMPORTANT: 
- If original is wordy → make it concise but keep key points
- If original is too short → you can add warmth/context
- If original is good length → keep similar length
- Always prioritize natural flow over exact length

Generate 3 DISTINCT rephrased versions:
Version 1: Direct and clear (in {tone.upper()} tone)
Version 2: Softer or more polished (in {tone.upper()} tone)
Version 3: More expressive or warm (in {tone.upper()} tone)

Return ONLY valid JSON:
{{
  "replies": [
    {{"text": "rephrased version 1", "reason": "why this version is better"}},
    {{"text": "rephrased version 2", "reason": "why this version is better"}},
    {{"text": "rephrased version 3", "reason": "why this version is better"}}
  ]
}}"""
    else:
        # Reply mode - generate replies TO the message
        return f"""[Request #{seed}]
Message: "{message}"
Required Tone: {tone.upper()}

TONE DEFINITION FOR {tone.upper()}:
- Description: {tone_info['desc']}
- Writing Style: {tone_info['style']}

TASK: Generate REPLIES to this message in {tone.upper()} tone.

CRITICAL INSTRUCTIONS:
1. You MUST write in {tone.upper()} tone - this is NON-NEGOTIABLE
2. Generate 3 COMPLETELY DIFFERENT replies
3. Each reply must clearly show the {tone.upper()} tone
4. Keep replies SHORT (1-2 sentences max)
5. Make them sound like real WhatsApp/Instagram messages

Generate 3 DISTINCT replies:
Reply 1: Direct and straightforward (still {tone.upper()} tone)
Reply 2: Softer or playful approach (still {tone.upper()} tone)
Reply 3: Emotionally thoughtful (still {tone.upper()} tone)

Return ONLY valid JSON:
{{
  "replies": [
    {{"text": "reply 1 in {tone.upper()} tone", "reason": "why it works"}},
    {{"text": "reply 2 in {tone.upper()} tone", "reason": "why it works"}},
    {{"text": "reply 3 in {tone.upper()} tone", "reason": "why it works"}}
  ]
}}"""

@app.get("/")
async def root():
    return {"status": "SayRight API is running!"}

@app.get("/health")
async def health():
    """Health check endpoint for monitoring"""
    return {
        "status": "ok",
        "service": "SayRight API",
        "version": "1.0"
    }

@app.post("/api/generate-reply")
async def generate_reply(request: ReplyRequest) -> ReplyResponse:
    # Validate input
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Debug logging
    print(f"\n🔍 Request received:")
    print(f"   Message: {request.message}")
    print(f"   Tone: {request.tone}")
    print(f"   Mode: {request.mode}")
    
    start_time = time.time()
    
    try:
        prompt = create_prompt(request.message, request.tone, request.mode)
        print(f"   Prompt created with tone: {request.tone}, mode: {request.mode}")
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",  # Better for following instructions
                    "messages": [
                        {
                            "role": "system",
                            "content": SYSTEM_PROMPT  # Use high-quality system prompt
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.8,  # Higher for more variety
                    "response_format": {"type": "json_object"}
                },
                timeout=10.0  # Fail fast if slow
            )
        
        result = response.json()
        
        # Safe JSON parsing with validation
        try:
            content = json.loads(result['choices'][0]['message']['content'])
            
            # Validate response format
            if "replies" not in content or len(content["replies"]) != 3:
                raise ValueError("Invalid AI response format")
                
        except:
            # Fallback replies if AI response fails
            content = {
                "replies": [
                    {
                        "text": "Hmm… give me a sec to think about that.",
                        "reason": "Fallback when AI response fails"
                    },
                    {
                        "text": "I get what you're saying… let me come back to this.",
                        "reason": "Keeps conversation going"
                    },
                    {
                        "text": "That's interesting… not sure how to reply yet 😅",
                        "reason": "Natural fallback response"
                    }
                ]
            }
        
        processing_time = time.time() - start_time
        
        return ReplyResponse(
            replies=content["replies"],
            processing_time=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
