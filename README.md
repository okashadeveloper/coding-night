# MaintainIQ

AI-powered QR maintenance and asset history platform.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** MongoDB
- **AI:** Groq API (issue triage)

## Features

- Asset CRUD with auto-generated codes (`AST-1001`)
- QR code generation for each asset
- Public asset page (scan QR → view status / report issue)
- Issue reporting with evidence images
- AI triage (category, priority, suggested checks)
- Admin assignment & status workflow
- Maintenance records (parts, cost, evidence)
- Asset history timeline
- Admin dashboard (stats, charts, service-due alerts)
- Rate limiting on public / AI endpoints

## Setup

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see Environment Variables below), then:

```bash
node server.js
# → http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
```

Create `frontend/.env` from `.env.example`, then:

```bash
npm run dev
# → http://localhost:5173
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.com` | `pass123` |
| Technician | `tech@test.com` | `pass123` |

> Register these users via `POST /api/auth/register` if they are not in your DB yet.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/assets` | List assets (auth) |
| POST | `/api/assets` | Create asset (admin) |
| GET | `/api/assets/:id` | Asset details |
| PUT | `/api/assets/:id` | Update asset (admin) |
| DELETE | `/api/assets/:id` | Retire asset (admin) |
| GET | `/api/assets/:id/history` | Asset history |
| GET | `/api/public/asset/:assetCode` | Public asset view |
| POST | `/api/issues` | Report issue (public) |
| GET | `/api/issues` | List issues (auth) |
| PUT | `/api/issues/:id/assign` | Assign technician (admin) |
| PUT | `/api/issues/:id/status` | Update status |
| POST | `/api/issues/:id/maintenance` | Add maintenance record |
| GET | `/api/issues/:id/maintenance` | List maintenance records |
| POST | `/api/ai/triage` | AI triage suggestion |
| POST | `/api/upload` | Upload images (auth) |
| GET | `/api/dashboard/stats` | Dashboard stats (admin) |

## Environment Variables

**`backend/.env`**

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
GROQ_API_KEY=
PUBLIC_URL=http://localhost:5173
```

**`frontend/.env`**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
