# AI Campaign Matcher - Setup Guide

## Overview
The AI Campaign Matcher is a new feature that allows brands to describe their campaign requirements in simple, layman's terms, and the app uses AI to intelligently match them with suitable influencers.

## How It Works

1. **Brand Writes Campaign Brief**: A brand logs in and navigates to the "🤖 AI Matcher" page
2. **AI Analysis**: The AI (powered by OpenAI's GPT-4) analyzes the campaign description and extracts:
   - Budget range
   - Niche/category requirements
   - Social media platforms
   - Engagement level expectations
   - Campaign type
   - Location preferences
   - Target audience
   - Any additional requirements

3. **Intelligent Matching**: The system queries the database to find influencers matching all extracted criteria
4. **AI Recommendations**: The AI then generates a personalized recommendation explaining:
   - Why each influencer is perfect for the campaign
   - Key strengths of each match
   - Expected outcomes
   - Collaboration tips

5. **Browse & Connect**: Brands can view the matched influencers and connect with them directly

## Setup Instructions

### Prerequisites
- Node.js installed
- OpenAI API key (from https://platform.openai.com/account/api-keys)

### Server Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install openai
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the `/server` directory:
   ```
   MONGO_URI=mongodb://localhost:27017/influ-buddies
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

   Replace `sk-your-openai-api-key-here` with your actual OpenAI API key.

3. **Start the Server**
   ```bash
   npm run dev
   ```

### Files Created/Modified

#### New Files:
- `/server/routes/chatbot.js` - Chatbot API endpoints
- `/server/utils/chatbotHelper.js` - AI analysis logic
- `/client/src/pages/ChatBotPage.jsx` - Chatbot UI component
- `/client/src/pages/ChatBotPage.css` - Chatbot styling

#### Modified Files:
- `/server/package.json` - Added openai dependency
- `/server/index.js` - Registered chatbot routes
- `/client/src/App.jsx` - Added chatbot route
- `/client/src/components/Layout.jsx` - Added AI Matcher navigation link
- `/client/src/components/Layout.css` - Added AI Matcher link styling

## Features

### AI-Powered Analysis
- Understands natural language campaign descriptions
- Extracts key criteria automatically
- Handles vague descriptions intelligently

### Smart Matching Algorithm
- Filters influencers by niche
- Matches platform preferences
- Considers engagement rates
- Respects location preferences

### Personalized Recommendations
- AI-generated, human-readable explanations
- Customized insights for each campaign
- Collaboration suggestions

### User-Friendly Interface
- Beautiful, responsive design
- Example requests for guidance
- Clear criteria visualization
- Easy-to-use textarea input

## Example Campaign Descriptions

### Example 1: Fitness App
```
I want to promote a new fitness app. I have a budget of $5000, 
need high engagement influencers on Instagram and TikTok, based 
in US, with focus on health and wellness niche.
```

### Example 2: Sustainable Fashion
```
Looking for sustainable fashion brand advocates. Budget around $2000, 
prefer micro-influencers (good engagement), any platform, 
environmental/sustainability focus.
```

### Example 3: Tech Product Launch
```
Tech product launch campaign. Need 3-5 influencers for YouTube and 
Instagram, willing to spend $10000, focus on tech and gaming niches, 
prefer high follower counts.
```

## API Endpoints

### POST `/api/chatbot/analyze`
Analyzes campaign requirements and returns matched influencers.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "brandRequest": "I want to promote my new beauty product with a budget of $3000..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Great! We found some perfect influencers for your campaign!",
  "criteria": {
    "budget": "around $3000",
    "niches": ["beauty", "cosmetics"],
    "platforms": ["instagram", "youtube"],
    "engagementLevel": "high",
    "campaignType": "product launch",
    "location": "any",
    "targetAudience": "beauty enthusiasts, women 18-35",
    "additionalRequirements": []
  },
  "influencers": [
    {
      "_id": "...",
      "name": "Influencer Name",
      "niche": "beauty",
      "platforms": ["instagram", "youtube"],
      "followerCount": 150000,
      "engagementRate": 6.5,
      ...
    }
  ],
  "recommendation": "These influencers are perfect because..."
}
```

### POST `/api/chatbot/quick-search`
Quick search without AI analysis.

**Request Body:**
```json
{
  "niche": "beauty",
  "platforms": ["instagram"],
  "minEngagement": 5,
  "location": "India"
}
```

## Troubleshooting

### "OPENAI_API_KEY is missing" Error
- Ensure your `.env` file in `/server` directory contains `OPENAI_API_KEY`
- Restart the server after updating `.env`

### API Rate Limit Errors
- You may hit OpenAI's rate limits during testing
- Check your OpenAI account usage at https://platform.openai.com/usage

### No Influencers Matched
- The AI couldn't find influencers matching all criteria
- Try adjusting requirements (broader niche, lower engagement expectations, any location)
- Ensure sufficient influencers exist in database matching the criteria

### "Only brands can use the chatbot matcher"
- Make sure you're logged in as a brand account
- Sign up with role = "brand" to access this feature

## Future Enhancements

Potential features to add:
1. Chat history and saved campaigns
2. Batch campaign analysis
3. Budget optimization suggestions
4. Influencer availability calendar integration
5. Direct messaging with influencers
6. Campaign performance tracking
7. Multi-language support
8. Advanced filters (follower growth rate, audience demographics, etc.)

## Support

For issues or questions about the AI Matcher feature:
1. Check the troubleshooting section
2. Verify OpenAI API key is correct
3. Check server logs for detailed error messages
4. Ensure all dependencies are installed correctly
