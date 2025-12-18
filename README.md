# Influ-Buddies

A lightweight full-stack web app to connect influencers with brands for collaborations.

## Project overview
Brand-Buddies helps brands discover and evaluate social media influencers by browsing curated influencer profiles, filtering by niche/location/platform, and visiting social links.

This repository contains a static frontend (HTML/CSS/JS) and JSON datasets used to demonstrate influencer listings.

## Features
- Influencer listings populated from JSON files (e.g. `beauty.json`, `dance.json`, `Fashion.json`).
- Individual influencer details include name, location, gender, image, and social link.
- Simple signup/signin pages and category pages.

## Tech stack
- Frontend: Vanilla HTML, CSS, JavaScript
- Data: Local JSON files

## Local setup
1. Clone the repository:
   git clone <your-fork-or-repo-url>
2. Open the project folder in VS Code or any editor.
3. Serve the files using a static server (recommended) or open `BrandBuddies.html` / `BrandBuddies.html` in browser.

Recommended ways to serve locally:
- Using Node.js http-server:
  npm install -g http-server
  http-server .
- Using Python 3 built-in server:
  python3 -m http.server 8000

Then open http://localhost:8080 (http-server) or http://localhost:8000 (python) in your browser.

## Contributing
- Fix bugs or improve UI in the `*.html`, `*.css`, `*.js` files.
- Add or update influencer data in the JSON files under the project root.
- Create a feature branch, commit changes, and open a pull request.

## License
This project is provided as-is. Add a license file if you plan to publish it publicly.

## Notes for uploading to GitHub
If you want me to push this repository to your GitHub (`https://github.com/tushartyagi9/Influ-Buddies`), make sure:
- You have git configured and authenticated locally (SSH key or GitHub CLI / token).
- I will add the remote and push to `main`. If authentication is required I will prompt or the push will fail and show instructions to complete locally.

