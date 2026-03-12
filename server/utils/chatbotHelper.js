// ===== Enhanced AI Chatbot Helper – keyword parser + scoring + smart responses =====

/* ---------- 1. KEYWORD DICTIONARIES ---------- */

const NICHE_KEYWORDS = {
  fitness:        /\b(fitness|gym|workout|exercise|sports|athletic|training|bodybuilding|yoga|pilates|crossfit|marathon|running)\b/gi,
  beauty:         /\b(beauty|cosmetics|makeup|skincare|hair|skin\s*care|hair\s*care|grooming|nail|lash|glow|concealer)\b/gi,
  fashion:        /\b(fashion|style|apparel|clothing|outfit|wardrobe|streetwear|luxury.*fashion|couture|designer)\b/gi,
  tech:           /\b(tech|technology|gadget|software|app|digital|programming|startup|saas|ai|machine\s*learning|hardware|electronics)\b/gi,
  food:           /\b(food|cook|recipe|restaurant|dining|culinary|chef|beverage|baking|vegan|keto|delivery)\b/gi,
  travel:         /\b(travel|tourism|destination|hotel|adventure|explore|wanderlust|trip|vacation|backpack|flight)\b/gi,
  lifestyle:      /\b(lifestyle|daily\s*life|routine|living|home|interior|design|diy|minimal|hygge|self[\s-]?care)\b/gi,
  entertainment:  /\b(entertainment|gaming|music|movies?|film|tv|comedy|streaming|podcast|vlog|anime|series)\b/gi,
  education:      /\b(education|learning|courses?|tutorial|skills?|training|teach|academic|study|edtech|school)\b/gi,
  sustainability: /\b(sustainability|eco|environment|green|organic|sustainable|carbon|recycle|zero[\s-]?waste|ethical)\b/gi,
  wellness:       /\b(wellness|mental\s*health|meditation|mindfulness|therapy|healing|holistic|well[\s-]?being)\b/gi,
  music:          /\b(music|musician|singer|band|hip[\s-]?hop|rap|jazz|pop|rock|edm|spotify|soundcloud)\b/gi,
  gaming:         /\b(gaming|gamer|esports|twitch|steam|playstation|xbox|nintendo|rpg|fps|mmorpg)\b/gi,
  parenting:      /\b(parent|mom|dad|baby|toddler|kids|family|child|maternity|newborn)\b/gi,
  finance:        /\b(finance|invest|money|crypto|stock|trading|budget|wealth|fintech|banking|savings)\b/gi,
  pets:           /\b(pet|dog|cat|puppy|kitten|animal|vet|rescue)\b/gi,
};

const PLATFORM_KEYWORDS = {
  instagram: /\b(instagram|ig|insta)\b/gi,
  tiktok:    /\b(tiktok|tik[\s-]?tok|short[\s-]?video|reels)\b/gi,
  youtube:   /\b(youtube|yt|vlog)\b/gi,
  twitter:   /\b(twitter|tweet|x\.com)\b/gi,
  linkedin:  /\b(linkedin|professional\s*network)\b/gi,
  facebook:  /\b(facebook|fb)\b/gi,
};

const LOCATION_MAP = {
  'us':             'US',
  'usa':            'US',
  'united states':  'US',
  'america':        'US',
  'uk':             'UK',
  'united kingdom': 'UK',
  'britain':        'UK',
  'england':        'UK',
  'india':          'India',
  'canada':         'Canada',
  'australia':      'Australia',
  'germany':        'Germany',
  'france':         'France',
  'japan':          'Japan',
  'singapore':      'Singapore',
  'dubai':          'Dubai',
  'uae':            'Dubai',
  'brazil':         'Brazil',
  'mexico':         'Mexico',
  'south korea':    'South Korea',
  'korea':          'South Korea',
  'indonesia':      'Indonesia',
  'nigeria':        'Nigeria',
  'south africa':   'South Africa',
  'spain':          'Spain',
  'italy':          'Italy',
  'china':          'China',
  'russia':         'Russia',
  'turkey':         'Turkey',
  'new york':       'US',
  'los angeles':    'US',
  'london':         'UK',
  'mumbai':         'India',
  'delhi':          'India',
  'toronto':        'Canada',
  'sydney':         'Australia',
  'berlin':         'Germany',
  'paris':          'France',
  'tokyo':          'Japan',
};

/* ---------- 2. SMART KEYWORD PARSER ---------- */

export function parseKeywords(text) {
  const lower = text.toLowerCase();

  // --- Niches (with match-count scoring) ---
  const nicheScores = {};
  for (const [niche, regex] of Object.entries(NICHE_KEYWORDS)) {
    const matches = lower.match(regex);
    if (matches) nicheScores[niche] = matches.length;
  }
  // Sort by frequency, take top niches
  const sortedNiches = Object.entries(nicheScores)
    .sort((a, b) => b[1] - a[1])
    .map(([n]) => n);
  const niches = sortedNiches.length ? sortedNiches.slice(0, 3) : ['general'];

  // --- Platforms ---
  const platforms = [];
  for (const [platform, regex] of Object.entries(PLATFORM_KEYWORDS)) {
    if (regex.test(lower)) platforms.push(platform);
  }
  // Default: if user mentions "social media" generically or nothing
  if (!platforms.length) platforms.push('instagram');

  // --- Budget – try to find exact amount first ---
  let budget = 'not specified';
  let budgetNumeric = null;
  const currencyMatch = text.match(/[₹$]\s?([\d,]+(?:\.\d+)?)\s*(?:k|K)?/);
  const numberKMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:k|K)\s*(?:budget|dollar|usd|rupee|inr)?/i);
  const plainNumberBudget = text.match(/budget\s*(?:of|around|is|:)?\s*[₹$]?\s*([\d,]+)/i);

  if (currencyMatch) {
    let val = parseFloat(currencyMatch[1].replace(/,/g, ''));
    if (/k|K/.test(currencyMatch[0])) val *= 1000;
    budgetNumeric = val;
  } else if (numberKMatch) {
    budgetNumeric = parseFloat(numberKMatch[1]) * 1000;
  } else if (plainNumberBudget) {
    budgetNumeric = parseFloat(plainNumberBudget[1].replace(/,/g, ''));
  }

  if (budgetNumeric !== null) {
    budget = `₹${budgetNumeric.toLocaleString()}`;
  } else if (/high.*budget|large.*budget|big.*budget|substantial|significant|premium/i.test(lower)) {
    budget = '₹5,000+';
    budgetNumeric = 5000;
  } else if (/medium.*budget|moderate|reasonable/i.test(lower)) {
    budget = '₹1,000–5,000';
    budgetNumeric = 3000;
  } else if (/low.*budget|small.*budget|tight.*budget|limited|cheap|affordable/i.test(lower)) {
    budget = '₹500–1,000';
    budgetNumeric = 750;
  }

  // --- Engagement level ---
  let engagementLevel = 'any';
  if (/high.*engage|strong.*engage|very.*engage|active.*audience|interactive|viral/i.test(lower)) {
    engagementLevel = 'high';
  } else if (/medium.*engage|moderate.*engage|decent.*engage|good.*engage/i.test(lower)) {
    engagementLevel = 'medium';
  } else if (/low.*engage|casual/i.test(lower)) {
    engagementLevel = 'low';
  }

  // --- Follower tier ---
  let followerTier = null;
  if (/\b(nano|very\s*small)\b/i.test(lower)) {
    followerTier = { label: 'nano (1K–10K)', min: 1000, max: 10000 };
  } else if (/\b(micro)\b/i.test(lower)) {
    followerTier = { label: 'micro (10K–100K)', min: 10000, max: 100000 };
  } else if (/\b(mid[\s-]?tier|mid[\s-]?level)\b/i.test(lower)) {
    followerTier = { label: 'mid-tier (100K–500K)', min: 100000, max: 500000 };
  } else if (/\b(macro|big|large|major)\b/i.test(lower) && /\b(influencer|account|creator|follower)\b/i.test(lower)) {
    followerTier = { label: 'macro (500K–1M)', min: 500000, max: 1000000 };
  } else if (/\b(mega|celebrity|huge|massive)\b/i.test(lower)) {
    followerTier = { label: 'mega (1M+)', min: 1000000, max: Infinity };
  } else if (/high.*follower|big.*following|large.*following|lots.*follower/i.test(lower)) {
    followerTier = { label: 'macro (500K+)', min: 500000, max: Infinity };
  }

  // --- Location ---
  let location = null;
  for (const [keyword, mapped] of Object.entries(LOCATION_MAP)) {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(lower)) {
      location = mapped;
      break;
    }
  }

  // --- Campaign type ---
  let campaignType = 'general promotion';
  if (/launch|new\s*product|product\s*launch|release|drop/i.test(lower)) {
    campaignType = 'product launch';
  } else if (/awareness|brand\s*building|reach|visibility/i.test(lower)) {
    campaignType = 'brand awareness';
  } else if (/promot|advertis|marketing\s*campaign/i.test(lower)) {
    campaignType = 'product promotion';
  } else if (/collaborat|partner|collab|ambassador|brand\s*deal/i.test(lower)) {
    campaignType = 'collaboration';
  } else if (/ugc|user[\s-]?generated|content\s*creat/i.test(lower)) {
    campaignType = 'UGC / content creation';
  } else if (/review|unbox|test/i.test(lower)) {
    campaignType = 'product review';
  } else if (/event|live|webinar|stream/i.test(lower)) {
    campaignType = 'event / live stream';
  }

  // --- Gender preference ---
  let gender = null;
  if (/\b(female|women|woman|she|her)\b/i.test(lower)) gender = 'female';
  else if (/\b(male|men|man|he|him)\b/i.test(lower)) gender = 'male';

  // --- Number of influencers requested ---
  let requestedCount = null;
  const countMatch = lower.match(/(\d+)\s*(?:[-–to]+\s*(\d+))?\s*influencer/);
  if (countMatch) {
    requestedCount = countMatch[2] ? parseInt(countMatch[2]) : parseInt(countMatch[1]);
  }

  return {
    budget,
    budgetNumeric,
    niches,
    platforms,
    engagementLevel,
    followerTier,
    campaignType,
    location,
    gender,
    requestedCount,
    targetAudience: 'general audience',
  };
}

/* ---------- 3. ANALYSE MARKETING REQUEST ---------- */

export async function analyzeMarketingRequest(brandRequest, conversationContext = '') {
  try {
    console.log('Analyzing campaign request:', brandRequest);

    // Combine current request with conversation context for better understanding
    const fullText = conversationContext
      ? `${conversationContext}\n---\n${brandRequest}`
      : brandRequest;

    const criteria = parseKeywords(fullText);
    console.log('Extracted criteria:', JSON.stringify(criteria, null, 2));
    return criteria;
  } catch (error) {
    console.error('Error analyzing marketing request:', error.message);
    throw new Error(`Failed to analyze marketing request: ${error.message}`);
  }
}

/* ---------- 4. SCORE & RANK INFLUENCERS ---------- */

export function scoreInfluencer(influencer, criteria) {
  let score = 0;
  const reasons = [];

  // Niche match (highest weight)
  if (criteria.niches.includes(influencer.niche?.toLowerCase())) {
    score += 40;
    reasons.push(`Niche match: ${influencer.niche}`);
  }

  // Platform overlap
  const platformOverlap = (influencer.platforms || []).filter((p) =>
    criteria.platforms.includes(p.toLowerCase())
  );
  if (platformOverlap.length) {
    score += 10 * platformOverlap.length;
    reasons.push(`Platform match: ${platformOverlap.join(', ')}`);
  }

  // Engagement fit
  const eng = influencer.engagementRate || 0;
  if (criteria.engagementLevel === 'high' && eng >= 5) {
    score += 20;
    reasons.push('High engagement');
  } else if (criteria.engagementLevel === 'medium' && eng >= 2 && eng < 8) {
    score += 15;
    reasons.push('Good engagement');
  } else if (criteria.engagementLevel === 'any') {
    score += 10;
  } else if (eng > 0) {
    score += 5;
  }

  // Follower tier fit
  const fc = influencer.followerCount || 0;
  if (criteria.followerTier) {
    if (fc >= criteria.followerTier.min && fc <= criteria.followerTier.max) {
      score += 15;
      reasons.push(`Follower tier match: ${criteria.followerTier.label}`);
    }
  } else {
    // Default: reward decent following
    if (fc > 10000) score += 5;
    if (fc > 100000) score += 5;
  }

  // Location match
  if (criteria.location && influencer.location) {
    if (influencer.location.toLowerCase().includes(criteria.location.toLowerCase())) {
      score += 10;
      reasons.push(`Location match: ${influencer.location}`);
    }
  }

  // Gender match
  if (criteria.gender && influencer.gender) {
    if (influencer.gender.toLowerCase() === criteria.gender.toLowerCase()) {
      score += 5;
      reasons.push('Gender preference match');
    }
  }

  return { score, reasons };
}

/* ---------- 5. SMART RESPONSE GENERATION ---------- */

export async function generateInfluencerRecommendationResponse(criteria, influencersData) {
  try {
    const total = influencersData.length;

    // Build concise influencer summaries
    const influencerLines = influencersData.slice(0, 8).map((inf, idx) => {
      const fc = inf.followerCount
        ? inf.followerCount >= 1_000_000
          ? `${(inf.followerCount / 1_000_000).toFixed(1)}M`
          : `${(inf.followerCount / 1_000).toFixed(0)}K`
        : 'N/A';
      return `${idx + 1}. ${inf.name} — ${inf.niche} | ${(inf.platforms || []).join(', ')} | ${fc} followers | ${inf.engagementRate ?? '?'}% engagement | ${inf.location || 'N/A'}${inf._matchScore ? ` | Score: ${inf._matchScore}` : ''}`;
    }).join('\n');

    // Build budget-aware tips
    let budgetTip = '';
    if (criteria.budgetNumeric) {
      if (criteria.budgetNumeric < 1000) {
        budgetTip = 'With your budget range, nano and micro-influencers (1K–50K followers) offer the best ROI — they tend to have higher engagement and are more affordable per post.';
      } else if (criteria.budgetNumeric < 5000) {
        budgetTip = 'Your budget is well-suited for micro to mid-tier influencers. Consider splitting it across 2–3 creators to diversify reach.';
      } else if (criteria.budgetNumeric < 20000) {
        budgetTip = 'With this budget, you can work with mid-tier to macro influencers. A mix of 3–5 creators across different platforms will maximise both reach and engagement.';
      } else {
        budgetTip = 'Your premium budget opens up macro and mega influencer partnerships. Consider a hero + supporting cast strategy: one big name for reach plus several mid-tier creators for authentic engagement.';
      }
    }

    // Context-specific suggestions
    const suggestions = [];

    if (!criteria.location) {
      suggestions.push('You didn\'t specify a location. Tell me if you\'re targeting a specific country or region — I can filter for local influencers.');
    }

    if (criteria.niches.includes('general')) {
      suggestions.push('I wasn\'t sure about the niche. Try mentioning specific topics like "fitness", "beauty", "tech", "food", "travel", "gaming", or "fashion".');
    }

    if (criteria.platforms.length === 1 && criteria.platforms[0] === 'instagram') {
      suggestions.push('I defaulted to Instagram since no platform was specified. Let me know if you want TikTok, YouTube, or other platform influencers.');
    }

    if (criteria.engagementLevel === 'any') {
      suggestions.push('No engagement preference detected — I included all levels. Say "high engagement" if you want creators with 5%+ rates.');
    }

    // Compose the final response
    let response = '';

    if (total > 0) {
      response = `Here are the top ${Math.min(total, 8)} matches for your ${criteria.campaignType} campaign targeting ${criteria.niches.join(' & ')} on ${criteria.platforms.join(', ')}:\n\n${influencerLines}`;

      if (budgetTip) {
        response += `\n\nBudget Insight: ${budgetTip}`;
      }

      if (suggestions.length) {
        response += `\n\nTo refine your results:\n${suggestions.map((s) => `• ${s}`).join('\n')}`;
      }

      response += '\n\nWant me to narrow things down? You can say things like "show only micro-influencers", "focus on TikTok", or "only US-based creators".';
    } else {
      const alternativeNiches = Object.keys(NICHE_KEYWORDS)
        .filter((n) => !criteria.niches.includes(n))
        .slice(0, 5);

      response = `I couldn't find influencers matching all your criteria (${criteria.niches.join(', ')} on ${criteria.platforms.join(', ')}${criteria.location ? ` in ${criteria.location}` : ''}).`;

      response += '\n\nHere are some things you can try:\n';
      response += '• Broaden the niche — related niches: ' + alternativeNiches.join(', ') + '\n';
      response += '• Remove the location filter\n';
      response += '• Try different platforms\n';

      if (budgetTip) {
        response += `\nBudget Insight: ${budgetTip}`;
      }

      response += '\n\nTell me what to adjust and I\'ll search again!';
    }

    return response.trim();
  } catch (error) {
    console.error('Error generating response:', error.message);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}
