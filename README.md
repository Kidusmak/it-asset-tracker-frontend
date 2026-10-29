# IT Asset Tracker - Frontend (Next.js)

Next.js 15 (App Router, JavaScript) frontend for the IT Asset & Equipment Tracker API.

## Run it

1. Start the backend first (Docker or `mvn spring-boot:run`) so it answers on http://localhost:8080
2. In this folder:

```bash
npm install
npm run dev
```

3. Open http://localhost:3000 and log in (e.g. `admin` / `Admin@12345`).

Next.js forwards every `/api/*` request to the backend (see `next.config.mjs`), so no CORS setup is needed.
To use another backend address, copy `.env.local.example` to `.env.local` and change `API_URL`.

## Pages

| Page | What it does |
|------|--------------|
| `/login`, `/register` | Sign in (HTTP Basic) / create a STAFF account |
| `/assets` | Table + status filter. Admin: add, assign, return, delete |
| `/my-assets` | Assets assigned to the logged-in user |
| `/categories` | List categories. Admin: add one |

The backend should have the small `GET /api/auth/me` endpoint (returns id, username, role) so the UI
knows whether to show admin buttons. Without it the buttons are shown to everyone and the server still
rejects staff with 403.

## Structure

```
src/app/            pages (one folder = one URL)
src/components/     AuthProvider (login state), Shell (nav + route guard), AssetTable, ErrorBox
src/lib/api.js      fetch wrapper that adds the Basic auth header
```
