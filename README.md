# EduPro (MERN + Vite)

EduPro is an education platform with:
- student discovery + learning flow
- admin course management (create/edit/upload assets)
- student progress tracking + My Learning
- Stitch-inspired UI (Space Grotesk + Material Symbols)

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **DB:** MongoDB (optional in local dev; demo fallback is supported)
- **Auth:** JWT cookie-based auth
- **Uploads:** Multer + static `/uploads` serving

## Project Structure

```txt
WaB/
├── client/
│   ├── src/components/
│   ├── src/context/
│   ├── src/lib/
│   └── src/pages/
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── store/
├── package.json
└── README.md
```

## Run on localhost (proper way)

### Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+
- (Optional) MongoDB local instance if you want persistent DB data

### 1) Install dependencies

From repo root:

```bash
npm install
```

Then install app dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Start backend

In terminal 1:

```bash
cd server
node server.js
```

Backend runs at:
- `http://localhost:5000`

If MongoDB is not running, backend still starts in **demo mode** using in-memory fallback.

### 3) Start frontend

In terminal 2:

```bash
cd client
npm run dev
```

Frontend default:
- `http://localhost:5173`

If that port is busy, Vite automatically uses `5174`, `5175`, etc.  
Always use the exact `Local:` URL shown in terminal output.

### 4) Alternative: run from root

From root:

```bash
npm run dev
```

This uses `concurrently` to run server + client together.

## Main Routes

### Public / Student

- `/` - student homepage (logged out and logged in student view)
- `/courses` - browse catalog (rating-focused)
- `/courses/:id` - course detail
- `/courses/:id/learn?section=0&lecture=0` - course player page
- `/my-learning` - student dashboard (saved + progress)
- `/signin`
- `/signup`

### Admin

- `/admin` - admin dashboard
- `/admin/courses` - course management
- `/publish` - admin only
- `/dashboard` - admin-only route alias

## Key APIs

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Courses
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses` (admin)
- `PUT /api/courses/:id` (admin)
- `POST /api/courses/:id/curriculum/lecture` (admin)
- `POST /api/courses/:id/assets` (admin)

### Sessions / Learning
- `POST /api/sessions/track` - student session heartbeat
- `GET /api/sessions/admin/recent` - admin recent student sessions
- `GET /api/learning/saved`
- `POST /api/learning/saved`
- `DELETE /api/learning/saved/:courseId`
- `POST /api/learning/progress`
- `GET /api/learning/dashboard`

## Notes

- Frontend proxies `/api` and `/uploads` to backend.
- Save-course has local fallback in client to stay resilient if API is slow.
- Course player currently uses a placeholder YouTube video for lesson playback.

## Troubleshooting

### White screen / stale HMR

1. Stop Vite.
2. Restart frontend:
   ```bash
   cd client
   npm run dev
   ```
3. Hard refresh browser (`Ctrl+Shift+R`).

### Frontend port changed

Use the exact URL printed by Vite (`Local:`), not hardcoded `5173`.

### Save courses not appearing

- Ensure backend is running (`localhost:5000`)
- Hard refresh once
- Check student account is logged in

### Lint/build verification

```bash
cd client
npm run lint
npm run build
```
