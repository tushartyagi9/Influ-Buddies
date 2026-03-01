// Free keyword-based analyzer - no API calls needed
function parseKeywords(text) {
  const lowerText = text.toLowerCase();
  
  // Define keywords for different categories
  const budgetKeywords = {
    high: /(\$\d+000|\d{4,}|high.*budget|large.*budget|substantial|significant)/gi,
    medium: /(\$\d{3}0{2}|\d{3,4}(?!000)|medium.*budget|moderate)/gi,
    low: /(\$\d{1,3}0{2}|low.*budget|small.*budget|tight.*budget)/gi
  };

  const nicheKeywords = {
    'fitness': /fitness|gym|workout|exercise|health|wellness|sports|athletic/gi,
    'beauty': /beauty|cosmetics|makeup|skincare|hair|fashion|style|glamour|makeup artist/gi,
    'tech': /technology|tech|gadget|software|app|digital|programming|code|startup/gi,
    'food': /food|cook|recipe|restaurant|dining|culinary|chef|beverage|drink/gi,
    'travel': /travel|tourism|destination|hotel|adventure|explore|wanderlust|trip/gi,
    'lifestyle': /lifestyle|daily life|routine|living|home|interior|design|diy/gi,
    'entertainment': /entertainment|gaming|music|movies|film|tv|comedy|streaming/gi,
    'education': /education|learning|course|tutorial|skills|training|teach|academic/gi,
    'sustainability': /sustainability|eco|environment|green|organic|sustainable|carbon/gi,
  };

  const platformKeywords = {
    instagram: /instagram|ig|insta/gi,
    tiktok: /tiktok|tik tok|short video/gi,
    youtube: /youtube|yt/gi,
    twitter: /twitter|x|tweet|social media/gi,
    linkedin: /linkedin|professional|business network/gi,
    facebook: /facebook|fb/gi,
  };

  const engagementKeywords = {
    high: /high.*engagement|strong.*engagement|active|engaged|interactive/gi,
    medium: /medium.*engagement|moderate engagement/gi,
    low: /low.*engagement|casual/gi,
  };

  // Extract niches
  const detectedNiches = [];
  for (const [niche, regex] of Object.entries(nicheKeywords)) {
    if (regex.test(lowerText)) {
      detectedNiches.push(niche);
    }
  }

  // Extract platforms
  const detectedPlatforms = [];
  for (const [platform, regex] of Object.entries(platformKeywords)) {
    if (regex.test(lowerText)) {
      detectedPlatforms.push(platform);
    }
  }

  // Extract engagement level
  let engagementLevel = 'medium';
  for (const [level, regex] of Object.entries(engagementKeywords)) {
    if (regex.test(lowerText)) {
      engagementLevel = level;
      break;
    }
  }

  // Extract budget
  let budget = 'not specified';
  for (const [level, regex] of Object.entries(budgetKeywords)) {
    if (regex.test(lowerText)) {
      budget = level === 'high' ? '$5000+' : level === 'medium' ? '$1000-5000' : '$500-1000';
      break;
    }
  }

  // Extract location
  const locationMatch = lowerText.match(/\b(us|usa|united states|uk|india|canada|australia|germany|france|japan|singapore|dubai|australia)\b/i);
  const location = locationMatch ? locationMatch[1] : null;

  // Extract campaign type
  let campaignType = 'general promotion';
  if (/launch|new.*product|product.*launch|release/.test(lowerText)) {
    campaignType = 'product launch';
  } else if (/awareness|brand awareness|brand.*building/.test(lowerText)) {
    campaignType = 'brand awareness';
  } else if (/promotion|promote|advertise|advertisement/.test(lowerText)) {
    campaignType = 'product promotion';
  } else if (/collaboration|partnership|collab/.test(lowerText)) {
    campaignType = 'collaboration';
  }

  return {
    budget,
    niches: detectedNiches.length > 0 ? detectedNiches : ['general'],
    platforms: detectedPlatforms.length > 0 ? detectedPlatforms : ['instagram'],
    engagementLevel,
    campaignType,
    location,
    targetAudience: 'general audience',
    additionalRequirements: []
  };
}

export async function analyzeMarketingRequest(brandRequest) {
  try {
    console.log('Analyzing campaign request (free parser):', brandRequest);
    const criteria = parseKeywords(brandRequest);
    console.log('Extracted criteria:', criteria);
    return criteria;
  } catch (error) {
    console.error('Error analyzing marketing request:', error.message);
    throw new Error(`Failed to analyze marketing request: ${error.message}`);
  }
}

export async function generateInfluencerRecommendationResponse(criteria, influencersData) {
  try {
    console.log('Generating response for', influencersData.length, 'influencers');
    
    // Build influencer list with their stats
    let influencerList = '';
    if (influencersData.length > 0) {
      influencerList = influencersData.map((inf, idx) => {
        return `${idx + 1}. **${inf.name}** - ${inf.niche.toUpperCase()}\n   📱 Platforms: ${inf.platforms.join(', ')}\n   👥 Followers: ${(inf.followerCount / 1000).toFixed(0)}K\n   📊 Engagement: ${inf.engagementRate}%\n   📍 Location: ${inf.location}`;
      }).join('\n\n');
    }

    // Get alternative niches
    const nicheOptions = [
      'fitness', 'beauty', 'tech', 'food', 'travel', 
      'lifestyle', 'entertainment', 'education', 'sustainability', 'music', 'gaming', 'wellness'
    ];
    const currentNiches = criteria.niches;
    const alternatives = nicheOptions.filter(n => !currentNiches.includes(n)).slice(0, 4);

    let response = '';

    if (influencersData.length > 0) {
      response = `
Awesome! I found ${influencersData.length} influencer(s) matching your ${criteria.niches.join(', ')} campaign on ${criteria.platforms.join(' & ')}:

${influencerList}

---

**Want to explore more options?**

You can also look at these niches:
• ${alternatives.join('\n• ')}

**Quick questions to help you narrow down:**
1. Do you prefer micro-influencers (under 500K followers) or bigger accounts?
2. Any specific platform you want to focus on (Instagram, YouTube, TikTok)?
3. Should we look at different engagement levels (higher vs lower)?
4. Any particular location preference?
5. Want to explore a different niche I suggested above?

Just let me know what works best for you! 😊
      `;
    } else {
      response = `
Hmm, I couldn't find influencers in the "${criteria.niches.join(', ')}" niche right now. But don't worry! Here are some similar niches you might want to explore:

• ${alternatives.join('\n• ')}

**Let's find the right match for you!**

Tell me:
1. Would you like to explore one of these alternative niches?
2. Are you flexible with your budget?
3. Do you have a specific platform in mind (Instagram, YouTube, TikTok)?
4. What's your main goal - reach, engagement, or brand awareness?

I can help you find great influencers once I know more! 💫
      `;
    }

    return response.trim();
  } catch (error) {
    console.error('Error generating response:', error.message);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}
