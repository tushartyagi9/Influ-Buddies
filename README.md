# Influ-Buddies (MERN)

Influ-Buddies is a lightweight full-stack web app that connects brands with social media influencers for collaborations. Brands can browse curated influencer profiles, filter by niche/location/platform, and visit social links. Influencers can manage their profiles.

## Tech stack

- **Frontend**: React (Vite), React Router, CSS
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth

## Project structure

- `client/` – React SPA consuming the API
- `server/` – Express API and MongoDB models

## Getting started

### Prerequisites

- Node.js (LTS)
- MongoDB instance (local or cloud)

### 1. Install dependencies

```bash
npm install              # root tooling
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

Create `server/.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/influ_buddies
JWT_SECRET=replace_me_with_a_long_secret
PORT=5000
```

Optionally create `client/.env`:

```bash
VITE_API_URL=http://localhost:5000
```

### 3. Seed sample influencers

Place your JSON files (e.g. `beauty.json`, `dance.json`, `Fashion.json`) in `server/data/`, matching the shape from your original static project. Then run:

```bash
cd server
npm run seed
```

This will clear and repopulate the `Influencer` collection.

### 4. Run the app in development

From the repo root:

```bash
npm run dev
```

- Client: `http://localhost:5173` (Vite default)
- API: `http://localhost:5000`

## Core features

- **Auth**
  - Email/password signup and login.
  - Roles: `brand` and `influencer`.
  - JWT-based auth with protected routes.

- **Influencer browsing**
  - `/browse` page with filters: niche, location, platform, gender, name search.
  - `/influencers/:id` detail page with profile info and social links.

- **Dashboards**
  - Brand and influencer dashboards with role-based access (placeholders for future enhancements).

