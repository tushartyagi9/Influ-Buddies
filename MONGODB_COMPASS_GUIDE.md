# How to View Data in MongoDB Compass

## Step 1: Download MongoDB Compass
- Go to: https://www.mongodb.com/products/compass
- Download and install the free version
- Or use MongoDB Shell if you prefer command line

## Step 2: Connect to Your Database
1. Open MongoDB Compass
2. Click **"New Connection"**
3. Enter connection string:
   ```
   mongodb://127.0.0.1:27017
   ```
4. Click **"Connect"**

## Step 3: Browse to Your Database
- In left panel, look for **"influ_buddies"** database
- You should see it listed under the MongoDB instance
- Click to expand it

## Step 4: View Collections
Inside `influ_buddies`, you'll see collections:
- `influencers` - All 29 influencer records
- `users` - All registered users (brands & influencers)
- `sessions` - Any active sessions (if using sessions)

## Step 5: View Influencer Data
1. Click on **"influencers"** collection
2. You'll see all 29 dummy influencers with:
   - name
   - niche (beauty, fitness, tech, food, travel, etc.)
   - platforms (instagram, youtube, tiktok, etc.)
   - location
   - gender
   - followerCount
   - engagementRate
   - socialLink

## Step 6: Search & Filter
In MongoDB Compass you can:

### Filter by Niche
```json
{"niche": "fitness"}
```

### Filter by Platform
```json
{"platforms": "instagram"}
```

### Filter by Engagement Rate
```json
{"engagementRate": {"$gte": 5.5}}
```

### Filter by Location
```json
{"location": /Delhi/}
```

## Step 7: View Collection Stats
- **Collection name**: `influencers`
- **Total documents**: 29
- **Average engagement**: ~5.4%
- **Follower range**: 150K - 2.1M

## Current Influencers in Database:

### Beauty & Fashion (4)
- Aisha Glam
- StyleByMia
- MakeupWithSarah
- FashionFever
- BeautyTips_Priya

### Fitness & Wellness (5)
- FitWithKaran
- GymBro_Arjun
- Yoga_Queen_Anjali
- MuscleGains_Rahul
- HealthyLiving_Maya

### Food & Cooking (4)
- Chef_Sanjeev
- RecipesBy_Neha
- FoodieAdventures
- BakingWithLove

### Tech & Gaming (5)
- TechReviews_Nikhil
- Gaming_Guru_Rohan
- Gadget_Girl_Priya
- DanceWithRio
- (Plus others)

### Travel & Lifestyle (4)
- TravelWithAksh
- WanderlustDiaries
- LifestyleWith_Avi
- HomeDecor_Shreya

### Entertainment & Music (3)
- SingerSaif
- ComedyWith_Kranti
- ActressRashi

### Education & Learning (2)
- EducationHub_Dev
- LanguageLearning_Isha

### Sustainability (2)
- EcoWarrior_Anand
- GreenLiving_Pooja

## Quick Tips

### Using MongoDB Shell
If you prefer command line instead:
```bash
# Connect to MongoDB
mongosh

# Switch to database
use influ_buddies

# View all influencers
db.influencers.find()

# View with pretty formatting
db.influencers.find().pretty()

# Count total influencers
db.influencers.countDocuments()

# Find by niche
db.influencers.find({"niche": "fitness"})

# Find with highest followers
db.influencers.find().sort({"followerCount": -1}).limit(5)
```

## Verify Your Data
Open MongoDB Compass and you should see:
- ✅ 29 total influencers
- ✅ Multiple niches (beauty, fitness, tech, food, travel, entertainment, education, sustainability)
- ✅ Various platforms (instagram, youtube, tiktok, twitch)
- ✅ Different locations across India
- ✅ Engagement rates ranging from 3.8% to 6.4%
- ✅ Follower counts from 150K to 2.1M

Your AI Chatbot will now match brands with these influencers based on their campaign requirements!
