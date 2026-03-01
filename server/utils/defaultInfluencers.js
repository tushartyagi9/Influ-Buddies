const defaultInfluencers = [
  // Beauty & Fashion
  {
    name: 'Aisha Glam',
    niche: 'beauty',
    platforms: ['instagram'],
    location: 'Mumbai, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/aishaglam',
    followerCount: 250000,
    engagementRate: 4.2
  },
  {
    name: 'StyleByMia',
    niche: 'fashion',
    platforms: ['instagram'],
    location: 'Bengaluru, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/stylebymia',
    followerCount: 320000,
    engagementRate: 3.8
  },
  {
    name: 'MakeupWithSarah',
    niche: 'beauty',
    platforms: ['instagram', 'tiktok'],
    location: 'Delhi, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/makeupwithsarah',
    followerCount: 180000,
    engagementRate: 5.6
  },
  {
    name: 'FashionFever',
    niche: 'fashion',
    platforms: ['instagram', 'youtube'],
    location: 'Pune, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/fashionfever',
    followerCount: 420000,
    engagementRate: 4.1
  },
  {
    name: 'BeautyTips_Priya',
    niche: 'beauty',
    platforms: ['youtube', 'tiktok'],
    location: 'Hyderabad, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://youtube.com/beautytips',
    followerCount: 560000,
    engagementRate: 6.2
  },

  // Fitness & Wellness
  {
    name: 'FitWithKaran',
    niche: 'fitness',
    platforms: ['instagram', 'youtube'],
    location: 'Pune, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://instagram.com/fitwithkaran',
    followerCount: 150000,
    engagementRate: 4.7
  },
  {
    name: 'GymBro_Arjun',
    niche: 'fitness',
    platforms: ['instagram', 'tiktok'],
    location: 'Mumbai, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://instagram.com/gymbroarejun',
    followerCount: 280000,
    engagementRate: 5.3
  },
  {
    name: 'Yoga_Queen_Anjali',
    niche: 'wellness',
    platforms: ['youtube', 'instagram'],
    location: 'Rishikesh, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://youtube.com/yogaqueen',
    followerCount: 320000,
    engagementRate: 5.8
  },
  {
    name: 'MuscleGains_Rahul',
    niche: 'fitness',
    platforms: ['instagram'],
    location: 'Gurgaon, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://instagram.com/musclegains',
    followerCount: 450000,
    engagementRate: 4.5
  },
  {
    name: 'HealthyLiving_Maya',
    niche: 'wellness',
    platforms: ['instagram', 'tiktok'],
    location: 'Bangalore, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/healthyliving',
    followerCount: 200000,
    engagementRate: 5.9
  },

  // Food & Cooking
  {
    name: 'Chef_Sanjeev',
    niche: 'food',
    platforms: ['youtube', 'instagram'],
    location: 'Delhi, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://youtube.com/chefsanjeev',
    followerCount: 890000,
    engagementRate: 6.1
  },
  {
    name: 'RecipesBy_Neha',
    niche: 'food',
    platforms: ['youtube', 'tiktok'],
    location: 'Mumbai, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://youtube.com/recipesbyneha',
    followerCount: 1200000,
    engagementRate: 5.7
  },
  {
    name: 'FoodieAdventures',
    niche: 'food',
    platforms: ['instagram', 'tiktok'],
    location: 'Goa, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://instagram.com/foodieadventures',
    followerCount: 380000,
    engagementRate: 5.4
  },
  {
    name: 'BakingWithLove',
    niche: 'food',
    platforms: ['youtube', 'instagram'],
    location: 'Pune, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://youtube.com/bakingwithlove',
    followerCount: 560000,
    engagementRate: 6.3
  },

  // Tech & Gaming
  {
    name: 'DanceWithRio',
    niche: 'dance',
    platforms: ['instagram', 'youtube'],
    location: 'Delhi, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://youtube.com/dancewitrio',
    followerCount: 180000,
    engagementRate: 5.1
  },
  {
    name: 'TechReviews_Nikhil',
    niche: 'tech',
    platforms: ['youtube', 'instagram'],
    location: 'Bangalore, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://youtube.com/techreviews',
    followerCount: 720000,
    engagementRate: 5.8
  },
  {
    name: 'Gaming_Guru_Rohan',
    niche: 'gaming',
    platforms: ['twitch', 'youtube'],
    location: 'Mumbai, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://youtube.com/gamingguru',
    followerCount: 640000,
    engagementRate: 6.0
  },
  {
    name: 'Gadget_Girl_Priya',
    niche: 'tech',
    platforms: ['instagram', 'youtube'],
    location: 'Hyderabad, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://youtube.com/gadgetgirl',
    followerCount: 420000,
    engagementRate: 5.5
  },

  // Travel & Lifestyle
  {
    name: 'TravelWithAksh',
    niche: 'travel',
    platforms: ['instagram', 'youtube'],
    location: 'Delhi, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://instagram.com/travelwithaksh',
    followerCount: 950000,
    engagementRate: 5.2
  },
  {
    name: 'WanderlustDiaries',
    niche: 'travel',
    platforms: ['instagram', 'tiktok'],
    location: 'Goa, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/wanderlustdiaries',
    followerCount: 680000,
    engagementRate: 5.9
  },
  {
    name: 'LifestyleWith_Avi',
    niche: 'lifestyle',
    platforms: ['instagram'],
    location: 'Mumbai, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://instagram.com/lifestyleavi',
    followerCount: 520000,
    engagementRate: 4.8
  },
  {
    name: 'HomeDecor_Shreya',
    niche: 'lifestyle',
    platforms: ['instagram', 'youtube'],
    location: 'Bangalore, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/homedecorshreya',
    followerCount: 380000,
    engagementRate: 5.6
  },

  // Entertainment & Music
  {
    name: 'SingerSaif',
    niche: 'music',
    platforms: ['youtube', 'instagram'],
    location: 'Lucknow, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://youtube.com/singersaif',
    followerCount: 1100000,
    engagementRate: 6.2
  },
  {
    name: 'ComedyWith_Kranti',
    niche: 'entertainment',
    platforms: ['youtube', 'tiktok'],
    location: 'Pune, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://youtube.com/comedykranti',
    followerCount: 890000,
    engagementRate: 6.4
  },
  {
    name: 'ActressRashi',
    niche: 'entertainment',
    platforms: ['instagram', 'youtube'],
    location: 'Mumbai, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/actressrashi',
    followerCount: 750000,
    engagementRate: 5.3
  },

  // Education & Learning
  {
    name: 'EducationHub_Dev',
    niche: 'education',
    platforms: ['youtube'],
    location: 'Delhi, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://youtube.com/educationhub',
    followerCount: 2100000,
    engagementRate: 5.9
  },
  {
    name: 'LanguageLearning_Isha',
    niche: 'education',
    platforms: ['youtube', 'instagram'],
    location: 'Bangalore, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://youtube.com/languagelearning',
    followerCount: 680000,
    engagementRate: 6.1
  },

  // Sustainability & Environment
  {
    name: 'EcoWarrior_Anand',
    niche: 'sustainability',
    platforms: ['instagram', 'youtube'],
    location: 'Kerala, India',
    gender: 'male',
    imageUrl: '',
    socialLink: 'https://instagram.com/ecowarrior',
    followerCount: 420000,
    engagementRate: 5.7
  },
  {
    name: 'GreenLiving_Pooja',
    niche: 'sustainability',
    platforms: ['instagram', 'tiktok'],
    location: 'Gurgaon, India',
    gender: 'female',
    imageUrl: '',
    socialLink: 'https://instagram.com/greenliving',
    followerCount: 560000,
    engagementRate: 5.8
  }
];

export default defaultInfluencers;

