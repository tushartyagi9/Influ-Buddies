# Quick Start Guide - AI Campaign Matcher

## For Developers - Get Started in 5 Minutes

### 1. Get OpenAI API Key
- Go to https://platform.openai.com/account/api-keys
- Create a new API key (starts with `sk-`)
- Copy it

### 2. Update Server .env
Edit `/server/.env`:
```
OPENAI_API_KEY=sk-paste-your-key-here
```

### 3. Install Dependencies
```bash
cd server
npm install
```

### 4. Start Server
```bash
npm run dev
```

### 5. Test It Out
- Open http://localhost:5173 (or your client URL)
- Sign up as a **Brand**
- Click **"🤖 AI Matcher"** in navigation
- Try: "I want to promote a fitness app with $5000 budget on Instagram and TikTok"

---

## For Brands - How to Use

### Step 1: Login as Brand
Sign in with your brand account (not influencer)

### Step 2: Click "🤖 AI Matcher"
Found in the top navigation menu

### Step 3: Describe Your Campaign
Write what you need in simple language:
- What are you promoting?
- What's your budget?
- Which platforms do you want?
- What's your target audience?
- Any special requirements?

**Examples:**
- "I want to promote a fitness app with $5000 budget on Instagram and TikTok focusing on fitness niche"
- "Looking for tech influencers on YouTube to launch my new gadget, budget $3000"
- "Need sustainable fashion advocates on Instagram, budget $2000"

### Step 4: Review Results
The AI will:
1. Show extracted requirements
2. Display matched influencers
3. Give personalized recommendations

### Step 5: Connect
Click on any influencer card to view full profile and connect with them

---

## API Endpoints Reference

```
POST /api/chatbot/analyze
- Requires: Bearer token (brand user)
- Body: { "brandRequest": "your campaign description" }
- Returns: matched influencers + AI recommendation

POST /api/chatbot/quick-search
- No auth required
- Body: { "niche": "...", "platforms": [...], "minEngagement": 5 }
- Returns: filtered influencers
```

---

## Key Files

**Backend:**
- `/server/routes/chatbot.js` - API endpoints
- `/server/utils/chatbotHelper.js` - AI logic

**Frontend:**
- `/client/src/pages/ChatBotPage.jsx` - Main UI
- `/client/src/pages/ChatBotPage.css` - Styles

---

## Cost Consideration

OpenAI API calls cost money! Typical costs:
- Each campaign analysis ≈ $0.01-0.05
- Check usage at: https://platform.openai.com/usage

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "API key missing" | Add `OPENAI_API_KEY` to `/server/.env` and restart |
| "Can't use tool" | Make sure you're logged in as a brand (not influencer) |
| No results | Try simpler criteria - "fitness influencers on Instagram" |
| API errors | Check your OpenAI account has credits/balance |

---

## Next Steps

Want to enhance it? Consider:
- [ ] Save campaign history
- [ ] Budget calculator
- [ ] Influencer availability check
- [ ] Direct messaging integration
- [ ] Campaign performance dashboard

Enjoy! 🚀
