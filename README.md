# AI Trading

A lightweight trading dashboard and strategy bot starter for Angel One SmartAPI.

Features
- Connect to Angel One SmartAPI with API key, client code, MPIN, and TOTP
- Fetch live quotes for NSE/NFO/BSE symbols
- Generate multi-level entry/TP/SL plan
- Browser-based dashboard with strategy log
- Express backend proxy to avoid direct browser API issues

Project structure
- `server.js` – Express server and API routes
- `src/angelOneClient.js` – wrapper for Angel One REST calls
- `src/strategyEngine.js` – multi-level strategy planner
- `public/` – frontend dashboard

Quick start

1. Install dependencies:
   npm install

2. Copy environment file:
   cp .env.example .env

3. Fill your Angel One values in `.env`

4. Run the app:
   npm start

5. Open:
   http://localhost:3000

Important notes
- Do not use real trading credentials in shared environments.
- For production, prefer a secure backend and do not expose secrets to the frontend.
- Use paper trading or simulated orders before using live capital.
