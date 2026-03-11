# Influ-Buddies

> An Instagram-inspired influencer marketing platform built with the MERN stack. Brands discover, connect with, and hire social-media influencers — all from one place.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)

---

## Features

| Area | What you get |
|------|-------------|
| **Auth** | Email/password signup & login with sliding Brand / Influencer role toggle. JWT-protected routes. |
| **Browse Influencers** | Filter by niche, location, platform, gender, follower count, and name search. |
| **Influencer Detail** | Full profile with stats, bio, social links, and a **Message** button. |
| **Reels** | Instagram Reels-style vertical card browser — swipe or arrow-key through influencer profiles. |
| **Messages / DM** | Real-time-style conversation list + chat interface between brands and influencers. |
| **Brand Dashboard** | Three tabs: **Create Ad** (post opportunities), **My Ads** (manage & review applications), **Saved** (favourites). |
| **Influencer Dashboard** | Three tabs: **Browse Opportunities**, **My Applications** (track status), **My Profile**. |
| **AI Chatbot** | `/ai-matcher` — natural-language influencer recommendations powered by a helper utility. |
| **Responsive UI** | Left sidebar navigation, Instagram-inspired light theme with CSS custom properties, mobile-friendly. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Vite 7, CSS custom properties |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB |
| Auth | JWT + bcrypt |

---

## Project Structure

```
checkers-1/
├── client/                 # React SPA (Vite)
│   └── src/
│       ├── api/            # API client helpers
│       ├── components/     # Layout, FilterBar, InfluencerCard, RequireAuth
│       ├── context/        # AuthContext, FavoritesContext
│       └── pages/          # All page components + CSS
├── server/                 # Express REST API
│   ├── config/             # DB connection, env vars
│   ├── middleware/         # JWT auth middleware
│   ├── models/             # User, Influencer, Opportunity, Application, Message
│   ├── routes/             # auth, influencers, opportunities, messages, chatbot, users
│   ├── scripts/            # seedInfluencers
│   └── utils/              # chatbotHelper, defaultInfluencers, defaultOpportunities
└── package.json            # Root scripts (dev, build, start)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (LTS)
- **MongoDB** running locally or a cloud URI (e.g. MongoDB Atlas)

### 1. Clone & install

```bash
git clone https://github.com/tushart99/checkers.git
cd checkers-1

# Install root, server, and client dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure environment

Create **`server/.env`**:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/influ_buddies
JWT_SECRET=replace_me_with_a_long_random_secret
PORT=5050
```

Optionally create **`client/.env`**:

```env
VITE_API_URL=http://localhost:5050
```

### 3. Seed sample data

```bash
cd server && node scripts/seedInfluencers.js
```

This populates the database with sample influencers and opportunities.

### 4. Run in development

From the repo root:

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | `http://localhost:5173` |
| Backend API | `http://localhost:5050` |

---

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register (brand or influencer) |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✔ | Current user profile |
| GET | `/api/influencers` | — | List / filter influencers |
| GET | `/api/influencers/:id` | — | Influencer detail |
| GET | `/api/opportunities` | — | List opportunities |
| POST | `/api/opportunities` | ✔ Brand | Create opportunity |
| DELETE | `/api/opportunities/:id` | ✔ Brand | Delete own opportunity |
| POST | `/api/opportunities/:id/apply` | ✔ Influencer | Apply to opportunity |
| GET | `/api/opportunities/:id/applications` | ✔ Brand | View applications |
| PATCH | `/api/opportunities/applications/:id` | ✔ Brand | Accept / reject |
| GET | `/api/messages/conversations` | ✔ | List conversations |
| GET | `/api/messages/:partnerId` | ✔ | Message history |
| POST | `/api/messages` | ✔ | Send a message |
| POST | `/api/chatbot` | ✔ Brand | AI influencer matcher |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client & server in parallel |
| `npm run build` | Production build of the client |
| `npm start` | Start the production server |
| `cd server && node scripts/seedInfluencers.js` | Seed the database |

---

## License

ISC

